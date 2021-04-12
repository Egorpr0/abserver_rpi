class AddTypeToConfig < ActiveRecord::Migration[6.0]
  def change
    add_column :configs, :type, :string
    add_index :configs, :name, unique: true
  end
end
