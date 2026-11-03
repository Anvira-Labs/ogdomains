// DOM side of the mall: store overlay, directory nav and the (dummy) buy form.
const $ = (s, r = document) => r.querySelector(s);
const storeEl = $('#store');
const modal = $('#modal');
const form = $('#buy-form');
let current = null;
let onBack = () => {};
let lastFocus = null;       // element focused before the store opened
let modalFocus = null;      // element focused before the buy modal opened
const catalogue = $('#catalogue');
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// --- Crawlable listing: visible without JS / without WebGL, visually hidden while the 3D mall runs.
const HIDE = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0';
function syncCatalogue() {
  if (!catalogue) return;
  const noGL = document.body.classList.contains('no-gl');
  catalogue.classList.toggle('catalogue-hidden', !noGL);
  // Skip-link target stays reachable by screen readers; inline style only while 3D is active.
  if (noGL) catalogue.removeAttribute('style'); else catalogue.setAttribute('style', HIDE);
}
syncCatalogue();
new MutationObserver(syncCatalogue).observe(document.body, { attributes: true, attributeFilter: ['class'] });
// Skip link: reveal the list to everyone using it (keyboard / screen reader), then focus it.
const skip = $('.skip-link');
if (skip && catalogue) {
  skip.addEventListener('click', () => {
    if (isStoreOpen()) return;
    catalogue.removeAttribute('style');
    catalogue.classList.add('catalogue-open');
    catalogue.focus({ preventScroll: false });
  });
  catalogue.addEventListener('focusout', (e) => {
    if (catalogue.contains(e.relatedTarget) || document.body.classList.contains('no-gl')) return;
    catalogue.classList.remove('catalogue-open');
    syncCatalogue();
  });
}

// --- Dialog helpers: inert background + focus trap.
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select,textarea,[tabindex]:not([tabindex="-1"])';
const inerted = new Map(); // element -> previous inert state, per dialog
function isolate(dialog, key) {
  const list = [];
  for (const el of document.body.children) {
    if (el === dialog || el.contains(dialog) || el.tagName === 'SCRIPT' || el.tagName === 'NOSCRIPT') continue;
    if (el === modal && key === 'store') continue;
    if (!el.inert) { el.inert = true; list.push(el); }
  }
  inerted.set(key, list);
}
function release(key) {
  (inerted.get(key) || []).forEach((el) => { el.inert = false; });
  inerted.delete(key);
}
function trap(e, dialog) {
  if (e.key !== 'Tab') return;
  const items = [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
  if (!items.length) { e.preventDefault(); return; }
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
}
storeEl.inert = true;
modal.inert = true;
storeEl.addEventListener('keydown', (e) => trap(e, storeEl));
modal.addEventListener('keydown', (e) => trap(e, modal));

export function setBackHandler(fn) { onBack = fn; }

// The HUD directory. 147 chips would not fit, so it shows one chip per wing (category) that walks you to the
// start of that stretch of corridor, plus a "find a domain" box that jumps straight into one store.
export function renderDirectory(wings, domains, on) {
  const nav = $('#dirs');
  nav.innerHTML = wings
    .map((w) => `<button type="button" data-cat="${w.no}" style="--a:${w.accent}" title="Stores ${w.first + 1}–${w.first + w.count}" aria-label="Walk to ${esc(w.name)}, stores ${w.first + 1} to ${w.first + w.count}, ${w.count} ${w.count === 1 ? 'domain' : 'domains'}"><b aria-hidden="true">${String(w.no).padStart(2, '0')}</b>${esc(w.short)}<small aria-hidden="true">${w.count}</small></button>`)
    .join('');
  nav.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cat]');
    if (b) on.wing(wings.find((w) => w.no === +b.dataset.cat));
  });

  const input = $('#finder'), list = $('#finder-list');
  if (!input || !list) return;
  list.innerHTML = domains.map((d, i) => `<option value="${esc(d.name)}" label="No. ${String(i + 1).padStart(3, '0')}"></option>`).join('');
  const find = (text) => {
    const v = text.trim().toLowerCase();
    if (!v) return -1;
    const num = /^(?:no\.?\s*|#|store\s*)?0*(\d{1,3})$/.exec(v);    // "79", "079", "#79", "no. 79": go by store number
    if (num) { const i = +num[1] - 1; return i >= 0 && i < domains.length ? i : -1; }
    const exact = domains.findIndex((d) => d.name.toLowerCase() === v);
    if (exact >= 0) return exact;
    const starts = domains.map((d, i) => (d.name.toLowerCase().startsWith(v) ? i : -1)).filter((i) => i >= 0);
    return starts.length === 1 ? starts[0] : -1; // a unique prefix is enough; otherwise make them choose
  };
  input.addEventListener('change', () => {
    const i = find(input.value);
    if (i < 0) {
      if (input.value.trim()) { input.setAttribute('aria-invalid', 'true'); input.title = 'Pick a domain from the list'; }
      return;
    }
    input.removeAttribute('aria-invalid'); input.title = '';
    input.value = ''; input.blur();
    on.store(i);
  });
  input.addEventListener('input', () => input.removeAttribute('aria-invalid'));
}

let activeCat = null;
export function markActive(catNo) {
  if (catNo === activeCat) return;
  activeCat = catNo;
  document.querySelectorAll('#dirs button').forEach((b) => b.classList.toggle('on', +b.dataset.cat === catNo));
}

const isStoreOpen_ = () => storeEl.classList.contains('open');

