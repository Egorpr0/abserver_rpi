class Api::V1::TasksController < ApplicationController
  def index
		render :json => [
      {:title => "Task title", :info => "Some info"},
      {:title => "Task title 2", :info => "Some info"}, 
      {:title => "Task title 3", :info => "Some info"}
    ]
  end

  def create
    @task = Task.new(task_params)

    if @task.save 
      puts "Task saved with:" + task_params
    else
      puts "Task NOT saved with:" + task_params
    end
  end
end
