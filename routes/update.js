var express = require('express');
var router = express.Router();
const crypto = require('crypto');
let diskdb = require("./disk");

// diskdb.general.save({"topic":[],"syllabus":[],"std":[],"payment":[],"_id":"3e429a294568490abbdfd36fb3235b48"})


const db = require("./db")
const sendMail = require('./mail').sendMail
const auth = require("./authentication")
/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post("/pending", auth(), (req, res) => {
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
          let sub1 = "Maths Tution - Approved Class on "+val[0].date
            let bdy = `<strong>Hello Sir</strong><br><br><div>You <strong>Approved</strong> Class for ${val[0].fname} ${val[0].lname}<br> Date : <strong> ${val[0].date} </strong> Time : <strong> ${val[0].timing} </strong> </div>`
            let mailid = 'raj.anthony92@gmail.com'
            sendMail(mailid, sub1, bdy)
          res.redirect('/home/teacher/'+req.session.userId)
        }
      })
    }
  })

})

router.post("/aproved", auth(), (req, res) => {
  let status = req.body.status,
    id = req.body.id
  db.query("UPDATE `booking` SET status = ? where id =?", [status, id], (err1) => {
    if (err1) {
      console.log(err1)
    } else {
      db.query("select * from booking where id = ?", [id], (err, val) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(val)
          let body = `Hello <strong>${val[0].fname} ${val[0].lname}</strong> ! <br><br>Your  Class on ${val[0].date} is marked As Finished<br>class was handeled by <strong> Mr. Anthony Raj </strong>  at <strong> ${val[0].timing} </strong><br><br><br><strong>Thank You<br>With Regards<br>Mr. Anthony Raj</strong>`
          let subject = "Maths Tution - "+val[0].fname+" - Class Marked As Finished "
          let email  =val[0].email
          sendMail(email, subject, body)
          res.redirect('/home/teacher/'+req.session.userId)
        }
      })
    }
  })

})

router.post("/topic",(req,res)=>{
  let topic = req.body.topic
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let change = list[0].topic
  change.push(topic)
  // console.log(list,change);
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{topic:change})
  res.redirect("/home/teacher/"+req.session.userId);
})

router.post("/syllabus",(req,res)=>{
  let syllabus = req.body.syllabus
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let change = list[0].syllabus
  change.push(syllabus)
  // console.log(list,change);
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{syllabus:change})
  res.redirect("/home/teacher/"+req.session.userId);
})

router.post("/std",(req,res)=>{
  let std = req.body.std
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let change = list[0].std
  change.push(std)
  // console.log(list,change);
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{std:change})
  res.redirect("/home/teacher/"+req.session.userId);
})

router.post("/payment",(req,res)=>{
  let payment = req.body.payment
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let change = list[0].payment
  change.push(payment)
  // console.log(list,change);
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{payment:change})
  res.redirect("/home/teacher/"+req.session.userId);
})

router.post("/topic/rm",(req,res)=>{
  let topic = req.body.topic
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let count = 0;
  for(let i=0;i<list[0].topic.length;i++){
    if(list[0].topic[i] == topic){
      list[0].topic.splice(count,1)
    }
    count++
  }
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{topic:list[0].topic})
  res.redirect("/home/teacher/"+req.session.userId);
})

router.post("/syllabus/rm",(req,res)=>{
  let syllabus = req.body.syllabus
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let count = 0;
  for(let i=0;i<list[0].syllabus.length;i++){
    if(list[0].syllabus[i] == syllabus){
      list[0].syllabus.splice(count,1)
    }
    count++
  }
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{syllabus:list[0].syllabus})
  res.redirect("/home/teacher/"+req.session.userId);
})

router.post("/std/rm",(req,res)=>{
  let std = req.body.std
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let count = 0;
  for(let i=0;i<list[0].std.length;i++){
    if(list[0].std[i] == std){
      list[0].std.splice(count,1)
    }
    count++
  }
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{std:list[0].std})
  res.redirect("/home/teacher/"+req.session.userId);
})

router.post("/payment/rm",(req,res)=>{
  let payment = req.body.payment
  let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"});
  let count = 0;
  for(let i=0;i<list[0].payment.length;i++){
    if(list[0].payment[i] == payment){
      list[0].payment.splice(count,1)
    }
    count++
  }
  diskdb.general.update({_id:"3e429a294568490abbdfd36fb3235b48"},{payment:list[0].payment})
  res.redirect("/home/teacher/"+req.session.userId);
})


router.get("/password",(req,res)=>{
  db.query("select * from users where id  =?",[req.session.userId],(err,list)=>{
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
    crypto.pbkdf2(pass, 'salt', 10, 64, 'sha512', (err, hash) => {
      if (err) throw err;
      let a = hash.toString('hex');
      db.query("UPDATE `users` SET `password`= ? where id = ?" ,[a,id],(err)=>{
        if(err){
          console.log(err)
        }else{
          req.session.userId = undefined;
          req.session.roll = undefined;
          req.session.destroy(function(err) {
            if(err) console.log(err);
            res.render("login",{msg:"Password Changed"})
          });
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
