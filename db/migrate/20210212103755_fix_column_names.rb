class FixColumnNames < ActiveRecord::Migration[6.0]
  def change
    rename_column :tasks, :tracked_object, :trackedObjectName
    add_column :tasks, :trackedObjectId, :string
    rename_column :tasks, :shutter_speed, :shutterSpeed
    rename_column :tasks, :exposures_number, :exposuresNumber
    remove_column :tasks, :status
    add_column :tasks, :status, :string
    add_column :tasks, :progress, :float
  end
end
