var express = require('express');
var router = express.Router();
const User = require('../models/User'); 

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