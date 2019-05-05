var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const uniqid = require('uniqid');

let diskdb = require("./disk");
let db = require("./db");

let auth = require('./authentication')
let sendMail = require("./mail").sendMail
let getDate=()=>{
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
  // return
  global.thistoday = dd + '-' + mm + '-' + yyyy;

}
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
  
  crypto.pbkdf2(password, 'salt', 10, 64, 'sha512', (err, hash) => {
    if (err) throw err;
    let record = {
      id: uniqid(),
      userid: userid,
      password: hash.toString('hex'),
      username:b.fname,
      roll: "student"
    };
    console.log(record);
    db.query("INSERT INTO `users`(`userid`, `password`,`username`, `roll`, `id`) VALUES(?,?,?,?,?)", [record.userid, record.password, record.username,record.roll, record.id], (err) => {
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
              let body = `Welcome <strong>${book.fname} ${book.lname}</strong> !<br><br>You are Registered now You will get a confirmation mail by Sir. Athony Raj or mail Him <strong>raj.anthony92@gmail.com</strong><br><br>You can Login to your Account by your email <strong>${book.email}</strong> and temprory password as <strong>maths@me</strong>`
              let subject = "Maths Tution - Registation Completed"
              sendMail(userid, subject, body)
              let sub1 = "Maths Tution - New Registation"
              let bdy = `<strong>Hello Sir</strong><br><br><div>You Got New Registation by ${book.fname} ${book.lname}<br>You Need To Approve it.</div>`
              let mailid = 'raj.anthony92@gmail.com'
              sendMail(mailid, sub1, bdy)
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
        crypto.pbkdf2(password, 'salt', 10, 64, 'sha512', (err, hash) => {
          if (err) throw err;
          if(list[0].password === hash.toString('hex')){
            req.session.userId = list[0].id;
            req.session.username = list[0].username
            req.session.roll = list[0].roll
            if (req.session.roll === "admin" || req.session.roll === "teacher") {
              res.redirect("/home/teacher/"+list[0].id)
            } else if (req.session.roll === "student") {
              res.redirect("home/student/"+list[0].id)
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

router.get("/reg",  auth(), (req, res) => {
  res.render("reg", { msg: null })
})

router.post("/reg",  auth(),(req, res) => {
  let userid = req.body.email;
  let password = req.body.pass;
  let username = req.body.username
  let roll = req.body.roll;
  crypto.pbkdf2(password, 'salt', 10, 64, 'sha512', (err, hash) => {
    if (err) throw err;
    // a = derivedKey
    let record = {
      id: uniqid(),
      userid: userid,
      password: hash.toString('hex'),
      roll
    };
    db.query("INSERT INTO `users`(`userid`, `password`,`username`, `roll`, `id`) VALUES(?,?,?,?,?)", [record.userid, record.password, username,record.roll, record.id], (err) => {
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

  db.query("select * from booking where status = 'pending'", (err1, pending) => {
    if (err1) {
      console.log(err1)
    } else {
      db.query("select * from booking where status = 'aproved'", (err2, ausers) => {
        if (err2) {
          console.log(err2)
        } else {
          getDate();
          // console.log(global.thistoday);
          let nu = [],nu1=[],classover=[], user = [], tu = [];
          for (let i = 0; i < pending.length; i++) {
            // console.log(pending[i].date,global.thistoday);
            user.push({ id: pending[i].id, fname: pending[i].fname, lname: pending[i].lname })
          }
          for (let i = 0; i < ausers.length; i++) {
            nu.push(ausers[i].uid)
            nu1.push(ausers[i].fname)
            classover.push({ id: ausers[i].id, fname: ausers[i].fname, lname: ausers[i].lname })
            if (global.thistoday == ausers[i].date) {
              tu.push({ id: ausers[i].id, fname: ausers[i].fname, time: ausers[i].timing })
            }
            // console.log(ausers[i].uid,nu[i].uid)
          }
          let arr = [...new Set(nu)];
          let arr1 = [...new Set(nu1)]
          // console.log(arr,arr1);
          nu =[];
          for(var i =0 ;i<arr.length;i++){
            nu[i] ={
              uid:arr[i],
              fname:arr1[i]
            } 
          }
          let list = diskdb.general.find({_id:"3e429a294568490abbdfd36fb3235b48"})
          res.render("home", {today:global.thistoday,list:list[0],username:req.session.username, classover,user, aproved: nu, tu,tid:req.session.userId })
        }
      })
    }
  })
})

router.get("/home/student/:id", auth(),(req,res)=>{
  getDate();
  let id = req.params.id
  db.query("select * from booking where status = 'pending' and uid = ?",[id],(err1, pending) => {
    if (err1) {
      console.log(err1)
    } else {
      db.query("select * from booking where status = 'aproved' and uid=?",[id],(err2, ausers) => {
        if (err2) {
          console.log(err2)
        } else {
          db.query("select * from booking where status = 'finished' and uid=?",[id],(err3,finished)=>{
            if(err3){
              console.log(err3);
            }else{
            let tu = [];
            for (let i = 0; i < pending.length; i++) {
              if (global.thistoday == pending[i].date) {
                tu.push(pending[i])
              }
            }
            res.render("student-home", {today:global.thistoday,finished,username:req.session.username,user:pending, aproved: ausers, tu,sid:req.session.userId })
            }
          })
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

router.get("/new-booking",auth(),(req,res)=>{
  res.render("book-new",{msg:null})
})

router.post("/new-booking",auth(), (req,res)=>{
  db.query("select * from booking where uid = ?",[req.session.userId],(err,list)=>{
    if(err){
      console.log(err)
    }else{
      let b = list[0]
      let book = {
        id: uniqid(),
        uid: b.uid,
        fname: b.fname,
        lname: b.lname,
        phn: b.phn,
        email: b.email,
        skypeid: b.skype,
        date: req.body.date,
        payment: b.payment,
        topic: b.topic,
        year: b.year,
        syllabus: b.syllabus,
        timing: req.body.timing,
        status: "pending"
      }
      db.query("INSERT INTO `booking`(`uid`, `fname`, `lname`, `email`, `skype`, `date`, `payment`, `topic`, `year`, `syllabus`, `timing`, `status`, `id`, `phn`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [book.uid, book.fname, book.lname, book.email, book.skypeid, book.date, book.payment, book.topic, book.year, book.syllabus, book.timing, book.status, book.id, book.phn],
        (err1) => {
          if (err1) {
            console.log("err1 ", err1)
          } else {
            let body = `Welcome <strong>${book.fname} ${book.lname}</strong> !<br><br>You are Registered now You will get a confirmation mail by Sir. Athony Raj or mail Him <strong>raj.anthony92@gmail.com</strong><br><br>With Regards <br> Athony Raj`
            let subject = "Maths Tution - Registation Completed"
            sendMail(userid, subject, body)
            let sub1 = "Maths Tution - New Registation"
            let bdy = `<strong>Hello Sir</strong><br><br><div>You Got New Registation by ${book.fname} ${book.lname}<br>You Need To Approve it.</div>`
            let mailid = 'raj.anthony92@gmail.com'
            sendMail(mailid, sub1, bdy)
            res.render("book-new",{msg:"Booked Wait For The Mail"})
          }
        })
    }
  })
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
