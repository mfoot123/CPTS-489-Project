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

    // parses the string retrieved from localStorage into a JavaScript object, if doesnt exist set as empty string
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // find the item we want to delete, create new array without them
    cart = cart.filter(item => item.name !== productName);

    // updates the cart data stored in local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // refresh the page
    window.location.reload();
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

    // create a div element for displaying total price
    const totalSection = document.createElement('div');
    totalSection.classList.add('total-section');

    // populate total div with HTML content + the total price
    totalSection.innerHTML = `
        <h2>Total Price: $${totalPrice.toFixed(2)}</h2>
    `;

    // append total div to the body of the document
    document.body.appendChild(totalSection);
}
