var express = require('express');
var router = express.Router();

const db = require("./db")
const sendMail = require('./mail').sendMail
const auth = require("./authentication")
/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});


router.get("/:id", (req, res) => {
    let id = req.params.id
    db.query("select * from booking where id = ?", [id], (err, val) => {
      if (err) {
        console.log(err)
      } else {
        res.send(val[0]);
      }
    })
  })
  
  router.get("/",(req,res)=>{
    res.render("redirect")
  })
  
  router.get("/view/:id",auth(), (req, res) => {
    let id =req.params.id
    db.query("select * from booking where uid = ?", [id], (err, list) => {
      if (err) {
        console.log(err)
      } else {
        res.render("view-aproved", { list: list[0] })
      }
    })
    
  })

module.exports = router;
