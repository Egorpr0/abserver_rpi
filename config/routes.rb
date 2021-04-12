require 'sidekiq/web'

Rails.application.routes.draw do
  root "index#index"
  mount Sidekiq::Web => '/sidekiq'

  namespace :api do
    namespace :v1 do
      mount ActionCable.server => '/cable'
      resources :tasks do
        post 'execute' => 'tasks#execute'
        get 'status' => 'tasks#status'
        get 'terminate' => 'tasks#terminate'
      end
      resources :current_tasks

      resources :configs

      post '/manual_control' => 'manual_control#rotate'
      # post '/serial_port' => 'serial_port#send_message' #TODO move this to arduino controller
      get '/serial_port' => 'serial_port#receive_message'

      namespace :arduino do
        get '/find' => 'arduino#find'
        get '/status' => 'arduino#status'
        post '/connect' => 'arduino#connect'
        get '/disconnect' => 'arduino#disconnect'

      end
    end
  end


  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
