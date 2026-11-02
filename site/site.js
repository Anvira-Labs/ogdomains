// Renders a concept site for one domain: /site/?d=<id>. One template serves every domain in the mall that has no
// hand-built site: the category (js/categories.js) decides the theme file and the wording, the domain supplies
// the brand name. Personal-name domains get the blank portfolio (see renderPortfolio).
import { DOMAINS } from '../js/domains.js';
import { CATEGORY_BY_NO } from '../js/categories.js';
import { PROFILES } from '../js/profiles.js';

const app = document.getElementById('app');
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeHref = (h) => (/^(https?:|mailto:)/i.test(h || '') ? h : '#');
const id = new URLSearchParams(location.search).get('d');
const d = DOMAINS.find((x) => x.id === id);

function notFound() {
  document.title = 'Not found · OGDomains';
  app.innerHTML = `<div class="wrap" style="padding-top:20vh"><h1>No such door</h1><p class="lead">There is no concept site for “${esc(id || '')}”.</p><p class="cta"><a class="btn" href="../index.html">Back to the mall</a></p></div>`;
  app.hidden = false;
}

function shell(main, cat) {
  const back = `../index.html#hall-${esc(d.id)}`;
  return `<a class="skip" href="#main">Skip to content</a>
  <header class="top"><a class="back" href="${back}">&larr; Back to the mall</a><span class="addr">${esc(d.domain)}</span></header>
  <div id="main" tabindex="-1">${main}</div>`;
}

