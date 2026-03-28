/* ============================================================
   KAUSHAR INVESTMENT — Main JavaScript
   ============================================================ */

'use strict';

// ── WhatsApp Number (replace with your actual number, include country code, no +)
const WA_NUMBER = '26771234567'; // TODO: Replace with your WhatsApp number

// ── Product Data (localStorage-backed for admin management)
function getProducts() {
  try {
    return JSON.parse(localStorage.getItem('ki_products') || '[]');
  } catch(e) { return []; }
}
function saveProducts(products) {
  localStorage.setItem('ki_products', JSON.stringify(products));
}

// ── Default/Demo Products
const DEFAULT_PRODUCTS = [
  // Hardware
  {
    id: 'hw001', category: 'hardware', title: 'Heavy Duty Angle Grinder 850W',
    desc: 'Professional 850W angle grinder with adjustable guard, ergonomic handle, and high-performance motor suitable for cutting, grinding, and polishing metal and masonry surfaces.',
    price: 'P850.00', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'hw002', category: 'hardware', title: 'Power Drill Set 13-Piece',
    desc: 'Complete power drill set including 13 assorted drill bits, carry case, and a variable-speed 650W drill driver for both wood and masonry.',
    price: 'P620.00', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'hw003', category: 'hardware', title: 'Stanley Hammer 16oz',
    desc: 'Durable 16oz claw hammer with fiberglass handle and anti-vibration grip for comfortable extended use.',
    price: 'P120.00', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    special: true, originalPrice: 'P160.00'
  },
  {
    id: 'hw004', category: 'hardware', title: 'Marble Cutter 1200W',
    desc: 'High-powered 1200W marble/tile cutter with 110mm diamond blade, water cooling tray, and adjustable cutting depth for professional tiling work.',
    price: 'P1,150.00', image: 'https://images.unsplash.com/photo-1581092921461-7d65ca45393a?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1581092921461-7d65ca45393a?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'hw005', category: 'hardware', title: 'Air Compressor 50L Tank',
    desc: 'Portable 50-litre belt-driven air compressor with 2.5HP motor, pressure gauge, quick-release fittings, and rubber wheel for mobility.',
    price: 'P2,400.00', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'hw006', category: 'hardware', title: 'Multi-Bit Screwdriver Set',
    desc: 'Professional 32-piece magnetic screwdriver set with chrome-vanadium steel bits, ergonomic soft-grip handle, and compact carry case.',
    price: 'P195.00', image: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1563906267088-b029e7101114?w=600&q=80'],
    special: true, originalPrice: 'P260.00'
  },

  // Electronics
  {
    id: 'el001', category: 'electronics', title: 'LED Smart TV 43-Inch',
    desc: '43-inch Full HD LED Smart TV with built-in WiFi, HDMI x3, USB x2, Netflix & YouTube apps pre-installed, and slim bezel design.',
    price: 'P3,800.00', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834d?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834d?w=600&q=80'],
    special: true, originalPrice: 'P4,500.00'
  },
  {
    id: 'el002', category: 'electronics', title: 'Wireless Bluetooth Speaker',
    desc: 'Portable 20W wireless Bluetooth speaker with 12-hour battery, IPX5 waterproof rating, and 360° rich stereo sound for outdoor and indoor use.',
    price: 'P480.00', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'el003', category: 'electronics', title: 'Security Camera System 4CH',
    desc: '4-channel HD CCTV security kit with 4 weatherproof cameras, DVR recorder, 1TB HDD, night vision up to 20m, and remote mobile viewing.',
    price: 'P2,100.00', image: 'https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'el004', category: 'electronics', title: 'Universal Remote Control',
    desc: 'Universal smart remote compatible with most TV, DSTV, DVD, and sound system brands. Easy setup, backlit buttons, ergonomic design.',
    price: 'P85.00', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80'],
    special: false, originalPrice: null
  },

  // Outdoor/Camp
  {
    id: 'oc001', category: 'outdoor', title: '4-Person Camping Tent',
    desc: 'Spacious 4-person waterproof dome tent with double-layer design, fibreglass poles, carry bag, and UV protection coating for all-weather camping.',
    price: 'P1,290.00', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'oc002', category: 'outdoor', title: 'Portable Gas Braai Stove',
    desc: 'Compact 2-burner portable gas braai stove with folding legs, windshield panels, and piezo ignition. Ideal for camping and outdoor cooking.',
    price: 'P640.00', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80'],
    special: true, originalPrice: 'P800.00'
  },
  {
    id: 'oc003', category: 'outdoor', title: 'Heavy Duty Cooler Box 60L',
    desc: '60-litre premium rotomoulded cooler box with superior ice retention (up to 5 days), non-slip feet, drain plug, and lockable lid.',
    price: 'P1,750.00', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'oc004', category: 'outdoor', title: 'LED Headlamp 500 Lumens',
    desc: 'Bright 500-lumen rechargeable LED headlamp with 3 modes (high/low/red SOS), IPX4 water resistance, and 10-hour run time.',
    price: 'P165.00', image: 'https://images.unsplash.com/photo-1550985543-49bee3167284?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1550985543-49bee3167284?w=600&q=80'],
    special: false, originalPrice: null
  },

  // Household
  {
    id: 'hh001', category: 'household', title: 'Stainless Steel Cookware Set 6Pc',
    desc: '6-piece stainless steel cookware set including saucepans, stock pot, and frying pan. Induction compatible, dishwasher safe, with glass lids.',
    price: 'P1,050.00', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'hh002', category: 'household', title: 'Digital Air Fryer 5L',
    desc: '5-litre digital air fryer with 8 preset cooking modes, touch control panel, 200°C max temp, and 60-minute timer. Uses 80% less oil.',
    price: 'P1,280.00', image: 'https://images.unsplash.com/photo-1648146027039-6b6ec6feaeef?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1648146027039-6b6ec6feaeef?w=600&q=80'],
    special: true, originalPrice: 'P1,600.00'
  },
  {
    id: 'hh003', category: 'household', title: 'Cordless Vacuum Cleaner',
    desc: 'Powerful cordless stick vacuum with 25,000 Pa suction, HEPA filtration, 45-min runtime, and multiple attachments for floors, stairs, and upholstery.',
    price: 'P1,900.00', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'hh004', category: 'household', title: 'LED Ceiling Light 36W',
    desc: 'Modern round 36W LED ceiling light with warm/cool/daylight colour modes, remote control, and dimmable function. 3600 lumens output.',
    price: 'P320.00', image: 'https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?w=600&q=80'],
    special: false, originalPrice: null
  },

  // Vehicle
  {
    id: 'va001', category: 'vehicle', title: 'Car Jump Starter 2000A',
    desc: '2000A peak portable car jump starter with 20,000mAh power bank, LED flashlight, USB-C charging, and smart clamps for vehicles up to 8.0L.',
    price: 'P880.00', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'va002', category: 'vehicle', title: 'Dash Camera Full HD 1080P',
    desc: 'Full HD 1080P dash camera with 170° wide angle, night vision, loop recording, G-sensor, and 3-inch display. Includes 32GB SD card.',
    price: 'P750.00', image: 'https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=600&q=80'],
    special: true, originalPrice: 'P950.00'
  },
  {
    id: 'va003', category: 'vehicle', title: 'Car Phone Mount 360°',
    desc: 'Universal 360° adjustable magnetic car phone mount with extra-strong suction cup. Compatible with all smartphones. Easy one-hand operation.',
    price: 'P75.00', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80'],
    special: false, originalPrice: null
  },
  {
    id: 'va004', category: 'vehicle', title: 'Tyre Inflator 12V Portable',
    desc: 'Compact 12V portable digital tyre inflator with preset pressure function, auto shutoff, LED light, and universal Presta/Schrader nozzles.',
    price: 'P420.00', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'],
    special: false, originalPrice: null
  }
];

