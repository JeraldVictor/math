const mysql      = require('mysql');

const connection = mysql.createConnection({
  host     : '192.168.1.5',
  user     : 'root1',
  password : 'root',
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