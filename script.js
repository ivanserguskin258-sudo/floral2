// Данные товаров
const products = [
    { id: 1, name: "Розовый букет", price: 2490, image: "https://avatars.mds.yandex.net/get-mpic/11401175/2a0000018c0ae12f02e87f0fb993df3b8d7e/orig", description: "Нежные розы в пастельных тонах, 25 стеблей. Идеально для признания в любви." },
    { id: 2, name: "Лавандовое поле", price: 1890, image: "https://avatars.mds.yandex.net/get-mpic/16479068/2a0000019a20ba518103802a386fabf9c937/optimize", description: "Ароматная лаванда и полевые цветы. Создаёт атмосферу уюта." },
    { id: 3, name: "Яркие хризантемы", price: 1650, image: "https://main-cdn.sbermegamarket.ru/big2/hlr-system/-21/077/355/822/818/14/100065304052b0.png", description: "Яркий и жизнерадостный букет из хризантем." },
    { id: 4, name: "Пионовая нежность", price: 3250, image: "https://www.studiofloristic.ru/files/catalog/4304/w640_d4107e79a074138047907a695ea20a74.jpg", description: "Роскошные пионы, 15 крупных бутонов." },
    { id: 5, name: "Экзотическая орхидея", price: 3990, image: "https://avatars.mds.yandex.net/get-mpic/5261272/img_id4921232643755625551.jpeg/orig", description: "Изысканная орхидея в кашпо, долго цветёт." },
    { id: 6, name: "Весенний микс", price: 2100, image: "https://www.studiofloristic.ru/files/catalog/4592/w1000_1d6dde3284d04a400bd7ecef5b6d3c21.jpg", description: "Свежие тюльпаны, ирисы и гипсофила." },
    { id: 7, name: "Королевская гортензия", price: 2850, image: "https://cdn.rozavam.ru/uploads/fl_post/2025-12-09/thumbs/7773_images_17652800751.jpeg", description: "Роскошная голубая гортензия с нежными лепестками. 5 крупных соцветий." },
    { id: 8, name: "Алая страсть", price: 3590, image: "https://avatars.mds.yandex.net/get-mpic/12491287/2a00000190e03574cb3a792289dc18a35b96/orig", description: "Букет из 51 алой розы. Для самого яркого признания в любви." }
];

let cart = [];
let currentUser = null;

// DOM элементы
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartCountSpan = document.getElementById('cartCount');
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
const userIcon = document.getElementById('userIcon');
const userNameDisplay = document.getElementById('userNameDisplay');
const navLinks = document.querySelectorAll('.nav-link');

// Модалки
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const feedbackModal = document.getElementById('feedbackModal');

// ========== Рендер товаров ==========
function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    if (grid) {
        grid.innerHTML = products.slice(0,4).map(product => createProductCard(product)).join('');
        attachProductEvents();
    }
}

