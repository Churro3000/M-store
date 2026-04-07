/* ============================================================
   KAUSHAR INVESTMENT — Main JavaScript
   ============================================================ */
'use strict';

// ── Block F12 / DevTools ──
document.addEventListener('keydown', function(e) {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C','U'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')) {
    e.preventDefault(); return false;
  }
});
document.addEventListener('contextmenu', function(e) {
  // Only block right-click on images to prevent saving, allow text copy menu everywhere else
  if (e.target.tagName === 'IMG') { e.preventDefault(); return false; }
});

// ── Supabase Config ──
const SUPABASE_URL = 'https://rcssxrhxxvacrhvqkgdv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3N4cmh4eHZhY3JodnFrZ2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTQwODgsImV4cCI6MjA5MDg5MDA4OH0.TPEdtDJZa5IVcl_Hy0USI1uD_IC3BFN3zOzHV4RgVps';
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const WA_NUMBER = '26771234567';

// ── Product Storage — Supabase is source of truth, localStorage is cache ──
let _cachedProducts = null;

function getProducts() {
  if (_cachedProducts !== null) return _cachedProducts;
  try {
    const local = JSON.parse(localStorage.getItem('ki_products') || 'null');
    if (local && Array.isArray(local) && local.length > 0) return local;
  } catch(e) {}
  return [];
}

function saveProducts(products) {
  _cachedProducts = products;
  localStorage.setItem('ki_products', JSON.stringify(products));
  _sb.from('products').select('id').limit(1).then(function(res) {
    var data = JSON.stringify(products);
    if (res.data && res.data.length > 0) {
      _sb.from('products').update({ data: data }).eq('id', res.data[0].id).then(function(r) {
        if (r.error) console.warn('Supabase update failed:', r.error);
      });
    } else {
      _sb.from('products').insert({ data: data }).then(function(r) {
        if (r.error) console.warn('Supabase insert failed:', r.error);
      });
    }
  });
}

function getSettings() { try { return JSON.parse(localStorage.getItem('ki_settings') || '{}'); } catch(e) { return {}; } }
function saveSettings(s) { localStorage.setItem('ki_settings', JSON.stringify(s)); }

function formatPrice(raw) {
  if (!raw) return '';
  const s = String(raw).replace(/[^0-9.,]/g, '');
  if (!s) return '';
  const noCommas = s.replace(/,/g, '');
  const num = parseFloat(noCommas);
  if (isNaN(num)) return '';
  const parts = num.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return 'P' + parts[0] + '.' + parts[1];
}

