// Updated Menu Data with PKR
const menuItems = [
    // BUCKETS
    { id: 1, category: 'buckets', name: "Family Festival Bucket", price: 3450, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500" },
    { id: 2, category: 'buckets', name: "Midnight Bucket Deal", price: 1890, img: "https://images.unsplash.com/photo-1623653387045-d5442b307ca7?w=600&auto=format&fit=crop" },
    { id: 11, category: 'buckets', name: "Economical 5pc Bucket", price: 1250, img: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500" },
    
    // BURGERS
    { id: 3, category: 'burgers', name: "Chohan Zinger Supreme", price: 650, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
    { id: 4, category: 'burgers', name: "Mighty Chohan Burger", price: 890, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500" },
    { id: 5, category: 'burgers', name: "Classic Crispy Fillet", price: 540, img: "https://images.unsplash.com/photo-1513185158878-8d8ae1485967?w=500" },
    { id: 12, category: 'burgers', name: "Smoky BBQ Burger", price: 720, img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500" },

    // SNACKS & SIDES
    { id: 6, category: 'snacks', name: "Hot Wings (10pcs)", price: 790, img: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500" },
    { id: 7, category: 'snacks', name: "Loaded Fries", price: 450, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" },
    { id: 13, category: 'snacks', name: "Corn on the Cob", price: 290, img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500" },

    // DRINKS
    { id: 9, category: 'drinks', name: "Pepsi 1.5L", price: 220, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500" },
    { id: 10, category: 'drinks', name: "Mountain Dew Can", price: 120, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500" },
    { id: 14, category: 'drinks', name: "Mineral Water", price: 80, img: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=500" }
];
let cart = JSON.parse(localStorage.getItem('chohanClubCart')) || [];

// Add to Cart
function addToCart(id) {
    const item = menuItems.find(p => p.id === id);
    cart.push(item);
    localStorage.setItem('chohanClubCart', JSON.stringify(cart));
    updateCartUI();
}

// Update UI
function updateCartUI() {
    const count = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if(document.getElementById('cart-count')) document.getElementById('cart-count').innerText = count;
    if(document.getElementById('cart-total-price')) document.getElementById('cart-total-price').innerText = total;
    
    // In Header if exists
    if(document.getElementById('cart-header-total')) document.getElementById('cart-header-total').innerText = total;
}

// Navigation to Checkout
function proceedToCheckout() {
    if(cart.length === 0) return alert("Your bucket is empty!");
    window.location.href = 'checkout.html';
}

// Checkout Page Summary
function displaySummary() {
    const container = document.getElementById('summary-items');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    if(!container) return;

    container.innerHTML = cart.map(item => `
        <div class="flex justify-between text-sm">
            <span>${item.name}</span>
            <span class="font-bold">Rs. ${item.price}</span>
        </div>
    `).join('');

    document.getElementById('subtotal').innerText = `Rs. ${total}`;
    document.getElementById('final-total').innerText = `Rs. ${total}`;
}

// Final Order Submission
// Final Order Submission (Updated)
function handleOrder(e) {
    e.preventDefault();
    
    const newOrder = {
        id: 'CFC-' + Math.floor(Math.random() * 999999),
        customer: {
            name: document.getElementById('custName').value,
            phone: document.getElementById('custPhone').value,
            address: document.getElementById('custAddress').value
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        status: 'Pending',
        date: new Date().toLocaleString()
    };

    // 1. Save last order for the confirmation page
    localStorage.setItem('lastOrder', JSON.stringify(newOrder));

    // 2. Add to "All Orders" list for Admin
    let allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
    allOrders.push(newOrder);
    localStorage.setItem('allOrders', JSON.stringify(allOrders));

    window.location.href = 'confirmation.html';
}
// 3. Render Menu function
function renderMenu(filter = 'all') {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = "";

    const filteredItems = filter === 'all' ? menuItems : menuItems.filter(item => item.category === filter);

    filteredItems.forEach(item => {
        menuGrid.innerHTML += `
            <div class="food-card bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 p-4">
                <img src="${item.img}" class="w-full h-40 object-cover rounded-xl mb-4" alt="${item.name}">
                <h3 class="font-bold text-lg mb-1">${item.name}</h3>
                <p class="text-gray-500 text-sm mb-4">Original Recipe from the Club.</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-black text-red-600">PKR ${item.price.toFixed(2)}</span>
                    <button onclick="addToCart(${item.id})" class="bg-red-600 text-white w-10 h-10 rounded-full hover:scale-110 transition">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

// 4. Cart Functions
function addToCart(id) {
    // Find the item from our menuItems array
    const product = menuItems.find(item => item.id === id);
    
    if (product) {
        // Add to our global cart array
        cart.push({...product}); 
        
        // Save to localStorage so it persists
        saveCart();
        
        // IMPORTANT: Update the UI immediately
        updateCartUI();
        
        // Open the cart slider automatically
        const drawer = document.getElementById('cart-sidebar');
        if (drawer) drawer.classList.remove('translate-x-full');
    }
}
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('chohanClubCart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');
    const cartCountElement = document.getElementById('cart-count');

    if (!cartContainer) return;

    cartContainer.innerHTML = ''; // Clear previous

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-gray-400">
                <i class="fas fa-shopping-basket text-5xl mb-4"></i>
                <p>Your bucket is empty!</p>
            </div>`;
    } else {
        cart.forEach((item, index) => {
            // Check if item has the expected properties
            const image = item.img || 'placeholder.jpg';
            const name = item.name || 'Unknown Item';
            const price = item.price || 0;

            cartContainer.innerHTML += `
                <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3">
                    <img src="${image}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-grow">
                        <h4 class="font-bold text-sm leading-tight text-black">${name}</h4>
                        <p class="text-red-600 font-bold text-sm">Rs. ${price}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-gray-300 hover:text-red-600 p-2">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        });
    }

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    if (totalPriceElement) totalPriceElement.innerText = total;
    if (cartCountElement) cartCountElement.innerText = cart.length;
}
// Ensure UI updates on page load
window.addEventListener('DOMContentLoaded', updateCartUI);
// 5. Utility Functions
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('translate-x-full');
}

function filterMenu(category) {
    // Toggle Active Class on buttons
    document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(category) || (category === 'all' && btn.innerText === 'All Items')) {
            btn.classList.add('active');
        }
    });
    renderMenu(category);
}
function goToTracker() {
    // Check if there is an order stored in the browser
    const lastOrder = localStorage.getItem('lastOrder');
    
    if (lastOrder) {
        // If order exists, redirect to the confirmation/tracker page
        window.location.href = 'confirmation.html';
    } else {
        // If no order is found, show a nice alert
        alert("You haven't placed an order yet! Order some delicious Chohan's chicken first.");
    }
}
// Initial Run
renderMenu();
updateCartUI();