function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (grid) {
        grid.innerHTML = products.map(product => createProductCard(product)).join('');
        attachProductEvents();
    }
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/FFD1C1/white?text=${encodeURIComponent(product.name)}'">
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">${product.price} ₽</div>
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">В корзину</button>
            </div>
        </div>
    `;
}

function attachProductEvents() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.removeEventListener('click', addToCartHandler);
        btn.addEventListener('click', addToCartHandler);
    });
    document.querySelectorAll('.product-card').forEach(card => {
        card.removeEventListener('click', productCardClickHandler);
        card.addEventListener('click', productCardClickHandler);
    });
}

function addToCartHandler(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    addToCart(id, name, price);
    updateCartUI();
    showNotification('Товар добавлен в корзину!', 'success');
}

function productCardClickHandler(e) {
    if (e.target.classList.contains('add-to-cart')) return;
    const card = e.currentTarget;
    const id = parseInt(card.dataset.id);
    const product = products.find(p => p.id === id);
    if (product) showProductModal(product);
}

function showProductModal(product) {
    const modal = document.getElementById('productModal');
    const detailContainer = document.getElementById('productDetailContainer');
    detailContainer.innerHTML = `
        <div style="text-align:center;">
            <img src="${product.image}" alt="${product.name}" style="width:100%; max-height:280px; object-fit:cover; border-radius:1rem;" onerror="this.src='https://placehold.co/600x400/FFD1C1/white?text=${encodeURIComponent(product.name)}'">
            <h2 style="margin:1rem 0 0.5rem">${product.name}</h2>
            <p style="font-size:1.2rem; color:#c36a5c; font-weight:bold;">${product.price} ₽</p>
            <p style="margin:1rem 0;">${product.description}</p>
            <button class="btn-primary" id="detailAddToCart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Добавить в корзину</button>
        </div>
    `;
    modal.style.display = 'flex';
    const detailBtn = document.getElementById('detailAddToCart');
    if (detailBtn) {
        detailBtn.addEventListener('click', (e) => {
            const id = parseInt(detailBtn.dataset.id);
            const name = detailBtn.dataset.name;
            const price = parseInt(detailBtn.dataset.price);
            addToCart(id, name, price);
            updateCartUI();
            modal.style.display = 'none';
            showNotification('Товар добавлен в корзину!', 'success');
        });
    }
}

// ========== Корзина ==========
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCartToLocal();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToLocal();
    renderCartModal();
    updateCartUI();
}

function updateQuantity(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (newQuantity <= 0) removeFromCart(id);
        else item.quantity = newQuantity;
        saveCartToLocal();
        renderCartModal();
        updateCartUI();
    }
}

function saveCartToLocal() {
    localStorage.setItem('flowerCart', JSON.stringify(cart));
}

function loadCartFromLocal() {
    const saved = localStorage.getItem('flowerCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountSpan) cartCountSpan.innerText = totalItems;
    renderCartModal();
}

function renderCartModal() {
    const cartItemsDiv = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotalPrice');
    if (!cartItemsDiv) return;
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Корзина пуста. Добавьте красивые цветы!</p>';
        if (totalSpan) totalSpan.innerText = '0';
        return;
    }
    let total = 0;
    cartItemsDiv.innerHTML = '';
    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div><strong>${item.name}</strong><br>${item.price} ₽ × ${item.quantity}</div>
            <div>
                <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
                <span style="margin:0 8px;">${item.quantity}</span>
                <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
    if (totalSpan) totalSpan.innerText = total;

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.removeEventListener('click', qtyHandler);
        btn.addEventListener('click', qtyHandler);
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.removeEventListener('click', removeHandler);
        btn.addEventListener('click', removeHandler);
    });
}

function qtyHandler(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    const delta = parseInt(btn.dataset.delta);
    const item = cart.find(i => i.id === id);
    if (item) {
        const newQty = item.quantity + delta;
        updateQuantity(id, newQty);
    }
}

function removeHandler(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    removeFromCart(id);
}

// ========== Аутентификация ==========
function loadUserFromLocal() {
    const savedUser = localStorage.getItem('flowerUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }
}

function saveUserToLocal() {
    if (currentUser) {
        localStorage.setItem('flowerUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('flowerUser');
    }
}

function updateUserUI() {
    if (currentUser) {
        userNameDisplay.textContent = currentUser.name.split(' ')[0];
        userIcon.style.background = '#c36a5c';
        userIcon.style.color = 'white';
    } else {
        userNameDisplay.textContent = 'Войти';
        userIcon.style.background = '#f5ebe5';
        userIcon.style.color = '#4a3b2f';
    }
}

function login(email, password) {
    const users = JSON.parse(localStorage.getItem('flowerUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = { name: user.name, email: user.email, phone: user.phone };
        saveUserToLocal();
        updateUserUI();
        closeAllModals();
        showNotification(`Добро пожаловать, ${user.name}!`, 'success');
        return true;
    } else {
        showNotification('Неверный email или пароль!', 'error');
        return false;
    }
}

function register(name, email, phone, password) {
    const users = JSON.parse(localStorage.getItem('flowerUsers') || '[]');
    if (users.find(u => u.email === email)) {
        showNotification('Пользователь с таким email уже существует!', 'error');
        return false;
    }
    const newUser = { name, email, phone, password };
    users.push(newUser);
    localStorage.setItem('flowerUsers', JSON.stringify(users));
    currentUser = { name, email, phone };
    saveUserToLocal();
    updateUserUI();
    showNotification('Регистрация прошла успешно!', 'success');
    return true;
}

function logout() {
    currentUser = null;
    saveUserToLocal();
    updateUserUI();
    showNotification('Вы вышли из аккаунта', 'info');
}

// ========== Обратная связь ==========
function sendFeedback(name, email, subject, message) {
    const feedbacks = JSON.parse(localStorage.getItem('flowerFeedbacks') || '[]');
    const newFeedback = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleString()
    };
    feedbacks.push(newFeedback);
    localStorage.setItem('flowerFeedbacks', JSON.stringify(feedbacks));
    showNotification('Спасибо за обращение! Мы ответим вам в ближайшее время.', 'success');
    return true;
}

// ========== Уведомления ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========== Модалки ==========
function openLoginModal() {
    loginModal.style.display = 'flex';
}

function openRegisterModal() {
    registerModal.style.display = 'flex';
}

function openFeedbackModal() {
    feedbackModal.style.display = 'flex';
    if (currentUser) {
        document.getElementById('feedbackName').value = currentUser.name;
        document.getElementById('feedbackEmail').value = currentUser.email;
    } else {
        document.getElementById('feedbackName').value = '';
        document.getElementById('feedbackEmail').value = '';
    }
}

function closeAllModals() {
    const modals = [loginModal, registerModal, feedbackModal, cartModal, document.getElementById('productModal')];
    modals.forEach(modal => {
        if (modal) modal.style.display = 'none';
    });
}

// ========== Плавная навигация и активное меню ==========
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Плавная прокрутка
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (navMenu.classList.contains('active')) navMenu.classList.remove('active');
    });
});

// Скролл для подсветки меню
window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// ========== Обработчики событий ==========
burger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

userIcon.addEventListener('click', () => {
    if (currentUser) {
        if (confirm('Выйти из аккаунта?')) {
            logout();
        }
    } else {
        openLoginModal();
    }
});

cartIcon.addEventListener('click', () => {
    renderCartModal();
    cartModal.style.display = 'flex';
});

// Форма логина
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (login(email, password)) {
        loginModal.style.display = 'none';
        document.getElementById('loginForm').reset();
    }
});

// Форма регистрации
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirm) {
        showNotification('Пароли не совпадают!', 'error');
        return;
    }
    if (password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }
    if (register(name, email, phone, password)) {
        registerModal.style.display = 'none';
        document.getElementById('registerForm').reset();
    }
});

// Форма обратной связи
document.getElementById('feedbackForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('feedbackName').value;
    const email = document.getElementById('feedbackEmail').value;
    const subject = document.getElementById('feedbackSubject').value;
    const message = document.getElementById('feedbackMessage').value;
    
    if (sendFeedback(name, email, subject, message)) {
        feedbackModal.style.display = 'none';
        document.getElementById('feedbackForm').reset();
    }
});

// Переключение между формами
document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    openRegisterModal();
});

document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    openLoginModal();
});

// Закрытие модалок
document.querySelectorAll('.close-modal, .close-login, .close-register, .close-feedback, .close-cart, .close-product').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

window.addEventListener('click', (e) => {
    const modals = [loginModal, registerModal, feedbackModal, cartModal, document.getElementById('productModal')];
    modals.forEach(modal => {
        if (e.target === modal) modal.style.display = 'none';
    });
});

document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Корзина пуста!', 'error');
        return;
    }
    if (!currentUser) {
        showNotification('Пожалуйста, войдите в аккаунт для оформления заказа', 'error');
        openLoginModal();
        return;
    }
    const total = document.getElementById('cartTotalPrice').innerText;
    showNotification(`Заказ оформлен! 💐 Сумма: ${total} ₽. Менеджер свяжется с вами.`, 'success');
    cart = [];
    saveCartToLocal();
    updateCartUI();
    closeAllModals();
});

// Открытие формы обратной связи со страницы
document.getElementById('openFeedbackBtn')?.addEventListener('click', () => {
    openFeedbackModal();
});

// ========== Инициализация ==========
function init() {
    renderFeatured();
    renderCatalog();
    loadCartFromLocal();
    loadUserFromLocal();
}

init();