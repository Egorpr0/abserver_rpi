class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.string :tracked_object
      t.json :shutter_speed
      t.integer :exposures_number
      t.string :status

      t.timestamps
    end
  end
end
