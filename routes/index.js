var express = require('express');
var router = express.Router();
let db = require('./db');
let bcrypt = require('bcrypt');
const saltRounds = 10;

let auth = require('./authentication').authenticationMiddleware
let sendMail = require("./mail").sendMail
/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post("/", (req, res) => {
  let b = req.body;
  let userid = req.body.email
  let password = "math@me"
  bcrypt.hash(password, saltRounds, (err, hash) => {

    let record = {
      userid: userid,
      password: hash,
      roll: "student"
    };
    db.users.save(record);
    record = {};
    record = db.users.find({ userid });
    let id = record[0]._id
    if (record.length > 0) {
      let book = {
        uid: id,
        fname: b.fname,
        lname: b.lname,
        phn: b.phn,
        email: b.email,
        skypeid: b.skypeid,
        date: b.date,
        payment: b.payment,
        topic: b.topic,
        year: b.yr,
        syllabus: b.syllabus,
        timing: b.timing,
        status: "pending"
      }
      db.booking.save(book);
      let check = db.booking.find({ uid: id })
      if (check.length > 0) {
        let body = `Welcome <strong>${book.fname} ${book.lname}</strong> ! 
            <br>
            <br>
            You are Registered now You will get a confirmation mail by Sir. Athony Raj or mail Him <strong>raj.anthony92@gmail.com</strong>
            <br>
            <br>
            You can Login to your Account by your email <strong>${book.email}</strong> and temprory password as <strong>maths@me</strong>`
        let subject = "Maths Tution - Registation Completed"
      sendMail(userid, subject, body)
        res.render("redirect", { list: check[0] })
      } else {
        res.send({ b })
      }
    }
  });

})

router.get("/login", (req, res) => {
  res.render("login", { msg: null });
})

router.post("/login", (req, res) => {
  userid = req.body.email;
  password = req.body.pass;
  let user = db.users.find({
    userid: userid
  })
  // console.log(user);
  if (user.length > 0) {
    //check the entered password is same as in database
    bcrypt.compare(password, user[0].password, (err, response) => {
      if (response) {
        global.loged = true;
        // console.log("Logged In Sussesfully");
        // console.log(response);
        res.redirect("/home");
        // res.send({ userid, password })
      } else {
        global.loged = false;
        res.render("login", {
          msg: "Incorrect UserId/Password"
        });
      }
    })
  } else {
    global.loged = false;
    res.render("login", {
      msg: "Incorrect UserId/Password"
    });
  }
})

router.get("/reg",auth(), (req, res) => {
  res.render("reg", { msg: null })
})

router.post("/reg",auth(), (req, res) => {
  let userid = req.body.email;
  let password = req.body.pass;
  let roll = req.body.roll;
  bcrypt.hash(password, saltRounds, (err, hash) => {

    let record = {
      userid: userid,
      password: hash,
      roll
    };
    db.users.save(record);
    record = {};
    record = db.users.find({ userid });
    if (record.length > 0) {
      global.loged = false;
      res.redirect("/login")
    } else {
      res.render("reg", { msg: "Error in register registered" });
    }
  })
})

router.get("/home",auth(), (req, res) => {


  let thistoday = new Date();
  let dd = thistoday.getDate();
  let mm = thistoday.getMonth() + 1; //January is 0!

  let yyyy = thistoday.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  thistoday = dd + '-' + mm + '-' + yyyy;
  let pending = db.booking.find({ status: "pending" })
  let ausers = db.booking.find({ status: "aproved" })
  let nu = [], user = [], tu = [];
  for (let i = 0; i < pending.length; i++) {
    user.push({ id: pending[i]._id, fname: pending[i].fname, lname: pending[i].lname })
    if (thistoday == pending[i].date) {
      tu.push({ id: pending[i]._id, fname: pending[i].fname, time: pending[i].timing })
    }
  }
  for (let i = 0; i < ausers.length; i++) {
    nu.push({ id: ausers[i]._id, fname: ausers[i].fname,uid:ausers[i].uid })
  }
  res.render("home", { user, aproved: nu, tu })
})

router.get("/date/:date", (req, res) => {
  let datearray = req.params.date;
  datearray = datearray.split("-")
  let newdate = datearray.join("/")
  res.send(newdate)
})

router.get("/avilabe", (req, res) => {
  let a = db.booking.find({})
  let d = [];
  // console.log(a)
  for (i = 0; i < a.length; i++) {
    d.push(a[i].date)
  }
  console.log(d);
  res.send(d);
})

router.get("/api/:id", (req, res) => {
  let _id = req.params.id
  let val = db.booking.find({ _id })
  res.send(val[0]);
})

router.post("/update",auth(), (req, res) => {
  let ud = {
    status: req.body.status,
    timing: req.body.timing
  }
  let _id = req.body.id
  db.booking.update({ _id }, ud);
  let val = db.booking.find({ _id })
  let body = `Hello <strong>${val[0].fname} ${val[0].lname}</strong> ! 
  <br>
  <br>
  Your booking for Class on ${val[0].date} is confirmed
  <br>
   <span style="text-align:center"> & </span>
   <br>
  class will be handeled by <strong> Mr. Anthony Raj </strong>  at <strong> ${ud.timing} </strong>
  <br>
  if any Changes Contact <strong> Mr. Anthony Raj </strong>
  `
let subject = "Maths Tution - confirmation of Tution Timing"
sendMail(val[0].email, subject, body)
  res.redirect('/home')
})

router.get("/api/view/:id",auth(),(req,res)=>{
  let list = db.booking.find({uid:req.params.id})
  res.render("view-aproved",{list:list[0]})
})

router.get("/logout",(req,res)=>{
  global.loged = false;
    // console.log("Logged out Succesfully");
    res.render("login",{msg:"logged Out Sucessfully"})
})

module.exports = router;
