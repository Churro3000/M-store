/* ============================================================
   KAUSHAR INVESTMENT — manage.js
   Standalone CMS. No dependency on main.js or style.css logic.
   Connects to Supabase for all product and settings storage.
   ============================================================ */

// ── Supabase Init ──
const SUPA_URL = 'https://rcssxrhxxvacrhvqkgdv.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3N4cmh4eHZhY3JodnFrZ2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTQwODgsImV4cCI6MjA5MDg5MDA4OH0.TPEdtDJZa5IVcl_Hy0USI1uD_IC3BFN3zOzHV4RgVps';
const db = supabase.createClient(SUPA_URL, SUPA_KEY);

// ── Constants ──
const MANAGE_PASS = 'kaushar2026';
const STORAGE_BUCKET = 'product-images'; // Supabase storage bucket name

// ── State ──
let allProducts = [];
let currentImages = []; // { url, isNew, file? }
let selectedCategory = '';
let editingId = null;
let currentFilter = 'all';

// ── Default products for emergency reset ──
const DEFAULT_PRODUCTS = [
  { title: 'Heavy Duty Angle Grinder 850W', description: 'Professional 850W angle grinder with adjustable guard, ergonomic handle, and high-performance motor suitable for cutting, grinding, and polishing metal and masonry surfaces.', price: 850.00, original_price: null, category: 'hardware', featured: false, special: false, images: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80'], sort_order: 0 },
  { title: 'Power Drill Set 13-Piece', description: 'Complete power drill set including 13 assorted drill bits, carry case, and a variable-speed 650W drill driver for both wood and masonry.', price: 620.00, original_price: null, category: 'hardware', featured: true, special: false, images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80'], sort_order: 1 },
  { title: 'LED Smart TV 43-Inch', description: '43-inch Full HD LED Smart TV with built-in WiFi, HDMI x3, USB x2, Netflix & YouTube apps pre-installed, and slim bezel design.', price: 3800.00, original_price: 4500.00, category: 'electronics', featured: true, special: true, images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834d?w=600&q=80'], sort_order: 0 },
  { title: 'Digital Air Fryer 5L', description: '5-litre digital air fryer with 8 preset cooking modes, touch control panel, 200°C max temp, and 60-minute timer. Uses 80% less oil.', price: 1280.00, original_price: 1600.00, category: 'household', featured: true, special: true, images: ['https://images.unsplash.com/photo-1648146027039-6b6ec6feaeef?w=600&q=80'], sort_order: 0 },
  { title: '4-Person Camping Tent', description: 'Spacious 4-person waterproof dome tent with double-layer design, fibreglass poles, carry bag, and UV protection coating for all-weather camping.', price: 1290.00, original_price: null, category: 'outdoor', featured: false, special: false, images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80'], sort_order: 0 },
  { title: 'Car Jump Starter 2000A', description: '2000A peak portable car jump starter with 20,000mAh power bank, LED flashlight, USB-C charging, and smart clamps for vehicles up to 8.0L.', price: 880.00, original_price: null, category: 'vehicle', featured: false, special: false, images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80'], sort_order: 0 }
];

// ============================================================
// UTILITIES
// ============================================================
function toast(msg, type = 'success') {
  const t = document.getElementById('mgToast');
  const icon = type === 'success'
    ? `<svg class="t-icon" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg class="t-icon" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  t.className = `mg-toast ${type}`;
  t.innerHTML = icon + `<span>${msg}</span>`;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3000);
}

function showLoading(msg = 'Saving…') {
  document.getElementById('loadingText').textContent = msg;
  document.getElementById('mgLoading').classList.add('show');
}

function hideLoading() {
  document.getElementById('mgLoading').classList.remove('show');
}

function formatPrice(raw) {
  if (!raw && raw !== 0) return null;
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? null : n;
}

function displayPrice(num) {
  if (num === null || num === undefined) return '';
  return 'P' + Number(num).toFixed(2);
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// AUTH
// ============================================================
function checkAuth() {
  return sessionStorage.getItem('ki_manage_auth') === '1';
}

function login() {
  const pw = document.getElementById('loginPass').value;
  const err = document.getElementById('loginErr');
  if (pw === MANAGE_PASS) {
    sessionStorage.setItem('ki_manage_auth', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('manageApp').style.display = 'block';
    initApp();
  } else {
    err.style.display = 'block';
    document.getElementById('loginPass').value = '';
  }
}

function logout() {
  sessionStorage.removeItem('ki_manage_auth');
  document.getElementById('manageApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginPass').value = '';
}

// ============================================================
// SUPABASE — PRODUCTS
// ============================================================
async function loadProducts() {
  const { data, error } = await db
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) { console.error('Load error:', error); return []; }
  return data || [];
}

async function saveProduct(product) {
  if (product.id) {
    const { id, ...rest } = product;
    const { error } = await db.from('products').update(rest).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await db.from('products').insert(product);
    if (error) throw error;
  }
}

async function deleteProduct(id) {
  const { error } = await db.from('products').delete().eq('id', id);
  if (error) throw error;
}

async function updateSortOrders(orderedIds) {
  const updates = orderedIds.map((id, index) =>
    db.from('products').update({ sort_order: index }).eq('id', id)
  );
  await Promise.all(updates);
}

// ============================================================
// SUPABASE — SETTINGS
// ============================================================
async function loadSettings() {
  const { data } = await db.from('settings').select('*');
  const settings = {};
  if (data) data.forEach(row => { settings[row.key] = row.value; });
  return settings;
}

async function saveSetting(key, value) {
  const { data } = await db.from('settings').select('id').eq('key', key).single();
  if (data) {
    await db.from('settings').update({ value }).eq('key', key);
  } else {
    await db.from('settings').insert({ key, value });
  }
}

// ============================================================
// SUPABASE — IMAGE UPLOAD
// ============================================================
async function uploadImageToSupabase(file) {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await db.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: urlData } = db.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return urlData.publicUrl;
}

// ============================================================
// STATS
// ============================================================
function refreshStats() {
  document.getElementById('statTotal').textContent = allProducts.length;
  document.getElementById('statFeatured').textContent = allProducts.filter(p => p.featured).length;
  document.getElementById('statSpecial').textContent = allProducts.filter(p => p.special).length;
}

// ============================================================
// IMAGE HANDLING
// ============================================================
function renderImgGrid() {
  const grid = document.getElementById('imgGrid');
  grid.innerHTML = '';
  currentImages.forEach((img, i) => {
    const div = document.createElement('div');
    div.className = 'mg-img-item';
    div.draggable = true;
    div.dataset.index = i;
    div.innerHTML = `
      <img src="${esc(img.url)}" alt="Product image ${i+1}">
      <button class="mg-img-remove" data-i="${i}" title="Remove">×</button>
      ${i === 0 ? '<span class="mg-img-badge">MAIN</span>' : ''}
    `;
    grid.appendChild(div);
  });

  // Remove buttons
  grid.querySelectorAll('.mg-img-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const i = parseInt(btn.dataset.i);
      currentImages.splice(i, 1);
      renderImgGrid();
    });
  });

  // Drag-to-reorder
  initImgDrag(grid);
}

function initImgDrag(grid) {
  let dragSrc = null;
  grid.querySelectorAll('.mg-img-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      dragSrc = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      dragSrc = null;
      saveImgOrder(grid);
    });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      if (dragSrc && dragSrc !== item) {
        const r = item.getBoundingClientRect();
        if (e.clientX < r.left + r.width / 2) grid.insertBefore(dragSrc, item);
        else grid.insertBefore(dragSrc, item.nextSibling);
      }
    });
  });

  // Touch drag
  let touchDrag = null;
  grid.querySelectorAll('.mg-img-item').forEach(item => {
    item.addEventListener('touchstart', e => {
      if (e.target.classList.contains('mg-img-remove')) return;
      touchDrag = item;
      item.classList.add('dragging');
    }, { passive: true });
    item.addEventListener('touchend', () => {
      if (touchDrag) { touchDrag.classList.remove('dragging'); touchDrag = null; saveImgOrder(grid); }
    }, { passive: true });
  });
  grid.addEventListener('touchmove', e => {
    if (!touchDrag) return;
    e.preventDefault();
    const t = e.touches[0];
    const items = [...grid.querySelectorAll('.mg-img-item:not(.dragging)')];
    let near = null, dist = 9999;
    items.forEach(it => {
      const r = it.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - t.clientX);
      if (d < dist) { dist = d; near = it; }
    });
    if (near) {
      const r = near.getBoundingClientRect();
      if (t.clientX < r.left + r.width / 2) grid.insertBefore(touchDrag, near);
      else grid.insertBefore(touchDrag, near.nextSibling);
    }
  }, { passive: false });
}

function saveImgOrder(grid) {
  const items = [...grid.querySelectorAll('.mg-img-item')];
  const newOrder = items.map(item => {
    const idx = parseInt(item.dataset.index);
    return currentImages[idx];
  }).filter(Boolean);
  currentImages = newOrder;
  renderImgGrid();
}

async function handleImageFiles(files) {
  const bar = document.getElementById('uploadingBar');
  const txt = document.getElementById('uploadingText');
  bar.style.display = 'flex';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;
    txt.textContent = `Uploading image ${i + 1} of ${files.length}…`;
    try {
      const url = await uploadImageToSupabase(file);
      currentImages.push({ url, isNew: true });
      renderImgGrid();
    } catch (err) {
      console.error('Upload error:', err);
      // Fallback: use local blob URL if storage fails
      const localUrl = URL.createObjectURL(file);
      currentImages.push({ url: localUrl, isNew: false, file });
      renderImgGrid();
      toast('Image stored locally (check storage bucket settings)', 'error');
    }
  }

  bar.style.display = 'none';
}

// ============================================================
// FORM
// ============================================================
function clearForm() {
  document.getElementById('editingId').value = '';
  document.getElementById('fieldTitle').value = '';
  document.getElementById('fieldDesc').value = '';
  document.getElementById('fieldPrice').value = '';
  document.getElementById('fieldOrigPrice').value = '';
  document.getElementById('toggleFeatured').checked = false;
  document.getElementById('toggleSpecial').checked = false;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('selected'));
  selectedCategory = '';
  editingId = null;
  currentImages = [];
  renderImgGrid();
  document.getElementById('formHeading').textContent = 'Add New Product';
  document.getElementById('cancelEditBtn').style.display = 'none';
}

function loadProductIntoForm(product) {
  editingId = product.id;
  document.getElementById('editingId').value = product.id;
  document.getElementById('fieldTitle').value = product.title || '';
  document.getElementById('fieldDesc').value = product.description || '';
  document.getElementById('fieldPrice').value = product.price ? product.price.toString() : '';
  document.getElementById('fieldOrigPrice').value = product.original_price ? product.original_price.toString() : '';
  document.getElementById('toggleFeatured').checked = !!product.featured;
  document.getElementById('toggleSpecial').checked = !!product.special;
  selectedCategory = product.category || '';
  document.querySelectorAll('.cat-pill').forEach(p => {
    p.classList.toggle('selected', p.dataset.cat === product.category);
  });
  currentImages = (product.images || []).map(url => ({ url, isNew: false }));
  renderImgGrid();
  document.getElementById('formHeading').textContent = 'Edit Product';
  document.getElementById('cancelEditBtn').style.display = 'inline-flex';
  switchTab('add');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function submitProduct() {
  const title = document.getElementById('fieldTitle').value.trim();
  const desc = document.getElementById('fieldDesc').value; // preserve line breaks
  const priceRaw = document.getElementById('fieldPrice').value.trim();
  const origRaw = document.getElementById('fieldOrigPrice').value.trim();
  const featured = document.getElementById('toggleFeatured').checked;
  const special = document.getElementById('toggleSpecial').checked;

  if (!title) { toast('Please enter a product title', 'error'); return; }
  if (!desc.trim()) { toast('Please enter a description', 'error'); return; }
  if (!priceRaw) { toast('Please enter a price', 'error'); return; }
  if (!selectedCategory) { toast('Please select a category', 'error'); return; }

  const price = formatPrice(priceRaw);
  if (price === null) { toast('Invalid price format', 'error'); return; }
  const originalPrice = origRaw ? formatPrice(origRaw) : null;

  const images = currentImages.map(img => img.url);
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80');
  }

  const product = {
    title,
    description: desc,
    price,
    original_price: originalPrice,
    category: selectedCategory,
    featured,
    special,
    images,
    sort_order: editingId
      ? (allProducts.find(p => p.id === editingId)?.sort_order ?? 999)
      : allProducts.filter(p => p.category === selectedCategory).length
  };

  if (editingId) product.id = editingId;

  showLoading(editingId ? 'Updating product…' : 'Adding product…');
  try {
    await saveProduct(product);
    allProducts = await loadProducts();
    refreshStats();
    renderProductList();
    clearForm();
    hideLoading();
    toast(editingId ? '✓ Product updated!' : '✓ Product added!');
  } catch (err) {
    hideLoading();
    console.error('Save error:', err);
    toast('Error saving product: ' + (err.message || 'unknown'), 'error');
  }
}

// ============================================================
// PRODUCT LIST
// ============================================================
function renderProductList() {
  const list = document.getElementById('productList');
  let products = [...allProducts];

  if (currentFilter === 'featured') products = products.filter(p => p.featured);
  else if (currentFilter === 'special') products = products.filter(p => p.special);
  else if (currentFilter !== 'all') products = products.filter(p => p.category === currentFilter);

  if (!products.length) {
    list.innerHTML = '<div class="no-products">No products found.</div>';
    return;
  }

  list.innerHTML = products.map(p => {
    const img = (p.images && p.images[0]) ? p.images[0] : 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&q=60';
    const catColors = { hardware: '#a5b4fc', electronics: '#67e8f9', outdoor: '#86efac', household: '#fde68a', vehicle: '#fdba74' };
    const catColor = catColors[p.category] || '#a5b4fc';
    return `
      <div class="prod-item" data-id="${p.id}">
        <span class="prod-drag">⠿</span>
        <img class="prod-thumb" src="${esc(img)}" alt="${esc(p.title)}" onerror="this.src='https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&q=60'">
        <div class="prod-info">
          <div class="prod-title">${esc(p.title)}</div>
          <div class="prod-meta">
            <span class="prod-price">${displayPrice(p.price)}</span>
            <span class="tag tag-cat" style="color:${catColor};background:${catColor}22">${esc(p.category)}</span>
            ${p.featured ? '<span class="tag tag-featured">⭐ Featured</span>' : ''}
            ${p.special ? '<span class="tag tag-special">🔥 SPECIAL</span>' : ''}
          </div>
        </div>
        <div class="prod-actions">
          <button class="btn-edit-outline" data-edit="${p.id}">Edit</button>
          <button class="btn-delete-red" data-del="${p.id}">Delete</button>
        </div>
      </div>`;
  }).join('');

  // Edit/Delete listeners
  list.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = allProducts.find(p => p.id === btn.dataset.edit);
      if (product) loadProductIntoForm(product);
    });
  });
  list.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => confirmDelete(btn.dataset.del));
  });

  initListDrag(list, products);
}

async function confirmDelete(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
  showLoading('Deleting…');
  try {
    await deleteProduct(id);
    allProducts = await loadProducts();
    refreshStats();
    renderProductList();
    hideLoading();
    toast('Product deleted', 'error');
  } catch (err) {
    hideLoading();
    toast('Error deleting: ' + err.message, 'error');
  }
}

function initListDrag(list, products) {
  let dragEl = null;
  list.querySelectorAll('.prod-drag').forEach(handle => {
    handle.addEventListener('mousedown', e => {
      e.preventDefault();
      dragEl = handle.closest('.prod-item');
      dragEl.classList.add('dragging');
      const mm = ev => {
        const items = [...list.querySelectorAll('.prod-item:not(.dragging)')];
        let near = null, d = 9999;
        items.forEach(it => {
          const r = it.getBoundingClientRect();
          const dist = Math.abs(r.top + r.height / 2 - ev.clientY);
          if (dist < d) { d = dist; near = it; }
        });
        if (near) {
          const r = near.getBoundingClientRect();
          if (ev.clientY < r.top + r.height / 2) list.insertBefore(dragEl, near);
          else list.insertBefore(dragEl, near.nextSibling);
        }
      };
      const mu = async () => {
        if (dragEl) {
          dragEl.classList.remove('dragging');
          const newOrder = [...list.querySelectorAll('.prod-item')].map(el => el.dataset.id);
          try { await updateSortOrders(newOrder); allProducts = await loadProducts(); toast('Order saved'); }
          catch (e) { toast('Could not save order', 'error'); }
          dragEl = null;
        }
        document.removeEventListener('mousemove', mm);
        document.removeEventListener('mouseup', mu);
      };
      document.addEventListener('mousemove', mm);
      document.addEventListener('mouseup', mu);
    });
  });
}

// ============================================================
// TABS
// ============================================================
function switchTab(tabId) {
  document.querySelectorAll('.mg-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.mg-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tabId}`));
  if (tabId === 'list') renderProductList();
}

// ============================================================
// SETTINGS — SPECIALS
// ============================================================
async function loadSpecialsSettings(settings) {
  document.getElementById('specTitle').value = settings['special_title'] || 'On Special';
  document.getElementById('specSubtitle').value = settings['special_subtitle'] || 'Selected products at reduced prices — while stock lasts.';
  const bannerOn = settings['special_banner_enabled'] === 'true';
  document.getElementById('bannerEnabled').checked = bannerOn;
  document.getElementById('bannerImgWrap').style.display = bannerOn ? 'block' : 'none';
  if (settings['special_banner_image']) {
    const prev = document.getElementById('bannerPreview');
    prev.src = settings['special_banner_image'];
    prev.style.display = 'block';
  }
  // Specials section visibility toggle
  const sectionEnabled = settings['specials_section_enabled'] !== 'false'; // Default ON
  document.getElementById('specialsSectionEnabled').checked = sectionEnabled;
}

async function saveSpecials() {
  showLoading('Saving…');
  try {
    await saveSetting('special_title', document.getElementById('specTitle').value.trim() || 'On Special');
    await saveSetting('special_subtitle', document.getElementById('specSubtitle').value.trim() || 'Selected products at reduced prices — while stock lasts.');
    await saveSetting('specials_section_enabled', String(document.getElementById('specialsSectionEnabled').checked));
    hideLoading();
    toast('Specials settings saved!');
  } catch (e) {
    hideLoading();
    toast('Error saving: ' + e.message, 'error');
  }
}

async function saveBanner() {
  showLoading('Saving…');
  try {
    const on = document.getElementById('bannerEnabled').checked;
    await saveSetting('special_banner_enabled', String(on));
    hideLoading();
    toast('Banner settings saved!');
  } catch (e) {
    hideLoading();
    toast('Error saving: ' + e.message, 'error');
  }
}

// ============================================================
// SETTINGS — CATEGORIES
// ============================================================
async function loadCatSettings(settings) {
  ['hardware', 'electronics', 'outdoor', 'household', 'vehicle'].forEach(cat => {
    const el = document.getElementById(`catSub_${cat}`);
    if (el && settings[`cat_subtitle_${cat}`]) el.value = settings[`cat_subtitle_${cat}`];
  });
}

async function saveCatSettings() {
  showLoading('Saving…');
  try {
    const cats = ['hardware', 'electronics', 'outdoor', 'household', 'vehicle'];
    for (const cat of cats) {
      const val = document.getElementById(`catSub_${cat}`)?.value.trim();
      if (val) await saveSetting(`cat_subtitle_${cat}`, val);
    }
    hideLoading();
    toast('Category settings saved!');
  } catch (e) {
    hideLoading();
    toast('Error saving: ' + e.message, 'error');
  }
}

// ============================================================
// BACKUP
// ============================================================
function downloadBackup() {
  const data = JSON.stringify(allProducts, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kaushar_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Backup downloaded!');
}

async function restoreFromBackup(file) {
  if (!file || !file.name.endsWith('.json')) { toast('Please select a .json backup file', 'error'); return; }
  const text = await file.text();
  let products;
  try { products = JSON.parse(text); } catch { toast('Invalid backup file', 'error'); return; }
  if (!Array.isArray(products)) { toast('Invalid backup format', 'error'); return; }
  if (!confirm(`Restore ${products.length} products from backup? This will replace all current products.`)) return;
  showLoading('Restoring…');
  try {
    await db.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const clean = products.map(({ id, created_at, ...rest }) => rest);
    if (clean.length) await db.from('products').insert(clean);
    allProducts = await loadProducts();
    refreshStats();
    renderProductList();
    hideLoading();
    toast(`✓ Restored ${allProducts.length} products!`);
  } catch (e) {
    hideLoading();
    toast('Restore failed: ' + e.message, 'error');
  }
}

async function resetDefaults() {
  if (!confirm('⚠️ This will DELETE all current products and replace them with demo products. Are you sure?')) return;
  showLoading('Resetting…');
  try {
    await db.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await db.from('products').insert(DEFAULT_PRODUCTS);
    allProducts = await loadProducts();
    refreshStats();
    renderProductList();
    hideLoading();
    toast('✓ Reset to default products!');
  } catch (e) {
    hideLoading();
    toast('Reset failed: ' + e.message, 'error');
  }
}

// ============================================================
// INIT
// ============================================================
async function initApp() {
  showLoading('Loading products…');
  try {
    [allProducts] = await Promise.all([loadProducts()]);
    const settings = await loadSettings();
    refreshStats();
    renderProductList();
    await loadSpecialsSettings(settings);
    await loadCatSettings(settings);
    hideLoading();
  } catch (e) {
    hideLoading();
    console.error('Init error:', e);
    toast('Error loading data: ' + e.message, 'error');
  }
}

// ============================================================
// EVENT LISTENERS — all set up once on DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ── AUTH ──
  if (checkAuth()) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('manageApp').style.display = 'block';
    initApp();
  }

  document.getElementById('loginBtn').addEventListener('click', login);
  document.getElementById('loginPass').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // ── TABS ──
  document.querySelectorAll('.mg-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // ── FILTER PILLS ──
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderProductList();
    });
  });

  // ── IMAGE UPLOAD ──
  const uploadZone = document.getElementById('uploadZone');
  const imgInput = document.getElementById('imgFileInput');

  uploadZone.addEventListener('click', () => imgInput.click());
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    handleImageFiles(Array.from(e.dataTransfer.files));
  });
  imgInput.addEventListener('change', e => {
    handleImageFiles(Array.from(e.target.files));
    e.target.value = '';
  });

  // ── CATEGORY PILLS ──
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      selectedCategory = pill.dataset.cat;
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
    });
  });

  // ── FORM ACTIONS ──
  document.getElementById('saveProductBtn').addEventListener('click', submitProduct);
  document.getElementById('cancelEditBtn').addEventListener('click', clearForm);
  document.getElementById('clearFormBtn').addEventListener('click', clearForm);

  // ── SPECIALS ──
  document.getElementById('saveSpecialsBtn').addEventListener('click', saveSpecials);
  document.getElementById('saveBannerBtn').addEventListener('click', saveBanner);
  document.getElementById('bannerEnabled').addEventListener('change', function() {
    document.getElementById('bannerImgWrap').style.display = this.checked ? 'block' : 'none';
  });

  const bannerZone = document.getElementById('bannerUploadZone');
  const bannerInput = document.getElementById('bannerFileInput');
  bannerZone.addEventListener('click', () => bannerInput.click());
  bannerInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    showLoading('Uploading banner…');
    try {
      const url = await uploadImageToSupabase(file);
      await saveSetting('special_banner_image', url);
      const prev = document.getElementById('bannerPreview');
      prev.src = url;
      prev.style.display = 'block';
      hideLoading();
      toast('Banner uploaded and saved!');
    } catch (err) {
      hideLoading();
      toast('Banner upload failed: ' + err.message, 'error');
    }
    e.target.value = '';
  });

  // ── CATEGORIES ──
  document.getElementById('saveCatsBtn').addEventListener('click', saveCatSettings);

  // ── BACKUP ──
  document.getElementById('downloadBackupBtn').addEventListener('click', downloadBackup);

  const restoreZone = document.getElementById('restoreZone');
  const restoreInput = document.getElementById('restoreFileInput');
  restoreZone.addEventListener('click', () => restoreInput.click());
  restoreInput.addEventListener('change', e => {
    restoreFromBackup(e.target.files[0]);
    e.target.value = '';
  });

  document.getElementById('resetDefaultsBtn').addEventListener('click', resetDefaults);
});
