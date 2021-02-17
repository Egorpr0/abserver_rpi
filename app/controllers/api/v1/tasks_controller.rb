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
    ExecuteTaskJob.perform_async(params[:task_id])
  end

  def create
    @params = params.permit(:name, :trackedObjectName, :shutterSpeed, :exposuresNumber)
    @task = Task.new(@params)
    if @task.save
      ActionCable.server.broadcast 'tasks_update_channel', action: "add", taskId: @task.id, values: @task.to_json 
    end
  end

  def update
    @params = params.permit(:id, :name, :trackedObjectName, :shutterSpeed, :exposuresNumber, :trackedObjectId, :status, :progress)
    @task = Task.find(@params[:id])
    @task.assign_attributes(@params)
    if @task.save
      ActionCable.server.broadcast 'tasks_update_channel', action: "update", taskId: @task.id, values: @params.to_json
    end
  end

  def destroy
    if @task = Task.destroy(params[:id])
      ActionCable.server.broadcast 'tasks_update_channel', action: "delete", taskId: @task.id, values: @task.to_json
    end
  end
end
