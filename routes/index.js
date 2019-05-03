var express = require('express');
var router = express.Router();
let bcrypt = require('bcrypt');
const saltRounds = 10;
const uniqid = require('uniqid');

let diskdb = require("./disk");
let db = require("./db");

let auth = require('./authentication')
let sendMail = require("./mail").sendMail
/* GET home page. */
router.get('/', (req, res) => {
  let list = diskdb.general.find({ _id: "3e429a294568490abbdfd36fb3235b48" })
  res.render('index',
    {
      title: 'Maths Tution | Anthony Raj',
      std: list[0].std,
      topic: list[0].topic,
      syllabus: list[0].syllabus,
      payment: list[0].payment
    });
});

router.post("/", (req, res) => {
  let b = req.body;
  let userid = req.body.email
  let password = "math@me"
  bcrypt.hash(password, saltRounds, (err, hash) => {

    let record = {
      id: uniqid(),
      userid: userid,
      password: hash,
      roll: "student"
    };

    db.query("INSERT INTO `users`(`userid`, `password`, `roll`, `id`) VALUES (?,?,?,?)", [record.userid, record.password, record.roll, record.id], (err) => {
      if (err) {
        console.log("err ", err)
      } else {
        console.log("pass saved")
        let book = {
          id: uniqid(),
          uid: record.id,
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
        db.query("INSERT INTO `booking`(`uid`, `fname`, `lname`, `email`, `skype`, `date`, `payment`, `topic`, `year`, `syllabus`, `timing`, `status`, `id`, `phn`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [book.uid, book.fname, book.lname, book.email, book.skypeid, book.date, book.payment, book.topic, book.year, book.syllabus, book.timing, book.status, book.id, book.phn],
          (err1) => {
            if (err1) {
              console.log("err1 ", err1)
            } else {
              console.log("val insertec on book")
              let body = `Welcome <strong>${book.fname} ${book.lname}</strong> ! 
            <br>
            <br>
            You are Registered now You will get a confirmation mail by Sir. Athony Raj or mail Him <strong>raj.anthony92@gmail.com</strong>
            <br>
            <br>
            You can Login to your Account by your email <strong>${book.email}</strong> and temprory password as <strong>maths@me</strong>`
              let subject = "Maths Tution - Registation Completed"
              sendMail(userid, subject, body)
              res.send(`<h1> Registered </h1> You will recive a mail from us. <br> <a href="/"> Back </a>`)
            }
          })
      }
    })
  })
});

router.get("/login", (req, res) => {
  res.render("login", { msg: null });
})

router.post("/login", (req, res) => {
  userid = req.body.email;
  password = req.body.pass;

  db.query("select * from users where userid = ?", [userid], (err, list) => {
    if (err) {
      console.log(err)
    } else {
      if (list.length > 0) {
        //check the entered password is same as in database
        bcrypt.compare(password, list[0].password, (err, response) => {
          if (response) {
            req.session.userId = list[0].id;
            req.session.roll = list[0].roll
            if (req.session.roll === "admin" || req.session.roll === "teacher") {
              res.redirect("/home/teacher/"+list[0].id)
            } else if (req.session.roll === "student") {
              res.redirect("/home");
            }
          } else {
            res.render("login", {
              msg: "Incorrect UserId/Password"
            });
          }
        })
      } else {
        res.render("login", {
          msg: "UserId Not Found"
        });
      }
    }
  })
})

router.get("/reg", auth(), (req, res) => {
  res.render("reg", { msg: null })
})

router.post("/reg", auth(), (req, res) => {
  let userid = req.body.email;
  let password = req.body.pass;
  let roll = req.body.roll;
  bcrypt.hash(password, saltRounds, (err, hash) => {

    let record = {
      id: uniqid(),
      userid: userid,
      password: hash,
      roll
    };
    db.query("INSERT INTO `users`(`userid`, `password`, `roll`, `id`) VALUES(?,?,?,?)", [record.userid, record.password, record.roll, record.id], (err) => {
      if (err) {
        console.log(err)
        res.render("reg", { msg: "Error in register registered" });
      } else {
        res.redirect("/login")
      }
    })
  })
})

router.get("/home/teacher/:id", auth(), (req, res) => {

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
  db.query("select * from booking where status = 'pending'", (err1, pending) => {
    if (err1) {
      console.log(err1)
    } else {
      db.query("select * from booking where status = 'aproved'", (err2, ausers) => {
        if (err2) {
          console.log(err2)
        } else {
          let nu = [], user = [], tu = [];
          for (let i = 0; i < pending.length; i++) {
            user.push({ id: pending[i].id, fname: pending[i].fname, lname: pending[i].lname })
            if (thistoday == pending[i].date) {
              tu.push({ id: pending[i].id, fname: pending[i].fname, time: pending[i].timing })
            }
          }
          for (let i = 0; i < ausers.length; i++) {
            nu.push({ id: ausers[i].id, fname: ausers[i].fname, uid: ausers[i].uid })
          }
          res.render("home", { user, aproved: nu, tu,tid:req.params.id })
        }
      })
    }
  })
})


router.get("/avilabe", (req, res) => {
  db.query("select * from booking", (err, a) => {
    if (err) {
      console.log(err)
    } else {
      let d = [];
      // console.log(a)
      for (i = 0; i < a.length; i++) {
        d.push(a[i].date)
      }
      // console.log(d);
      res.send(d);
    }
  });
})

router.get("/logout", (req, res) => {
  req.session.userId = undefined;
  req.session.roll = undefined;
  req.session.destroy(function(err) {
    if(err) console.log(err);
    res.render("login", { msg: "logged Out Sucessfully" })
  });
})

module.exports = router;
