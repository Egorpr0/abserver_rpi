class Api::V1::ManualControlController < ApplicationController
  skip_before_action :verify_authenticity_token

  def rotate
    ActionCable.server.broadcast 'manual_control_channel', {
      message: "Nice",
      head: "ok"
    }
  end
end
