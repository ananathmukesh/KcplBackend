// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('GadgetDetails', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.string('userid',4000).nullable();
      table.string('gadget',4000).nullable();
      table.string('brand',4000).nullable();
      table.string('model',300).nullable();
      table.string('warranty',1000).nullable();
      table.string('purchase_date',1000).nullable();
      table.string('description',4000).nullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('GadgetDetails');
  };
  