const restaurants = [
  {
    id: 1,
    name: 'Bella Napoli',
    category: 'italian',
    type: 'Italian • Pizza • Pasta',
    time: '20-30 min',
    rating: '4.8',
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80',
    tag: 'Free delivery',
    menu: [
      { name: 'Margherita Pizza', price: 8.5 },
      { name: 'Truffle Pasta', price: 13 },
      { name: 'Tiramisu', price: 6 }
    ],
    reviews: ['Best pizza in town!', 'Fast delivery and great taste.']
  },
  {
    id: 2,
    name: 'Urban Burger',
    category: 'burger',
    type: 'Burgers • Fries • Drinks',
    time: '15-25 min',
    rating: '4.7',
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular',
    menu: [
      { name: 'Classic Burger', price: 9 },
      { name: 'Cheese Fries', price: 4.5 },
      { name: 'Cola', price: 2 }
    ],
    reviews: ['Juicy burgers.', 'Perfect for quick lunch.']
  },
  {
    id: 3,
    name: 'Sushi Zen',
    category: 'sushi',
    type: 'Sushi • Asian • Fresh',
    time: '25-35 min',
    rating: '4.9',
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=80',
    tag: 'Book table',
    menu: [
      { name: 'Salmon Set', price: 16 },
      { name: 'Dragon Roll', price: 14 },
      { name: 'Miso Soup', price: 4 }
    ],
    reviews: ['Fresh sushi and premium service.', 'Great for dinner booking.']
  },
  {
    id: 4,
    name: 'Shawarma House',
    category: 'arabic',
    type: 'Arabic • Shawarma • Grill',
    time: '18-28 min',
    rating: '4.6',
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80',
    tag: 'Hot deal',
    menu: [
      { name: 'Chicken Shawarma', price: 6.5 },
      { name: 'Falafel Plate', price: 7 },
      { name: 'Hummus', price: 4 }
    ],
    reviews: ['Tastes like home.', 'Good portions.']
  },
  {
    id: 5,
    name: 'Pasta Milano',
    category: 'italian',
    type: 'Pasta • Risotto • Wine',
    time: '30-40 min',
    rating: '4.8',
    status: 'Busy',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80',
    tag: 'Fine dining',
    menu: [
      { name: 'Carbonara', price: 12 },
      { name: 'Risotto', price: 14 },
      { name: 'Panna Cotta', price: 6 }
    ],
    reviews: ['Elegant and delicious.', 'Perfect pasta.']
  },
  {
    id: 6,
    name: 'Grill Palace',
    category: 'arabic',
    type: 'Grill • Kebab • Mezze',
    time: '25-35 min',
    rating: '4.7',
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    tag: 'Family place',
    menu: [
      { name: 'Mixed Grill', price: 18 },
      { name: 'Kebab Plate', price: 12 },
      { name: 'Tabbouleh', price: 5 }
    ],
    reviews: ['Great grill.', 'Nice family place.']
  }
];

const restaurantGrid = document.getElementById('restaurantGrid');
const categoryButtons = document.querySelectorAll('.cat-btn');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestions = document.getElementById('suggestions');
const toast = document.getElementById('toast');

const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutBtn = document.getElementById('checkoutBtn');
const trackingBox = document.getElementById('trackingBox');

const bookingTitle = document.getElementById('bookingTitle');
const bookingForm = document.getElementById('bookingForm');
const detailsContent = document.getElementById('detailsContent');

const navLinks = document.getElementById('navLinks');

const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authText = document.getElementById('authText');
const authName = document.getElementById('authName');
const authSubmit = document.getElementById('authSubmit');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');

const userBox = document.getElementById('userBox');
const userNameText = document.getElementById('userNameText');
const accountBtn = document.getElementById('accountBtn');
const accountName = document.getElementById('accountName');
const accountEmail = document.getElementById('accountEmail');
const accountContent = document.getElementById('accountContent');
const logoutBtn = document.getElementById('logoutBtn');

