var express = require('express');
var router = express.Router();
const Product = require('../models/Product');

router.get('/products', async function(req, res, next) {
    console.log("IS IT MAKING IT HERE");
    const categoryName = req.query.category;
    const products = await Product.findAll({
        where: {
            category: categoryName,
        },
    });
    console.log("IS IT MAKING IT HERE");
    res.render('products', {products} );
});

module.exports = router;