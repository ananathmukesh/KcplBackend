// knexfile.js
require('dotenv').config();

module.exports = {
  client: 'mssql',
  connection: {
    server: 'kcpldatabase.cvqgq6ou6nh3.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'kodukku#2022',
    database: 'kcpl_database',
    charset: 'utf8',
   
    options: {
      encrypt: false, 
      
    },
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};


// module.exports = {
//   client: 'mssql',
//   connection: {
//     server: 'DESKTOP-SKTGI2Q',
//     user: 'mukeshkanna',
//     password: 'leo45gkm',
//     database: 'kcpl_test',
//     charset: 'utf8',
   
//     options: {
//       encrypt: false, 
      
//     },
//   },
//   migrations: {
//     tableName: 'knex_migrations',
//     directory: './migrations',
//   },
//   seeds: {
//     directory: './seeds',
//   },
// };