let cart = [];
let selectedProduct = {};

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

function loadProducts() {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.getElementById('products-container');
            productsContainer.innerHTML = '';

            data.products.forEach(product => {
                const productHTML = `
                    <div class="product_box">
                        <img src="${product.image}" alt="${product.name}">
                        <h4>${product.name}</h4>
                        <p>$${product.price}</p>
                        <button onclick="viewProduct(${product.id})">View Details</button>
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>`;
                productsContainer.innerHTML += productHTML;
            });
        });
}

function viewProduct(productId) {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            selectedProduct = data.products.find(p => p.id === productId);

            const productDetailsHTML = `
                <h2>${selectedProduct.name}</h2>
                <img src="${selectedProduct.image}" alt="${selectedProduct.name}">
                <p>${selectedProduct.description}</p>
                <p>Price: $${selectedProduct.price}</p>`;

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

function searchProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const productBoxes = document.querySelectorAll('.product_box');

    productBoxes.forEach(box => {
        const productName = box.querySelector('h4').textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}

function sortProducts() {
    const sortValue = document.getElementById('sort-select').value;
    const productsContainer = document.getElementById('products-container');
    let products = Array.from(productsContainer.children);

    if (sortValue === 'price-asc') {
        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('p').textContent.slice(1));
            const priceB = parseFloat(b.querySelector('p').textContent.slice(1));
            return priceA - priceB;
        });
    } else if (sortValue === 'price-desc') {
        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('p').textContent.slice(1));
            const priceB = parseFloat(b.querySelector('p').textContent.slice(1));
            return priceB - priceA;
        });
    } else if (sortValue === 'name-asc') {
        products.sort((a, b) => {
            const nameA = a.querySelector('h4').textContent.toLowerCase();
            const nameB = b.querySelector('h4').textContent.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    } else if (sortValue === 'name-desc') {
        products.sort((a, b) => {
            const nameA = a.querySelector('h4').textContent.toLowerCase();
            const nameB = b.querySelector('h4').textContent.toLowerCase();
            return nameB.localeCompare(nameA);
        });
    }

    productsContainer.innerHTML = '';
    products.forEach(product => {
        productsContainer.appendChild(product);
    });
}

function filterProducts() {
    const filterValue = document.getElementById('filter-select').value;
    const productBoxes = document.querySelectorAll('.product_box');

    productBoxes.forEach(box => {
        const productName = box.querySelector('h4').textContent.toLowerCase();
        if (filterValue === 'all') {
            box.style.display = 'block';
        } else if (productName.includes(filterValue)) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}
