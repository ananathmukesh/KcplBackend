// In the create_contact_information_table migration file
exports.up = function(knex) {
    return knex.schema.createTable('JobDetails', (table) => {
      table.increments('id').primary(); // Auto-incremental primary key
      table.string('userid',20).nullable();
      table.string('user_role',20).nullable();
      table.string('current_role',10).nullable();
      table.string('current_job',100).nullable(); 
      table.string('current_company',1000).nullable();
      table.string('previous_company',200).nullable();
      table.string('industry',200).nullable();


      table.string('job_types',200).nullable();
      

      table.string('start_career_month',200).nullable();
      table.string('start_career_year',200).nullable();
      table.string('reason_career_break',4000).nullable();


      table.string('work_experiance',200).nullable();
      table.string('prefered_role',200).nullable();
      table.string('currently_located',200).nullable();
      table.string('open_to_work',200).nullable();
      table.string('salary_expectation',200).nullable();
      table.string('notice_period',200).nullable();
      table.string('resume',200).nullable();
      table.string('skills',10).nullable();
      table.string('skills_level',100).nullable();
      
      
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('ContactInformation');
  };
  