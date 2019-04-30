var express = require('express');
var router = express.Router();

// const mysql      = require('mysql');
// const connection = mysql.createConnection({
//   host     : 'www.victorwebtec.in',
//   user     : 'jerald',
//   password : 'jerald@11',
//   database : 'AnthonyDB'
// });
 
// connection.connect((err)=>{
//   if(err){
//     console.log(err)
//   }else{
//     console.log("connected");
//   }
// });

// connection.query('SELECT * FROM `users`',  (error, results, fields)=> {
//   if (error) throw error;
//   console.log('The solution is: ', results);
// });

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/cal',(req,res)=>{
  res.render("calender")
})

router.get("/date/:date",(req,res)=>{
  let datearray =req.params.date;
  datearray=datearray.split("-")
  let newdate = datearray.join("/")
  res.send(newdate)
})

router.get("/avilabe",(req,res)=>{
  let dates = ["30/04/2019","01/05/2019","02/05/2019"]
  res.send(dates);
})

module.exports = router;
