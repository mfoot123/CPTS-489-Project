var express = require('express');
var router = express.Router();
const Product = require('../models/Product');
const sequelize = require('../db');

router.get('/', async function(req, res, next) {
    const categories = await Product.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']]
    });
    res.render('search', {categories} );
});

router.get('/results', async function(req, res, next) {
    const keyword = req.query.search.toLowerCase();
    const products = await Product.findAll({
        where: sequelize.where( sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + keyword + '%')
    });
    res.render('products', {products} );
});

module.exports = router;