const DEFAULT_PRODUCTS = [
  {id:'hw001',category:'hardware',title:'Heavy Duty Angle Grinder 850W',desc:'Professional 850W angle grinder with adjustable guard, ergonomic handle, and high-performance motor suitable for cutting, grinding, and polishing metal and masonry surfaces.',price:'P850.00',image:'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',images:['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:0},
  {id:'hw002',category:'hardware',title:'Power Drill Set 13-Piece',desc:'Complete power drill set including 13 assorted drill bits, carry case, and a variable-speed 650W drill driver for both wood and masonry.',price:'P620.00',image:'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',images:['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80'],special:false,featured:true,originalPrice:null,sortOrder:1},
  {id:'hw003',category:'hardware',title:'Stanley Hammer 16oz',desc:'Durable 16oz claw hammer with fiberglass handle and anti-vibration grip for comfortable extended use.',price:'P120.00',image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],special:true,featured:false,originalPrice:'P160.00',sortOrder:2},
  {id:'hw004',category:'hardware',title:'Marble Cutter 1200W',desc:'High-powered 1200W marble/tile cutter with 110mm diamond blade, water cooling tray, and adjustable cutting depth for professional tiling work.',price:'P1,150.00',image:'https://images.unsplash.com/photo-1581092921461-7d65ca45393a?w=400&q=80',images:['https://images.unsplash.com/photo-1581092921461-7d65ca45393a?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:3},
  {id:'hw005',category:'hardware',title:'Air Compressor 50L Tank',desc:'Portable 50-litre belt-driven air compressor with 2.5HP motor, pressure gauge, quick-release fittings, and rubber wheel for mobility.',price:'P2,400.00',image:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',images:['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:4},
  {id:'hw006',category:'hardware',title:'Multi-Bit Screwdriver Set',desc:'Professional 32-piece magnetic screwdriver set with chrome-vanadium steel bits, ergonomic soft-grip handle, and compact carry case.',price:'P195.00',image:'https://images.unsplash.com/photo-1563906267088-b029e7101114?w=400&q=80',images:['https://images.unsplash.com/photo-1563906267088-b029e7101114?w=600&q=80'],special:true,featured:true,originalPrice:'P260.00',sortOrder:5},
  {id:'el001',category:'electronics',title:'LED Smart TV 43-Inch',desc:'43-inch Full HD LED Smart TV with built-in WiFi, HDMI x3, USB x2, Netflix & YouTube apps pre-installed, and slim bezel design.',price:'P3,800.00',image:'https://images.unsplash.com/photo-1593359677879-a4bb92f4834d?w=400&q=80',images:['https://images.unsplash.com/photo-1593359677879-a4bb92f4834d?w=600&q=80'],special:true,featured:true,originalPrice:'P4,500.00',sortOrder:0},
  {id:'el002',category:'electronics',title:'Wireless Bluetooth Speaker',desc:'Portable 20W wireless Bluetooth speaker with 12-hour battery, IPX5 waterproof rating, and 360° rich stereo sound.',price:'P480.00',image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',images:['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:1},
  {id:'el003',category:'electronics',title:'Security Camera System 4CH',desc:'4-channel HD CCTV security kit with 4 weatherproof cameras, DVR recorder, 1TB HDD, night vision up to 20m, and remote mobile viewing.',price:'P2,100.00',image:'https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=400&q=80',images:['https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:2},
  {id:'el004',category:'electronics',title:'Universal Remote Control',desc:'Universal smart remote compatible with most TV, DSTV, DVD, and sound system brands. Easy setup, backlit buttons, ergonomic design.',price:'P85.00',image:'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80',images:['https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:3},
  {id:'oc001',category:'outdoor',title:'4-Person Camping Tent',desc:'Spacious 4-person waterproof dome tent with double-layer design, fibreglass poles, carry bag, and UV protection coating for all-weather camping.',price:'P1,290.00',image:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80',images:['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:0},
  {id:'oc002',category:'outdoor',title:'Portable Gas Braai Stove',desc:'Compact 2-burner portable gas braai stove with folding legs, windshield panels, and piezo ignition. Ideal for camping and outdoor cooking.',price:'P640.00',image:'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80',images:['https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80'],special:true,featured:true,originalPrice:'P800.00',sortOrder:1},
  {id:'oc003',category:'outdoor',title:'Heavy Duty Cooler Box 60L',desc:'60-litre premium rotomoulded cooler box with superior ice retention (up to 5 days), non-slip feet, drain plug, and lockable lid.',price:'P1,750.00',image:'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',images:['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:2},
  {id:'oc004',category:'outdoor',title:'LED Headlamp 500 Lumens',desc:'Bright 500-lumen rechargeable LED headlamp with 3 modes, IPX4 water resistance, and 10-hour run time.',price:'P165.00',image:'https://images.unsplash.com/photo-1550985543-49bee3167284?w=400&q=80',images:['https://images.unsplash.com/photo-1550985543-49bee3167284?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:3},
  {id:'hh001',category:'household',title:'Stainless Steel Cookware Set 6Pc',desc:'6-piece stainless steel cookware set including saucepans, stock pot, and frying pan. Induction compatible, dishwasher safe, with glass lids.',price:'P1,050.00',image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',images:['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:0},
  {id:'hh002',category:'household',title:'Digital Air Fryer 5L',desc:'5-litre digital air fryer with 8 preset cooking modes, touch control panel, 200°C max temp, and 60-minute timer. Uses 80% less oil.',price:'P1,280.00',image:'https://images.unsplash.com/photo-1648146027039-6b6ec6feaeef?w=400&q=80',images:['https://images.unsplash.com/photo-1648146027039-6b6ec6feaeef?w=600&q=80'],special:true,featured:true,originalPrice:'P1,600.00',sortOrder:1},
  {id:'hh003',category:'household',title:'Cordless Vacuum Cleaner',desc:'Powerful cordless stick vacuum with 25,000 Pa suction, HEPA filtration, 45-min runtime, and multiple attachments.',price:'P1,900.00',image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:2},
  {id:'hh004',category:'household',title:'LED Ceiling Light 36W',desc:'Modern round 36W LED ceiling light with warm/cool/daylight colour modes, remote control, and dimmable function. 3600 lumens output.',price:'P320.00',image:'https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?w=400&q=80',images:['https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:3},
  {id:'va001',category:'vehicle',title:'Car Jump Starter 2000A',desc:'2000A peak portable car jump starter with 20,000mAh power bank, LED flashlight, USB-C charging, and smart clamps for vehicles up to 8.0L.',price:'P880.00',image:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80',images:['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:0},
  {id:'va002',category:'vehicle',title:'Dash Camera Full HD 1080P',desc:'Full HD 1080P dash camera with 170° wide angle, night vision, loop recording, G-sensor, and 3-inch display. Includes 32GB SD card.',price:'P750.00',image:'https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=400&q=80',images:['https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=600&q=80'],special:true,featured:true,originalPrice:'P950.00',sortOrder:1},
  {id:'va003',category:'vehicle',title:'Car Phone Mount 360°',desc:'Universal 360° adjustable magnetic car phone mount with extra-strong suction cup. Compatible with all smartphones.',price:'P75.00',image:'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=80',images:['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:2},
  {id:'va004',category:'vehicle',title:'Tyre Inflator 12V Portable',desc:'Compact 12V portable digital tyre inflator with preset pressure function, auto shutoff, LED light, and universal nozzles.',price:'P420.00',image:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',images:['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'],special:false,featured:false,originalPrice:null,sortOrder:3}
];

let cart = [];
try { cart = JSON.parse(localStorage.getItem('ki_cart') || '[]'); } catch(e) { cart = []; }
function saveCart() { localStorage.setItem('ki_cart', JSON.stringify(cart)); }

// ============================================================
// UTILITIES
// ============================================================
function showToast(msg, type) {
  type = type || 'success';
  const t = document.getElementById('toast');
  if (!t) return;
  const isMobile = window.innerWidth <= 900;
  t.className = 'toast ' + type + (isMobile ? ' toast-top' : '');
  const icon = type === 'success'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px;flex-shrink:0"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  t.innerHTML = icon + '<span>' + msg + '</span>';
  t.classList.add('show');
  clearTimeout(t._to);
  t._to = setTimeout(function() { t.classList.remove('show'); }, 2800);
}

function whatsappInquire(title) {
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Good day, I would like to inquire about ' + title + '.'), '_blank');
}

function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Formats description preserving line breaks
function fmtDesc(s) {
  return escHtml(String(s || '')).replace(/\n/g, '<br>');
}

// ============================================================
// CART
// ============================================================
function addToCart(product) {
  if (!cart.find(function(i) { return i.id === product.id; })) {
    cart.push(product);
    saveCart();
  }
  updateCartUI();
  showToast('"' + product.title + '" added to cart');
}

function removeFromCart(id, skipConfirm) {
  const isMobile = window.innerWidth <= 900;
  if (isMobile && !skipConfirm) {
    showCartConfirm(id);
    return;
  }
  cart = cart.filter(function(i) { return i.id !== id; });
  saveCart();
  updateCartUI();
  renderCartItems();
}

function showCartConfirm(id) {
  document.getElementById('cartConfirmOv')?.remove();
  const ov = document.createElement('div');
  ov.id = 'cartConfirmOv';
  ov.className = 'cart-confirm-overlay';
  ov.innerHTML = '<div class="cart-confirm-box">' +
    '<p>Remove this item from your cart?</p>' +
    '<div class="cart-confirm-actions">' +
    '<button class="btn-confirm-cancel" onclick="document.getElementById(\'cartConfirmOv\').remove()">Cancel</button>' +
    '<button class="btn-confirm-remove" onclick="forceRemoveFromCart(\'' + id + '\')">Remove</button>' +
    '</div></div>';
  document.body.appendChild(ov);
}
window.forceRemoveFromCart = function(id) {
  document.getElementById('cartConfirmOv')?.remove();
  removeFromCart(id, true);
};

function updateCartUI() {
  document.querySelectorAll('.cart-badge').forEach(function(b) {
    b.textContent = cart.length;
    b.style.display = cart.length > 0 ? 'flex' : 'none';
  });
}

function renderCartItems() {
  const el = document.getElementById('cartItems');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;opacity:0.3;margin:0 auto 12px;display:block"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg><p>Your cart is empty</p></div>';
    return;
  }
  const fb = 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&q=60';
  el.innerHTML = cart.map(function(p) {
    const img = (p.image && p.image.length > 0) ? p.image : fb;
    return '<div class="cart-item">' +
      '<img src="' + escHtml(img) + '" alt="' + escHtml(p.title) + '" onerror="this.src=\'' + fb + '\'">' +
      '<div class="cart-item-info"><div class="cart-item-title">' + escHtml(p.title) + '</div><div class="cart-item-price">' + escHtml(p.price) + '</div></div>' +
      '<button class="cart-item-remove" data-rid="' + escHtml(p.id) + '" aria-label="Remove">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>' +
      '</button></div>';
  }).join('');
  el.querySelectorAll('.cart-item-remove').forEach(function(btn) {
    btn.addEventListener('click', function() { removeFromCart(this.dataset.rid); });
  });
}

function inquireAll() {
  if (!cart.length) { showToast('Your cart is empty', 'error'); return; }
  const list = cart.map(function(p, i) { return (i + 1) + '. ' + p.title; }).join('\n');
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Good day, I would like to inquire about the following products:\n' + list), '_blank');
}

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
  const dots = document.querySelectorAll('.hero-dot');
  let current = 0;
  const total = track.querySelectorAll('.hero-slide').length;
  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }
  dots.forEach(function(d, i) { d.addEventListener('click', function() { goTo(i); }); });
  goTo(0);
  setInterval(function() { goTo(current + 1); }, 5000);
}

// ============================================================
// PRODUCT CARD
// ============================================================
function productCardHTML(p) {
  const badge = p.special ? '<div class="special-badge">ON SPECIAL</div>' : '';
  const orig = p.originalPrice ? '<span class="original-price">' + escHtml(p.originalPrice) + '</span>' : '';
  const pStr = escHtml(JSON.stringify(p));
  const safeT = p.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return '<div class="product-card' + (p.special ? ' special' : '') + '" onclick=\'openProductModal(' + pStr + ')\'>' +
    '<div class="product-card-img-wrap">' + badge +
    '<img class="product-card-img" src="' + escHtml(p.image) + '" alt="' + escHtml(p.title) + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=60\'">' +
    '</div><div class="product-card-body">' +
    '<div class="product-card-title">' + escHtml(p.title) + '</div>' +
    '<div class="product-card-desc">' + fmtDesc(p.desc) + '</div>' +
    '<div class="product-card-price">' + escHtml(p.price) + orig + '</div>' +
    '<div class="product-card-actions">' +
    '<button class="btn-inquire" onclick="event.stopPropagation();whatsappInquire(\'' + safeT + '\')">Inquire</button>' +
    '<button class="btn-cart" onclick=\'event.stopPropagation();addToCart(' + pStr + ')\' title="Add to cart">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.73l1.22-7.67H6"/></svg>' +
    '</button></div></div></div>';
}

// ============================================================
// PRODUCT SLIDER — true 1:1 finger tracking, no bounce
// ============================================================
function buildSlider(wrapperId, products) {
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  const track = wrap.querySelector('.product-slider-track');
  if (!track) return;
  track.innerHTML = products.map(productCardHTML).join('');

  function getVis() { return window.innerWidth <= 900 ? 1.5 : 4.5; }
  function getGaps() { return window.innerWidth <= 900 ? 1 : 4; }
  function cardW() {
    const vp = wrap.querySelector('.product-slider-viewport');
    return (vp.offsetWidth - getGaps() * 16) / getVis();
  }
  function stepW() { return cardW() + 16; }
  function maxPos() { return Math.max(0, products.length - Math.floor(getVis())); }

  function setW() {
    const w = cardW();
    track.querySelectorAll('.product-card').forEach(function(c) {
      c.style.minWidth = w + 'px'; c.style.maxWidth = w + 'px';
    });
  }
  setW();
  window.addEventListener('resize', setW);

  let pos = 0;
  function goToPos(newPos, animate) {
    pos = Math.max(0, Math.min(newPos, maxPos()));
    track.style.transition = animate ? 'transform 0.28s ease' : 'none';
    track.style.transform = 'translateX(-' + (pos * stepW()) + 'px)';
  }

  wrap.querySelector('.slider-arrow.left')?.addEventListener('click', function() { setW(); goToPos(pos - 1, true); });
  wrap.querySelector('.slider-arrow.right')?.addEventListener('click', function() { setW(); goToPos(pos + 1, true); });

  const vp = wrap.querySelector('.product-slider-viewport');
  let touchStartX = 0, touchStartY = 0, touchStartTranslate = 0, isTouchDragging = false, touchVertLocked = null;

  vp.addEventListener('touchstart', function(e) {
    setW();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isTouchDragging = true;
    touchVertLocked = null;
    try { touchStartTranslate = new WebKitCSSMatrix(track.style.transform).m41; } catch(err) { touchStartTranslate = -(pos * stepW()); }
    track.style.transition = 'none';
  }, { passive: true });

  vp.addEventListener('touchmove', function(e) {
    if (!isTouchDragging) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (touchVertLocked === null) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) touchVertLocked = false;
      else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) touchVertLocked = true;
    }
    if (touchVertLocked === false) {
      e.preventDefault();
      const minX = -(maxPos() * stepW());
      const newX = Math.max(minX, Math.min(0, touchStartTranslate + dx));
      track.style.transform = 'translateX(' + newX + 'px)';
    }
  }, { passive: false });

  vp.addEventListener('touchend', function(e) {
    if (!isTouchDragging) return;
    isTouchDragging = false;
    if (touchVertLocked !== false) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const rawPos = -(touchStartTranslate + dx) / stepW();
    const snappedPos = dx < -30 ? Math.ceil(rawPos) : dx > 30 ? Math.floor(rawPos) : Math.round(rawPos);
    goToPos(snappedPos, true);
    touchVertLocked = null;
  }, { passive: true });
}

function initProductSlider(id, products) { buildSlider(id, products); }

// ============================================================
// PRODUCT MODAL
// ============================================================
function openProductModal(p) {
  const ov = document.getElementById('productModal');
  if (!ov) return;
  const imgs = (p.images && p.images.length) ? p.images : [p.image];
  let idx = 0;
  const dots = imgs.length > 1 ? '<div class="modal-img-dots">' + imgs.map(function(_, i) { return '<div class="modal-img-dot' + (i === 0 ? ' active' : '') + '" data-mi="' + i + '"></div>'; }).join('') + '</div>' : '';
  const arrows = imgs.length > 1
    ? '<button class="modal-gallery-arrow left" id="mgL"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button><button class="modal-gallery-arrow right" id="mgR"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>'
    : '';
  const pStr = escHtml(JSON.stringify(p));
  const safeT = p.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  ov.innerHTML = '<div class="modal-box">' +
    '<button class="modal-close" onclick="closeProductModal()">&#x2715;</button>' +
    '<div class="modal-gallery">' + arrows +
    '<div class="modal-img-track" id="mgTrack">' +
    imgs.map(function(s) { return '<div class="modal-img-slide"><img src="' + escHtml(s) + '" alt="' + escHtml(p.title) + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=60\'"></div>'; }).join('') +
    '</div>' + dots + '</div>' +
    '<div class="modal-info"><h2>' + escHtml(p.title) + '</h2>' +
    '<p class="full-desc">' + fmtDesc(p.desc) + '</p>' +
    '<div class="modal-price">' + escHtml(p.price) + (p.originalPrice ? '<span class="original-price" style="margin-left:10px">' + escHtml(p.originalPrice) + '</span>' : '') + '</div>' +
    '<div class="modal-actions">' +
    '<button class="btn-inquire" onclick="whatsappInquire(\'' + safeT + '\')">Inquire on WhatsApp</button>' +
    '<button class="btn-cart" onclick=\'addToCart(' + pStr + ')\' title="Add to cart">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.73l1.22-7.67H6"/></svg>' +
    '</button></div></div></div>';
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  function go(i) {
    idx = (i + imgs.length) % imgs.length;
    document.getElementById('mgTrack').style.transform = 'translateX(-' + (idx * 100) + '%)';
    ov.querySelectorAll('.modal-img-dot').forEach(function(d, j) { d.classList.toggle('active', j === idx); });
  }
  ov.querySelector('#mgL')?.addEventListener('click', function() { go(idx - 1); });
  ov.querySelector('#mgR')?.addEventListener('click', function() { go(idx + 1); });
  ov.querySelectorAll('.modal-img-dot').forEach(function(d) { d.addEventListener('click', function() { go(+d.dataset.mi); }); });
  ov.addEventListener('click', function(e) { if (e.target === ov) closeProductModal(); });
}
function closeProductModal() {
  document.getElementById('productModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// CATEGORY SEARCH
// ============================================================
const CATEGORY_TERMS = {
  hardware: ['Angle Grinder','Blower','Drilling Tools','Marble Cutter','Hammer','Screwdriver','Wrench','Pliers','Tape Measure','Level','Jigsaw','Circular Saw','Air Compressor','Nail Gun','Chisel','Extension Cord','Paint Brush','Clamp','Safety Gear'],
  electronics: ['LED TV','Smart TV','Bluetooth Speaker','CCTV Camera','Security System','Remote Control','Solar Panel','Inverter','Power Bank','USB Hub','HDMI Cable','Earphones','Headset','Charger','Adapter','LED Strip','Projector','Router','WiFi Extender','Memory Card','Flash Drive'],
  outdoor: ['Tent','Camping Chair','Folding Table','Cooler Box','Braai Stand','Gas Stove','Sleeping Bag','Headlamp','Torch','Backpack','Fishing Rod','Canopy','Tarpaulin','Rope','Lantern','Mosquito Net'],
  household: ['Cookware Set','Air Fryer','Kettle','Toaster','Blender','Juicer','Vacuum Cleaner','Mop','Fan','Heater','Curtain','Pillow','Towel','Storage Box','Ceiling Light','Bulb','Iron','Dish Rack'],
  vehicle: ['Jump Starter','Dash Camera','Car Mount','Tyre Inflator','Seat Cover','Car Charger','Wiper Blades','Car Polish','Oil Filter','Car Mat','Tow Rope','Fuel Can','Car Vacuum','Steering Wheel Cover']
};

function initCategorySearch(cat) {
  const input = document.getElementById('catSearch');
  const dd = document.getElementById('catSearchDropdown');
  if (!input || !dd) return;
  const terms = CATEGORY_TERMS[cat] || [];
  function sorted() { return getProducts().filter(function(p) { return p.category === cat; }).sort(function(a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); }); }
  function renderGrid(q) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    const all = sorted();
    const f = q ? all.filter(function(p) { return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q); }) : all;
    grid.innerHTML = f.length ? f.map(productCardHTML).join('') : '<div class="no-results"><p>No products found for "' + escHtml(q) + '"</p></div>';
  }
  input.addEventListener('input', function() {
    const q = input.value.toLowerCase().trim();
    if (!q) { dd.classList.remove('open'); renderGrid(''); return; }
    const m = terms.filter(function(t) { return t.toLowerCase().includes(q); });
    if (m.length) { dd.innerHTML = m.slice(0, 8).map(function(x) { return '<div class="search-dropdown-item" onclick="selSearch(\'' + escHtml(x) + '\')">' + escHtml(x) + '</div>'; }).join(''); dd.classList.add('open'); }
    else dd.classList.remove('open');
    renderGrid(q);
  });
  window.selSearch = function(t) { input.value = t; dd.classList.remove('open'); renderGrid(t.toLowerCase()); };
  document.addEventListener('click', function(e) { if (!input.contains(e.target) && !dd.contains(e.target)) dd.classList.remove('open'); });
  renderGrid('');
}

function renderCategoryProducts(cat) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const s = getSettings();
  const sub = document.getElementById('catSubtitle');
  if (sub && s['cat_subtitle_' + cat]) sub.textContent = s['cat_subtitle_' + cat];
  const all = getProducts().filter(function(p) { return p.category === cat; }).sort(function(a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); });
  grid.innerHTML = all.length ? all.map(productCardHTML).join('') : '<div class="no-results"><p>No products yet. Check back soon!</p></div>';
}

// ============================================================
// HOMEPAGE
// ============================================================
function initHomePage() {
  const products = getProducts();
  const s = getSettings();
  const st = document.getElementById('specialSectionTitle');
  const ss = document.getElementById('specialSectionSub');
  if (st && s.special_title) st.textContent = s.special_title;
  if (ss && s.special_subtitle) ss.textContent = s.special_subtitle;
  const bw = document.getElementById('specialBannerWrap');
  if (bw) {
    if (s.special_banner_enabled && s.special_banner_image) {
      bw.style.display = 'block';
      const bi = bw.querySelector('img');
      if (bi) bi.src = s.special_banner_image;
    } else bw.style.display = 'none';
  }
  const featured = products.filter(function(p) { return p.featured; });
  buildSlider('featuredSlider', featured.length ? featured : products.slice(0, 10));
  const specials = products.filter(function(p) { return p.special; });
  buildSlider('specialSlider', specials);
}

function viewAllProducts() { window.location.href = 'hardware.html'; }

// ============================================================
// HAMBURGER
// ============================================================
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('mobileNav');
  const cl = document.querySelector('.mobile-nav-close');
  btn?.addEventListener('click', function() { nav?.classList.add('open'); });
  cl?.addEventListener('click', function() { nav?.classList.remove('open'); });
}

// ============================================================
// MANAGE PAGE
// ============================================================
const MANAGE_PASS = 'kaushar2026';
let _mImgs = [], _mCat = '', _mEditId = null;

function initManage() {
  if (sessionStorage.getItem('ki_auth') !== '1') {
    document.getElementById('mLoginScreen').style.display = 'flex';
    document.getElementById('mApp').style.display = 'none';
    return;
  }
  showMApp();
}

window.doLogin = function() {
  const passEl = document.getElementById('mPass');
  const errEl = document.getElementById('mLoginErr');
  if (!passEl) return;
  if (passEl.value === MANAGE_PASS) {
    sessionStorage.setItem('ki_auth', '1');
    document.getElementById('mLoginScreen').style.display = 'none';
    showMApp();
  } else {
    if (errEl) errEl.style.display = 'block';
    passEl.value = '';
  }
};

window.doLogout = function() {
  sessionStorage.removeItem('ki_auth');
  document.getElementById('mApp').style.display = 'none';
  document.getElementById('mLoginScreen').style.display = 'flex';
};

function showMApp() {
  document.getElementById('mLoginScreen').style.display = 'none';
  document.getElementById('mApp').style.display = 'block';
  refreshMStats();
  renderMList('all');
  loadMSettings();
  initMForm();
}

function refreshMStats() {
  const p = getProducts();
  const e = function(id) { return document.getElementById(id); };
  if (e('mStat1')) e('mStat1').textContent = p.length;
  if (e('mStat2')) e('mStat2').textContent = p.filter(function(x) { return x.featured; }).length;
  if (e('mStat3')) e('mStat3').textContent = p.filter(function(x) { return x.special; }).length;
}

window.switchMTab = function(tab) {
  const tabs = ['add', 'list', 'specials', 'cats', 'backup'];
  document.querySelectorAll('.m-tab-btn').forEach(function(b, i) {
    b.classList.toggle('active', tabs[i] === tab);
  });
  document.querySelectorAll('.m-tab-panel').forEach(function(p) { p.classList.remove('active'); });
  const panel = document.getElementById('mPanel_' + tab);
  if (panel) panel.classList.add('active');
  if (tab === 'list') renderMList(window._mFilter || 'all');
};

window._mFilter = 'all';
window.filterMList = function(f, btn) {
  window._mFilter = f;
  document.querySelectorAll('.m-filter-pill').forEach(function(p) { p.classList.remove('active'); });
  btn.classList.add('active');
  renderMList(f);
};

const CAT_L = { hardware: 'Hardware', electronics: 'Electronics', outdoor: 'Outdoor & Camp', household: 'Household', vehicle: 'Vehicle Accessories' };

function renderMList(filter) {
  let p = getProducts();
  if (filter === 'featured') p = p.filter(function(x) { return x.featured; });
  else if (filter === 'special') p = p.filter(function(x) { return x.special; });
  else if (filter !== 'all') p = p.filter(function(x) { return x.category === filter; });
  p = p.sort(function(a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); });
  const list = document.getElementById('mProdList');
  if (!list) return;
  if (!p.length) { list.innerHTML = '<div class="admin-empty">No products found.</div>'; return; }
  list.innerHTML = p.map(function(x) {
    return '<div class="admin-product-item" data-id="' + escHtml(x.id) + '" data-cat="' + escHtml(x.category) + '">' +
      '<span class="drag-handle" title="Hold and drag to reorder">⠿</span>' +
      '<img src="' + escHtml(x.image) + '" alt="' + escHtml(x.title) + '" onerror="this.src=\'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=60&q=60\'">' +
      '<div class="admin-product-item-info"><strong>' + escHtml(x.title) + '</strong>' +
      '<div class="admin-product-item-meta">' +
      '<span>' + escHtml(x.price) + '</span>' +
      '<span class="cat-tag">' + escHtml(CAT_L[x.category] || x.category) + '</span>' +
      (x.featured ? '<span class="feat-tag">⭐ Featured</span>' : '') +
      (x.special ? '<span class="special-tag">🔥 Special</span>' : '') +
      '</div></div>' +
      '<div class="admin-product-item-actions">' +
      '<button class="btn-admin-edit" onclick="mEdit(\'' + escHtml(x.id) + '\')">Edit</button>' +
      '<button class="btn-admin-delete" onclick="mDelete(\'' + escHtml(x.id) + '\')">Delete</button>' +
      '</div></div>';
  }).join('');
  initDrag(list);
}

function initDrag(list) {
  let dragEl = null;
  list.querySelectorAll('.drag-handle').forEach(function(h) {
    h.style.cursor = 'grab';
    h.addEventListener('mousedown', function(e) {
      e.preventDefault();
      dragEl = h.closest('.admin-product-item');
      dragEl.classList.add('dragging');
      function mm(ev) {
        const items = [...list.querySelectorAll('.admin-product-item:not(.dragging)')];
        let near = null, d = 9999;
        items.forEach(function(it) {
          const r = it.getBoundingClientRect();
          const dist = Math.abs(r.top + r.height / 2 - ev.clientY);
          if (dist < d) { d = dist; near = it; }
        });
        if (near) { const r = near.getBoundingClientRect(); if (ev.clientY < r.top + r.height / 2) list.insertBefore(dragEl, near); else list.insertBefore(dragEl, near.nextSibling); }
      }
      function mu() {
        if (dragEl) { dragEl.classList.remove('dragging'); saveDrag(list); dragEl = null; }
        document.removeEventListener('mousemove', mm);
        document.removeEventListener('mouseup', mu);
      }
      document.addEventListener('mousemove', mm);
      document.addEventListener('mouseup', mu);
    });
    h.addEventListener('touchstart', function(e) {
      dragEl = h.closest('.admin-product-item');
      dragEl.classList.add('dragging');
      e.stopPropagation();
    }, { passive: true });
    h.addEventListener('touchend', function() {
      if (dragEl) { dragEl.classList.remove('dragging'); saveDrag(list); dragEl = null; }
    }, { passive: true });
  });
  list.addEventListener('touchmove', function(e) {
    if (!dragEl) return;
    const t = e.touches[0];
    const items = [...list.querySelectorAll('.admin-product-item:not(.dragging)')];
    let near = null, d = 9999;
    items.forEach(function(it) {
      const r = it.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - t.clientY);
      if (dist < d) { d = dist; near = it; }
    });
    if (near) { const r = near.getBoundingClientRect(); if (t.clientY < r.top + r.height / 2) list.insertBefore(dragEl, near); else list.insertBefore(dragEl, near.nextSibling); }
  }, { passive: true });
}

function saveDrag(list) {
  const ids = [...list.querySelectorAll('.admin-product-item')].map(function(e) { return e.dataset.id; });
  const p = getProducts();
  ids.forEach(function(id, i) { const x = p.find(function(x) { return x.id === id; }); if (x) x.sortOrder = i; });
  saveProducts(p);
  showToast('Order saved', 'success');
}

window.mEdit = function(id) {
  const p = getProducts().find(function(x) { return x.id === id; });
  if (!p) return;
  window.switchMTab('add');
  _mEditId = id; _mCat = p.category;
  document.getElementById('mTitle').value = p.title;
  document.getElementById('mDesc').value = p.desc;
  document.getElementById('mPrice').value = p.price.replace('P', '');
  document.getElementById('mOrigPrice').value = p.originalPrice ? p.originalPrice.replace('P', '') : '';
  document.getElementById('mFeatured').checked = !!p.featured;
  document.getElementById('mSpecial').checked = !!p.special;
  document.querySelectorAll('.m-cat-pill').forEach(function(pill) { pill.classList.toggle('selected', pill.dataset.cat === p.category); });
  _mImgs = p.images ? [...p.images] : (p.image ? [p.image] : []);
  renderMPrev();
  document.getElementById('mFormHead').textContent = 'Edit Product';
  document.getElementById('mCancelEdit').style.display = 'inline-flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.mDelete = function(id) {
  if (!confirm('Delete this product? Cannot be undone.')) return;
  saveProducts(getProducts().filter(function(p) { return p.id !== id; }));
  renderMList(window._mFilter || 'all');
  refreshMStats();
  showToast('Product deleted', 'error');
};

// ── FIX: initMForm uses a flag on the elements themselves so listeners
//    are only ever attached once, no matter how many times it is called.
function initMForm() {
  const zone = document.getElementById('mUploadZone');
  const inp = document.getElementById('mImgInput');

  // Guard: only attach listeners once per element lifetime
  if (zone && !zone._kiListened) {
    zone._kiListened = true;
    zone.addEventListener('click', function(e) {
      // Don't re-open picker when the click came FROM the input itself
      if (e.target === inp) return;
      inp && inp.click();
    });
    zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', function() { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', function(e) { e.preventDefault(); zone.classList.remove('drag-over'); addMFiles(Array.from(e.dataTransfer.files)); });
  }

  if (inp && !inp._kiListened) {
    inp._kiListened = true;
    // Stop input click from bubbling to zone (prevents re-opening picker after selection)
    inp.addEventListener('click', function(e) { e.stopPropagation(); });
    inp.addEventListener('change', function(e) { addMFiles(Array.from(e.target.files)); e.target.value = ''; });
  }

  document.querySelectorAll('.m-cat-pill').forEach(function(pill) {
    if (pill._kiListened) return;
    pill._kiListened = true;
    pill.addEventListener('click', function() {
      _mCat = pill.dataset.cat;
      document.querySelectorAll('.m-cat-pill').forEach(function(p) { p.classList.remove('selected'); });
      pill.classList.add('selected');
    });
  });

  ['mPrice', 'mOrigPrice'].forEach(function(id) {
    const el = document.getElementById(id);
    if (!el || el._kiListened) return;
    el._kiListened = true;
    el.addEventListener('input', function() {
      const pos = el.selectionStart;
      const cleaned = el.value.replace(/[^0-9.,]/g, '');
      if (el.value !== cleaned) { el.value = cleaned; el.setSelectionRange(pos, pos); }
    });
    el.addEventListener('blur', function() {
      if (!el.value.trim()) return;
      el.value = formatPrice(el.value).replace('P', '');
    });
  });
}

function addMFiles(files) {
  const rem = 8 - _mImgs.length;
  if (rem <= 0) { showToast('Max 8 images', 'error'); return; }
  files.filter(function(f) { return f.type.startsWith('image/'); }).slice(0, rem).forEach(function(file) {
    const r = new FileReader();
    r.onload = function(e) { _mImgs.push(e.target.result); renderMPrev(); };
    r.readAsDataURL(file);
  });
}

function renderMPrev() {
  const g = document.getElementById('mImgGrid');
  if (!g) return;
  g.innerHTML = _mImgs.map(function(src, i) {
    return '<div class="img-preview-item" draggable="true" data-idx="' + i + '">' +
      '<img src="' + escHtml(src) + '" alt="Preview" draggable="false">' +
      '<button class="img-preview-remove" onclick="event.stopPropagation();removeMImg(' + i + ')">×</button>' +
      (i === 0 ? '<span class="img-preview-badge">Main</span>' : '') +
      '</div>';
  }).join('');
  initImgDrag(g);
}

function initImgDrag(grid) {
  let dragSrc = null;
  grid.querySelectorAll('.img-preview-item').forEach(function(item) {
    item.addEventListener('dragstart', function(e) { dragSrc = item; item.classList.add('img-dragging'); e.dataTransfer.effectAllowed = 'move'; });
    item.addEventListener('dragend', function() { item.classList.remove('img-dragging'); dragSrc = null; saveImgOrder(grid); });
    item.addEventListener('dragover', function(e) {
      e.preventDefault(); e.dataTransfer.dropEffect = 'move';
      if (dragSrc && dragSrc !== item) {
        const r = item.getBoundingClientRect();
        if (e.clientX < r.left + r.width / 2) grid.insertBefore(dragSrc, item);
        else grid.insertBefore(dragSrc, item.nextSibling);
      }
    });
  });
  let touchDragEl = null;
  grid.querySelectorAll('.img-preview-item').forEach(function(item) {
    item.addEventListener('touchstart', function(e) { if (e.target.classList.contains('img-preview-remove')) return; touchDragEl = item; item.classList.add('img-dragging'); }, { passive: true });
    item.addEventListener('touchend', function() { if (touchDragEl) { touchDragEl.classList.remove('img-dragging'); touchDragEl = null; saveImgOrder(grid); } }, { passive: true });
  });
  grid.addEventListener('touchmove', function(e) {
    if (!touchDragEl) return;
    e.preventDefault();
    const t = e.touches[0];
    const items = [...grid.querySelectorAll('.img-preview-item:not(.img-dragging)')];
    let near = null, dist = 9999;
    items.forEach(function(it) { const r = it.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - t.clientX); if (d < dist) { dist = d; near = it; } });
    if (near) { const r = near.getBoundingClientRect(); if (t.clientX < r.left + r.width / 2) grid.insertBefore(touchDragEl, near); else grid.insertBefore(touchDragEl, near.nextSibling); }
  }, { passive: false });
}

function saveImgOrder(grid) {
  const items = [...grid.querySelectorAll('.img-preview-item')];
  _mImgs = items.map(function(item) { return item.querySelector('img').src; });
  renderMPrev();
}
window.removeMImg = function(i) { _mImgs.splice(i, 1); renderMPrev(); };

window.submitMProduct = function() {
  const title = document.getElementById('mTitle')?.value.trim();
  const desc = document.getElementById('mDesc')?.value.trim();
  const priceRaw = document.getElementById('mPrice')?.value.trim();
  const origRaw = document.getElementById('mOrigPrice')?.value.trim();
  const feat = document.getElementById('mFeatured')?.checked || false;
  const spec = document.getElementById('mSpecial')?.checked || false;
  if (!title) { showToast('Enter a title', 'error'); return; }
  if (!desc) { showToast('Enter a description', 'error'); return; }
  if (!priceRaw) { showToast('Enter a price', 'error'); return; }
  if (!_mCat) { showToast('Select a category', 'error'); return; }
  const price = formatPrice(priceRaw);
  const origPrice = origRaw ? formatPrice(origRaw) : null;
  const fb = 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80';
  const imgs = _mImgs.length ? _mImgs : [fb];
  const products = getProducts();
  if (_mEditId) {
    const idx = products.findIndex(function(p) { return p.id === _mEditId; });
    if (idx !== -1) products[idx] = { ...products[idx], title, desc, price, originalPrice: origPrice, category: _mCat, featured: feat, special: spec, image: imgs[0], images: imgs };
    showToast('✓ Product updated!', 'success');
  } else {
    const so = products.filter(function(p) { return p.category === _mCat; }).length;
    products.push({ id: _mCat.slice(0, 2) + Date.now(), category: _mCat, title, desc, price, originalPrice: origPrice, featured: feat, special: spec, image: imgs[0], images: imgs, sortOrder: so });
    showToast('✓ Product added!', 'success');
  }
  saveProducts(products);
  clearMForm();
  refreshMStats();
};

function clearMForm() {
  ['mTitle', 'mDesc', 'mPrice', 'mOrigPrice'].forEach(function(id) { const e = document.getElementById(id); if (e) e.value = ''; });
  const f = document.getElementById('mFeatured'), s = document.getElementById('mSpecial');
  if (f) f.checked = false; if (s) s.checked = false;
  _mCat = ''; _mImgs = []; _mEditId = null;
  document.querySelectorAll('.m-cat-pill').forEach(function(p) { p.classList.remove('selected'); });
  renderMPrev();
  const h = document.getElementById('mFormHead'), c = document.getElementById('mCancelEdit');
  if (h) h.textContent = 'Add New Product'; if (c) c.style.display = 'none';
}
window.clearMForm = clearMForm;

function loadMSettings() {
  const s = getSettings();
  const e = function(id) { return document.getElementById(id); };
  if (e('mSpecTitle')) e('mSpecTitle').value = s.special_title || 'On Special';
  if (e('mSpecSub')) e('mSpecSub').value = s.special_subtitle || 'Selected products at reduced prices — while stock lasts.';
  if (e('mBannerOn')) e('mBannerOn').checked = !!s.special_banner_enabled;
  window.toggleMBanner();
  ['hardware', 'electronics', 'outdoor', 'household', 'vehicle'].forEach(function(cat) {
    const inp = e('mCSub_' + cat);
    if (inp && s['cat_subtitle_' + cat]) inp.value = s['cat_subtitle_' + cat];
  });
  if (s.special_banner_image) { const pr = e('mBannerPrev'); if (pr) { pr.src = s.special_banner_image; pr.style.display = 'block'; } }
}

window.saveMSettings = function() {
  const e = function(id) { return document.getElementById(id); };
  const s = getSettings();
  s.special_title = e('mSpecTitle')?.value.trim() || 'On Special';
  s.special_subtitle = e('mSpecSub')?.value.trim() || 'Selected products at reduced prices — while stock lasts.';
  s.special_banner_enabled = e('mBannerOn')?.checked || false;
  ['hardware', 'electronics', 'outdoor', 'household', 'vehicle'].forEach(function(cat) {
    const v = e('mCSub_' + cat)?.value.trim();
    if (v) s['cat_subtitle_' + cat] = v;
  });
  saveSettings(s);
  showToast('Settings saved!', 'success');
};

window.toggleMBanner = function() {
  const on = document.getElementById('mBannerOn')?.checked;
  const w = document.getElementById('mBannerImgWrap');
  if (w) w.style.display = on ? 'block' : 'none';
};

window.handleMBannerUpload = function(inp) {
  const file = inp.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = function(e) {
    const s = getSettings(); s.special_banner_image = e.target.result; saveSettings(s);
    const pr = document.getElementById('mBannerPrev');
    if (pr) { pr.src = e.target.result; pr.style.display = 'block'; }
    showToast('Banner image saved!', 'success');
  };
  r.readAsDataURL(file);
};

// ============================================================
// BACKUP & RESTORE
// ============================================================
window.doBackupDownload = function() {
  var products = getProducts();
  if (!products.length) { showToast('No products to back up', 'error'); return; }
  var payload = JSON.stringify({ version: 1, date: new Date().toISOString(), products: products }, null, 2);
  var blob = new Blob([payload], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'kaushar-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Backup downloaded! Keep it safe.', 'success');
};

window.doBackupRestore = function(input) {
  var file = input.files[0];
  if (!file) return;
  var status = document.getElementById('backupRestoreStatus');
  if (status) status.textContent = 'Reading file...';
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var parsed = JSON.parse(e.target.result);
      var products = parsed.products || (Array.isArray(parsed) ? parsed : null);
      if (!products || !products.length) throw new Error('No products found');
      _cachedProducts = products;
      saveProducts(products);
      if (status) status.textContent = '✓ ' + products.length + ' products restored!';
      showToast('✓ ' + products.length + ' products restored!', 'success');
      refreshMStats();
      renderMList('all');
      input.value = '';
    } catch(err) {
      if (status) status.textContent = '✗ Invalid backup file.';
      showToast('Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
};

window.doRestoreDefaults = function() {
  if (!confirm('Replace all products with demo defaults? This cannot be undone.')) return;
  _cachedProducts = DEFAULT_PRODUCTS;
  saveProducts(DEFAULT_PRODUCTS);
  showToast('Default products restored', 'success');
  refreshMStats();
  renderMList('all');
};

// ============================================================
// SUPABASE — load products on startup
// ============================================================
function loadProductsFromSupabase() {
  _sb.from('products').select('data').limit(1).then(function(res) {
    if (res.error) {
      console.warn('Supabase load failed:', res.error);
      if (!_cachedProducts || !_cachedProducts.length) {
        var local = null;
        try { local = JSON.parse(localStorage.getItem('ki_products') || 'null'); } catch(e) {}
        _cachedProducts = (local && local.length) ? local : DEFAULT_PRODUCTS;
      }
      refreshCurrentPage();
      return;
    }
    if (res.data && res.data.length > 0 && res.data[0].data) {
      try {
        var products = JSON.parse(res.data[0].data);
        if (products && products.length > 0) {
          _cachedProducts = products;
          localStorage.setItem('ki_products', JSON.stringify(products));
          refreshCurrentPage();
          return;
        }
      } catch(e) {}
    }
    var local = null;
    try { local = JSON.parse(localStorage.getItem('ki_products') || 'null'); } catch(e) {}
    _cachedProducts = (local && local.length) ? local : DEFAULT_PRODUCTS;
    saveProducts(_cachedProducts);
    refreshCurrentPage();
  });
}

function refreshCurrentPage() {
  var page = document.body ? document.body.dataset.page : null;
  if (page === 'home') initHomePage();
  else if (page === 'hardware') { renderCategoryProducts('hardware'); initCategorySearch('hardware'); }
  else if (page === 'electronics') { renderCategoryProducts('electronics'); initCategorySearch('electronics'); }
  else if (page === 'outdoor') { renderCategoryProducts('outdoor'); initCategorySearch('outdoor'); }
  else if (page === 'household') { renderCategoryProducts('household'); initCategorySearch('household'); }
  else if (page === 'vehicle') { renderCategoryProducts('vehicle'); initCategorySearch('vehicle'); }
  else if (page === 'manage') { if (typeof refreshMStats === 'function') { refreshMStats(); renderMList(window._mFilter || 'all'); } }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  updateCartUI();
  initHamburger();
  initHeroSlider();

  loadProductsFromSupabase();

  const page = document.body.dataset.page;
  if (page === 'manage') {
    initManage();
    document.getElementById('mPass')?.addEventListener('keydown', function(e) { if (e.key === 'Enter') doLogin(); });
  }

  document.querySelectorAll('.cart-btn').forEach(function(b) { b.addEventListener('click', openCart); });
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('inquireAllBtn')?.addEventListener('click', inquireAll);
});
