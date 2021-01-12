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
      serial.write(msg + " ")
    end
  end
end

recieve = Thread.new do
  @redis = Redis.new
  buffer = ""
  loop do
    serial.wait_readable
    input = serial.readline.chop
    response = HTTParty.post('http://localhost:3000/api/v1/serial_port', body: {'message': input})
  end
end

send.join
recieve.join