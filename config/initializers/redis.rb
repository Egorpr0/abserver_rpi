# frozen_string_literal: true

Redis.current = Redis.new(url:  "redis://localhost",
                          port: "6379",
                          db:   "1")