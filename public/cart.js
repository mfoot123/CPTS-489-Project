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

    // rerieves cart from local storage, if it doesnt exist use empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // find index of item we want to remove
    let index = cart.findIndex(item => item.name === productName);
    
    // if the index exists
    if (index !== -1) {

        // and is more than 1
        if (cart[index].quantity > 1) {

            // subtract quantity
            cart[index].quantity -= 1;
        } else {
            
            // if quantity = 1, remove the item
            cart.splice(index, 1);
        }
        
        // update the cart
        localStorage.setItem('cart', JSON.stringify(cart));

        // update the display
        updateCartDisplay(cart);
    }
}

function updateCartDisplay(cart) {
    
    // select container used for dusplaying products
    const productSection = document.querySelector('.product-section');

    // clear existing contents
    productSection.innerHTML = '';

    // total price var
    let totalPrice = 0;

    // loop through cart items
    cart.forEach(item => {

        // create a div element for each item
        const productDiv = document.createElement('div');

        // add to container
        productDiv.classList.add('product-container');

        // set up of product
        productDiv.innerHTML = `
            <div class="product">
                <h2>${item.name}</h2>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price}</p>
                <button onclick="removeFromCart('${item.name}')">Remove from Cart</button>
            </div>
        `;

        // append the product div to the product container
        productSection.appendChild(productDiv);

        // update total price by multiplying item price with its quantity
        totalPrice += item.price * item.quantity;
    });

    // update the total price display
    const totalSection = document.querySelector('.total-section h2');
    totalSection.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}