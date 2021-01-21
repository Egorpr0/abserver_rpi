class ChangeDataTypeForTaskStatus < ActiveRecord::Migration[6.0]
  def change
    change_column :tasks, :status, :json
  end
end
