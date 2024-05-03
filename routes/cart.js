const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const Cart = require('../models/Cart');
const sequelize = require('../db');

const db = new sqlite3.Database("database/repairdb.sqlite");

router.use((req, res, next) => {
    if(req.query.msg){
        res.locals.msg = req.query.msg;
        res.locals.courseid = req.query.name;
    }
    next();
});

// Route to add an item to the cart
router.post('/add-to-cart', async (req, res) => {
    const { productName, quantity = 1, price } = req.body;

    try {
        if (price === null || price === undefined) {
            throw new Error("Product price must not be null");
        }

        // check if the product already exists in the cart
        db.get('SELECT * FROM Carts WHERE productName = ?', [productName], (err, existingItem) => {
            if (err) {
                console.error("Error querying cart:", err);
                return res.status(500).json({ success: false, message: 'Error adding to cart' });
            }

            if (existingItem) {
                // if product exists, update the quantity and total price
                const newQuantity = existingItem.quantity + quantity;
                const newTotalPrice = newQuantity * price;

                db.run(
                    'UPDATE Carts SET quantity = ?, totalPrice = ? WHERE productName = ?',
                    [newQuantity, newTotalPrice, productName],
                    (err) => {
                        if (err) {
                            console.error("Error updating cart:", err);
                            return res.status(500).json({ success: false, message: 'Error updating cart' });
                        }
                        res.status(200).json({ success: true, message: 'Quantity updated' });
                    }
                );
            } else {
                // if product does not exist, create a new item
                db.run(
                    'INSERT INTO Carts (productName, productPrice, quantity, totalPrice) VALUES (?, ?, ?, ?)',
                    [productName, price, quantity, quantity * price],
                    (err) => {
                        if (err) {
                            console.error("Error adding to cart:", err);
                            return res.status(500).json({ success: false, message: 'Error adding to cart' });
                        }
                        res.status(200).json({ success: true, message: 'Product added to cart' });
                    }
                );
            }
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
});


// Route to remove an item from the cart
router.delete('/remove-from-cart', (req, res) => {
    const { productName } = req.body;

    if (!productName) {
        return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    db.get('SELECT * FROM Carts WHERE productName = ?', [productName], (err, existingItem) => {
        if (err) {
            console.error("Error querying cart:", err);
            return res.status(500).json({ success: false, message: 'Error removing product from cart' });
        }

        if (!existingItem) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        const newQuantity = existingItem.quantity - 1;

        if (newQuantity <= 0) {
            // if the new quantity is zero or less, delete the item
            db.run('DELETE FROM Carts WHERE productName = ?', [productName], (err) => {
                if (err) {
                    console.error("Error removing product from cart:", err);
                    return res.status(500).json({ success: false, message: 'Error removing product from cart' });
                }
                res.status(200).json({ success: true, message: 'Product removed from cart' });
            });
        } else {
            // if the quantity is positive, update the quantity and total price
            const newTotalPrice = newQuantity * existingItem.productPrice;

            db.run(
                'UPDATE Carts SET quantity = ?, totalPrice = ? WHERE productName = ?',
                [newQuantity, newTotalPrice, productName],
                (err) => {
                    if (err) {
                        console.error("Error updating cart:", err);
                        return res.status(500).json({ success: false, message: 'Error updating cart' });
                    }
                    res.status(200).json({ success: true, message: 'Quantity updated' });
                }
            );
        }
    });
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
