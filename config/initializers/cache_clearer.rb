require 'sidekiq/api'

Sidekiq::RetrySet.new.clear

Sidekiq::ScheduledSet.new.clear

Sidekiq::Stats.new.reset

Sidekiq::DeadSet.new.clear

Sidekiq::Queue.all.each {|q| q.clear}

Rails.cache.write("arduinoConnectorStatus", nil)
Rails.cache.write("arduinoConnectorTerminate", false)