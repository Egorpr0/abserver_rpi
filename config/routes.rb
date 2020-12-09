Rails.application.routes.draw do
  root "index#index"
  namespace :api do
    namespace :v1 do
      mount ActionCable.server => '/cable'
      resources :tasks
      post '/manual_control' => 'manual_control#rotate'

      post '/serial_port' => 'serial_port#send_message'
      get '/serial_port' => 'serial_port#recieve'
    end
  end


  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
