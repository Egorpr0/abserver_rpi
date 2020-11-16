class Api::V1::ManualControlController < ApplicationController
  skip_before_action :verify_authenticity_token

  
  def rotate
    serial = UART.open '/dev/ttyUSB0'

    serial.write("Rotate" + params[:steps].b)
  end
end
