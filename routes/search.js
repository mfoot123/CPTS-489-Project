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

module.exports = router;