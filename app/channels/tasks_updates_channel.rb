class TasksUpdatesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tasks_update_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
