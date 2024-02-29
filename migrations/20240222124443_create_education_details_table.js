// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('EducationalDetails', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.string('clg_course',20).nullable();
      table.string('clg_specialization',200).nullable();
      table.string('start_year',10).nullable();
      table.string('end_year',10).nullable();
      table.string('university',100).nullable();
      table.string('collage',100).nullable();
     
      table.string('scl_qualification',1000).nullable();
      table.string('scl_specialization',200).nullable();
      table.string('scl_start',200).nullable();
      table.string('scl_end',200).nullable();
      table.string('scl_name',200).nullable();
      
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('ContactInformation');
  };
  