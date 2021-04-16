class AddTypeToConfig < ActiveRecord::Migration[6.0]
  def change
    add_column :configs, :value_type, :string
    add_index :configs, :name, unique: true
    add_column :configs, :modifiable, :boolean
    add_column :configs, :subcategory, :string
  end
end
