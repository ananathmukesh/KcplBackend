// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('SchoolDetails', (table) => {
      table.increments('id').primary();
      table.string('scl_qualification',1000).nullable();
      table.string('scl_specialization',200).nullable();
      table.string('scl_start',200).nullable();
      table.string('scl_end',200).nullable();
      table.string('scl_name',200).nullable();
      table.string('scl_percentage',200).nullable();
      
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('SchoolDetails');
  };
  