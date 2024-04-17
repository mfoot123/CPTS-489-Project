function addToCart(productName, quantity, price) {

    // console log for debugging
    console.log("Adding to cart:", productName, quantity, price);

    // parses the string retrieved from localStorage into a JavaScript object, if doesnt exist set as empty string
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // get our product name
    let found = cart.find(item => item.name === productName);

    // if the product already exists
    if (found) {

        // add t the quantity
        found.quantity += quantity;
    } else {

        // push the new item to cart
        cart.push({ name: productName, quantity, price });
    }

    // store locally so when pages refresh it stays
    localStorage.setItem('cart', JSON.stringify(cart));

    // print cart for debugging
    console.log("Cart contents:", cart);
}

function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let index = cart.findIndex(item => item.name === productName);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the display of the cart contents on the webpage
        updateCartDisplay(cart);
    }
}


function displayCart() {

    // // parses the string retrieved from localStorage into a JavaScript object, if doesnt exist set as empty string
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // walk through object, display item + additional details
    cart.forEach(item => {
        console.log(`${item.name} x${item.quantity} - $${item.price}`);
    });
}

function updateCartDisplay(cart) {

    // select the product section container
    const productSection = document.querySelector('.product-section');

    // clear existing contents
    productSection.innerHTML = '';

    // total price variable
    let totalPrice = 0;

    // loop through each item in the cart
    cart.forEach(item => {

        // create a div element for each product
        const productDiv = document.createElement('div');

        // add to product container
        productDiv.classList.add('product-container');
        
        // populate the product div with HTML content
        productDiv.innerHTML = `
            <div class="product">
                <img src="${item.image}" alt="${item.name}">
                <h2>${item.name}</h2>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price}</p>
                <button onclick="removeFromCart('${item.name}')">Remove from Cart</button>
            </div>
        `;

        // append the div to the product section container
        productSection.appendChild(productDiv);

        // calculate total price by multiplying items price with its quantity
        totalPrice += item.price * item.quantity;
    });

    // remove existing total price if it exists
    const existingTotalSection = document.querySelector('.total-section');
    if (existingTotalSection) {
        existingTotalSection.remove();
    }

    // create and append new total price section
    const totalSection = document.createElement('div');
    totalSection.classList.add('total-section');
    totalSection.innerHTML = `
        <h2>Total Price: $${totalPrice.toFixed(2)}</h2>
    `;
    document.body.appendChild(totalSection);
}
