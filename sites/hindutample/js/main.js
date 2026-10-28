(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lightMQ = window.matchMedia('(prefers-color-scheme: light)');
  var SVGNS = 'http://www.w3.org/2000/svg';

  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- theme ---------- */
  var btn = document.getElementById('themeBtn');
  var label = document.getElementById('themeLabel');
  var icon = document.getElementById('themeIcon');
  function effective() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return lightMQ.matches ? 'light' : 'dark';
  }
  function syncBtn() {
    var cur = effective();
    var next = cur === 'dark' ? 'light' : 'dark';
    btn.setAttribute('aria-pressed', String(cur === 'light'));
    btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    label.textContent = next === 'light' ? 'Light' : 'Dark';
    icon.innerHTML = next === 'light' ? '&#9788;' : '&#9790;';
  }
  try {
    var saved = localStorage.getItem('hindutample-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { /* storage unavailable */ }
  btn.addEventListener('click', function () {
    var next = effective() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('hindutample-theme', next); } catch (e) { /* ignore */ }
    syncBtn();
    drawKolam(true);
  });
  if (lightMQ.addEventListener) lightMQ.addEventListener('change', function () { syncBtn(); drawKolam(true); });
  syncBtn();

  /* ---------- marigold garland ---------- */
  var g = document.getElementById('garland');
  if (g) {
    var cols = ['var(--marigold)', 'var(--flame-b)', 'var(--marigold)'];
    var n = 60, w = 1200;
    el('path', { d: 'M0 6 Q600 78 1200 6', fill: 'none', stroke: 'var(--leaf)', 'stroke-width': 2 }, g);
    for (var i = 0; i <= n; i++) {
      var t = i / n, x = t * w;
      var y = 6 + 144 * t * (1 - t); /* matches the quadratic curve */
      var r = 6 + (i % 3 === 0 ? 2 : 0);
      el('circle', { cx: x, cy: y + r * 0.6, r: r, fill: cols[i % 3], stroke: 'var(--bg)', 'stroke-width': 0.8 }, g);
      if (i % 5 === 2) el('path', { d: 'M' + x + ' ' + (y + 3) + ' l-4 14 l4 -4 l4 4z', fill: 'var(--leaf)' }, g);
    }
  }

  /* ---------- diyas ---------- */
  var dy = document.getElementById('diyas');
  if (dy) {
    for (var d = 0; d < 7; d++) {
      var wrap = document.createElement('div');
      wrap.className = 'diya';
      wrap.style.setProperty('--d', (2 + ((d * 0.37) % 1.3)).toFixed(2) + 's');
      wrap.style.setProperty('--d2', (2.8 + ((d * 0.53) % 1.5)).toFixed(2) + 's');
      wrap.style.setProperty('--dl', (-d * 0.61).toFixed(2) + 's');
      var s = el('svg', { viewBox: '0 0 56 64', width: 56, height: 64 }, wrap);
      var gid = 'dg' + d;
      var defs = el('defs', {}, s);
      var rg = el('radialGradient', { id: gid }, defs);
      el('stop', { offset: 0, 'stop-color': 'var(--glow)', 'stop-opacity': 0.8 }, rg);
      el('stop', { offset: 1, 'stop-color': 'var(--glow)', 'stop-opacity': 0 }, rg);
      el('circle', { class: 'glow', cx: 28, cy: 30, r: 26, fill: 'url(#' + gid + ')' }, s);
      el('path', { d: 'M8 42 Q28 66 48 42 Q28 48 8 42Z', fill: 'var(--brass-d)' }, s);
      el('path', { d: 'M8 42 Q28 50 48 42 Q28 38 8 42Z', fill: 'var(--brass-l)' }, s);
      var f = el('g', { class: 'flame' }, s);
      el('path', { d: 'M28 14 C35 24 36 32 28 40 C20 32 21 24 28 14Z', fill: 'var(--flame-b)' }, f);
      el('path', { d: 'M28 24 C32 29 32 34 28 39 C24 34 24 29 28 24Z', fill: 'var(--flame-a)' }, f);
      dy.appendChild(wrap);
    }
  }

  /* ---------- lotus ---------- */
  var lotus = document.getElementById('lotus');
  if (lotus) {
    function petals(group, count, offset, cls, len) {
      for (var i = 0; i < count; i++) {
        var a = -80 + (160 / (count - 1)) * i + offset;
        var holder = el('g', { transform: 'rotate(' + a + ')' }, group);
        var p = el('path', {
          class: 'petal' + (cls ? ' ' + cls : ''),
          d: 'M0 0 C' + (-0.24 * len) + ' ' + (-0.33 * len) + ' ' + (-0.17 * len) + ' ' + (-0.73 * len) + ' 0 ' + (-len) +
             ' C' + (0.17 * len) + ' ' + (-0.73 * len) + ' ' + (0.24 * len) + ' ' + (-0.33 * len) + ' 0 0Z'
        }, holder);
        p.style.transitionDelay = (cls ? 0.5 : 0) + i * 0.08 + 's';
      }
    }
    petals(lotus.querySelector('.back'), 7, 0, '', 62);
    petals(lotus.querySelector('.front'), 6, 0, 'inner', 52);
    if (reduce.matches || !('IntersectionObserver' in window)) lotus.classList.add('open');
    else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { lotus.classList.add('open'); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(lotus);
    }
  }

  /* ---------- aarti flame circle ---------- */
  var aarti = document.getElementById('aarti');
  var aflames = [];
  if (aarti) {
    for (var k = 0; k < 5; k++) {
      var wrapA = document.createElement('div');
      wrapA.className = 'af';
      var sv = el('svg', { viewBox: '0 0 18 30', width: 18, height: 30 }, wrapA);
      var fl = el('g', { class: 'flame' }, sv);
      fl.style.setProperty('--d', (1.9 + k * 0.23).toFixed(2) + 's');
      fl.style.setProperty('--dl', (-k * 0.4) + 's');
      el('path', { d: 'M9 1 C14 8 15 17 9 24 C3 17 4 8 9 1Z', fill: 'var(--flame-b)' }, fl);
      el('path', { d: 'M9 10 C12 14 12 18 9 22 C6 18 6 14 9 10Z', fill: 'var(--flame-a)' }, fl);
      aarti.appendChild(wrapA);
      aflames.push(wrapA);
    }
  }
  var aVisible = true;
  function placeAarti(angle) {
    var R = Math.min(aarti.clientWidth, aarti.clientHeight) * 0.3;
    aflames.forEach(function (f, i) {
      var a = angle + (i * 2 * Math.PI) / aflames.length;
      f.style.transform = 'translate(' + (Math.cos(a) * R * 1.35).toFixed(1) + 'px,' + (Math.sin(a) * R).toFixed(1) + 'px)';
    });
  }
  function aartiLoop(ts) {
    if (aVisible && !reduce.matches) placeAarti(((ts / 1000) / 8) * 2 * Math.PI);
    requestAnimationFrame(aartiLoop);
  }
  if (aarti) {
    placeAarti(-Math.PI / 2);
    if (!reduce.matches) requestAnimationFrame(aartiLoop);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { aVisible = es[0].isIntersecting; }).observe(aarti);
    }
    window.addEventListener('resize', function () { placeAarti(-Math.PI / 2); });
  }

  /* ---------- bell: damped pendulum, silent ---------- */
  var bellBtn = document.getElementById('bellBtn');
  var bellBody = document.getElementById('bellBody');
  var swinging = false;
  function ring() {
    if (reduce.matches || swinging) return;
    swinging = true;
    var t0 = performance.now();
    (function step(now) {
      var t = (now - t0) / 1000;
      var th = 22 * Math.exp(-0.8 * t) * Math.cos(6 * t);
      bellBody.style.transform = 'rotate(' + th.toFixed(2) + 'deg)';
      if (t < 5 && Math.abs(th) > 0.15) requestAnimationFrame(step);
      else { bellBody.style.transform = ''; swinging = false; }
    })(t0);
  }
  if (bellBtn) {
    bellBtn.addEventListener('mouseenter', ring);
    bellBtn.addEventListener('focus', ring);
    bellBtn.addEventListener('click', ring);
  }

  /* ---------- kolam ---------- */
  var cv = document.getElementById('kolam');
  var kolamRaf = 0;
  function cssVar(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }
  function drawKolam(instant) {
    if (!cv) return;
    cancelAnimationFrame(kolamRaf);
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
    var dotC = cssVar('--dot'), lineC = cssVar('--kolam');
    var pts = [], N = 1400, R = W * 0.38;
    for (var i = 0; i <= N; i++) {
      var th = (i / N) * Math.PI * 2;
      var r = R * (0.55 + 0.45 * Math.cos(4 * th));
      pts.push([cx + r * Math.cos(th), cy + r * Math.sin(th)]);
    }
    function frame(count) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = dotC;
      for (var gx = -3; gx <= 3; gx++) for (var gy = -3; gy <= 3; gy++) {
        if (Math.abs(gx) + Math.abs(gy) > 4) continue;
        ctx.beginPath(); ctx.arc(cx + gx * 38, cy + gy * 38, 2.6, 0, 7); ctx.fill();
      }
      ctx.strokeStyle = lineC; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      for (var j = 0; j < count; j++) { if (j) ctx.lineTo(pts[j][0], pts[j][1]); else ctx.moveTo(pts[0][0], pts[0][1]); }
      ctx.stroke();
    }
    if (instant === true || reduce.matches) { frame(pts.length); return; }
    var start = null;
    (function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / 6000, 1);
      frame(Math.max(2, Math.floor(p * pts.length)));
      if (p < 1) kolamRaf = requestAnimationFrame(step);
    })(performance.now());
  }
  if (cv) {
    if ('IntersectionObserver' in window && !reduce.matches) {
      frame0();
    } else drawKolam(true);
  }
  function frame0() {
    var started = false;
    new IntersectionObserver(function (es, ob) {
      if (es[0].isIntersecting && !started) { started = true; drawKolam(false); ob.disconnect(); }
    }, { threshold: 0.4 }).observe(cv);
  }

  /* ---------- dummy enquiry form ---------- */
  var form = document.getElementById('enqForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fields = [['f-name', 'e-name'], ['f-email', 'e-email'], ['f-msg', 'e-msg']];
      var ok = true, first = null;
      fields.forEach(function (pair) {
        var input = document.getElementById(pair[0]), err = document.getElementById(pair[1]);
        var v = input.value.trim();
        var valid = v.length > 0 && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
        err.hidden = valid;
        input.setAttribute('aria-invalid', String(!valid));
        if (!valid) { ok = false; if (!first) first = input; }
      });
      var msg = document.getElementById('enqOk');
      if (!ok) { msg.hidden = true; first.focus(); return; }
      console.log('[Hindutample demo form] validated; nothing was sent.', {
        name: document.getElementById('f-name').value.trim(), email: document.getElementById('f-email').value.trim(), message: document.getElementById('f-msg').value.trim()
      });
      msg.hidden = false;
      msg.focus();
      form.reset();
    });
  }
})();
