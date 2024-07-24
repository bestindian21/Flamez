let cart = [];
let cartCount = 0;

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

function addToCart(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const button = event.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        cartCount += 1;
        updateCartCount();
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('cartCount', cartCount);
    }
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartItems && cartTotal) {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.id}.jpg" alt="${item.name}">
                    <span class="cart-item-name">${item.name}</span>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
}

function updateQuantity(event) {
    if (event.target.classList.contains('decrease-quantity') || event.target.classList.contains('increase-quantity')) {
        const button = event.target;
        const id = button.getAttribute('data-id');
        const item = cart.find(item => item.id === id);

        if (item) {
            if (button.classList.contains('decrease-quantity')) {
                item.quantity = Math.max(0, item.quantity - 1);
                cartCount = Math.max(0, cartCount - 1);
            } else {
                item.quantity += 1;
                cartCount += 1;
            }

            if (item.quantity === 0) {
                cart = cart.filter(cartItem => cartItem.id !== id);
            }

            updateCartCount();
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('cartCount', cartCount);
            displayCart();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    updateCartCount();

    const shopPage = document.querySelector('.products');
    if (shopPage) {
        shopPage.addEventListener('click', addToCart);
    }

    const cartPage = document.querySelector('.cart');
    if (cartPage) {
        displayCart();
        cartPage.addEventListener('click', updateQuantity);
    }
});