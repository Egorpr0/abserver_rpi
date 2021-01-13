class Api::V1::CurrentTasksController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def create
    @task = Task.find(params[:id])
    Redis.set('current_task', @task.to_json)
  end

  def show
    @task = Redis.get('current_task')
    render json: @task.to_json
  end
end