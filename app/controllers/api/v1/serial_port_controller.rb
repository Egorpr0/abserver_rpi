class Api::V1::SerialPortController < ApplicationController
  skip_before_action :verify_authenticity_token

  def receive_message #get, send message to arduino
    redis = Redis.new
    redis.publish('serial-port', params[:message].to_s)
  end

  # def send_message #post, send message to frontend
    # ActionCable.server.broadcast 'serial_port_channel',
      # params.to_json
  # end
end
