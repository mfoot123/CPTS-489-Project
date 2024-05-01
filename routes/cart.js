const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const Cart = require('../models/Cart'); // Ensure this import is correct

// Open or create the SQLite database
const db = new sqlite3.Database('repairdb.sqlite');

// Route to add an item to the cart
router.post('/cart/add-to-cart', async (req, res) => {
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
    'DELETE FROM Cart WHERE product_name = ?',
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

// Route to get all items in the cart
router.get('/cart-data', (req, res) => {
  db.all('SELECT * FROM Cart', (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error retrieving cart data' });
    } else {
      res.status(200).json(rows); // Return cart data
    }
  });
});

// Route to display the cart page
router.get('/cart', (req, res) => {
  db.all('SELECT * FROM Cart', (err, rows) => {
    if (err) {
      res.status(500).send('Error retrieving cart items');
    } else {
      res.render('cart', { cartItems: rows });
    }
  });
});

module.exports = router;
