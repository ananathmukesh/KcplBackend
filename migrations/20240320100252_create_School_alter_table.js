// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.alterTable('SchoolDetails', (table) => {
        table.string('scl_section',100).nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('SchoolDetails');
  };
  