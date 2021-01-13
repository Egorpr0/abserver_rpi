desc "Setup serial port listeners in rails"

namespace :subscribe do
  task :redis => :environment do
    $redis.subscribe("serial-port") do |on|
      on.message do |channel, message|
        puts "Broadcast on channel #{channel}: #{message}"
      end
    end
  end
end