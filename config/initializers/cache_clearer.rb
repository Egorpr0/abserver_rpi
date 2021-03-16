require 'sidekiq/api'

Sidekiq.configure_server do |config|
  config.redis = { url: "redis://#{ENV["REDIS_URL"]}:6379/1" }
end

Sidekiq.configure_client do |config|
  config.redis = { url: "redis://#{ENV["REDIS_URL"]}:6379/1" }
end

Sidekiq::RetrySet.new.clear

Sidekiq::ScheduledSet.new.clear

Sidekiq::Stats.new.reset

Sidekiq::DeadSet.new.clear

Sidekiq::Queue.all.each {|q| q.clear}

Rails.cache.write("arduinoConnectorStatus", nil)
Rails.cache.write("arduinoConnectorTerminate", false)