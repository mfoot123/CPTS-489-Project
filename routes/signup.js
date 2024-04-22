var express = require('express');
const User = require('../models/User');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('signup', { msg: req.session.msg });
});

router.post('/register', async function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
  
    const existingUser = await User.checkUsername(username); 
    if (existingUser == true) {
        req.session.msg = 'error';
        res.redirect('/signup');
    } else if (existingUser == false) {
        req.session.msg = 'success';
        const newUser = await User.createUser(username, password);
        res.redirect('/'); 
    }
  });

module.exports = router;