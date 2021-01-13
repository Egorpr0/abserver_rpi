class ExecuteTaskJob < ApplicationJob
  queue_as :default

  def perform(task_id)
    task = Task.find(task_id)
    task.status = 0
    10.times do
      # puts task.status
      task.status = task.status.to_i + 10
      # puts task.status
      ActionCable.server.broadcast 'tasks_update_channel', task.to_json.to_s
      sleep(1)
    end
  end
end
