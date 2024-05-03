var express = require('express');
var router = express.Router();
const Company = require('../models/Company');
const Product = require('../models/Product');
const sequelize = require('../db');

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
    try{
        let admin = false;
        const categories = await Product.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']]
        });
        if(req.session.user && req.session.user.level == 'admin')
        {
            admin = true;
            res.render('search', {categories, admin} );
        }
        else
        {
            res.render('search', {categories, admin} );
        }
    }
    catch(error)
    {
        console.log(error.message);
        res.redirect("/?msg=failed+to+find+products");
    }
});

module.exports = router;