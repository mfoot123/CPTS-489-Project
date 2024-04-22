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
    try{
        const categoryName = req.query.category;
        const products = await Product.findAll({
            where: {
                category: categoryName,
            },
        });
        res.render('products', {products} );
    }
    catch(error){
        console.log(error.message);
        res.redirect("/?msg=incorrect+category+name")
    }
});
router.post('/new', async function(req, res, next)
{
    try{
        //console.log(req.body.name);
        const {category, name, description, price, imageUrl, guideUrl} = req.body;
        await Product.create(
            {
                category,
                name,
                description, 
                price, 
                imageUrl,
                guideUrl
            }
        );
        res.redirect("/search");        
    }
    catch(error)
    {
        console.log(error.message);
        res.redirect("/?msg=failed+to+validate+product");
    }
});

module.exports = router;