export function openStore(d, index) {
  const wasOpen = isStoreOpen_();
  current = d;
  const signals = d.signals.length
    ? `<h3>Category signals</h3><ul class="signals">${d.signals.map((s) => `<li>${s.t} <a href="${s.href}" target="_blank" rel="noopener noreferrer">Source ↗</a></li>`).join('')}</ul>`
    : '';
  const buyers = d.buyers.length
    ? `<h3>Ideal buyers</h3><div class="chips">${d.buyers.map((b) => `<span>${b}</span>`).join('')}</div>`
    : '';
  const facts = (d.facts && d.facts.length)
    ? `<h3>Domain facts</h3><dl class="facts">${d.facts.map((f) => `<div><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join('')}</dl>`
    : '';
  // A domain that isn't for sale can still carry its own call to action (`cta`),
  // which replaces the buy button and the generic "step inside" link.
  const cta = d.sale
    ? `<button class="btn" type="button" data-buy>Buy this domain</button>`
    : d.cta
      ? `<a class="btn" href="${esc(d.cta.href)}">${esc(d.cta.label)} →</a>`
      : `<span class="pill">Not yet open</span>`;
  // Each domain's own site lives under sites/<id>/ and opens as a normal page.
  const visit = (d.site && !d.cta)
    ? `<a class="btn ghost" href="${esc(d.site)}">Step inside ${esc(d.name)} →</a>`
    : '';
  storeEl.innerHTML = `
    <div class="store-inner" data-theme="${d.theme}" style="--a:${d.accent};--b:${d.accent2}">
      <div class="fx" aria-hidden="true"></div>
      <button class="back" type="button" data-back>← Back to hallway</button>
      <div class="hero">
        <p class="eyebrow">Store ${String(index + 1).padStart(3, '0')} · ${d.sale ? 'For sale' : d.cta ? 'Not for sale' : 'Coming soon'}</p>
        <h2 id="store-title">${d.name}</h2>
        <p class="tag">${d.tagline}</p>
        <div class="cta">${visit}${cta}<span class="price">${d.price}</span></div>
      </div>
      <div class="body">
        <h3>Why this name</h3><p>${d.why}</p>
        ${buyers}
        ${facts}
        ${signals}
      </div>
    </div>`;
  if (!wasOpen) lastFocus = document.activeElement;
  storeEl.setAttribute('role', 'dialog');
  storeEl.setAttribute('aria-modal', 'true');
  storeEl.removeAttribute('aria-label');
  storeEl.setAttribute('aria-labelledby', 'store-title');
  storeEl.inert = false;
  release('store');
  isolate(storeEl, 'store');
  storeEl.setAttribute('aria-hidden', 'false');
  storeEl.classList.add('open');
  storeEl.scrollTop = 0;
  $('[data-back]', storeEl).focus({ preventScroll: true });
}

export function closeStore() {
  closeModal(true);
  storeEl.classList.remove('open');
  storeEl.setAttribute('aria-hidden', 'true');
  current = null;
  storeEl.inert = true;
  release('store');
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}

export const isStoreOpen = () => !!current;

function openModal() {
  if (!current) return;
  $('#modal-domain').textContent = current.name;
  form.reset();
  clearErrors();
  $('.ok', form).textContent = '';
  $('button[type=submit]', form).disabled = false;
  modalFocus = document.activeElement;
  modal.inert = false;
  isolate(modal, 'modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  $('input[name=mobile]', form).focus();
}

export function closeModal(skipRestore) {
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modal.inert = true;
  release('modal');
  if (skipRestore !== true && modalFocus && modalFocus.isConnected && modalFocus.focus) modalFocus.focus({ preventScroll: true });
  modalFocus = null;
}
export const isModalOpen = () => modal.classList.contains('open');

storeEl.addEventListener('click', (e) => {
  if (e.target.closest('[data-back]')) onBack();
  else if (e.target.closest('[data-buy]')) openModal();
});
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.closest('[data-close]')) closeModal();
});

function clearErrors() {
  $('.err', form).textContent = '';
  form.querySelectorAll('[aria-invalid]').forEach((el) => { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
}
function fail(field, msg) {
  const err = $('.err', form);
  err.textContent = msg; // announced via the aria-live region
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', err.id);
  field.focus();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  const mobile = form.mobile.value.trim();
  const email = form.email.value.trim();
  const offerRaw = form.offer.value.trim();
  const digits = mobile.replace(/\D/g, '');
  if (!/^\+?[\d\s\-()]+$/.test(mobile) || digits.length < 7 || digits.length > 15) {
    fail(form.mobile, 'Please enter a valid mobile number.'); return;
  }
  if (!form.email.checkValidity() || !email) {
    fail(form.email, 'Please enter a valid email address.'); return;
  }
  let offer = null;
  if (offerRaw) {
    const n = Number(offerRaw.replace(/[,\s$]/g, ''));
    if (!/^[\d,.\s$]+$/.test(offerRaw) || !Number.isFinite(n) || n <= 0) {
      fail(form.offer, 'Your offer must be a positive number in USD, or leave it blank.'); return;
    }
    offer = n;
  }
  $('button[type=submit]', form).disabled = true;
  // Honeypot: bots fill the hidden field. Pretend success, log nothing.
  if (form.website.value) { $('.ok', form).textContent = 'Thanks! Your enquiry is noted.'; return; }
  // Dummy submit: nothing leaves the browser. Wire this to a form service when ready.
  console.log('[OGDomains enquiry]', { domain: current && current.name, mobile, email, offerUSD: offer });
  $('.ok', form).textContent = `Thanks! Your enquiry for ${current.name} is noted. The owner will be in touch.`;
});
