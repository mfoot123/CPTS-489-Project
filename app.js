const express = require('express');
const session = require('express-session');
const path = require('path');
const stripe = require('stripe')('sk_test_51P6TkSA2UcryXt5ubQvrkqVIaPnzfvtge0MAMdammUpXXyNEzmUbV4BJFBLa5umXG8CvodiEe346N7pYHoaH70Oj00PXNuSd1t');
const sequelize = require('./db');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const User = require('./models/User');
const Product = require('./models/Product');
const populateDB = require('./populateDB');

var indexRouter = require('./routes/index');
var coursesRouter = require('./routes/courses');
// var productsRouter = require('./routes/products');

const app = express();

// Ssession middleware with a random session secret
const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/courses', coursesRouter);
// app.use('/products', productsRouter);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/homepage.html'));
});

app.get('/products', async function(req, res, next) {
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
async function setup() {
  const testuser = await User.create({ username: "testuser", password: "1234", level: "admin"});
  console.log("testuser instance created...")
}

sequelize.sync().then(()=>{
  console.log("Sequelize Sync Completed...");
  if (User.count() == 0)
  {
    setup().then(()=> console.log("User setup complete"))
  }

  // populateDB("Surface All in One", "surfaceallinone.html")
  // populateDB("Surface Pro", "surfacepro.html")
  // populateDB("Surface Laptop", "surfacelaptop.html")
  // populateDB("Framework Laptop 13", "frameworklaptop13.html")
  // populateDB("Framework Laptop 16", "frameworklaptop16.html")
  // populateDB("Framework Chromebook", "frameworkchromebook.html")
  // populateDB("iPhone", "iphone.html")
  // populateDB("Mac", "mac.html")
  // populateDB("MacBook", "macBook.html")
})

module.exports = app;