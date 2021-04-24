class Config < ApplicationRecord
  before_update :handle_update

  def handle_update
    if value_changed?
      case name
      when 'status_report_period'
        Redis.current.publish('serial-port', {:n => :config, :p => {:reportFrequency => value}}.to_json.to_s)
      else
        puts 'Some other value changed'
      end
    end
  end
end
