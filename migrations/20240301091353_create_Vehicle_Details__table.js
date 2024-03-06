// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('VehicleDetails', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.string('userid',4000).nullable();
      table.string('model',4000).nullable();
      table.string('brand',4000).nullable();
      table.string('type',1000).nullable();
      table.string('vehicle_no',1000).nullable();
      table.string('vehicle',1000).nullable();
      table.string('dealer_agency',1000).nullable();
      table.string('description',4000).nullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('VehicleDetails');
  };
  