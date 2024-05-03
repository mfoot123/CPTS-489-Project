const express = require('express');
const session = require('express-session');
const path = require('path');
const stripe = require('stripe')('sk_test_51P6TkSA2UcryXt5ubQvrkqVIaPnzfvtge0MAMdammUpXXyNEzmUbV4BJFBLa5umXG8CvodiEe346N7pYHoaH70Oj00PXNuSd1t');
const sequelize = require('./db');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Company = require('./models/Company');
const ProductCategories = require('./models/ProductCategories');

// Import routers
const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const searchRouter = require('./routes/search');
const signupRouter = require('./routes/signup');
const cartRouter = require('./routes/cart');
const homepageRouter = require('./routes/homepage');
const companyhomeRouter = require('./routes/companyhome');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Session setup
app.set('trust proxy', 1);
app.use(session({
  secret: 'wsu489',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Use routers
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/search', searchRouter);
app.use('/signup', signupRouter);
app.use('/cart', cartRouter);
app.use('/homepage', homepageRouter);
app.use('/companyhome', companyhomeRouter);

// Route for handling Stripe payment
app.post('/charge', async (req, res) => {
  try {
    const token = req.body.token;

    // Calculate total cart amount from the session cart
    const cart = req.session.cart || [];
    let totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Convert to cents for Stripe
    const amountInCents = Math.round(totalAmount * 100);

    // Create a Stripe charge
    const charge = await stripe.charges.create({
      amount: amountInCents,
      currency: 'usd',
      description: 'Payment for cart items',
      source: token,
    });

    // Clear the session cart after successful payment
    req.session.cart = [];

    // Successful payment
    res.json({ message: 'Payment successful', charge });
  } catch (err) {
    console.error('Error processing Stripe charge:', err);
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Global error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error'); // Render the error page
});

// Sequelize sync
sequelize.sync().then(() => {
  console.log('Sequelize sync completed.');

  // Create a test user if none exists
  User.count().then((count) => {
    if (count === 0) {
      setup().then(() => console.log('User setup complete'));
    }
  });
});

module.exports = app;
