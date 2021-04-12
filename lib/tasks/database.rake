namespace :database do
  
  desc "#CLear configs with empty name/value from configs database"
  task clear_empty_configs: :environment do
    puts "Deleting #{Config.where(["name IS NULL or value IS NULL"]).count} configs!"
    Config.all.each do |config|
      if config.name == nil || config.value == nil
        config.destroy
      end
    end
  end
end
