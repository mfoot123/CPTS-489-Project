var express = require('express');
const User = require('../models/User');
var router = express.Router();
const path = require('path')
const Product = require('../models/Product');
const sequelize = require('../db');

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
    res.redirect('/homepage');
  }else{
    res.redirect("/?msg=fail")
  }
});

router.get('/results', async function(req, res, next) {
  try{
      const keyword = req.query.search.toLowerCase();
      const products = await Product.findAll({
          where: sequelize.where( sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + keyword + '%')
      });
      res.render('products', {products} );
  }
  catch(error)
  {
      console.log(error);
      res.redirect("/?msg=no+products+contain+that+keyword")
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

module.exports = router;
