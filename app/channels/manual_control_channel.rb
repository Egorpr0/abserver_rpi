class ManualControlChannel < ApplicationCable::Channel  
  def subscribed
    stream_from 'manual_control_channel'
  end
  def unsubscribed
  end
end  
