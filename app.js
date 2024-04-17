const session = require('express-session');

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  req.session.cart = req.session.cart || [];
  // You can now add to req.session.cart as needed
  res.sendFile(path.join(__dirname, '/public/homepage.html'));
});

// Example route to add an item to the cart
app.get('/add-to-cart', (req, res) => {
  let { item, quantity, price } = req.query;
  req.session.cart.push({ item, quantity, price });
  res.send('Item added to cart');
});
