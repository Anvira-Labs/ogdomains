// Turns a domain label into CamelCase by splitting it into known words: "hindumandir" -> "HinduMandir".
// Smart parts: a vocabulary of English + Hindi/Punjabi words and names; splits into the FEWEST words (ties go to longer words);
// acronyms stay upper-case ("icga" -> "ICGA"); digits are kept as their own piece; hyphens split parts; and a label it
// cannot fully explain is just capitalised rather than guessed at.
const WORDS = `
back order orders being desi big b bollywood festival film magazine studio city congratulations domain domains guru queen tools
diamond india english vinglish eternal voice khalsa school college kite fest lest we forget luxury condos music world perfume wala
play vision punjab punjabi republic tv smart guy snakes and ladders training wheels think positive to let top toronto fm weed media
og sharma ji bk holi tabla dara bittu kath putli e tele con
aastha akash vani amar singh amrit anant naad anil kapoor anokhi ashok bhakti path hindu mandir sabha jagannath jai dev ho
jyotish kama sutra katha malini awasthi masti pyar radhe raghu rajdhani ram nami otsav rath yatra sanskar satnam seva sukh swami
premananda ramdev sivananda tamasha tehlka thakur vijay vishva kalyan purnima divya yog yoga shivani sangeet sadhana
`.trim().split(/\s+/);
const ACRONYMS = new Set(['icga', 'iftda', 'vssct', 'isra', 'tv', 'fm', 'bk', 'og']);
const VOCAB = new Set(WORDS);

function split(s) {
  const n = s.length, best = new Array(n + 1).fill(null); best[0] = { c: 0, q: 0, prev: -1 };
  for (let i = 0; i < n; i++) {
    if (!best[i]) continue;
    for (let j = i + 1; j <= n; j++) {
      const w = s.slice(i, j);
      if (!(VOCAB.has(w) || ACRONYMS.has(w) || /^\d+$/.test(s.slice(i, j)) && (j === n || !/\d/.test(s[j])))) continue;
      const c = best[i].c + 1, q = best[i].q + w.length * w.length;
      if (!best[j] || c < best[j].c || (c === best[j].c && q > best[j].q)) best[j] = { c, q, prev: i };
    }
  }
  if (!best[n]) return null;
  const out = []; for (let j = n; j > 0; j = best[j].prev) out.unshift(s.slice(best[j].prev, j));
  return out;
}
const cap = (w) => (ACRONYMS.has(w) ? w.toUpperCase() : /^\d/.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1));

export function camelLabel(label) {
  return label.split('-').map((part) => {
    if (ACRONYMS.has(part)) return part.toUpperCase();
    const w = split(part);
    return w ? w.map(cap).join('') : part[0].toUpperCase() + part.slice(1);
  }).join('-');
}
