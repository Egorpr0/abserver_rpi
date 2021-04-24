require 'serialport'
require 'redis'
require 'json'
require 'httparty'

class Arduino::ArduinoConnectorJob
  include Sidekiq::Worker
  sidekiq_options retry: false

  $watcherFrequency = 0.25

  $arduinoConnected = nil

  def perform(port, baudRate)
    begin
      serial = SerialPort.new(port, baudRate)
      serial.flush_input
      $arduinoConnected = true
      Rails.cache.write('arduinoConnectorStatus', 'connecting ')
      ActionCable.server.broadcast 'serial_port_channel', 
        {'type' => 'actionResponse', 'description' => 'arduino_connected'}.to_json

    rescue Errno::ENOENT
      puts 'Arduino is not connected!'
      ActionCable.server.broadcast 'serial_port_channel', 
        {'type' => 'actionResponse', 'description' => 'arduino_not_found'}.to_json
      Rails.cache.write('arduinoConnectorStatus', 'disconnected')
      terminate_job()
    end

    $redis = Redis.new(url: "redis://#{ENV["REDIS_URL"]}:6379/1")

    if $arduinoConnected
      $send = Thread.new do
        $redis.subscribe('serial-port') do |on|
          on.message do |channel, msg|
            serial.write(msg)
          end
        end
      end

      $recieve = Thread.new do
        loop do
          serial.wait_readable
          buffer = ""
          begin
            loop do
              char = serial.read(1)
              unless char == "\n" 
                buffer += char.to_s
              else
                break
              end
            end
          rescue Encoding::UndefinedConversionError
            puts "Unable to recieve data"
          end

          begin
            messageJson = JSON.parse(buffer.chomp)
            Rails.cache.write("arduinoConnectorStatus", "connected")
            if messageJson['type'] == 'initialize'
              Rails.cache.write('arduinoConnectorStatus', 'connected')
              puts 'Arduino initialized!'
            end
          rescue
            puts "Some strange message was recieved! #{buffer}"
          end

          ActionCable.server.broadcast 'serial_port_channel', buffer.to_s.chomp

        end
      end

      $connectionWatcher = Thread.new do
        loop do
          devicesString = `ls /dev/ttyUSB*`
          devices = devicesString.split("\n")

          if Rails.cache.read('arduinoConnectorTerminate')
            ActionCable.server.broadcast 'serial_port_channel', 
              {'type' => 'actionResponse', 'description' => 'connector_stopped'}.to_json
            terminate_job([$send, $recieve, $connectionWatcher])
          end

          unless devices.include? port
            ActionCable.server.broadcast 'serial_port_channel', 
              {'type' => 'actionResponse', 'description' => 'arduino_disconnected_unexpectedly'}.to_json
            terminate_job([$send, $recieve, $connectionWatcher])
          end

          sleep($watcherFrequency)
        end
      end

      $send.join
      $recieve.join
      $connectionWatcher.join
    end
  end

  private def terminate_job(threads = nil)
    puts "Terminatig job!"
    Rails.cache.write('arduinoConnectorStatus', 'disconnected')
    Rails.cache.write("arduinoConnectorTerminate", false)
    $arduinoConnected = false
    unless threads == nil
      threads.each do |thread|
        thread.terminate
      end
    end
  end

end
