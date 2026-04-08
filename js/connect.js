/* ============================================================
   KAUSHAR INVESTMENT — connect.js  (v2)
   Bridges the Supabase products table (written by manage.js)
   to the main.js rendering system (reads window.KI_PRODUCTS).

   Fixes in v2:
   - Featured / Special ONLY show if that toggle is actually ON
     (strict boolean — no false positives from default products)
   - Price auto-adds .00 only when no decimal is typed;
     custom decimals like .95 or .80 are preserved exactly
   - Clears slider tracks before re-rendering so stale default
     products never bleed through alongside real ones
   ============================================================ */

(function() {
  var SUPA_URL = 'https://rcssxrhxxvacrhvqkgdv.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3N4cmh4eHZhY3JodnFrZ2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTQwODgsImV4cCI6MjA5MDg5MDA4OH0.TPEdtDJZa5IVcl_Hy0USI1uD_IC3BFN3zOzHV4RgVps';

  // ── Format a numeric price the way main.js expects ──
  // Keeps custom decimals (.95, .80 etc) — only adds .00 when whole number
  function fmtPrice(num) {
    if (num === null || num === undefined) return null;
    var n = Number(num);
    if (isNaN(n)) return null;
    // If the number already has meaningful cents, keep them; else .00
    var str = n.toFixed(2);          // e.g. "850.00" or "850.95"
    var parts = str.split('.');
    // Add thousand-separator
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return 'P' + parts[0] + '.' + parts[1];
  }

  // ── Convert a Supabase row into the shape main.js expects ──
  function toKIProduct(row) {
    var imgs = Array.isArray(row.images) ? row.images : [];
    var mainImg = imgs[0] || '';

    // Price — preserve exact decimal, only auto-add .00 for whole numbers
    var priceFormatted  = fmtPrice(row.price);
    var origFormatted   = row.original_price ? fmtPrice(row.original_price) : null;

    // Featured / Special — STRICT: only true when the DB column is literally true
    // This prevents default/demo products (featured:true) bleeding into real data
    var isFeatured = row.featured === true || row.featured === 'true';
    var isSpecial  = row.special  === true || row.special  === 'true';

    return {
      id:            row.id,
      category:      row.category,
      title:         row.title || '',
      desc:          row.description || '',
      // Pass pre-formatted strings so main.js productCardHTML() shows them directly
      price:         priceFormatted,
      originalPrice: origFormatted,
      // Also pass raw number so main.js getProducts() mapper doesn't re-process
      origPrice:     row.original_price ? Number(row.original_price) : null,
      images:        imgs,
      image:         mainImg,
      featured:      isFeatured,
      special:       isSpecial,
      sortOrder:     row.sort_order || 0
    };
  }

  // ── Clear slider tracks so old default cards don't show alongside real ones ──
  function clearSliderTracks() {
    ['featuredSlider', 'specialSlider'].forEach(function(id) {
      var wrap = document.getElementById(id);
      if (!wrap) return;
      var track = wrap.querySelector('.product-slider-track');
      if (track) track.innerHTML = '';
    });
    // Also clear category product grid if on a category page
    var grid = document.getElementById('productsGrid');
    if (grid) grid.innerHTML = '';
  }

  // ── Fetch products and inject into window.KI_PRODUCTS ──
  function loadAndInject() {
    var client = supabase.createClient(SUPA_URL, SUPA_KEY);

    client
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(function(res) {
        if (res.error || !res.data || res.data.length === 0) {
          // Nothing in Supabase yet — default products will already be rendered by main.js
          console.info('connect.js: No products in Supabase yet, using defaults.');
          return;
        }

        // ── Clear stale default content before injecting real products ──
        clearSliderTracks();

        // ── Inject into window.KI_PRODUCTS so main.js uses these ──
        window.KI_PRODUCTS = res.data.map(toKIProduct);

        // ── Also load settings and apply them ──
        client
          .from('settings')
          .select('*')
          .then(function(sRes) {
            if (!sRes.error && sRes.data && sRes.data.length > 0) {
              var settings = {};
              sRes.data.forEach(function(row) { settings[row.key] = row.value; });
              applySettings(settings);
            }
            triggerRender();
          });
      });
  }

  // ── Apply settings from Supabase to the page ──
  function applySettings(s) {
    var st = document.getElementById('specialSectionTitle');
    var ss = document.getElementById('specialSectionSub');
    if (st && s['special_title']) st.textContent = s['special_title'];
    if (ss && s['special_subtitle']) ss.textContent = s['special_subtitle'];

    var bw = document.getElementById('specialBannerWrap');
    if (bw) {
      if (s['special_banner_enabled'] === 'true' && s['special_banner_image']) {
        bw.style.display = 'block';
        var bi = bw.querySelector('img');
        if (bi) bi.src = s['special_banner_image'];
      } else {
        bw.style.display = 'none';
      }
    }

    var sub = document.getElementById('catSubtitle');
    var page = document.body ? document.body.dataset.page : null;
    if (sub && page && s['cat_subtitle_' + page]) {
      sub.textContent = s['cat_subtitle_' + page];
    }
  }

  // ── Tell main.js to re-render now that KI_PRODUCTS is populated ──
  function triggerRender() {
    var page = document.body ? document.body.dataset.page : null;
    if (!page) return;
    try {
      if (page === 'home' && typeof initHomePage === 'function') {
        initHomePage();
      } else if (typeof renderCategoryProducts === 'function') {
        var cats = ['hardware','electronics','outdoor','household','vehicle'];
        if (cats.indexOf(page) !== -1) {
          renderCategoryProducts(page);
          if (typeof initCategorySearch === 'function') initCategorySearch(page);
        }
      }
    } catch(e) {
      console.warn('connect.js triggerRender error:', e);
    }
  }

  // ── Wait for DOM + Supabase SDK to both be ready, then fetch ──
  function init() {
    if (typeof supabase === 'undefined' || typeof supabase.createClient !== 'function') {
      setTimeout(init, 80);
      return;
    }
    loadAndInject();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (script loaded at end of body)
    init();
  }

})();
