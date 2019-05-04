const mysql      = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'jerald@11',
  database : 'anthony'
});

// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'jeraldvi_jerald',
//   password : 'Johnpeter@17',
//   database : 'jeraldvi_anthony'
// });
 
connection.connect();

module.exports = connection;