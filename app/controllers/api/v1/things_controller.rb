class Api::V1::ThingsController < ApplicationController
  def index
		return json: { :things => [
			:name => "something",
			:item => "task"
		]}.to_json
  end
end