let cart = [];
let cartCount = 0;


function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
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

    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', proceedToCheckout);
    } else {
        console.log('Checkout button not found');
    }

    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('change', function() {
            if(this.checked) {
                nav.style.display = 'block';
                setTimeout(() => {
                    nav.style.opacity = '1';
                    nav.style.visibility = 'visible';
                }, 10);
            } else {
                nav.style.opacity = '0';
                nav.style.visibility = 'hidden';
                setTimeout(() => {
                    nav.style.display = 'none';
                }, 300);
            }
        });
    }
});


function addToCart(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const button = event.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const stripePriceId = button.getAttribute('data-stripe-price-id');
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1, stripePriceId });
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
                    <img src="product${item.id}.jpg" alt="${item.name}">
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

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');

    menuToggle.addEventListener('change', function() {
        if(this.checked) {
            nav.style.display = 'block';
            setTimeout(() => {
                nav.style.opacity = '1';
                nav.style.visibility = 'visible';
            }, 10);
        } else {
            nav.style.opacity = '0';
            nav.style.visibility = 'hidden';
            setTimeout(() => {
                nav.style.display = 'none';
            }, 300);
        }
    });
});

const stripe = Stripe('pk_live_51PgSuREk2cTtyUqsyRKcPJXjyNyJiFwSqXVSKk2p37U5hntrnvf5qvTj6V3hRCml8NnpfCStijivPUBZZMJGIB1g00ZA3AGEJL');

async function proceedToCheckout() {
    console.log('Checkout function called');
    console.log('Cart:', JSON.stringify(cart, null, 2));
    
    if (cart.length === 0) {
        console.log('Cart is empty');
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }

    try {
            const lineItems = cart.map(item => ({
            price: item.stripePriceId,
            quantity: item.quantity,
        }));

        console.log('Line items:', JSON.stringify(lineItems, null, 2));

        const { error } = await stripe.redirectToCheckout({
            mode: 'payment',
            lineItems: lineItems,
            successUrl: 'https://bestindian21.github.io/Flamez/success.html',
            cancelUrl: 'https://bestindian21.github.io/Flamez/cancel.html',
        });

        if (error) {
            console.error('Stripe error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your payment. Please try again.');
    }
}
