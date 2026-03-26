// (function () {
//   class GSTManager {
//     constructor() {
//       this.currencySymbol = '$';
//       this.currentState = localStorage.getItem('gstToggleState') === 'true';

//       this._pending = false;
//       this._lastRun = 0;
//       this.THROTTLE_MS = 500;

//       this.init();
//     }

//     init() {
//       this.initToggle();
//       this.updateAllPrices(true);
//       this.setupObservers();
//     }

//     initToggle() {
//       const toggle = document.getElementById('gstToggle');
//       if (!toggle) return;

//       if (toggle.dataset.gstBound === 'true') return;
//       toggle.dataset.gstBound = 'true';

//       toggle.checked = this.currentState;
//       this.updateToggleLabels();

//       toggle.addEventListener('change', (e) => {
//         this.currentState = !!e.target.checked;
//         localStorage.setItem('gstToggleState', String(this.currentState));
//         this.updateToggleLabels();
//         this.updateAllPrices(true);
//       });
//     }

//     updateToggleLabels() {
//       document.querySelectorAll('.gst-label').forEach(label => {
//         const type = (label.dataset.gstType || '').toLowerCase();
//         const active =
//           (this.currentState && type === 'incl') ||
//           (!this.currentState && type === 'excl');
//         label.classList.toggle('active', active);
//       });
//     }

//     extractCents(text) {
//       const t = (text || '').replace(/,/g, '');
//       const match = t.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
//       if (!match) return null;

//       const amountStr = match[1];
//       const parts = amountStr.split('.');
//       const dollars = parseInt(parts[0], 10) || 0;
//       const cents = parts[1] ? parseInt((parts[1] + '00').slice(0, 2), 10) : 0;

//       return dollars * 100 + cents;
//     }

//     applyGSTToCents_NoRound(baseCents) {
//       return Math.floor(baseCents * 110 / 100);
//     }

//     formatFromCents(cents, withLabel = true) {
//       const abs = Math.abs(cents);
//       const dollars = Math.floor(abs / 100);
//       const rem = abs % 100;
//       const price = `${cents < 0 ? '-' : ''}${this.currencySymbol}${dollars}.${String(rem).padStart(2, '0')}`;
//       if (!withLabel) return price;
//       return price + (this.currentState ? ' Inc GST' : ' ex GST');
//     }

//     shouldSkip(el) {
//       if (el.closest('.collection-filters, .facets, .sidebar, aside')) return true;
//       if (el.closest('header, footer')) return true;
//       return false;
//     }

//     updatePriceElement(el, force = false) {
//       if (!el || this.shouldSkip(el)) return;

//       const text = (el.textContent || '').trim();
//       if (!text) return;

//       if (!text.includes('$') && !/\d/.test(text)) return;
//       if (!text.match(/\d/)) return;

//       if (!force && el.dataset.gstReady === 'true') return;

//       if (!el.dataset.baseCents) {
//         const baseCents = this.extractCents(text);
//         if (baseCents == null) return;
//         el.dataset.baseCents = String(baseCents);
//         el.dataset.gstOriginal = text;
//       }

//       const baseCents = parseInt(el.dataset.baseCents, 10);
//       if (!isFinite(baseCents)) return;

//       const displayCents = this.currentState
//         ? this.applyGSTToCents_NoRound(baseCents)
//         : baseCents;

//       if (/per unit|each/i.test(text)) {
//         el.textContent = `(${this.formatFromCents(displayCents, false)} per unit)`;
//       } else if (/was/i.test(text)) {
//         el.textContent = `WAS ${this.formatFromCents(displayCents, false)}`;
//       } else {
//         el.textContent = this.formatFromCents(displayCents, true);
//       }

//       el.dataset.gstReady = 'true';
//     }

//     updateAllPrices(force = false) {
//       const scope = document.body;

//       const selectors = [
//         '.price',
//         '.product-price',
//         '.card-product__price',
//         '[class*="price"]',
//         '.cart-item__price',
//         '.cart-item__final-price',
//         '.cart-item__price-wrapper',
//         '.cart-item__discounted-prices',
//         '.cart-item__totals',
//         '.totals__subtotal-value',
//         '.totals__total-value',
//         '.cart__subtotal',
//         '.cart-drawer .price',
//         '.cart-drawer [class*="price"]',
//         '.drawer .price',
//         '.drawer [class*="price"]'
//       ];

//       if (force) {
//         scope.querySelectorAll('[data-gst-ready="true"]').forEach(el => {
//           el.dataset.gstReady = 'false';
//         });
//       }

//       scope.querySelectorAll(selectors.join(',')).forEach(el => {
//         this.updatePriceElement(el, force);
//       });

