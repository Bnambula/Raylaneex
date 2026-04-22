/* ============================================================
   RAYLANE EXPRESS — SHARED JAVASCRIPT
   Navigation, Animations, Utils, Geolocation
   ============================================================ */

'use strict';

// ── NAVBAR SCROLL BEHAVIOUR ──────────────────────────────────
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── MOBILE DRAWER ──────────────────────────────────────────────
(function initMobileDrawer() {
  const openBtn  = document.querySelector('.mobile-menu-btn');
  const drawer   = document.querySelector('.mobile-drawer');
  const overlay  = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  if (!drawer) return;

  const open  = () => { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer.classList.remove('open'); document.body.style.overflow = ''; };

  openBtn  && openBtn.addEventListener('click', open);
  overlay  && overlay.addEventListener('click', close);
  closeBtn && closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
})();

// ── SCROLL REVEAL ───────────────────────────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── COUNTER ANIMATION ──────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = target < 1 ? (eased * target).toFixed(1) : Math.floor(eased * target).toLocaleString();
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

(function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
})();

// ── TOAST SYSTEM ───────────────────────────────────────────────
window.Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = '', duration = 3500) {
    this.init();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: '✓', error: '✕', warning: '⚠' };
    t.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    this.container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
      t.style.transition = 'all 0.3s ease';
      setTimeout(() => t.remove(), 300);
    }, duration);
  },
  success(msg) { this.show(msg, 'success'); },
  error(msg)   { this.show(msg, 'error'); },
  warning(msg) { this.show(msg, 'warning'); },
};

// ── MODAL SYSTEM ───────────────────────────────────────────────
window.Modal = {
  open(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  },
  close(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
  },
  init() {
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => Modal.open(btn.dataset.modalOpen));
    });
    document.querySelectorAll('[data-modal-close], .modal-overlay').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target === el) {
          const overlay = el.closest('.modal-overlay');
          if (overlay) overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }
};
document.addEventListener('DOMContentLoaded', () => Modal.init());

// ── SEARCH TABS ────────────────────────────────────────────────
(function initSearchTabs() {
  const tabBtns = document.querySelectorAll('.search-tab');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.tab;
      document.querySelectorAll('.search-panel').forEach(p => {
        p.style.display = p.dataset.panel === target ? '' : 'none';
      });
    });
  });
})();

// ── SWAP ORIGIN/DESTINATION ─────────────────────────────────────
(function initSwapBtn() {
  const swapBtn = document.querySelector('.swap-btn');
  if (!swapBtn) return;
  swapBtn.addEventListener('click', () => {
    const from = document.querySelector('[name="from"], #from');
    const to   = document.querySelector('[name="to"],   #to');
    if (!from || !to) return;
    const tmp = from.value;
    from.value = to.value;
    to.value   = tmp;
    swapBtn.style.transform = 'translateY(-50%) rotate(180deg)';
    setTimeout(() => { swapBtn.style.transform = 'translateY(-50%) rotate(0deg)'; }, 400);
  });
})();

