import { CATALOGUE } from './catalogue.js';
import { camelLabel } from './camel.js';
import { CATEGORIES, CATEGORY_BY_NO } from './categories.js';

// Store catalogue. The hallway builds itself from DOMAINS, which is assembled at the bottom of this file:
//   - HAND: optional hand-written stores with their own full site; currently empty, so the mall is exactly the spreadsheet;
//   - CATALOGUE (catalogue.js, generated from the owner's spreadsheet): every other domain, expanded
//     from its category (categories.js) so that all domains in a category share a look and a site theme.
// To add one more ordinary domain, add a row to the spreadsheet and re-run tools/build-catalogue.py.
// `facts` is a list of {k, v}; use '—' where a value is not yet known (never invent figures).
// `sale: false` removes the buy button (used for placeholder slots).
// `site` is the domain's own full concept site, opened from the store page; omit it if there isn't one.
// `cat` is the category number (see categories.js).
const HAND = []; // none at present: every door comes from the spreadsheet (see CATALOGUE)

// ---- Everything below turns CATALOGUE rows into full store entries ----

// What the extension is, for the "Extension" fact. Only well-known, stable facts; anything else is left generic.
const TLD = {
  com: 'generic TLD', org: 'generic TLD', net: 'generic TLD',
  in: 'India country-code TLD', 'co.in': 'India second-level domain',
  uk: 'United Kingdom country-code TLD', 'co.uk': 'United Kingdom second-level domain', 'org.uk': 'United Kingdom second-level domain',
  si: 'Slovenia country-code TLD', us: 'United States country-code TLD', fm: 'Micronesia country-code TLD',
  tv: 'Tuvalu country-code TLD', to: 'Tonga country-code TLD', co: 'Colombia country-code TLD',
  ai: 'Anguilla country-code TLD', me: 'Montenegro country-code TLD', vc: 'Saint Vincent and the Grenadines country-code TLD',
};
const fill = (str, B, D) => str.replaceAll('{B}', B).replaceAll('{D}', D);

function expand([domain, catNo]) {
  const cat = CATEGORY_BY_NO[catNo];
  const label = domain.split('.')[0];
  const ext = domain.slice(label.length + 1);
  const B = camelLabel(label); // "HinduMandir": word-split CamelCase brand name, used everywhere (signs, stores, concept sites)
  const id = domain.replace(/[^a-z0-9]+/g, '-');
  return {
    id, cat: catNo, domain, brand: B, ext,
    name: `${B}.${ext}`,
    tagline: cat.tagline,
    theme: cat.key,
    signFont: cat.signFont,
    site: `site/?d=${id}`,
    accent: cat.accent,
    accent2: cat.accent2,
    sale: true,
    price: 'Make an offer',
    why: fill(cat.why, B, domain),
    buyers: cat.buyers,
    facts: [
      { k: 'Extension', v: `.${ext}${TLD[ext] ? ` (${TLD[ext]})` : ' (new generic TLD)'}` },
      { k: 'Name length', v: `${label.length} characters before the dot` },
      { k: 'Registered', v: '—' },
      { k: 'Registrar', v: '—' },
      { k: 'Transfer', v: 'Arranged with the owner after agreement' },
      { k: 'Included', v: 'Domain name only; no trademark, website or business' },
    ],
    signals: [],
  };
}

// Hallway order: category by category (the order of CATEGORIES); inside each, the hand-built stores first.
const handNames = new Set(HAND.map((d) => d.name.toLowerCase()));
const generated = CATALOGUE.filter(([domain]) => !handNames.has(domain)).map(expand);
export const DOMAINS = CATEGORIES.flatMap((c) => [
  ...HAND.filter((d) => d.cat === c.no),
  ...generated.filter((d) => d.cat === c.no),
]);

// One entry per category, in hallway order: where its stretch of corridor begins and how many doors it has.
export const WINGS = CATEGORIES.map((c) => {
  const first = DOMAINS.findIndex((d) => d.cat === c.no);
  return { ...c, first, count: DOMAINS.filter((d) => d.cat === c.no).length };
}).filter((w) => w.count > 0);
