class SerialPortChannel < ApplicationCable::Channel  
  def subscribed
    stream_from 'serial_port_channel'
  end
  def unsubscribed
  end
end  