let cart = JSON.parse(localStorage.getItem('bitego_cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let currentOrders = JSON.parse(localStorage.getItem('bitego_current_orders') || '[]');
let previousOrders = JSON.parse(localStorage.getItem('bitego_previous_orders') || '[]');
let reservations = JSON.parse(localStorage.getItem('bitego_reservations') || '[]');

let currentCategory = 'all';
let currentUser = JSON.parse(localStorage.getItem('bitego_user') || 'null');
let isSignup = false;

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
    }, 550);
  }

  renderRestaurants(restaurants);
  renderRecommendations();
  updateCart();
  setAuthMode('login');
  updateUserUI();

  if (window.firebaseObserver && window.firebaseAuth) {
    window.firebaseObserver(window.firebaseAuth, user => {
      if (user) {
        currentUser = {
          name: user.email.split('@')[0],
          email: user.email
        };

        localStorage.setItem('bitego_user', JSON.stringify(currentUser));
        updateUserUI();
      } else {
        currentUser = null;
        localStorage.removeItem('bitego_user');
        updateUserUI();
      }
    });
  }
});

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => {
    closeModal(button.dataset.close);
  });
});

document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      modal.classList.remove('active');
    }
  });
});

function renderRestaurants(list) {
  if (!restaurantGrid) return;

  restaurantGrid.innerHTML = '';

  if (!list.length) {
    restaurantGrid.innerHTML = '<p>No restaurants found. Try another search.</p>';
    return;
  }

  list.forEach(restaurant => {
    const isFav = favorites.includes(restaurant.id);
    const card = document.createElement('div');

    card.className = 'restaurant-card';

    card.innerHTML = `
      <div class="restaurant-img">
        <img src="${restaurant.image}" alt="${restaurant.name}">
        <span class="tag">${restaurant.tag}</span>
        <span class="open-tag">${restaurant.status}</span>
      </div>

      <div class="restaurant-body">
        <div class="restaurant-top">
          <h3>${restaurant.name}</h3>
          <span class="rating">★ ${restaurant.rating}</span>
        </div>

        <div class="meta">${restaurant.type} • ${restaurant.time}</div>

        <div class="card-actions">
          <button class="order-btn" onclick="quickAdd(${restaurant.id})">Order</button>
          <button class="book-btn" onclick="openBooking(${restaurant.id})">Book</button>
          <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${restaurant.id})">❤</button>
        </div>

        <button class="details-btn" onclick="openDetails(${restaurant.id})">
          View restaurant page
        </button>
      </div>
    `;

    restaurantGrid.appendChild(card);
  });
}

function getFilteredRestaurants(category = currentCategory) {
  const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

  return restaurants.filter(restaurant => {
    const matchesCategory =
      category === 'all' ||
      restaurant.category === category ||
      (category === 'favorites' && favorites.includes(restaurant.id));

    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchText) ||
      restaurant.type.toLowerCase().includes(searchText) ||
      restaurant.menu.some(item => item.name.toLowerCase().includes(searchText));

    return matchesCategory && matchesSearch;
  });
}

function filterRestaurants(category = currentCategory) {
  currentCategory = category;
  renderRestaurants(getFilteredRestaurants(category));
}

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    categoryButtons.forEach(btn => btn.classList.remove('active'));

    button.classList.add('active');
    currentCategory = button.dataset.category;

    if (categorySelect && currentCategory !== 'favorites') {
      categorySelect.value = currentCategory;
    }

    filterRestaurants(currentCategory);
  });
});

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    filterRestaurants(categorySelect.value);
  });
}

if (categorySelect) {
  categorySelect.addEventListener('change', () => {
    filterRestaurants(categorySelect.value);
  });
}

if (searchInput) {
  searchInput.addEventListener('keyup', () => {
    filterRestaurants(categorySelect.value);
    showSuggestions();
  });
}

function showSuggestions() {
  if (!suggestions || !searchInput) return;

  const text = searchInput.value.toLowerCase().trim();

  suggestions.innerHTML = '';

  if (!text) {
    suggestions.style.display = 'none';
    return;
  }

  const matches = restaurants
    .filter(restaurant =>
      restaurant.name.toLowerCase().includes(text) ||
      restaurant.type.toLowerCase().includes(text)
    )
    .slice(0, 4);

  if (!matches.length) {
    suggestions.style.display = 'none';
    return;
  }

  matches.forEach(restaurant => {
    const button = document.createElement('button');

    button.textContent = `${restaurant.name} — ${restaurant.type}`;

    button.onclick = () => {
      searchInput.value = restaurant.name;
      suggestions.style.display = 'none';
      filterRestaurants(categorySelect.value);
    };

    suggestions.appendChild(button);
  });

  suggestions.style.display = 'block';
}

