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
        if(req.query.msg){
            res.locals.msg = req.query.msg
            res.locals.courseid = req.query.courseid
          }
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
        res.redirect("/search?msg=success");        
    }
    catch(error)
    {
        console.log(error.message);
        res.redirect("/?msg=failed+to+validate+product");
    }
});

router.get('/delete', async function(req, res, next) {
    try{
        const modelName = req.query.name;
        const product = await Product.findOne({
            where: {
                name: modelName,
            },
        });
        if (product)
        {
            await product.destroy();
            res.redirect('/search?msg=success');
        }
        else
        {
            res.redirect("/?msg=product+does+not+exist")
        }
    }
    catch(error){
        console.log(error.message);
        res.redirect("/?msg=product+does+not+exist")
    }
});

module.exports = router;