// Initialise default products if none exist
if (!localStorage.getItem('ki_products')) {
  saveProducts(DEFAULT_PRODUCTS);
}

// ── Cart State
let cart = JSON.parse(localStorage.getItem('ki_cart') || '[]');
function saveCart() { localStorage.setItem('ki_cart', JSON.stringify(cart)); }

// ============================================================
// UTILITIES
// ============================================================
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.className = `toast ${type}`;
  t.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" style="color:${type==='success'?'#25D366':'#EF4444'}">
      ${type==='success'
        ? '<path d="M20 6L9 17l-5-5"/>'
        : '<path d="M18 6L6 18M6 6l12 12"/>'}
    </svg>${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function whatsappInquire(productTitle) {
  const msg = encodeURIComponent(`Good day, I would like to inquire about ${productTitle}.`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
}

// ============================================================
// CART
// ============================================================
function addToCart(product) {
  if (!cart.find(i => i.id === product.id)) {
    cart.push(product);
    saveCart();
  }
  updateCartUI();
  showToast(`"${product.title}" added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const count = cart.length;
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

function renderCartItems() {
  const el = document.getElementById('cartItems');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
      </svg>
      <p>Your cart is empty</p>
    </div>`;
    return;
  }
  el.innerHTML = cart.map(p => `
    <div class="cart-item">
      <img src="${p.image}" alt="${p.title}">
      <div class="cart-item-info">
        <div class="cart-item-title">${p.title}</div>
        <div class="cart-item-price">${p.price}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${p.id}')" aria-label="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
        </svg>
      </button>
    </div>`).join('');
}

function inquireAll() {
  if (!cart.length) { showToast('Your cart is empty', 'error'); return; }
  const list = cart.map((p, i) => `${i+1}. ${p.title}`).join('\n');
  const msg = encodeURIComponent(`Good day, I would like to inquire about the following products:\n${list}`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
}

// Cart sidebar open/close
function openCart() {
  renderCartItems();
  document.getElementById('cartOverlay')?.classList.add('open');
  document.getElementById('cartSidebar')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// HERO SLIDESHOW
// ============================================================
function initHeroSlider() {
  const track = document.querySelector('.hero-track');
  if (!track) return;
  const slides = track.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let current = 0;
  const total = slides.length;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  goTo(0);

  // Auto-advance (infinite loop — NOT rewinding)
  setInterval(() => goTo(current + 1), 5000);
}

// ============================================================
// PRODUCT CARD HTML
// ============================================================
function productCardHTML(p, isSpecial = false) {
  const images = p.images || [p.image];
  const imagesJSON = JSON.stringify(images).replace(/"/g, '&quot;');
  const cls = isSpecial ? 'product-card special' : 'product-card';
  const badge = (isSpecial && p.special) ? `<div class="special-badge">ON SPECIAL</div>` : '';
  const origPrice = (isSpecial && p.originalPrice) ? `<span class="original-price">${p.originalPrice}</span>` : '';

  return `
  <div class="${cls}" onclick="openProductModal(${JSON.stringify(p).replace(/"/g,'&quot;')})">
    <div class="product-card-img-wrap">
      ${badge}
      <img class="product-card-img" src="${p.image}" alt="${p.title}" loading="lazy">
    </div>
    <div class="product-card-body">
      <div class="product-card-title">${p.title}</div>
      <div class="product-card-desc">${p.desc}</div>
      <div class="product-card-price">${p.price}${origPrice}</div>
      <div class="product-card-actions">
        <button class="btn-inquire" onclick="event.stopPropagation(); whatsappInquire('${p.title.replace(/'/g,"\\'")}')">Inquire</button>
        <button class="btn-cart" onclick="event.stopPropagation(); addToCart(${JSON.stringify(p).replace(/"/g,'&quot;')})" title="Add to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.73l1.22-7.67H6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>`;
}

// ============================================================
// PRODUCT SLIDER (Homepage featured)
// ============================================================
function initProductSlider(wrapperId, products) {
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  const track = wrap.querySelector('.product-slider-track');
  if (!track) return;

  track.innerHTML = products.map(p => productCardHTML(p)).join('');

  // Calculate card width (4.5 visible)
  function getCardWidth() {
    const vp = wrap.querySelector('.product-slider-viewport');
    return (vp.offsetWidth - 4 * 16) / 4.5;
  }

  let cw = getCardWidth();
  // Set widths
  function setWidths() {
    cw = getCardWidth();
    track.querySelectorAll('.product-card').forEach(c => {
      c.style.minWidth = cw + 'px';
      c.style.maxWidth = cw + 'px';
    });
  }
  setWidths();
  window.addEventListener('resize', setWidths);

  let pos = 0;
  const step = cw + 16;

  function slide(dir) {
    const total = products.length;
    const maxPos = total - 4;
    pos = Math.max(0, Math.min(pos + dir, maxPos));
    track.style.transform = `translateX(-${pos * (cw + 16)}px)`;
  }

  wrap.querySelector('.slider-arrow.left')?.addEventListener('click', () => { setWidths(); slide(-1); });
  wrap.querySelector('.slider-arrow.right')?.addEventListener('click', () => { setWidths(); slide(1); });
}

// ============================================================
// PRODUCT MODAL
// ============================================================
function openProductModal(p) {
  const overlay = document.getElementById('productModal');
  if (!overlay) return;
  const images = p.images && p.images.length ? p.images : [p.image];
  let imgIdx = 0;

  const dotsHTML = images.length > 1
    ? `<div class="modal-img-dots">${images.map((_,i) => `<div class="modal-img-dot${i===0?' active':''}" data-mi="${i}"></div>`).join('')}</div>`
    : '';
  const arrowsHTML = images.length > 1
    ? `<button class="modal-gallery-arrow left" id="mgLeft"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
       <button class="modal-gallery-arrow right" id="mgRight"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>`
    : '';

  overlay.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" onclick="closeProductModal()">&#x2715;</button>
      <div class="modal-gallery">
        ${arrowsHTML}
        <div class="modal-img-track" id="mgTrack">
          ${images.map(src => `<div class="modal-img-slide"><img src="${src}" alt="${p.title}" loading="lazy"></div>`).join('')}
        </div>
        ${dotsHTML}
      </div>
      <div class="modal-info">
        <h2>${p.title}</h2>
        <p class="full-desc">${p.desc}</p>
        <div class="modal-price">${p.price}</div>
        <div class="modal-actions">
          <button class="btn-inquire" onclick="whatsappInquire('${p.title.replace(/'/g,"\\'")}')">Inquire on WhatsApp</button>
          <button class="btn-cart" onclick="addToCart(${JSON.stringify(p).replace(/"/g,'&quot;')})" title="Add to cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.73l1.22-7.67H6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Gallery navigation
  function gotoImg(idx) {
    imgIdx = (idx + images.length) % images.length;
    document.getElementById('mgTrack').style.transform = `translateX(-${imgIdx * 100}%)`;
    overlay.querySelectorAll('.modal-img-dot').forEach((d, i) => d.classList.toggle('active', i === imgIdx));
  }
  overlay.querySelector('#mgLeft')?.addEventListener('click', () => gotoImg(imgIdx - 1));
  overlay.querySelector('#mgRight')?.addEventListener('click', () => gotoImg(imgIdx + 1));
  overlay.querySelectorAll('.modal-img-dot').forEach(d => d.addEventListener('click', () => gotoImg(+d.dataset.mi)));

  overlay.addEventListener('click', e => { if (e.target === overlay) closeProductModal(); });
}

function closeProductModal() {
  const overlay = document.getElementById('productModal');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// CATEGORY SEARCH (per-page)
// ============================================================
const CATEGORY_TERMS = {
  hardware: ['Angle Grinder','Blower','Drilling Tools','Marble Cutter','Hammer','Screwdriver','Wrench','Pliers','Tape Measure','Level','Jigsaw','Circular Saw','Air Compressor','Nail Gun','Chisel','Bolt','Nut','Washer','Paint Brush','Roller','Sandpaper','Router','Drill Bit','Clamp','Vise Grip','File Set','Hex Key','Utility Knife','Safety Gear','Welding Mask','Extension Cord'],
  electronics: ['LED TV','Smart TV','Bluetooth Speaker','CCTV Camera','Security System','Remote Control','Solar Panel','Inverter','UPS','Power Bank','USB Hub','HDMI Cable','Earphones','Headset','Charger','Adapter','LED Strip','Dimmer Switch','Intercom','Projector','Router','WiFi Extender','Microphone','Memory Card','Flash Drive'],
  outdoor: ['Tent','Camping Chair','Folding Table','Cooler Box','Braai Stand','Gas Stove','Sleeping Bag','Headlamp','Torch','Hiking Boots','Backpack','Fishing Rod','Tackle Box','Canopy','Tarpaulin','Rope','Carabiner','Water Filter','Mosquito Net','Lantern'],
  household: ['Cookware Set','Air Fryer','Kettle','Toaster','Blender','Juicer','Vacuum Cleaner','Mop','Broom','Dustbin','Laundry Basket','Iron','Ironing Board','Fan','Heater','Curtain','Pillow','Mattress','Bedsheet','Towel','Cleaning Spray','Dish Rack','Storage Box','Hangers','Ceiling Light','Bulb'],
  vehicle: ['Jump Starter','Dash Camera','Car Mount','Tyre Inflator','Seat Cover','Steering Wheel Cover','Car Charger','Car Vacuum','Wiper Blades','Car Air Freshener','Oil Filter','Brake Pads','Motor Oil','Car Polish','Tyre Gauge','Tow Rope','Fuel Can','Car Mat','Roof Rack','Trailer Hitch']
};

function initCategorySearch(category) {
  const input = document.getElementById('catSearch');
  const dropdown = document.getElementById('catSearchDropdown');
  if (!input || !dropdown) return;

  const terms = CATEGORY_TERMS[category] || [];
  const products = getProducts().filter(p => p.category === category);

  function filterProducts(query) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    const q = query.toLowerCase().trim();
    const filtered = q
      ? products.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
      : products;
    grid.innerHTML = filtered.length
      ? filtered.map(p => productCardHTML(p)).join('')
      : `<div class="no-results"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px;margin:0 auto 12px;opacity:0.3"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><p>No products found for "${query}"</p></div>`;
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    if (q.length < 1) { dropdown.classList.remove('open'); filterProducts(''); return; }
    const matches = terms.filter(t => t.toLowerCase().includes(q));
    if (matches.length) {
      dropdown.innerHTML = matches.slice(0, 8).map(m =>
        `<div class="search-dropdown-item" onclick="selectSearch('${m}')">${m}</div>`).join('');
      dropdown.classList.add('open');
    } else {
      dropdown.classList.remove('open');
    }
    filterProducts(q);
  });

  window.selectSearch = (term) => {
    input.value = term;
    dropdown.classList.remove('open');
    filterProducts(term);
  };

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target))
      dropdown.classList.remove('open');
  });

  // Render all initially
  filterProducts('');
}

