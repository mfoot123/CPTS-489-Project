var express = require('express');
var router = express.Router();
const Product = require('../models/Product');

const sessionChecker = (req, res, next)=>{
    if(req.session.user){
      res.locals.username = req.session.user.username
      next()
    }else{
      res.redirect("/?msg=raf")
    }
  }
  
  router.use(sessionChecker)

router.get('/', async function(req, res, next) {
    console.log("IS IT MAKING IT HERE");
    const categoryName = req.query.category;
    const products = await Product.findAll({
        where: {
        },
    });
    console.log("IS IT MAKING IT HERE");
    res.render('products', {products} );
});

module.exports = router;