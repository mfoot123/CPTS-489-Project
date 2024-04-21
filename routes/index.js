var express = require('express');
const User = require('../models/User');
var router = express.Router();
const path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/homepage.html'));
  // res.render('index', { title: 'Repair Homepage' });
});

// router.post('/login', async function(req, res, next) {
//   //console.log(req.body.username+" - "+req.body.password);
//   const user = await User.findUser(req.body.username, req.body.password)
//   if(user!== null){
//     req.session.user = user
//     res.redirect("/courses")
//   }else{
//     res.redirect("/?msg=fail")
//   }
// });

module.exports = router;
