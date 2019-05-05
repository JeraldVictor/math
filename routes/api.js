var express = require('express');
var router = express.Router();

const db = require("./db")
const sendMail = require('./mail').sendMail
const auth = require("./authentication")
/* GET users listing. */
router.get('/',auth() ,(req, res) => {
  db.query("select * from users where roll = 'student'",(err,list)=>{
    if(err){
      console.log(err);
    }else{
      res.render("users",{user:list})
    }
  })
});


router.get("/:id",auth() , (req, res) => {
    let id = req.params.id
    db.query("select * from booking where id = ?", [id], (err, val) => {
      if (err) {
        console.log(err)
      } else {
        res.send(val[0]);
      }
    })
  })
  
  router.get("/",auth() ,(req,res)=>{
    res.render("redirect")
  })
  
  router.get("/view/:id",auth() , (req, res) => {
    let id =req.params.id
    db.query("select * from booking where uid = ?", [id], (err, list) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(list)
        let user={
          booking:0,
          date:[],
          time:[],
          topic:[]
        }
        for(let i=0;i<list.length;i++){
          // count++;
          user.booking ++;
          user.date.push(list[i].date)
          user.time.push(list[i].timing)
          user.topic.push(list[i].topic)
        }
        // console.log(user);
        // user.booking=count;
        // user.date=date;
        res.render("view-aproved", { list:list[0],user })
      }
    })
    
  })

module.exports = router;
