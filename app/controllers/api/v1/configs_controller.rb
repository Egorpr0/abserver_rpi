class Api::V1::ConfigsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @params = params.permit(:query)
    if @params.has_key?(:query)
      @configs_by_name = Config.where(['name LIKE ?', "%#{@params[:query]}%"])
      @configs_by_value = Config.where(['value LIKE ?', "%#{@params[:query]}%"])
      render json: {'by_name' => @configs_by_name, 'by_value' => @configs_by_value}.to_json
    else
      @configs = Config.all()
      render json: @configs
    end
  end

  def create
    @params = params.require(:config).permit(:name, :value)
    @config = Config.new(@params)
    @config.save
  end

  def show
    @params = params.permit(:id)
    @config = Config.find(params[:id])
    render json: @config
  end

  def update
    @params = params.permit(:id, :value)
    @config = Config.find(@params[:id])
    @config.assign_attributes(@params)
    @config.save
  end

  def destroy
    @params = params.permit(:id)
    @config = Config.find(@params[:id])
    @config.destroy
  end
end
