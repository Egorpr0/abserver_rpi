class Api::V1::TasksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @tasks = Task.all
    render json: @tasks.to_json
  end

  def show
    @task = Task.find(params[:id])

    render json: @task.to_json
  end

  def execute
    ExecuteTaskJob.perform_later(params[:task_id])
  end

  def edit
  end

  def create
    @task = Task.new
    @task.name = params[:name]
    @task.tracked_object = params[:tracked_object]
    @task.shutter_speed = params[:shutter_speed]
    @task.exposures_number = params[:exposures_number].to_i
    @task.status = {"state" => "added", "progress" => "0", "last_executed" => ""}.to_json

    if @task.save
      puts "Task saved with:" + params.to_s
      ActionCable.server.broadcast 'tasks_update_channel', action: "add", parameter: "task", value: @task.to_json
    else
      puts "Task NOT saved with:" + params.to_s
    end
  end

  def update

  end

  def destroy
    if @task = Task.destroy(params[:id])
      ActionCable.server.broadcast 'tasks_update_channel', action: "delete", parameter: "task", value: @task.to_json
    end
  end
end