//       document.dispatchEvent(new CustomEvent('gst:updated', {
//         detail: { gstState: this.currentState }
//       }));
//     }

//     throttledUpdate(force = false) {
//       const now = Date.now();
//       if (this._pending) return;

//       if (now - this._lastRun < this.THROTTLE_MS) {
//         this._pending = true;
//         setTimeout(() => {
//           this._pending = false;
//           this._lastRun = Date.now();
//           this.updateAllPrices(force);
//         }, this.THROTTLE_MS);
//         return;
//       }

//       this._lastRun = now;
//       this.updateAllPrices(force);
//     }

//     setupObservers() {
//       const observer = new MutationObserver(() => {
//         this.throttledUpdate(false);
//       });

//       observer.observe(document.body, { childList: true, subtree: true });

//       document.addEventListener('shopify:section:load', () => {
//         this.throttledUpdate(true);
//         this.initToggle();
//       });

//       document.addEventListener('cart:updated', () => {
//         this.throttledUpdate(true);
//       });
//     }
//   }

//   document.addEventListener('DOMContentLoaded', () => {
//     window.gstManager = new GSTManager();
//   });

//   document.addEventListener('shopify:section:load', () => {
//     if (window.gstManager) window.gstManager.throttledUpdate(true);
//   });
// })();





// (function () {
//   class GSTManager {
//     constructor() {
//       this.currencySymbol = '$';
//       this.currentState = localStorage.getItem('gstToggleState') === 'true';
//       this.init();
//     }

//     init() {
//       this.initToggle();
//       this.updateAllPrices(true);
//       this.setupObservers();
//     }

//     initToggle() {
//       const toggle = document.getElementById('gstToggle');
//       if (!toggle) return;

//       toggle.checked = this.currentState;
//       this.updateToggleLabels();

//       toggle.addEventListener('change', (e) => {
//         this.currentState = !!e.target.checked;
//         localStorage.setItem('gstToggleState', String(this.currentState));
//         this.updateToggleLabels();
//         this.updateAllPrices(true);
//       });
//     }

//     updateToggleLabels() {
//       document.querySelectorAll('.gst-label').forEach(label => {
//         const type = label.dataset.gstType;
//         const active =
//           (this.currentState && type === 'incl') ||
//           (!this.currentState && type === 'excl');
//         label.classList.toggle('active', active);
//       });
//     }

//     extractCents(text) {
//       const match = text.replace(/,/g, '').match(/(\d+(\.\d{1,2})?)/);
//       if (!match) return null;
//       return Math.round(parseFloat(match[1]) * 100);
//     }

//     applyGST(baseCents) {
//       return Math.floor(baseCents * 110 / 100);
//     }

//     format(cents, withLabel) {
//       const dollars = (cents / 100).toFixed(2);
//       const price = `${this.currencySymbol}${dollars}`;
//       if (!withLabel) return price;
//       return price + (this.currentState ? ' Inc GST' : ' ex GST');
//     }

// updatePriceElement(el, force = false) {
//   if (!el) return;
//   if (!force && el.dataset.gstReady === 'true') return;

//   // Only process leaf nodes (real price text)
//   if (el.children.length > 0) return;

//   const text = el.textContent.trim();
//   if (!text.includes('$')) return;
//   if (el.classList.contains('visually-hidden')) return;

//   if (!el.dataset.baseCents) {
//     const base = this.extractCents(text);
//     if (!base) return;
//     el.dataset.baseCents = base;
//   }

//   const baseCents = parseInt(el.dataset.baseCents, 10);
//   const newCents = this.currentState
//     ? this.applyGST(baseCents)
//     : baseCents;

//   const isRegular = el.classList.contains('f-price-item--regular');
//   const isSale = el.classList.contains('f-price-item--sale');
//   const isInsideSale = el.closest('.f-price__sale');

//   // Reset styling
//   el.style.textDecoration = '';
//   el.style.opacity = '';

//   if (isRegular && isInsideSale) {
//     el.textContent = this.format(newCents, false);
//     el.style.textDecoration = 'line-through';
//     el.style.opacity = '0.6';
//   } else {
//     el.textContent = this.format(newCents, true);
//   }

//   el.dataset.gstReady = 'true';
// }
//    updateAllPrices(force = false) {
// const selectors = [
//   '.price',
//   '.product-price',
//   '.card-product__price',
//   '.cart-item__price',
//   '.cart-item__final-price',
//   '.cart-item__price-wrapper',
//   '.cart-item__discounted-prices',
//   '.cart-item__totals',
//   '.totals__subtotal-value',
//   '.totals__total-value',
//   '.cart__subtotal',
//   '.cart-drawer .price',
//   '.drawer .price',
//   '.f-price-item'
// ];

