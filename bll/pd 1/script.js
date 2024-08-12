let cart = [];
let selectedProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
});

function loadProducts() {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.getElementById('products-container');
            data.products.forEach(product => {
                const productHTML = `
                    <div class="col-lg-3 col-sm-6" onclick="showProductModal(${product.id})">
                        <div class="product_box">
                            <h4 class="bursh_text">${product.name}</h4>
                            <p class="lorem_text">${product.description}</p>
                            <img src="${product.image}" class="image_1">
                            <div class="btn_main">
                                <div class="buy_bt">
                                    <ul>
                                        <li class="active"><a href="#">View Details</a></li>
                                    </ul>
                                </div>
                                <h3 class="price_text">Price $${product.price}</h3>
                            </div>
                        </div>
                    </div>`;
                productsContainer.innerHTML += productHTML;
            });
        });
}

function showProductModal(productId) {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            selectedProduct = data.products.find(p => p.id === productId);

            const productDetailsHTML = `
                <h2>${selectedProduct.name}</h2>
                <img src="${selectedProduct.image}">
                <p>${selectedProduct.description}</p>
                <h3>Price: $${selectedProduct.price}</h3>`;
            document.getElementById('product-details').innerHTML = productDetailsHTML;

            toggleProductModal();
        });
}

function addToCartFromModal() {
    addToCart(selectedProduct.id);
    toggleProductModal();
}

function addToCart(productId) {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id === productId);
            const cartItem = cart.find(item => item.id === productId);

            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartCount();
        });
}

function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
    updateCartModal();
}

function toggleProductModal() {
    const productModal = document.getElementById('product-modal');
    productModal.style.display = productModal.style.display === 'block' ? 'none' : 'block';
}

function toggleCartModal() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItemHTML = `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price}</p>
                <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>`;
        cartItemsContainer.innerHTML += cartItemHTML;
    });

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    document.getElementById('cart-total').textContent = cartTotal;
}

function checkout() {
    if (cart.length > 0) {
        alert('Checkout Successful!');
        cart = [];
        updateCartCount();
        toggleCartModal();
    } else {
        alert('Your cart is empty.');
    }
}
