var express = require('express');
var router = express.Router();
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
        const categories = await Product.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']]
        });
        res.render('search', {categories} );
    }
    catch(error)
    {
        console.log(error.message);
        res.redirect("/?msg=failed+to+find+products");
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

module.exports = router;