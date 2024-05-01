const Cart = require('../models/Cart');

function addToCart(productName, quantity, price) {
    fetch('/cart/add-to-cart', { // Use the correct endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName,
        quantity,
        productPrice,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log('Product added to cart');
        updateCart(); // Refresh cart display
      } else {
        console.error('Error adding product to cart:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error in addToCart:', error);
    });
  }

  function removeFromCart(productName) {
    fetch('/cart/remove-from-cart', { // Adjusted endpoint
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productName }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log('Product removed from cart');
        updateCart(); // Refresh cart display
      } else {
        console.error('Error removing product from cart:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error in removeFromCart:', error);
    });
  }
  
  

  