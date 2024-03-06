// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('PropertyDetails', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.string('userid',4000).nullable();
      table.string('property_types',4000).nullable();
      table.string('bhk_type',4000).nullable();
      table.string('property_description',1000).nullable();
      table.string('property_location',1000).nullable();
      table.string('property_status',1000).nullable();
      table.string('land_sqfit',1000).nullable();
      table.string('property_types_option',50).nullable();
    
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('PropertyDetails');
  };
  