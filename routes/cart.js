const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const Cart = require('../models/Cart');
const sequelize = require('../db');

// Open or create the SQLite database
const db = new sqlite3.Database("database/repairdb.sqlite");

// Route to add an item to the cart
router.post('/add-to-cart', async (req, res) => {
    console.log("Received data:", req.body); // Debugging log
    try {
      const { productName, quantity, price } = req.body;
  
      console.log("Received price:", price); // Check the value of 'price'
  
      if (price === null || price === undefined) {
        throw new Error("Product price must not be null");
      }
  
      const newCartItem = await Cart.create({
        productName,
        quantity,
        productPrice: price,
        totalPrice: quantity * price,
      });
  
      res.status(200).json({ success: true, cartItem: newCartItem });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
  });  

// Route to remove an item from the cart
router.delete('/remove-from-cart', (req, res) => {
  const { productName } = req.body;

  db.run(
    'DELETE FROM Carts WHERE product_name = ?',
    [productName],
    (err) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Error removing product from cart' });
      } else {
        res.status(200).json({ success: true });
      }
    }
  );
});

router.get('/cart-data', (req, res) => {
    db.all('SELECT * FROM Carts', (err, rows) => {
      if (err) {
        console.error("Error retrieving cart data:", err);
        res.status(500).json({ success: false, message: 'Error retrieving cart data' });
      } else {
        res.status(200).json(rows);
      }
    });
  });
  
  router.get('/', (req, res) => {
    db.all('SELECT * FROM Carts', (err, rows) => {
      if (err) {
        console.error("Error retrieving cart items:", err);
        res.status(500).send('Error retrieving cart items');
      } else {
        res.render('cart', { cartItems: rows });
      }
    });
  });
  

module.exports = router;
