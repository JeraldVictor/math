const mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'jerald@11',
  database : 'anthony'
});
 
connection.connect();

// connection.query("select * from users",(err,list)=>{
//   if(err){
//     console.log(err)
//   }else{
//     console.log("ok ",list)
//   }
// })



module.exports = connection;