function renderCategorySite(cat) {
  const B = d.brand, fill = (s) => s.replaceAll('{B}', B).replaceAll('{D}', d.domain);
  const s = cat.site;
  const cards = s.cards.map(([t, p], i) => `<article class="card"><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(fill(p))}</p></article>`).join('');
  const chips = d.buyers.map((b) => `<li>${esc(b)}</li>`).join('');
  const facts = d.facts.map((f) => `<div><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join('');
  document.title = `${B}${'.' + d.ext} · concept site`;
  return shell(`
  <section class="hero"><div class="wrap"><div>
    <p class="kicker">${esc(s.kicker)}</p>
    <h1><span class="b">${esc(B)}</span><span class="x">.${esc(d.ext)}</span></h1>
    <p class="lead">${esc(fill(s.lead))}</p>
    <p class="forsale"><strong>This domain is for sale.</strong> This page is a concept site, not a real company, and has no affiliation with any existing brand, channel, school or organisation.</p>
    <div class="cta"><a class="btn" href="#enquire">Enquire about the domain</a><a class="btn ghost" href="#build">See what could be built</a></div>
  </div><div class="art" aria-hidden="true"></div></div></section>
  <section class="block" id="build"><div class="wrap"><h2>What could be built</h2><div class="cards">${cards}</div></div></section>
  <section class="block"><div class="wrap"><h2>Who it is for</h2><ul class="chips">${chips}</ul></div></section>
  <section class="block"><div class="wrap"><h2>The domain</h2><dl class="facts">${facts}</dl></div></section>
  <section class="block" id="enquire"><div class="wrap"><h2>Enquire about ${esc(d.name)}</h2>${form()}</div></section>
  <footer class="foot"><div class="wrap"><p>${esc(d.name)} is listed at <a href="../index.html#hall-${esc(d.id)}">OGDomains</a>. The sale covers the domain name only: no trademark, website or business is included.</p><p>This concept page uses made-up copy and no real company's name, logo or content.</p></div></footer>`, cat);
}

// ---- Blank portfolio ----------------------------------------------------------------------------------------
// Layout, top to bottom, and why:
//   identity  (left rail, stays in view): photo, name, role, where to reach you. The reader knows who this is in 2 seconds.
//   headline  one sentence on what you do and for whom.
//   about     2-3 short paragraphs: who you are, what you are good at, what you want next.
//   work      3 case studies, each as problem -> what you did -> result. Proof beats adjectives.
//   skills    grouped, not a cloud; only what you would be happy to be asked about.
//   experience a short timeline, one line of impact per role.
//   writing   optional: talks, articles, open source.
//   contact   one clear next step and what to write about.
// Anything not supplied in js/profiles.js stays a dashed grey placeholder with a hint, so the gaps are obvious.
function renderPortfolio() {
  const P = PROFILES[d.id], blank = !P, p = P || {};
  const ph = (text, tag = 'span') => `<${tag} class="ph">${esc(text)}</${tag}>`;
  const hint = (t) => (blank ? `<p class="hint">What goes here: ${esc(t)}</p>` : '');
  const text = (v, fallback, tag = 'span') => (v ? esc(v) : ph(fallback, tag));
  const name = p.name ? `<h1>${esc(p.name)}</h1>` : `<h1 class="ph">Your Name</h1>`;
  const links = [...(p.email ? [{ label: p.email, href: 'mailto:' + p.email }] : []), ...(p.links || [])];
  const linkList = links.length
    ? links.map((l) => `<li><a href="${esc(safeHref(l.href))}" rel="noopener">${esc(l.label)}</a></li>`).join('')
    : ['you@example.com', 'LinkedIn', 'GitHub / Dribbble / Behance', 'CV (PDF)'].map((t) => `<li>${ph(t)}</li>`).join('');
  const about = p.about && p.about.length ? p.about.map((t) => `<p class="body">${esc(t)}</p>`).join('')
    : [ph('Who you are, in one or two sentences.', 'p'), ph('What you are good at, and the kind of problems you like.', 'p'), ph('What you are looking for next.', 'p')].map((h) => h).join('<br>');
  const work = (p.work && p.work.length ? p.work : [null, null, null]).map((w, i) => `<article class="card">
    <h3>${w ? esc(w.title) : ph(`Project ${i + 1} name`)}</h3><p>${w ? esc(w.role || '') : ph('Your role · year')}</p>
    <dl><div><dt>Problem</dt><dd>${w ? esc(w.problem || '') : ph('What was wrong, and for whom?', 'span')}</dd></div>
    <div><dt>What I did</dt><dd>${w ? esc(w.action || '') : ph('Your part, in plain words.', 'span')}</dd></div>
    <div><dt>Result</dt><dd>${w ? esc(w.result || '') : ph('What changed. Use a number if you have one.', 'span')}</dd></div></dl>
    ${w && w.href ? `<p><a href="${esc(safeHref(w.href))}" rel="noopener" style="color:var(--a);font-weight:600">See the project →</a></p>` : ''}</article>`).join('');
  const skills = (p.skills && p.skills.length ? p.skills : [{ group: 'Group, e.g. Design', items: [] }, { group: 'Group, e.g. Tools', items: [] }]).map((g) =>
    `<div><h3>${p.skills ? esc(g.group) : ph(g.group)}</h3><ul class="chips">${(g.items.length ? g.items : ['Skill', 'Skill', 'Skill']).map((i) => `<li>${g.items.length ? esc(i) : ph(i)}</li>`).join('')}</ul></div>`).join('');
  const exp = (p.experience && p.experience.length ? p.experience : [null, null]).map((e) => `<li>${e
    ? `<b>${esc(e.role)}</b> · ${esc(e.org || '')}<small>${esc(e.dates || '')}</small><span>${esc(e.summary || '')}</span>`
    : `${ph('Role · Organisation')}<small>${ph('Dates')}</small>${ph('One line on the impact you had.')}`}</li>`).join('');
  const writing = p.writing && p.writing.length
    ? `<ul class="chips">${p.writing.map((w) => `<li><a href="${esc(safeHref(w.href))}" rel="noopener">${esc(w.title)}</a>${w.venue ? ' · ' + esc(w.venue) : ''}</li>`).join('')}</ul>`
    : ph('Optional: talks, articles, open-source work, with a link each.', 'p');
  document.title = blank ? `Portfolio template · ${d.domain}` : `${p.name} · ${p.role || 'Portfolio'}`;
  return shell(`
  ${blank ? `<div class="pf-banner" role="note"><strong>Blank portfolio template.</strong> ${esc(d.domain)} has no portfolio yet, so this page shows how a portfolio should be laid out. Grey dashed boxes are placeholders; the yellow notes say what belongs in each section. Fill it in through <code>js/profiles.js</code>. This page is not about any real person.</div>` : ''}
  <div class="pf">
    <aside class="pf-side" aria-label="Identity">
      <div class="avatar" role="img" aria-label="${blank ? 'Photo placeholder' : 'Photo'}"${p.photo ? ` style="background-image:url('${esc(p.photo)}')"` : ''}>${p.photo ? '' : 'your photo<br>(square, face clear)'}</div>
      ${name}
      <p class="pf-role">${text(p.role, 'Your role · what you do')}</p>
      <ul class="pf-links">${linkList}</ul>
    </aside>
    <div class="pf-main">
      <section aria-labelledby="h-intro"><h2 id="h-intro">Headline</h2>${hint('one sentence: what you do, for whom, and the kind of result you deliver. No buzzwords.')}<p class="big${p.tagline ? '' : ' ph'}">${p.tagline ? esc(p.tagline) : 'I help [who] do [what] so that [result].'}</p></section>
      <section aria-labelledby="h-about"><h2 id="h-about">About</h2>${hint('two or three short paragraphs. Who you are, what you are good at, what you want next. Under 120 words.')}${about}</section>
      <section aria-labelledby="h-work"><h2 id="h-work">Selected work</h2>${hint('three projects, not thirty. Each one as problem → what you did → result, with a number where you can.')}<div class="work">${work}</div></section>
      <section aria-labelledby="h-skills"><h2 id="h-skills">Skills</h2>${hint('grouped by kind, and only what you would happily be asked about in an interview.')}<div class="skills">${skills}</div></section>
      <section aria-labelledby="h-exp"><h2 id="h-exp">Experience</h2>${hint('newest first; one line of impact per role. The full history lives in your CV.')}<ul class="tl">${exp}</ul></section>
      <section aria-labelledby="h-writing"><h2 id="h-writing">Writing &amp; talks</h2>${writing}</section>
      <section aria-labelledby="h-contact"><h2 id="h-contact">Contact</h2>${hint('one clear next step: what to write about, and how quickly you reply.')}
        <p class="big${p.contact ? '' : ' ph'}">${p.contact ? esc(p.contact) : 'Write to me about [what], and I reply within [how long].'}</p>
        ${p.email ? `<a class="btn cta-mail" href="mailto:${esc(p.email)}">Email ${esc(p.name || '')}</a>` : ''}</section>
    </div>
  </div>
  <footer class="foot"><div class="wrap"><p>${esc(d.domain)} is listed at <a href="../index.html#hall-${esc(d.id)}">OGDomains</a>.${blank ? ' The sale covers the domain name only; this template is not a website for any person.' : ''}</p></div></footer>`, null);
}

// ---- Dummy enquiry form: validates, logs, sends nothing (same as the mall's own form) ----
function form() {
  return `<form class="enq" id="enq" novalidate>
    <label>Mobile number<input name="mobile" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 98765 43210" required></label>
    <label>Email<input name="email" type="email" autocomplete="email" placeholder="you@company.com" required></label>
    <label>Your offer (USD), optional<input name="offer" type="text" inputmode="decimal" autocomplete="off" placeholder="e.g. 5000"></label>
    <div class="hp" aria-hidden="true"><label>Leave empty<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
    <p class="note">This is a demo form: nothing is sent anywhere yet.</p>
    <p class="err" role="alert" aria-live="assertive"></p>
    <button class="btn" type="submit">Submit enquiry</button>
    <p class="ok" role="status" aria-live="polite"></p></form>`;
}
function wireForm() {
  const f = document.getElementById('enq');
  if (!f) return;
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = f.querySelector('.err'), ok = f.querySelector('.ok');
    err.textContent = ''; ok.textContent = '';
    f.querySelectorAll('[aria-invalid]').forEach((x) => x.removeAttribute('aria-invalid'));
    const bad = (el, msg) => { err.textContent = msg; el.setAttribute('aria-invalid', 'true'); el.focus(); };
    const mobile = f.mobile.value.trim(), digits = mobile.replace(/\D/g, '');
    if (!/^\+?[\d\s\-()]+$/.test(mobile) || digits.length < 7 || digits.length > 15) return bad(f.mobile, 'Please enter a valid mobile number.');
    if (!f.email.value.trim() || !f.email.checkValidity()) return bad(f.email, 'Please enter a valid email address.');
    let offer = null; const raw = f.offer.value.trim();
    if (raw) { const n = Number(raw.replace(/[,\s$]/g, '')); if (!/^[\d,.\s$]+$/.test(raw) || !Number.isFinite(n) || n <= 0) return bad(f.offer, 'Your offer must be a positive number in USD, or leave it blank.'); offer = n; }
    f.querySelector('button[type=submit]').disabled = true;
    if (f.website.value) { ok.textContent = 'Thanks! Your enquiry is noted.'; return; } // honeypot
    console.log('[OGDomains enquiry]', { domain: d.name, mobile, email: f.email.value.trim(), offerUSD: offer });
    ok.textContent = `Thanks! Your enquiry for ${d.name} is noted. The owner will be in touch.`;
  });
}

// ---- boot: load the theme stylesheet first so the page never flashes unstyled ----
if (!d) notFound();
else {
  const cat = CATEGORY_BY_NO[d.cat];
  document.documentElement.dataset.theme = cat.key;
  document.documentElement.dataset.layout = cat.site.layout;
  app.dataset.layout = cat.site.layout;
  const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: `themes/${cat.key}.css` });
  const show = () => {
    app.innerHTML = cat.blank ? renderPortfolio() : renderCategorySite(cat);
    wireForm(); app.hidden = false;
  };
  let shown = false; const once = () => { if (!shown) { shown = true; show(); } };
  link.onload = once; link.onerror = once; setTimeout(once, 2000);
  document.head.appendChild(link);
}
