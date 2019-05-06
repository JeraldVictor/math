const mysql      = require('mysql');

// const connection = mysql.createConnection({
//   // host     : '192.168.1.5',
//   host     :"localhost",
//   port:3306,
//   user     : 'root',
//   password : '',
//   database : 'anthony'
// });

const connection = mysql.createConnection({
  host     : 'localhost',
  port:3306,
  user     : 'jeraldvi_jerald',
  password : 'Johnpeter@17',
  database : 'jeraldvi_anthony'
});
 
connection.connect((err)=>{
  if(err){
    console.log(err)
  }else{
    console.log("ok mysql connected")
  }
});

module.exports = connection;