class ExecuteTaskJob
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform(task_id)
    #system('python3 scripts/astro_calculator/calculator.py')

    
    progress = 0.0
    update_task(task_id, {"status" => "in_progress"})
    10.times do
      sleep(2)
      progress += 0.1
      update_task(task_id, {"progress" => progress})
    end
    sleep(2)
    update_task(task_id, {"progress" => 0, "status" => "completed"})
    sleep(5)
    update_task(task_id, {"status" => nil})
  end

  def update_task(task_id, params)
    @task = Task.find(task_id)
    @task.assign_attributes(params)
    if @task.save
      ActionCable.server.broadcast 'tasks_update_channel', action: "update", taskId: @task.id, values: params.to_json
    end
  end
end