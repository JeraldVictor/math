var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');

let body = `Welcome <strong>Jerald</strong> ! 
            <br>
            <br>
            You are Registered now You will get a confirmation mail by Sir. Athony Raj or mail Him <strong>raj.anthony92@gmail.com</strong>
            <br>
            <br>
            You can Login to your Account by your email <strong>Jeraldvictor123@yahoo.com</strong> and temprory password as <strong>maths@me</strong>`
let subject = "Maths Tution Registation Completed"
let userid = "jeraldvictor123@yahoo.com"


// sendMail(userid, subject, body)
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
