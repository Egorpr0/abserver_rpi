class Api::V1::TasksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @tasks = Task.all
    render json: @tasks.to_json
  end

  def create
    @task = Task.new
    @task.name = params[:name]
    @task.tracked_object = params[:tracked_object]
    @task.shutter_speed = params[:shutter_speed]
    @task.exposures_number = params[:exposures_number].to_i

    if @task.save 
      puts "Task saved with:" + params.to_s
    else
      puts "Task NOT saved with:" + params.to_s
    end
  end
end
