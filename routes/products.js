var express = require('express');
var router = express.Router();
const Product = require('../models/Product');

router.get('/', async function(req, res, next) {
    const categoryName = req.query.category;
    const products = await Product.findAll({
        where: {
            category: categoryName,
        },
    });
    res.render('products', {products} );
});
router.post('/new', async function(req, res, next)
{
        console.log(req.body.name);
        const {category, name, description, price, imageUrl, guideUrl} = req.body;
        const product = await Product.create(
            {
                category,
                name,
                description, 
                price, 
                imageUrl,
                guideUrl
            }
        );
        res.redirect("/search")
});

module.exports = router;