function renderCategoryProducts(category) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const products = getProducts().filter(p => p.category === category);
  grid.innerHTML = products.length
    ? products.map(p => productCardHTML(p)).join('')
    : `<div class="no-results"><p>No products in this category yet. Check back soon!</p></div>`;
}

// ============================================================
// HOMEPAGE SECTIONS
// ============================================================
function initHomePage() {
  const products = getProducts();

  // Featured slider (mix of categories, non-special)
  const featured = products.filter(p => !p.special).slice(0, 10);
  initProductSlider('featuredSlider', featured);

  // Special section slider
  const specials = products.filter(p => p.special);
  const specSlider = document.getElementById('specialSlider');
  if (specSlider) {
    const track = specSlider.querySelector('.product-slider-track');
    if (track) {
      track.innerHTML = specials.map(p => productCardHTML(p, true)).join('');
      // Size cards
      function setSpecialWidths() {
        const vp = specSlider.querySelector('.product-slider-viewport');
        const cw = (vp.offsetWidth - 4 * 16) / 4.5;
        track.querySelectorAll('.product-card').forEach(c => {
          c.style.minWidth = cw + 'px';
          c.style.maxWidth = cw + 'px';
        });
      }
      setSpecialWidths();
      window.addEventListener('resize', setSpecialWidths);
      let spos = 0;
      function sslide(dir) {
        const vp = specSlider.querySelector('.product-slider-viewport');
        const cw = (vp.offsetWidth - 4 * 16) / 4.5;
        const step = cw + 16;
        spos = Math.max(0, Math.min(spos + dir, specials.length - 4));
        track.style.transform = `translateX(-${spos * step}px)`;
      }
      specSlider.querySelector('.slider-arrow.left')?.addEventListener('click', () => sslide(-1));
      specSlider.querySelector('.slider-arrow.right')?.addEventListener('click', () => sslide(1));
    }
  }
}

