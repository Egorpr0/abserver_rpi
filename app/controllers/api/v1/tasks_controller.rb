class Api::V1::TasksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @tasks = Task.all
    render json: @tasks.to_json
  end

  def show
    @task = Task.find(id: params[:id])

    render json: @task.to_json
  end

  def edit
  end

  def create
    @task = Task.new
    @task.name = params[:name]
    @task.tracked_object = params[:tracked_object]
    @task.shutter_speed = params[:shutter_speed]
    @task.exposures_number = params[:exposures_number].to_i
    @task.status = "added"

    if @task.save
      puts "Task saved with:" + params.to_s
    else
      puts "Task NOT saved with:" + params.to_s
    end
  end

  def update
  end
  
  def destroy
    @task = Task.destroy(params[:id])
  end


end
