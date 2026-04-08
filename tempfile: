/* ============================================================
   KAUSHAR INVESTMENT — connect.js
   Bridges the Supabase products table (written by manage.js)
   to the main.js rendering system (reads window.KI_PRODUCTS).
   Drop this file in js/ and add ONE script tag to each HTML page.
   Zero changes needed to main.js or manage.js.
   ============================================================ */

(function() {
  var SUPA_URL = 'https://rcssxrhxxvacrhvqkgdv.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3N4cmh4eHZhY3JodnFrZ2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTQwODgsImV4cCI6MjA5MDg5MDA4OH0.TPEdtDJZa5IVcl_Hy0USI1uD_IC3BFN3zOzHV4RgVps';

  // ── Convert a Supabase row into the shape main.js expects ──
  function toKIProduct(row) {
    var imgs = Array.isArray(row.images) ? row.images : [];
    var mainImg = imgs[0] || '';
    var price = row.price ? Number(row.price) : 0;
    var origPrice = row.original_price ? Number(row.original_price) : null;
    return {
      id: row.id,
      category: row.category,
      title: row.title || '',
      desc: row.description || '',
      price: price,
      origPrice: origPrice,
      images: imgs,
      image: mainImg,
      featured: !!row.featured,
      special: !!row.special,
      sortOrder: row.sort_order || 0
    };
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
          // Nothing in Supabase yet — leave window.KI_PRODUCTS as-is
          // main.js will fall back to its own DEFAULT_PRODUCTS
          console.info('connect.js: No products in Supabase yet, using defaults.');
          triggerRender();
          return;
        }

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
    // Special section title & subtitle
    var st = document.getElementById('specialSectionTitle');
    var ss = document.getElementById('specialSectionSub');
    if (st && s['special_title']) st.textContent = s['special_title'];
    if (ss && s['special_subtitle']) ss.textContent = s['special_subtitle'];

    // Banner
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

    // Category subtitles
    var sub = document.getElementById('catSubtitle');
    var page = document.body ? document.body.dataset.page : null;
    if (sub && page && s['cat_subtitle_' + page]) {
      sub.textContent = s['cat_subtitle_' + page];
    }
  }

  // ── Tell main.js to re-render with the new data ──
  function triggerRender() {
    // main.js defines these functions globally — call whichever fits the current page
    var page = document.body ? document.body.dataset.page : null;
    if (!page) return;

    try {
      if (page === 'home' && typeof initHomePage === 'function') {
        initHomePage();
      } else if (page === 'hardware' && typeof renderCategoryProducts === 'function') {
        renderCategoryProducts('hardware');
        if (typeof initCategorySearch === 'function') initCategorySearch('hardware');
      } else if (page === 'electronics' && typeof renderCategoryProducts === 'function') {
        renderCategoryProducts('electronics');
        if (typeof initCategorySearch === 'function') initCategorySearch('electronics');
      } else if (page === 'outdoor' && typeof renderCategoryProducts === 'function') {
        renderCategoryProducts('outdoor');
        if (typeof initCategorySearch === 'function') initCategorySearch('outdoor');
      } else if (page === 'household' && typeof renderCategoryProducts === 'function') {
        renderCategoryProducts('household');
        if (typeof initCategorySearch === 'function') initCategorySearch('household');
      } else if (page === 'vehicle' && typeof renderCategoryProducts === 'function') {
        renderCategoryProducts('vehicle');
        if (typeof initCategorySearch === 'function') initCategorySearch('vehicle');
      }
    } catch(e) {
      console.warn('connect.js triggerRender error:', e);
    }
  }

  // ── Wait for DOM + supabase SDK, then fetch ──
  function init() {
    if (typeof supabase === 'undefined' || typeof supabase.createClient !== 'function') {
      // SDK not ready yet — retry shortly
      setTimeout(init, 80);
      return;
    }
    loadAndInject();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
