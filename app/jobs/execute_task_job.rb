class ExecuteTaskJob < ApplicationJob
  include Sidekiq::Worker
  queue_as :default

  def perform(task_id)
    task = Task.find(task_id)
    system('python3 scripts/astro_calculator/calculator.py')
    progress = 0;

    ActionCable.server.broadcast 'tasks_update_channel', taskId: task.id, action: 'update', parameter: 'status.state', value: 'in_progress'
    10.times do
      sleep(3)
      progress += 10
      ActionCable.server.broadcast 'tasks_update_channel', taskId: task.id, action: 'update', parameter: 'status.progress', value: progress.to_s
    end
    ActionCable.server.broadcast 'tasks_update_channel', taskId: task.id, action: 'update', parameter: 'status.state', value: 'completed'
    ActionCable.server.broadcast 'tasks_update_channel', taskId: task.id, action: 'update', parameter: 'status.progress', value: '0'
    task.status = {'state' => 'completed', 'progress' => '0', 'last_executed' => ''}.to_json
    task.save

  end
end