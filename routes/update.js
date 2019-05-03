var express = require('express');
var router = express.Router();
let bcrypt = require('bcrypt');
const saltRounds = 10;
let diskdb = require("./disk");

// diskdb.general.save({"topic":[],"syllabus":[],"std":[],"payment":[],"_id":"3e429a294568490abbdfd36fb3235b48"})

const db = require("./db")
const sendMail = require('./mail').sendMail
const auth = require("./authentication")
/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post("/pending/:id", auth(), (req, res) => {
  let status = req.body.status,
    timing = req.body.timing,
    id = req.body.id
  db.query("UPDATE `booking` SET status = ?, timing =? where id =?", [status, timing, id], (err1) => {
    if (err1) {
      console.log(err1)
    } else {
      db.query("select * from booking where id = ?", [id], (err, val) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(val)
          let body = `Hello <strong>${val[0].fname} ${val[0].lname}</strong> ! 
        <br>
        <br>
        Your booking for Class on ${val[0].date} is confirmed
        <br>
         <span style="text-align:center"> & </span>
         <br>
        class will be handeled by <strong> Mr. Anthony Raj </strong>  at <strong> ${val[0].timing} </strong>
        <br>
        if any Changes Contact <strong> Mr. Anthony Raj </strong>
        `
          let subject = "Maths Tution - confirmation of Tution Timing"
          let email  =val[0].email
          sendMail(email, subject, body)
          res.redirect('/home/teacher/'+req.params.id)
        }
      })
    }
  })

})

router.post("/topic/:id",(req,res)=>{
  let topic = req.body.topic
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let change = list[0].topic
  change.push(topic)
  // console.log(list,change);
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{topic:change})
  res.redirect("/home/teacher/"+req.params.id);
})

router.post("/syllabus/:id",(req,res)=>{
  let syllabus = req.body.syllabus
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let change = list[0].syllabus
  change.push(syllabus)
  // console.log(list,change);
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{syllabus:change})
  res.redirect("/home/teacher/"+req.params.id);
})

router.post("/std/:id",(req,res)=>{
  let std = req.body.std
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let change = list[0].std
  change.push(std)
  // console.log(list,change);
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{std:change})
  res.redirect("/home/teacher/"+req.params.id);
})

router.post("/payment/:id",(req,res)=>{
  let payment = req.body.payment
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let change = list[0].payment
  change.push(payment)
  // console.log(list,change);
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{payment:change})
  res.redirect("/home/teacher/"+req.params.id);
})

router.get("/password/:id",(req,res)=>{
  db.query("select * from users where id  =?",[req.params.id],(err,list)=>{
    if(err){
      console.log(err)
    }else{
      res.render("changepass",{msg:null,list:list[0],crt:null})
    }
  })
})

router.post("/password",(req,res)=>{
  let id = req.body.id;
  let pass = req.body.pass
  let pass1 = req.body.pass1
  if(pass === pass1 ){
    bcrypt.hash(pass, saltRounds, (err, hash) => {
      db.query("UPDATE `users` SET `password`= ? where id = ?" ,[hash,id],(err)=>{
        if(err){
          console.log(err)
        }else{
          res.render("login",{msg:"Password Changed"})
        }
      })
      })
  }else{
    db.query("select * from users where id  =?",[id],(err,list)=>{
      if(err){
        console.log(err)
      }else{
        res.render("changepass",{msg:null,list:list[0],crt:"is-invalid"})
      }
    })
  }
  
})


module.exports = router;