//   if (force) {
//     document.querySelectorAll('[data-gst-ready]')
//       .forEach(el => el.removeAttribute('data-gst-ready'));
//   }

//   document.querySelectorAll(selectors.join(','))
//     .forEach(el => this.updatePriceElement(el, force));
// }

//     setupObservers() {
//       const observer = new MutationObserver(() => {
//         this.updateAllPrices(false);
//       });

//       observer.observe(document.body, { childList: true, subtree: true });

//       document.addEventListener('shopify:section:load', () => {
//         this.updateAllPrices(true);
//       });

//       document.addEventListener('cart:updated', () => {
//         this.updateAllPrices(true);
//       });
//     }
//   }

//   document.addEventListener('DOMContentLoaded', () => {
//     new GSTManager();
//   });
// })();

(function () {
  class GSTManager {
    constructor() {
      this.currencySymbol = '$';
      this.init();
    }

    init() {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      // 🔥 Force Inc GST on mobile
      if (isMobile) {
        this.currentState = true;
      } else {
        this.currentState =
          localStorage.getItem('gstToggleState') === 'true';
      }

      this.initToggle();
      this.updateAllPrices(true);
      this.setupObservers();
    }

    initToggle() {
      const toggle = document.getElementById('gstToggle');
      if (!toggle) return;

      toggle.checked = this.currentState;
      this.updateToggleLabels();

      toggle.addEventListener('change', (e) => {
        this.currentState = !!e.target.checked;

        // Save only on desktop
        if (!window.matchMedia("(max-width: 768px)").matches) {
          localStorage.setItem(
            'gstToggleState',
            String(this.currentState)
          );
        }

        this.updateToggleLabels();
        this.updateAllPrices(true);
      });
    }

    updateToggleLabels() {
      document.querySelectorAll('.gst-label').forEach((label) => {
        const type = label.dataset.gstType;
        const active =
          (this.currentState && type === 'incl') ||
          (!this.currentState && type === 'excl');
        label.classList.toggle('active', active);
      });
    }

    extractCents(text) {
      const match = text.replace(/,/g, '').match(/(\d+(\.\d{1,2})?)/);
      if (!match) return null;
      return Math.round(parseFloat(match[1]) * 100);
    }

    applyGST(baseCents) {
      return Math.floor(baseCents * 110 / 100);
    }

    format(cents, withLabel) {
      const dollars = (cents / 100).toFixed(2);
      const price = `${this.currencySymbol}${dollars}`;
      if (!withLabel) return price;
      return price + (this.currentState ? ' Inc GST' : ' ex GST');
    }

    updatePriceElement(el, force = false) {
      if (!el) return;
      if (!force && el.dataset.gstReady === 'true') return;

      // Only leaf nodes
      if (el.children.length > 0) return;

      const text = el.textContent.trim();
      if (!text.includes('$')) return;
      if (el.classList.contains('visually-hidden')) return;

      if (!el.dataset.baseCents) {
        const base = this.extractCents(text);
        if (!base) return;
        el.dataset.baseCents = base;
      }

      const baseCents = parseInt(el.dataset.baseCents, 10);
      const newCents = this.currentState
        ? this.applyGST(baseCents)
        : baseCents;

      const isRegular = el.classList.contains('f-price-item--regular');
      const isInsideSale = el.closest('.f-price__sale');

      // Reset styling
      el.style.textDecoration = '';
      el.style.opacity = '';

      // Compare price (only inside sale container)
      if (isRegular && isInsideSale) {
        el.textContent = this.format(newCents, false);
        el.style.textDecoration = 'line-through';
        el.style.opacity = '0.6';
      } else {
        el.textContent = this.format(newCents, true);
      }

      el.dataset.gstReady = 'true';
    }

    updateAllPrices(force = false) {
      const selectors = [
        '.price',
        '.product-price',
        '.card-product__price',
        '.cart-item__price',
        '.cart-item__final-price',
        '.cart-item__price-wrapper',
        '.cart-item__discounted-prices',
        '.cart-item__totals',
        '.totals__subtotal-value',
        '.totals__total-value',
        '.cart__subtotal',
        '.cart-drawer .price',
        '.drawer .price',
        '.f-price-item'
      ];

      if (force) {
        document
          .querySelectorAll('[data-gst-ready]')
          .forEach((el) => el.removeAttribute('data-gst-ready'));
      }

      document
        .querySelectorAll(selectors.join(','))
        .forEach((el) => this.updatePriceElement(el, force));
    }

    setupObservers() {
      const observer = new MutationObserver(() => {
        this.updateAllPrices(false);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      document.addEventListener('shopify:section:load', () => {
        this.updateAllPrices(true);
      });

      document.addEventListener('cart:updated', () => {
        this.updateAllPrices(true);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new GSTManager();
  });
})();