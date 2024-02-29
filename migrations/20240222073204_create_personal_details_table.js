// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('PersonalDetails', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.string('dob',20).nullable();
      table.string('age',4000).nullable();
      table.string('gender',1000).nullable();
      table.string('material_status',1000).nullable();
      table.string('occupation',100).nullable();
      table.boolean('Disability',10).nullable().defaultTo(false);
      table.string('description',1000).nullable();
      table.string('relation_name',200).nullable();
      table.string('relation_dob',200).nullable();
      table.string('relation_age',200).nullable();
      table.string('relation',200).nullable();
      
      // Add other columns as needed
  
      // You can add timestamps if you want to track creation and update dates
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('ContactInformation');
  };
  