// ── NEARBY TERMINAL (GEOLOCATION) ──────────────────────────────
window.findNearbyTerminal = function(callback) {
  if (!navigator.geolocation) {
    Toast.error('Location not supported on this device.');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;

    // Uganda terminals with coordinates
    const terminals = [
      { name: 'Kampala Coach Park',          lat: 0.3136,  lng: 32.5811, city: 'Kampala' },
      { name: 'Nakawa Bus Terminal',          lat: 0.3247,  lng: 32.6074, city: 'Kampala' },
      { name: 'Kisenyi Bus Park',             lat: 0.3103,  lng: 32.5701, city: 'Kampala' },
      { name: 'Entebbe Bus Terminal',         lat: 0.0615,  lng: 32.4631, city: 'Entebbe' },
      { name: 'Jinja Main Terminal',          lat: 0.4244,  lng: 33.2041, city: 'Jinja' },
      { name: 'Mbale Bus Terminal',           lat: 1.0803,  lng: 34.1750, city: 'Mbale' },
      { name: 'Gulu Bus Park',                lat: 2.7743,  lng: 32.2990, city: 'Gulu' },
      { name: 'Mbarara Bus Terminal',         lat: -0.6059, lng: 30.6457, city: 'Mbarara' },
      { name: 'Fort Portal Bus Park',         lat: 0.6547,  lng: 30.2748, city: 'Fort Portal' },
      { name: 'Arua Bus Terminal',            lat: 3.0253,  lng: 30.9106, city: 'Arua' },
      { name: 'Kabale Bus Terminal',          lat: -1.2492, lng: 29.9947, city: 'Kabale' },
      { name: 'Lira Bus Park',                lat: 2.2499,  lng: 32.9002, city: 'Lira' },
      { name: 'Tororo Bus Terminal',          lat: 0.6921,  lng: 34.1791, city: 'Tororo' },
      { name: 'Soroti Bus Park',              lat: 1.7151,  lng: 33.6106, city: 'Soroti' },
      { name: 'Kasese Bus Terminal',          lat: 0.1840,  lng: 30.0849, city: 'Kasese' },
    ];

    // Haversine distance
    function dist(a, b) {
      const R = 6371;
      const dLat = (b.lat - a.lat) * Math.PI / 180;
      const dLng = (b.lng - a.lng) * Math.PI / 180;
      const x = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
    }

    const sorted = terminals.map(t => ({ ...t, distance: dist({ lat: latitude, lng: longitude }, t) }))
                             .sort((a, b) => a.distance - b.distance);

    if (callback) callback(sorted[0], sorted.slice(0,3));
  }, err => {
    const msgs = {
      1: 'Location permission denied. Please allow location access.',
      2: 'Unable to determine your location.',
      3: 'Location request timed out.'
    };
    Toast.error(msgs[err.code] || 'Location error.');
  }, { timeout: 8000, maximumAge: 60000 });
};

// ── DATE HELPERS ───────────────────────────────────────────────
window.formatDate = function(date) {
  return new Intl.DateTimeFormat('en-UG', { weekday:'short', day:'numeric', month:'short' }).format(date);
};

window.formatTime = function(date) {
  return new Intl.DateTimeFormat('en-UG', { hour:'2-digit', minute:'2-digit', hour12: true }).format(date);
};

// Set min date on date inputs to today
(function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(el => {
    if (!el.min) el.min = today;
    if (!el.value) el.value = today;
  });
})();

// ── FORM VALIDATION ────────────────────────────────────────────
window.validateForm = function(formEl) {
  let valid = true;
  formEl.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
      field.addEventListener('input', () => field.classList.remove('error'), { once: true });
    }
  });
  if (!valid) Toast.error('Please complete all required fields.');
  return valid;
};

// ── CLIPBOARD COPY ─────────────────────────────────────────────
window.copyToClipboard = async function(text, feedback = 'Copied to clipboard!') {
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(text);
    else {
      const t = document.createElement('textarea');
      t.value = text; document.body.appendChild(t); t.select();
      document.execCommand('copy'); document.body.removeChild(t);
    }
    Toast.success(feedback);
  } catch { Toast.error('Copy failed.'); }
};

// ── PRICE FORMATTER ────────────────────────────────────────────
window.formatUGX = function(n) {
  return 'UGX ' + Number(n).toLocaleString('en-UG');
};

// ── TABS (generic) ─────────────────────────────────────────────
window.initTabs = function(containerSelector) {
  document.querySelectorAll(containerSelector || '[data-tabs]').forEach(container => {
    const tabs    = container.querySelectorAll('[data-tab]');
    const panels  = container.querySelectorAll('[data-panel]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.style.display = 'none');
        tab.classList.add('active');
        const p = container.querySelector(`[data-panel="${tab.dataset.tab}"]`);
        if (p) p.style.display = '';
      });
    });
    // Activate first
    if (tabs[0]) tabs[0].click();
  });
};

// ── RIPPLE EFFECT ──────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const r = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `
    position:absolute; border-radius:50%; pointer-events:none;
    width:${size}px; height:${size}px;
    left:${e.clientX - rect.left - size/2}px;
    top:${e.clientY - rect.top - size/2}px;
    background:rgba(255,255,255,0.22);
    transform:scale(0);
    animation:ripple 0.55s ease-out forwards;
  `;
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
    document.head.appendChild(s);
  }
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
});

// ── GOOGLE MAPS LINK ───────────────────────────────────────────
window.openInMaps = function(lat, lng, label) {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(url, '_blank');
};

// ── KEYBOARD TRAP FOR MODALS ───────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const openModal = document.querySelector('.modal-overlay.open');
    if (openModal) {
      openModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// ── ACTIVE BOTTOM NAV ──────────────────────────────────────────
(function setActiveBottomNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    if (item.getAttribute('href') === path) item.classList.add('active');
  });
})();
