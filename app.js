const express = require('express');
const session = require('express-session');
const path = require('path');
const stripe = require('stripe')('sk_test_51P6TkSA2UcryXt5ubQvrkqVIaPnzfvtge0MAMdammUpXXyNEzmUbV4BJFBLa5umXG8CvodiEe346N7pYHoaH70Oj00PXNuSd1t');

const app = express();

// Ssession middleware with a random session secret
const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/homepage.html'));
});

// route to add an item to the cart
app.get('/add-to-cart', (req, res) => {

  // save our query
  let { item, quantity, price } = req.query;

  // see if a session exists
  req.session.cart = req.session.cart || [];

  // push our query
  req.session.cart.push({ item, quantity, price });

  // success message
  res.send('Item added to cart');
});

// route to handle the payment process with Stripe
app.post('/charge', async (req, res) => {
  try {
    const token = req.body.token;

    // calculate total cart amount
    const cart = req.session.cart || [];
    let totalAmount = 0;

    // iterate through each item in the cart and sum up the total amount
    cart.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // convert totalAmount to cents for Stripe
    const amountInCents = Math.round(totalAmount * 100); 

    // create charge using the token and total cart amount
    const charge = await stripe.charges.create({
      amount: amountInCents,
      currency: 'usd',
      description: 'Payment for items in the cart',
      source: token,
    });

    // handle successful charge
    res.json({ message: 'Payment successful', charge });
  } catch (err) {
    
    // payment failed
    res.status(500).json({ error: err.message });
  }
});


// starting the server at local host 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
