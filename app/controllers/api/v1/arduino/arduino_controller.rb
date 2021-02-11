class Api::V1::Arduino::ArduinoController < ApplicationController 
  skip_before_action :verify_authenticity_token

  def find
    usbDevicesString = `ls /dev/ttyUSB*`
    ubsDevicesVariants = usbDevicesString.split("\n")
    render json: {"devices" => ubsDevicesVariants}.to_json 
  end

  def connect
    @status = Rails.cache.read("arduinoConnectorStatus")
    puts @status
    if @status == "connected" || @status == "connecting"
      render json: {"status" => @status}.to_json
    else
      Arduino::ArduinoConnectorJob.perform_async(params[:port], params[:baudrate])
      render json: {"status" => @status}.to_json
    end
  end

  def status
    status = Rails.cache.read("arduinoConnectorStatus")
    render json: {"status" => status}.to_json
  end

  def disconnect
    Rails.cache.write("arduinoConnectorTerminate", true)
  end
end
