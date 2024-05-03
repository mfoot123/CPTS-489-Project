var express = require('express');
const Company = require('../models/Company');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    try{
        const companies = await Company.findAll();
        if(req.query.msg){
            res.locals.msg = req.query.msg
          }
        res.render('homepage', {companies} );
    }
    catch(error){
        console.log(error.message);
        res.redirect("/?msg=incorrect+category+name")
    }
});

module.exports = router;
