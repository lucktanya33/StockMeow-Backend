const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '166.62.28.131',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'mtr04group1'  
})

module.exports = connection