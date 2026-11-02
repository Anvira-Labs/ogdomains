(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'bollywood-theme';

  function store(get, v) {
    try { return get ? localStorage.getItem(KEY) : localStorage.setItem(KEY, v); } catch (e) { return null; }
  }
  var saved = store(true);
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  else root.setAttribute('data-theme', 'dark'); // dark is the default

  function isLight() { return root.getAttribute('data-theme') === 'light'; }

  document.addEventListener('DOMContentLoaded', function () {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- theme ----------
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

    // ---------- marquee bulbs around the façade, chased in a 3-phase cycle ----------
    var box = document.getElementById('bulbs');
    function buildBulbs() {
      var W = box.clientWidth, H = box.clientHeight, step = 26, pts = [], i;
      if (!W || !H) return;
      box.textContent = '';
      for (i = 0; i <= W; i += step) { pts.push([i, 0]); pts.push([i, H]); }
      for (i = step; i < H; i += step) { pts.push([0, i]); pts.push([W, i]); }
      pts.forEach(function (p, n) {
        var s = document.createElement('span');
        s.style.left = p[0] + 'px'; s.style.top = p[1] + 'px';
        s.style.animationDelay = (-(n % 3) * 0.4) + 's';
        box.appendChild(s);
      });
    }
    requestAnimationFrame(buildBulbs);

    // ---------- parallax ----------
    // One scroll listener, one rAF, transform/opacity only. Every layer reads
    // data-par (vertical), data-parx (horizontal) and data-rot (degrees):
    // positive values recede (move slower than the page), negative ones come
    // forward. Offsets are measured from the centre of the layer's [data-frame]
    // ancestor, so a layer is at rest when its section is centred in the viewport.
    var layers = [], bar = document.getElementById('bar'), cue = document.querySelector('.cue');
    var vh = innerHeight, amp = 0, docMax = 1;

    function collect() {
      layers = [].map.call(document.querySelectorAll('[data-par],[data-parx],[data-rot]'), function (el) {
        el.style.willChange = 'transform';
        return {
          el: el,
          f: parseFloat(el.dataset.par) || 0,
          x: parseFloat(el.dataset.parx) || 0,
          r: parseFloat(el.dataset.rot) || 0,
          frame: el.closest('[data-frame]') || el.parentElement,
          base: 0
        };
      });
    }
    // Read every geometry value in one pass; the frame elements are never
    // transformed, so their rects stay stable while layers move.
    function measure() {
      vh = innerHeight;
      amp = vh * 0.3 * (innerWidth < 700 ? 0.55 : 1);
      docMax = Math.max(1, root.scrollHeight - vh);
      var sy = window.scrollY || root.scrollTop;
      // Park the scroll cue at the foot of the first screen. svh can disagree
      // with the real inner height, and the cue is positioned against the hero,
      // which starts below the topbar, so both are measured here.
      if (cue) {
        var heroTop = cue.parentElement.getBoundingClientRect().top + sy;
        cue.style.top = Math.max(0, vh - 52 - heroTop) + 'px';
      }
      for (var i = 0; i < layers.length; i++) {
        var r = layers[i].frame.getBoundingClientRect();
        layers[i].base = r.top + sy + r.height / 2;
      }
    }

    var raf = 0;
    function tick() {
      raf = 0;
      var sy = window.scrollY || root.scrollTop;
      if (bar) bar.style.transform = 'scaleX(' + (sy / docMax).toFixed(4) + ')';
      if (reduce) return;
      // Hero progress, 0 at the top to 1 once the hero is scrolled past: drives
      // the curtains, the valance and the title's separating shadow layers.
      root.style.setProperty('--hero', Math.min(1, sy / (vh * 0.85)).toFixed(3));
      for (var i = 0; i < layers.length; i++) {
        var L = layers[i], c = (L.base - sy - vh / 2) / vh;
        if (c > 1.8 || c < -1.8) continue; // well off screen: leave it be
        var t = '';
        // Whole pixels only: fractional offsets blur the text inside a layer.
        if (L.f || L.x) t = 'translate3d(' + Math.round(-L.x * c * amp) + 'px,' + Math.round(-L.f * c * amp) + 'px,0)';
        if (L.r) t += ' rotate(' + (c * L.r).toFixed(2) + 'deg)';
        L.el.style.transform = t;
      }
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(tick); }

    var rt = 0;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(function () { buildBulbs(); measure(); onScroll(); }, 120);
    }
    collect(); measure(); tick();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    addEventListener('orientationchange', onResize);
    // Webfonts land after first paint and change section heights.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { buildBulbs(); measure(); onScroll(); });
    addEventListener('load', function () { measure(); onScroll(); });

    // ---------- reveal + stat counters ----------
    function countUp(el) {
      var target = parseFloat(el.dataset.num), dec = parseInt(el.dataset.dec || '0', 10);
      var pre = el.dataset.pre || '', post = el.dataset.post || '', t0 = 0, dur = 900;
      function fmt(v) {
        return pre + v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + post;
      }
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3), v = target * e;
        el.textContent = fmt(dec ? parseFloat(v.toFixed(dec)) : Math.round(v));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (x) {
          if (!x.isIntersecting) return;
          x.target.classList.add('in');
          var dd = x.target.querySelector('dd[data-num]');
          if (dd && !reduce && !dd.dataset.done) { dd.dataset.done = '1'; countUp(dd); }
          io.unobserve(x.target);
        });
      }, { threshold: 0.2 });
      [].forEach.call(document.querySelectorAll('.card,.stat,.ticket'), function (el) {
        el.classList.add('rv'); io.observe(el);
      });
    }

    // ---------- mock seat picker (nothing is stored or booked) ----------
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

    // ---------- dummy enquiry form: validate, console.log, confirm. Posts nowhere. ----------
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
  });
})();
