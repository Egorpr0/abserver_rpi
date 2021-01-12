class Api::V1::SerialPortController < ApplicationController
  skip_before_action :verify_authenticity_token

  def recieve
    redis = Redis.new
    redis.publish('serial-port', params[:message])
  end

  def send_message
    ActionCable.server.broadcast 'serial_port_channel',
      params.to_json
  end
end
