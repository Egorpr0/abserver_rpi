Rails.application.routes.draw do
  root "index#index"
  namespace :api do
    namespace :v1 do
      resources :things
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
