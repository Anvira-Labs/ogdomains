(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(pointer: fine) and (hover: hover)');

  /* Theme toggle */
  var btn = document.getElementById('theme');
  var lightMq = window.matchMedia('(prefers-color-scheme: light)');
  function current() {
    var a = root.getAttribute('data-theme');
    return a || (lightMq.matches ? 'light' : 'dark');
  }
  function label() {
    btn.setAttribute('aria-label', 'Switch to ' + (current() === 'light' ? 'dark' : 'light') + ' theme');
  }
  btn.addEventListener('click', function () {
    var next = current() === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('vipan-theme', next); } catch (e) {}
    label();
  });
  label();

  /* Line-by-line hero reveal with 40ms stagger */
  var hero = document.querySelector('.hero');
  var parts = hero.querySelectorAll('.line > span, .reveal-line > span, .cta.reveal-line > a');
  Array.prototype.forEach.call(parts, function (el, i) { el.style.transitionDelay = (i * 80) + 'ms'; });
  requestAnimationFrame(function () { requestAnimationFrame(function () {
    hero.querySelectorAll('h1, .reveal-line').forEach(function (n) { n.classList.add('go'); });
  }); });

  /* Scroll reveals */
  var items = document.querySelectorAll('.sec .sh, .stat, .role, .narr article, .arch, .skills > div, .earlier, .form');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) { el.style.transitionDelay = ((i % 3) * 60) + 'ms'; io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* Magnetic buttons + cursor follower: fine pointers, no reduced motion */
  function enabled() { return fine.matches && !reduce.matches; }
  var follower = document.getElementById('follower');
  document.querySelectorAll('.magnetic').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      if (!enabled()) return;
      var r = b.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) * 0.25;
      var y = (e.clientY - (r.top + r.height / 2)) * 0.25;
      b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });
  document.querySelectorAll('[data-follow]').forEach(function (c) {
    c.addEventListener('mouseenter', function () {
      if (!enabled()) return;
      follower.textContent = c.getAttribute('data-follow');
      follower.classList.add('on');
    });
    c.addEventListener('mousemove', function (e) {
      if (!enabled()) return;
      follower.style.transform = 'translate(' + (e.clientX + 16) + 'px,' + (e.clientY + 16) + 'px)';
    });
    c.addEventListener('mouseleave', function () { follower.classList.remove('on'); });
  });


  /* Contact links assembled at runtime (light scraper obfuscation) */
  (function () {
    var addr = ['vipankverma03', 'gmail.com'].join('@');
    var tel = ['+1', '742', '778', '0842'];
    document.querySelectorAll('[data-mail]').forEach(function (a) {
      a.setAttribute('href', 'mailto:' + addr + '?subject=' + encodeURIComponent(a.getAttribute('data-subject') || ''));
    });
    document.querySelectorAll('[data-addr]').forEach(function (n) { n.textContent = addr; });
    document.querySelectorAll('[data-tel]').forEach(function (a) { a.setAttribute('href', 'tel:' + tel.join('')); });
    document.querySelectorAll('[data-tel-text]').forEach(function (n) { n.textContent = tel.join(' '); });
  })();

  /* Count-up for headline metrics (final text is already in the HTML) */
  (function () {
    if (reduce.matches || !('IntersectionObserver' in window)) return;
    var nums = document.querySelectorAll('[data-count]');
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        o.unobserve(e.target);
        var el = e.target, end = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0);
        var final = el.textContent, t0 = null, dur = 1100;
        function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3));
          el.textContent = p === 1 ? final : v.toLocaleString('en-CA', { minimumFractionDigits: dec, maximumFractionDigits: dec });
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { o.observe(n); });
  })();

  /* Dummy contact form: validate, log, show message. Posts nowhere. */
  var form = document.getElementById('form');
  var ok = document.getElementById('ok');
  function check(input, errId, valid) {
    var err = document.getElementById(errId);
    err.hidden = valid;
    input.setAttribute('aria-invalid', valid ? 'false' : 'true');
    return valid;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ok.hidden = true;
    var n = form.elements.name, m = form.elements.email, g = form.elements.message;
    var a = check(n, 'e-name', n.value.trim().length > 0);
    var b = check(m, 'e-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()));
    var c = check(g, 'e-msg', g.value.trim().length > 0);
    if (!(a && b && c)) { (!a ? n : !b ? m : g).focus(); return; }
    console.log('Dummy form submitted (not sent anywhere):', { name: n.value, email: m.value, message: g.value });
    form.reset();
    ok.hidden = false;
    ok.focus();
  });
})();
