const mysql      = require('mysql');

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
setInterval(function () {
  connection.query('SELECT 1');
}, 5000);
module.exports = connection;