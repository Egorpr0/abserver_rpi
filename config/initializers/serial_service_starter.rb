thread = Thread.new do
    system('ruby', 'scripts/serial_port_listener.rb') or raise "Failed to start serial listener service"
end