/* ============================================================
   KAUSHAR INVESTMENT — specials.js
   Handles the "On Special" section display on homepage
   ============================================================ */

(function() {
  
  // ── Render Special Products Section ──
  function renderSpecialsSection() {
    var specialsSection = document.getElementById('specialsSection');
    if (!specialsSection) return;

    // Get products that are marked as special
    var products = window.KI_PRODUCTS || [];
    var specialProducts = products.filter(function(p) { return p.special === true; });

    // If no special products, hide the entire section
    if (specialProducts.length === 0) {
      specialsSection.style.display = 'none';
      return;
    }

    // Build the HTML
    var html = '';
    
    // Banner (if enabled - will be controlled by connect.js applySettings)
    html += '<div id="specialBannerWrap" style="display:none;">';
    html += '<img src="" alt="Special Offer Banner" style="width:100%;height:auto;display:block;border-radius:12px;margin-bottom:0;">';
    html += '</div>';

    // Section Header
    html += '<div class="special-section-header">';
    html += '<h2 class="special-section-title" id="specialSectionTitle">On Special</h2>';
    html += '<p class="special-section-subtitle" id="specialSectionSub">Selected products at reduced prices — while stock lasts.</p>';
    html += '</div>';

    // Products Slider
    html += '<div class="product-slider" id="specialSlider">';
    html += '<button class="slider-arrow left" aria-label="Previous">';
    html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>';
    html += '</button>';
    html += '<div class="product-slider-viewport">';
    html += '<div class="product-slider-track"></div>';
    html += '</div>';
    html += '<button class="slider-arrow right" aria-label="Next">';
    html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>';
    html += '</button>';
    html += '</div>';

    specialsSection.innerHTML = html;
    specialsSection.style.display = 'block';
  }

  // ── Initialize when called from main.js or connect.js ──
  window.initSpecialsSection = renderSpecialsSection;

  // Auto-init if products are already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (window.KI_PRODUCTS && window.KI_PRODUCTS.length > 0) {
        renderSpecialsSection();
      }
    });
  }

})();
