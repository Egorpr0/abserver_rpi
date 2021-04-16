namespace :configs do
  
  desc "#Clear configs with empty name/value from configs database"
  task clear_empty: :environment do
    puts "Deleting #{Config.where(["name IS NULL or value IS NULL"]).count} configs!"
    Config.all.each do |config|
      if config.name == nil || config.value == nil
        config.destroy
      end
    end
  end

  desc "#Overwrite all current configs to specified in the config/default_configs.yml"
  task set_defaults: :environment do
    puts "Deleting all configs!"
    Config.destroy_all

    @configs_file_dir = Dir['./config/*'].select {|x| x =~ /default_configs.(yml|yaml)/ }
    @default_configs = YAML.load(File.read(@configs_file_dir.first))
    @default_configs['configs'].each do |subcategory_name, subcategory|
      subcategory.each do |config_name, config_properties|
        @config = Config.new(name: config_name, subcategory: subcategory_name)
        @config.assign_attributes(config_properties)
        @config.save
      end
    end
  end
end