function quickAdd(id) {
  const restaurant = restaurants.find(item => item.id === id);
  const firstItem = restaurant.menu[0];

  addToCart(firstItem.name, firstItem.price, restaurant.name);
}

function addToCart(name, price, restaurantName) {
  const existing = cart.find(item =>
    item.name === name && item.restaurantName === restaurantName
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      name,
      price,
      restaurantName,
      qty: 1
    });
  }

  updateCart();
  showToast(`✅ ${name} added to cart`);
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cartCount) cartCount.textContent = count;
  if (cartTotal) cartTotal.textContent = `€${total.toFixed(2)}`;

  if (cartItems) {
    cartItems.innerHTML = cart.length ? '' : '<p>Your cart is empty.</p>';

    cart.forEach((item, index) => {
      const row = document.createElement('div');

      row.className = 'cart-item';

      row.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.restaurantName} • €${item.price.toFixed(2)}</small>
        </div>

        <div class="cart-controls">
          <button onclick="changeQty(${index}, -1)">−</button>
          <strong>${item.qty}</strong>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      `;

      cartItems.appendChild(row);
    });
  }

  localStorage.setItem('bitego_cart', JSON.stringify(cart));
  saveCurrentOrderToAccount();
}

function changeQty(index, amount) {
  cart[index].qty += amount;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));

  renderRestaurants(getFilteredRestaurants(currentCategory));
  showToast('❤️ Favorites updated');
}

function openBooking(id) {
  const restaurant = restaurants.find(item => item.id === id);

  if (bookingTitle) {
    bookingTitle.textContent = `Book a table at ${restaurant.name}`;
  }

  openModal('bookingModal');
}

function openDetails(id) {
  if (!detailsContent) return;

  const restaurant = restaurants.find(item => item.id === id);

  detailsContent.innerHTML = `
    <div class="detail-hero">
      <img src="${restaurant.image}" alt="${restaurant.name}">
    </div>

    <span class="badge">${restaurant.status} • ${restaurant.time} • ★ ${restaurant.rating}</span>

    <h3>${restaurant.name}</h3>
    <p>${restaurant.type}. View the menu, read reviews, order food, or reserve a table.</p>

    <h3>Menu</h3>

    <div class="menu-items">
      ${restaurant.menu.map(item => `
        <div class="menu-item">
          <div>
            <strong>${item.name}</strong><br>
            <small>€${item.price.toFixed(2)}</small>
          </div>

          <button onclick="addToCart('${item.name}', ${item.price}, '${restaurant.name}')">Add</button>
        </div>
      `).join('')}
    </div>

    <button class="checkout-btn" onclick="openBooking(${restaurant.id})">
      Book a table
    </button>

    <h3 style="margin-top:20px">Reviews</h3>

    ${restaurant.reviews.map(review => `
      <div class="review-box">⭐ ${review}</div>
    `).join('')}

    <h3 style="margin-top:20px">Map</h3>

    <div class="map-box">
      <iframe src="https://www.google.com/maps?q=Bari%20Italy&output=embed"></iframe>
    </div>
  `;

  openModal('detailsModal');
}

function renderRecommendations() {
  const recommendationsGrid = document.getElementById('recommendationsGrid');
  if (!recommendationsGrid) return;

  const picks = [
    {
      title: 'Best for quick lunch',
      text: 'Urban Burger is recommended because it has fast delivery and simple meals.'
    },
    {
      title: 'Best for dinner booking',
      text: 'Sushi Zen is a strong choice for dine-in with high rating and table booking.'
    },
    {
      title: 'Best comfort food',
      text: 'Bella Napoli is perfect for pizza and pasta lovers.'
    }
  ];

  recommendationsGrid.innerHTML = picks
    .map(pick => `
      <div class="recommend-card">
        <h3>${pick.title}</h3>
        <p>${pick.text}</p>
      </div>
    `)
    .join('');
}

const cartBtn = document.getElementById('cartBtn');
const bottomCartBtn = document.getElementById('bottomCartBtn');

if (cartBtn) {
  cartBtn.onclick = () => openModal('cartModal');
}

if (bottomCartBtn) {
  bottomCartBtn.onclick = () => openModal('cartModal');
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (!cart.length) {
      showToast('🛒 Your cart is empty');
      return;
    }

    checkoutForm.classList.toggle('active');
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener('submit', event => {
    event.preventDefault();

    checkoutForm.classList.remove('active');
    if (trackingBox) trackingBox.classList.add('active');

    previousOrders = [...previousOrders, ...cart];
    localStorage.setItem('bitego_previous_orders', JSON.stringify(previousOrders));

    cart = [];
    updateCart();

    showToast('✅ Order placed successfully');

    setTimeout(() => document.getElementById('step2')?.classList.add('active'), 900);
    setTimeout(() => document.getElementById('step3')?.classList.add('active'), 1800);
    setTimeout(() => document.getElementById('step4')?.classList.add('active'), 2800);
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();

    reservations.push({
      restaurant: bookingTitle.textContent.replace('Book a table at ', ''),
      date: 'Selected date',
      time: 'Selected time'
    });

    localStorage.setItem('bitego_reservations', JSON.stringify(reservations));

    bookingForm.reset();
    closeModal('bookingModal');

    showToast('✅ Reservation confirmed');
  });
}

function setAuthMode(mode) {
  isSignup = mode === 'signup';

  if (isSignup) {
    loginTab.classList.remove('active');
    signupTab.classList.add('active');

    authTitle.textContent = 'Create account';
    authText.textContent = 'Sign up and start ordering from your favorite restaurants.';
    authName.style.display = 'block';
    authSubmit.textContent = 'Create account';
  } else {
    signupTab.classList.remove('active');
    loginTab.classList.add('active');

    authTitle.textContent = 'Welcome back';
    authText.textContent = 'Login to continue ordering your favorite meals.';
    authName.style.display = 'none';
    authSubmit.textContent = 'Login';
  }
}

if (loginTab) loginTab.onclick = () => setAuthMode('login');
if (signupTab) signupTab.onclick = () => setAuthMode('signup');

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

if (loginBtn) {
  loginBtn.onclick = () => {
    openModal('authModal');
    setAuthMode('login');
  };
}

if (signupBtn) {
  signupBtn.onclick = () => {
    openModal('authModal');
    setAuthMode('signup');
  };
}

if (authForm) {
  authForm.addEventListener('submit', async event => {
    event.preventDefault();

    const email = authForm.querySelector('input[type="email"]').value.trim();
    const password = authForm.querySelector('input[type="password"]').value.trim();

    if (!email || !password) {
      showToast('❌ Please enter email and password');
      return;
    }

    try {
      let userCredential;

      if (isSignup) {
        userCredential = await window.firebaseCreateUser(
          window.firebaseAuth,
          email,
          password
        );

        showToast('✅ Account created successfully');
      } else {
        userCredential = await window.firebaseLogin(
          window.firebaseAuth,
          email,
          password
        );

        showToast('✅ Logged in successfully');
      }

      currentUser = {
        name: authName.value.trim() || userCredential.user.email.split('@')[0],
        email: userCredential.user.email
      };

      localStorage.setItem('bitego_user', JSON.stringify(currentUser));

      updateUserUI();

      closeModal('authModal');

      renderAccountTab('current');
      openModal('accountModal');

      showToast(`👋 Welcome, ${currentUser.name}`);
    } catch (error) {
      showToast('❌ ' + error.message);
    }
  });
}

function updateUserUI() {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const bottomLoginBtn = document.getElementById('bottomLoginBtn');
  const bottomSignupBtn = document.getElementById('bottomSignupBtn');

  if (currentUser) {
    if (loginBtn) {
      loginBtn.style.display = 'inline-block';
      loginBtn.textContent = `👋 ${currentUser.name}`;
      loginBtn.onclick = () => {
        renderAccountTab('current');
        openModal('accountModal');
      };
    }

    if (signupBtn) {
      signupBtn.style.display = 'none';
    }

    if (bottomLoginBtn) {
      bottomLoginBtn.innerHTML = '👤<br>Account';
      bottomLoginBtn.onclick = () => {
        renderAccountTab('current');
        openModal('accountModal');
      };
    }

    if (bottomSignupBtn) {
      bottomSignupBtn.style.display = 'none';
    }

    if (userBox) {
      userBox.style.display = 'none';
    }

    if (accountName) accountName.textContent = currentUser.name;
    if (accountEmail) accountEmail.textContent = currentUser.email;
  } else {
    if (loginBtn) {
      loginBtn.style.display = 'inline-block';
      loginBtn.textContent = 'Login';
      loginBtn.onclick = () => {
        openModal('authModal');
        setAuthMode('login');
      };
    }

    if (signupBtn) {
      signupBtn.style.display = 'inline-block';
    }

    if (bottomLoginBtn) {
      bottomLoginBtn.innerHTML = '👤<br>Login';
      bottomLoginBtn.onclick = () => {
        openModal('authModal');
        setAuthMode('login');
      };
    }

    if (bottomSignupBtn) {
      bottomSignupBtn.style.display = 'inline-block';
    }

    if (accountName) accountName.textContent = 'Guest';
    if (accountEmail) accountEmail.textContent = 'guest@email.com';
  }
}

function renderAccountTab(tab = 'current') {
  document.querySelectorAll('.account-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.accountTab === tab);
  });

  if (tab === 'current') {
    accountContent.innerHTML = currentOrders.length
      ? currentOrders.map(order => `
        <div class="account-item">
          🛒 <strong>${order.name}</strong><br>
          <small>${order.restaurantName} • €${order.price.toFixed(2)} • Qty: ${order.qty}</small>
        </div>
      `).join('')
      : '<p>No current orders yet.</p>';
  }

  if (tab === 'previous') {
    accountContent.innerHTML = previousOrders.length
      ? previousOrders.map(order => `
        <div class="account-item">
          📦 <strong>${order.name}</strong><br>
          <small>${order.restaurantName} • Completed</small>
        </div>
      `).join('')
      : '<p>No previous orders yet.</p>';
  }

  if (tab === 'bookings') {
    accountContent.innerHTML = reservations.length
      ? reservations.map(item => `
        <div class="account-item">
          📅 <strong>${item.restaurant}</strong><br>
          <small>${item.date} • ${item.time}</small>
        </div>
      `).join('')
      : '<p>No table bookings yet.</p>';
  }

  if (tab === 'favorites') {
    const favRestaurants = restaurants.filter(r => favorites.includes(r.id));

    accountContent.innerHTML = favRestaurants.length
      ? favRestaurants.map(r => `
        <div class="account-item">
          ❤️ <strong>${r.name}</strong><br>
          <small>${r.type} • ★ ${r.rating}</small>
        </div>
      `).join('')
      : '<p>No favorite restaurants yet.</p>';
  }
}

if (accountBtn) {
  accountBtn.onclick = () => {
    renderAccountTab('current');
    openModal('accountModal');
  };
}

document.querySelectorAll('.account-tab').forEach(btn => {
  btn.onclick = () => renderAccountTab(btn.dataset.accountTab);
});

if (logoutBtn) {
  logoutBtn.onclick = async () => {
    if (window.firebaseAuth && window.firebaseLogout) {
      await window.firebaseLogout(window.firebaseAuth);
    }

    currentUser = null;
    localStorage.removeItem('bitego_user');
    updateUserUI();

    closeModal('accountModal');
    showToast('👋 Logged out');
  };
}

function saveCurrentOrderToAccount() {
  currentOrders = [...cart];
  localStorage.setItem('bitego_current_orders', JSON.stringify(currentOrders));
}

function toggleTheme() {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    showToast('🌙 Dark mode on');
  } else {
    showToast('☀️ Light mode on');
  }
}

const themeBtn = document.getElementById('themeBtn');
const bottomThemeBtn = document.getElementById('bottomThemeBtn');

if (themeBtn) {
  themeBtn.onclick = toggleTheme;
}

if (bottomThemeBtn) {
  bottomThemeBtn.onclick = toggleTheme;
}

const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenu) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

const bottomLoginBtn = document.getElementById('bottomLoginBtn');
const bottomSignupBtn = document.getElementById('bottomSignupBtn');

if (bottomLoginBtn) {
  bottomLoginBtn.onclick = () => {
    openModal('authModal');
    setAuthMode('login');
  };
}

if (bottomSignupBtn) {
  bottomSignupBtn.onclick = () => {
    openModal('authModal');
    setAuthMode('signup');
  };
}

function fakeNotification() {
  const notifications = [
    '🔥 New order from Bella Napoli',
    '🍔 Urban Burger is trending today',
    '🍣 Sushi Zen tables are almost full',
    '🥙 New Arabic meals added'
  ];

  const random = notifications[Math.floor(Math.random() * notifications.length)];

  showToast(random);
}

setInterval(fakeNotification, 15000);

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');

  if (!navbar) return;

  if (window.scrollY > 40) {
    navbar.style.padding = '12px 7%';
  } else {
    navbar.style.padding = '16px 7%';
  }
});
