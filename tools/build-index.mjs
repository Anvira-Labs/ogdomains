#!/usr/bin/env node
// Regenerates the crawlable parts of index.html (the JSON-LD list and the <main id="catalogue"> block) from
// js/domains.js, so search engines and no-JS visitors see every domain. Run after changing the domain list:
//     node tools/build-index.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { DOMAINS, WINGS } from '../js/domains.js';

const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const path = new URL('../index.html', import.meta.url);
let html = readFileSync(path, 'utf8');

const ld = {
  '@context': 'https://schema.org', '@type': 'ItemList', name: 'OGDomains – Premium domains for sale',
  itemListElement: DOMAINS.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.name, description: d.sale ? d.tagline : `${d.tagline} The owner's own site, not for sale.` })),
};
const ldBlock = `<script type="application/ld+json">\n  ${JSON.stringify(ld, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;

const price = (d) => (d.sale ? '<p>Price: make an offer.</p>' : '<p>Not for sale — the owner\'s own site.</p>');
const articles = WINGS.map((w) => {
  const items = DOMAINS.map((d, i) => [d, i]).filter(([d]) => d.cat === w.no).map(([d, i]) => `      <article id="cat-${esc(d.id)}">
        <h4>${esc(d.name)} <small>(store ${String(i + 1).padStart(3, '0')})</small></h4>
        <p><strong>${esc(d.tagline)}</strong></p>
        <p>${esc(d.why)}</p>
        ${price(d)}
      </article>`).join('\n');
  return `    <section aria-labelledby="wing-${w.no}">\n      <h3 id="wing-${w.no}">${esc(w.name)} (${w.count})</h3>\n${items}\n    </section>`;
}).join('\n');
const catBlock = `<main id="catalogue" class="catalogue" tabindex="-1" aria-labelledby="catalogue-title">
    <h2 id="catalogue-title">Domains at OGDomains</h2>
    <p>${DOMAINS.length} domains in ${WINGS.length} categories. Prices are not listed. Domains marked for sale are available by making an offer, and cover the domain name only: no trademark, website or business is included. Entries marked otherwise are not for sale.</p>
${articles}
  </main>`;

const swap = (re, block, what) => { if (!re.test(html)) throw new Error('marker not found: ' + what); html = html.replace(re, () => block); };
swap(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ldBlock, 'JSON-LD');
swap(/<main id="catalogue"[\s\S]*?<\/main>/, catBlock, 'catalogue');
writeFileSync(path, html);
console.log(`index.html updated: ${DOMAINS.length} domains in ${WINGS.length} categories`);
