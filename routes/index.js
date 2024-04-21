var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('index');
});

router.post('/login', async function(req, res, next) {
  const user = await User.findUser(req.body.username, req.body.password)
  if(user!== null){
    req.session.user = user
    res.redirect("/products")
  }else{
    res.redirect("/?msg=fail")
  }
});

router.get('/logout', function(req,res, next){
  if(req.session.user){
    req.session.destroy()
    res.redirect("/?msg=logout")
  }else {
    res.redirect("/")
  }
})

router.get('/signup', function(req, res, next) {
  res.render('signup'); 
});

router.post('/signup', async function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await User.findUser(username); 
  if (existingUser) {
      return res.redirect('/signup?msg=usernameTaken')
  }

  const newUser = await User.createUser(username, password);
  res.redirect('/login'); 
});

module.exports = router;
