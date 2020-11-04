class Api::V1::ThingsController < ApplicationController
  def index
		render :json => [
      {:title => "Task title", :info => "Some info"},
      {:title => "Task title 2", :info => "Some info"}, 
      {:title => "Task title 3", :info => "Some info"}
    ]
  end
end