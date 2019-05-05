const mysql      = require('mysql');

const connection = mysql.createConnection({
  // host     : '192.168.1.5',
  host     :"localhost",
  port:3306,
  user     : 'root',
  password : '',
  database : 'anthony'
},(err,list)=>{
  if(err){console.log(errr)}else{
    console.log("connected ",list)
  }
});

// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'jeraldvi_jerald',
//   password : 'Johnpeter@17',
//   database : 'jeraldvi_anthony'
// });
 
connection.connect();

module.exports = connection;