// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('JobSkills', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.string('jod_details_id',4000).nullable();
      table.string('skills',4000).nullable();
      table.string('skills_level',4000).nullable();
      
      
      
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('ContactInformation');
  };
  