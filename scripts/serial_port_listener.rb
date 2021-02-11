require 'serialport'
require 'redis'
require 'json'
require 'httparty'
require 'byebug'


sleep(3)

serial = SerialPort.new("/dev/ttyUSB0", 115200)

send = Thread.new do
  @redis = Redis.new
  @redis.subscribe('serial-port') do |on|
    on.message do |channel, msg|
      s erial.write(msg)
    end
  end
end

recieve = Thread.new do
  loop do
    serial.wait_readable
    buffer = ""
    loop do
      char = serial.read(1)
      unless char == "\n"
        buffer += char.to_s
      else
        break
      end
    end
    puts(buffer)
    HTTParty.post('http://127.0.0.1:3000/api/v1/serial_port', body: {'message': buffer.to_s})
  end
end

send.join
recieve.join
