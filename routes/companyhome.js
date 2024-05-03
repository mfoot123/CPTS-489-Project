var express = require('express');
const ProductCategories = require('../models/ProductCategories');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    try{
        const companyName = req.query.company;
        const productCategories = await ProductCategories.findAll({
            where: {
                company: companyName,
            },
        });
        if(req.query.msg){
            res.locals.msg = req.query.msg
          }
        res.render('companyhome', {productCategories} );
    }
    catch(error){
        console.log(error.message);
        res.redirect("/?msg=incorrect+category+name")
    }
});

module.exports = router;