// "View All" scrolls to category bar
function viewAllProducts() {
  document.querySelector('.category-bar')?.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// HAMBURGER MENU
// ============================================================
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('mobileNav');
  const close = document.querySelector('.mobile-nav-close');
  btn?.addEventListener('click', () => nav?.classList.add('open'));
  close?.addEventListener('click', () => nav?.classList.remove('open'));
}

// ============================================================
// ADMIN PAGE
// ============================================================
function initAdmin() {
  const form = document.getElementById('adminForm');
  if (!form) return;

  // Image upload
  const uploadArea = document.getElementById('imgUploadArea');
  const fileInput = document.getElementById('imgFiles');
  let uploadedImages = [];

  uploadArea?.addEventListener('click', () => fileInput?.click());
  uploadArea?.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--orange)'; });
  uploadArea?.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea?.addEventListener('drop', e => {
    e.preventDefault(); uploadArea.style.borderColor = '';
    handleFiles(e.dataTransfer.files);
  });
  fileInput?.addEventListener('change', () => handleFiles(fileInput.files));

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        uploadedImages.push(e.target.result);
        renderImgPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderImgPreviews() {
    const grid = document.getElementById('imgPreviewGrid');
    if (!grid) return;
    grid.innerHTML = uploadedImages.map((src, i) => `
      <div class="img-preview-item">
        <img src="${src}" alt="img">
        <div class="img-preview-remove" onclick="removeUploadedImg(${i})">&#x2715;</div>
      </div>`).join('');
  }

  window.removeUploadedImg = (i) => {
    uploadedImages.splice(i, 1);
    renderImgPreviews();
  };

  // Category selection
  let selectedCat = null;
  document.querySelectorAll('.cat-pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(x => x.classList.remove('selected'));
      p.classList.add('selected');
      selectedCat = p.dataset.cat;
    });
  });

  // Special toggle
  let isSpecial = false;
  const toggle = document.getElementById('specialToggle');
  toggle?.addEventListener('click', () => {
    isSpecial = !isSpecial;
    toggle.classList.toggle('on', isSpecial);
  });

  // Form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('pTitle')?.value.trim();
    const desc = document.getElementById('pDesc')?.value.trim();
    const price = document.getElementById('pPrice')?.value.trim();
    const origPrice = document.getElementById('pOrigPrice')?.value.trim();

    if (!title || !desc || !price || !selectedCat) {
      showToast('Please fill in all required fields and select a category', 'error');
      return;
    }

    const editId = form.dataset.editId;
    const products = getProducts();

    const productData = {
      id: editId || `${selectedCat.slice(0,2)}${Date.now()}`,
      category: selectedCat,
      title, desc,
      price: price.startsWith('P') ? price : `P${price}`,
      originalPrice: origPrice ? (origPrice.startsWith('P') ? origPrice : `P${origPrice}`) : null,
      image: uploadedImages[0] || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
      images: uploadedImages.length ? uploadedImages : ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80'],
      special: isSpecial
    };

    if (editId) {
      const idx = products.findIndex(p => p.id === editId);
      if (idx > -1) products[idx] = productData;
      delete form.dataset.editId;
    } else {
      products.push(productData);
    }

    saveProducts(products);
    showToast(`Product "${title}" saved successfully!`);
    form.reset();
    uploadedImages = [];
    renderImgPreviews();
    selectedCat = null;
    document.querySelectorAll('.cat-pill').forEach(x => x.classList.remove('selected'));
    isSpecial = false;
    toggle?.classList.remove('on');
    renderAdminList();
  });

  renderAdminList();
}

