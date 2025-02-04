// Function to get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Function to save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to add an item to the cart
function addToCart(id, name, price, image) {
    let cart = getCart();

    // Check if item already exists
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    saveCart(cart);
}



// Function to display cart items on cart page
function displayCart() {
    let cart = getCart();
    let cartContainer = document.getElementById("cart-items");
    let totalPrice = 0;

    cartContainer.innerHTML = ""; // Clear previous items

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; background: transparent; padding: 15px; border-radius: 8px;">
                <img src="${item.image}" style="width: 80px; height: auto; border-radius: 8px; margin-right: 15px;">
                <div style="flex: 1;">
                    <span style="font-size: 18px; color: #f1c40f;">${item.name}</span><br>
                    <span style="font-size: 16px; color: #ccc;">Quantity: ${item.quantity} - ₹${item.price * item.quantity}</span>
                </div>
                <button onclick="removeFromCart('${item.id}')" style="background-color: #e74c3c; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">
                    Remove
                </button>
            </div>
        `;
    });

    document.getElementById("total-price").innerHTML = `<strong>Total: ₹${totalPrice}</strong>`;
}

// Function to remove an item from the cart
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    displayCart();
}

// Run displayCart if on cart page
if (document.getElementById("cart-items")) {
    displayCart();
}
