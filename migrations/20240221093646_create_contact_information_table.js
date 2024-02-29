// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('ContactInformation', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.integer('userid').notNullable();
      table.string('Street',4000).nullable();
      table.string('place',1000).nullable();
      table.string('taluk',1000).nullable();
      table.string('district',100).nullable();
      table.string('zipcode',20).nullable();
      table.string('idproof',100).nullable();
      table.string('idnumber',200).nullable();
      table.date('issueDate').nullable();
      table.string('country',200).nullable();
      table.string('IssuingAuthority',4000).nullable();
      // Add other columns as needed
  
      // You can add timestamps if you want to track creation and update dates
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('ContactInformation');
  };
  