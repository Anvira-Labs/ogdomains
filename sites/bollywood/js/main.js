(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'bollywood-theme';

  function store(get, v) {
    try { return get ? localStorage.getItem(KEY) : localStorage.setItem(KEY, v); } catch (e) { return null; }
  }
  function systemLight() {
    return window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches;
  }
  var saved = store(true);
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  else root.setAttribute('data-theme', 'dark'); // dark is the default

  function isLight() { return root.getAttribute('data-theme') === 'light'; }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeBtn');
    function sync() {
      var light = isLight();
      btn.setAttribute('aria-pressed', String(light));
      btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', light ? '#FFF1C9' : '#1a0409');
    }
    sync();
    btn.addEventListener('click', function () {
      var next = isLight() ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      store(false, next);
      sync();
    });

    // Marquee bulbs around the façade, chased in a 3-phase cycle.
    var box = document.getElementById('bulbs');
    var W = box.clientWidth, H = box.clientHeight, step = 26, pts = [], i;
    for (i = 0; i <= W; i += step) { pts.push([i, 0]); pts.push([i, H]); }
    for (i = step; i < H; i += step) { pts.push([0, i]); pts.push([W, i]); }
    pts.forEach(function (p, n) {
      var s = document.createElement('span');
      s.style.left = p[0] + 'px'; s.style.top = p[1] + 'px';
      s.style.animationDelay = (-(n % 3) * 0.4) + 's';
      box.appendChild(s);
    });

    // Mock seat picker (nothing is stored or booked).
    var seats = document.getElementById('seats'), out = document.getElementById('seatOut');
    var rows = 'ABCD', taken = { A3: 1, B5: 1, B6: 1, C2: 1, D7: 1 };
    rows.split('').forEach(function (r) {
      for (var c = 1; c <= 8; c++) {
        var id = r + c, b = document.createElement('button');
        b.type = 'button'; b.className = 'seat'; b.textContent = id;
        b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Seat ' + id);
        if (taken[id]) { b.disabled = true; b.setAttribute('aria-label', 'Seat ' + id + ', unavailable'); }
        seats.appendChild(b);
      }
    });
    seats.addEventListener('click', function (e) {
      var b = e.target.closest('.seat'); if (!b || b.disabled) return;
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      var sel = [].map.call(seats.querySelectorAll('[aria-pressed="true"]'), function (x) { return x.textContent; });
      out.textContent = sel.length ? 'Mock selection: ' + sel.join(', ') + ' (not a real booking).' : 'No seats selected.';
    });

    // Dummy enquiry form: validate, console.log, success message. Posts nowhere.
    var form = document.getElementById('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = form.name, em = form.email, ok = true;
      var ne = document.getElementById('fnE'), ee = document.getElementById('feE');
      ne.textContent = ''; ee.textContent = '';
      if (!n.value.trim()) { ne.textContent = 'Please enter your name.'; ok = false; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)) { ee.textContent = 'Please enter a valid email address.'; ok = false; }
      var msg = document.getElementById('ok');
      if (!ok) { msg.textContent = ''; (n.value.trim() ? em : n).focus(); return; }
      console.log('Demo enquiry (not sent anywhere):', { name: n.value, email: em.value, interest: form.interest.value, message: form.message.value });
      msg.textContent = 'Thank you. This is a demo form, so nothing was sent. To enquire for real, use the contact route on the main OGDomains page.';
      msg.focus();
      form.reset();
    });

    // Gentle reveal on scroll (skipped for reduced motion).
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
      }, { threshold: .12 });
      document.querySelectorAll('.card,.stat,.ticket').forEach(function (el) { el.classList.add('rv'); io.observe(el); });
    }
  });
})();