function renderAdminList() {
  const list = document.getElementById('adminProductList');
  if (!list) return;
  const products = getProducts();
  list.innerHTML = products.length ? products.map(p => `
    <div class="admin-product-item">
      <img src="${p.image}" alt="${p.title}">
      <div class="admin-product-item-info">
        <strong>${p.title}</strong>
        <span>${p.category} • ${p.price}${p.special ? ' • 🔥 On Special' : ''}</span>
      </div>
      <div class="admin-product-item-actions">
        <button class="admin-edit-btn" onclick="adminEdit('${p.id}')">Edit</button>
        <button class="admin-delete-btn" onclick="adminDelete('${p.id}')">Delete</button>
      </div>
    </div>`).join('')
    : `<p style="color:var(--gray);font-size:14px;">No products yet. Add your first product above!</p>`;
}

window.adminDelete = (id) => {
  if (!confirm('Delete this product?')) return;
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  renderAdminList();
  showToast('Product deleted');
};

window.adminEdit = (id) => {
  const p = getProducts().find(x => x.id === id);
  if (!p) return;
  document.getElementById('pTitle').value = p.title;
  document.getElementById('pDesc').value = p.desc;
  document.getElementById('pPrice').value = p.price.replace('P','');
  document.getElementById('pOrigPrice').value = p.originalPrice ? p.originalPrice.replace('P','') : '';
  document.querySelectorAll('.cat-pill').forEach(x => {
    x.classList.toggle('selected', x.dataset.cat === p.category);
  });
  const toggle = document.getElementById('specialToggle');
  toggle?.classList.toggle('on', p.special);
  document.getElementById('adminForm').dataset.editId = id;
  document.getElementById('adminForm').scrollIntoView({ behavior: 'smooth' });
  showToast('Editing product — make changes and save');
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  initHamburger();
  initHeroSlider();

  const page = document.body.dataset.page;
  if (page === 'home') initHomePage();
  if (page === 'hardware') { renderCategoryProducts('hardware'); initCategorySearch('hardware'); }
  if (page === 'electronics') { renderCategoryProducts('electronics'); initCategorySearch('electronics'); }
  if (page === 'outdoor') { renderCategoryProducts('outdoor'); initCategorySearch('outdoor'); }
  if (page === 'household') { renderCategoryProducts('household'); initCategorySearch('household'); }
  if (page === 'vehicle') { renderCategoryProducts('vehicle'); initCategorySearch('vehicle'); }
  if (page === 'admin') initAdmin();

  // Cart events
  document.querySelector('.cart-btn')?.addEventListener('click', openCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('inquireAllBtn')?.addEventListener('click', inquireAll);
});
