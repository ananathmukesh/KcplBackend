// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('HomeApplianceDetails', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.string('userid',4000).nullable();
      table.string('Appliance_type',4000).nullable();
      table.string('brand',1000).nullable();
      table.string('model',1000).nullable();
      table.string('warranty_period',1000).nullable();
      table.string('description',4000).nullable();
      
      
      
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('ContactInformation');
  };
  