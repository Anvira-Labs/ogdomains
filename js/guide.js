// The guide: a flat 2D animated character in the corner of the mall, drawn as SVG from the owner's reference photo
// (cream fedora with a black band, grey hair and moustache, warm smile, white hoodie with a red mark).
// Animation, all 2D and cheap (transforms only):
//   - idle: breathing, a slow head sway, blinking every few seconds, a hat-tip now and then
//   - pointer: head, face, eyes and hat slide at different rates toward the pointer (or last touch) for depth;
//     the brows lift when you click or tap; after a few still seconds it faces you again
// CSS for the idle motion lives at the end of css/style.css (#guide ...).
import { FACTS, VALUE } from './facts.js';
import { DOMAINS } from './domains.js';

const root = document.createElement('div');
root.id = 'guide';
root.innerHTML = `
<svg aria-hidden="true" viewBox="0 0 200 215" focusable="false">
  <defs>
    <clipPath id="g-clip"><path d="M-10 -10H210V138H172A72 72 0 0 1 28 138H-10Z"/></clipPath>
    <clipPath id="g-eye-l"><ellipse cx="79" cy="87" rx="9.5" ry="6.5"/></clipPath>
    <clipPath id="g-eye-r"><ellipse cx="121" cy="87" rx="9.5" ry="6.5"/></clipPath>
    <radialGradient id="g-plate" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#6b4a1e"/><stop offset="1" stop-color="#150f08"/></radialGradient>
  </defs>
  <circle class="g-plate" cx="100" cy="138" r="72" fill="url(#g-plate)"/>
  <g clip-path="url(#g-clip)">
    <g class="g-body">
      <path d="M8 218C12 178 44 164 78 160h44c34 4 66 18 70 58z" fill="#f6f6f8"/>
      <path d="M58 162c-2-16 12-24 22-18l20 20 20-20c10-6 24 2 22 18-12 12-72 12-84 0z" fill="#e2e3ea"/>
      <path d="M83 156l17 22 17-22z" fill="#16161b"/>
      <path d="M64 205c22-12 52-12 74 0v12H64z" fill="#e8472f"/>
      <path d="M86 132h28v28q-14 9-28 0z" fill="#a4623b"/>
      <path d="M86 150q14 10 28 0v-6q-14 8-28 0z" fill="#8e5130"/>
    </g>
  </g>
  <g id="g-head"><g class="g-sway">
    <g id="g-ears"><ellipse cx="57" cy="98" rx="8" ry="12" fill="#a8683f"/><ellipse cx="143" cy="98" rx="8" ry="12" fill="#a8683f"/></g>
    <path d="M58 82c-6 14-4 30 2 40l6-8-2-26zM142 82c6 14 4 30-2 40l-6-8 2-26z" fill="#d7d9df"/>
    <path d="M58 92C58 62 76 50 100 50s42 12 42 42v14c0 30-18 42-42 42S58 136 58 106z" fill="#bd7c53"/>
    <path d="M62 112c4 26 18 36 38 36s34-10 38-36c-8 18-20 26-38 26s-30-8-38-26z" fill="#a8683f" opacity=".55"/>
    <g id="g-face">
      <ellipse cx="72" cy="108" rx="11" ry="8" fill="#d28c62" opacity=".7"/><ellipse cx="128" cy="108" rx="11" ry="8" fill="#d28c62" opacity=".7"/>
      <g id="g-brows" fill="none" stroke="#dcdee4" stroke-width="5.5" stroke-linecap="round"><path d="M68 76q11-7 22-1"/><path d="M110 75q11-6 22 1"/></g>
      <ellipse cx="79" cy="87" rx="9.5" ry="6.5" fill="#fff"/><ellipse cx="121" cy="87" rx="9.5" ry="6.5" fill="#fff"/>
      <g clip-path="url(#g-eye-l)"><g class="g-pupil"><circle cx="79" cy="87" r="5" fill="#3b261a"/><circle cx="79" cy="87" r="2.4" fill="#0f0805"/><circle cx="81" cy="85" r="1.4" fill="#fff"/></g></g>
      <g clip-path="url(#g-eye-r)"><g class="g-pupil"><circle cx="121" cy="87" r="5" fill="#3b261a"/><circle cx="121" cy="87" r="2.4" fill="#0f0805"/><circle cx="123" cy="85" r="1.4" fill="#fff"/></g></g>
      <g class="g-lids" fill="#bd7c53"><rect class="g-lid" x="68" y="78" width="22" height="17"/><rect class="g-lid" x="110" y="78" width="22" height="17"/></g>
      <path d="M69 88q10-9 20 0M111 88q10-9 20 0" fill="none" stroke="#8a5233" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M98 92q-6 14 0 18 6 2 9-2" fill="none" stroke="#8e5130" stroke-width="2.4" stroke-linecap="round"/>
      <g id="g-mouth"><path d="M76 119q24 24 48 0q-24 8-48 0z" fill="#fff" stroke="#6e3326" stroke-width="2" stroke-linejoin="round"/></g>
      <path d="M78 113q11-7 22-2 11-5 22 2-10 11-22 5-12 6-22-5z" fill="#d5d7de"/>
      <path d="M68 118q-3 8 4 14M132 118q3 8-4 14" fill="none" stroke="#8e5130" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>
    </g>
    <g id="g-hat"><g class="g-tip">
      <ellipse cx="100" cy="60" rx="62" ry="13" fill="#e2d3ae"/>
      <ellipse cx="100" cy="57" rx="55" ry="9.5" fill="#f1e6c8"/>
      <path d="M62 56C62 30 76 15 91 12q9 7 18 0c15 3 29 18 29 44q-38 9-76 0z" fill="#efe2c2"/>
      <path d="M74 32q26-12 52 0M80 23q20-7 40 0" fill="none" stroke="#d6c6a0" stroke-width="2" stroke-linecap="round"/>
      <path d="M62 44q38 11 76 0v12q-38 10-76 0z" fill="#17171c"/>
      <path d="M62 46q38 11 76 0" fill="none" stroke="#3a3a44" stroke-width="1.2"/>
      <path d="M46 62q54 20 108 0" fill="none" stroke="#bfae84" stroke-width="1.6" opacity=".7"/>
    </g></g>
  </g></g>
</svg>
<div class="g-say" id="g-say" hidden>
  <p id="g-text" role="status" aria-live="polite"></p>
  <p class="g-vname" id="g-vname" hidden></p>
  <div class="g-ctl">
    <button type="button" id="g-next">Another fact</button>
    <button type="button" id="g-voice" aria-pressed="false">Voice: off</button>
    <button type="button" id="g-change" hidden>Change voice</button>
    <button type="button" id="g-close" aria-label="Close the guide's speech">&times;</button>
  </div>
</div>`;
document.body.appendChild(root);

const $ = (s) => root.querySelector(s);
const head = $('#g-head'), face = $('#g-face'), hat = $('#g-hat'), ears = $('#g-ears');
const pupils = root.querySelectorAll('.g-pupil'), brows = $('#g-brows');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) root.classList.add('still');             // CSS stops the idle animation; following the pointer stays, un-eased

const EASE = reduce ? 1 : 0.13;      // share of the remaining turn per frame; lower = lazier head
const REACH = 0.45, REACH_Y = 0.9;   // how far the pointer must be (share of viewport) for a full turn
const IDLE_MS = 4500;                // still this long -> face the visitor again
const clamp = (v) => Math.max(-1, Math.min(1, v));
let goal = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, running = false, idle = 0;

function pose(x, y) {                // x: -1 left .. 1 right; y: -1 up .. 1 down. Deeper layers travel further.
  head.setAttribute('transform', `translate(${x * 5} ${y * 3}) rotate(${x * 5} 100 150)`);
  face.setAttribute('transform', `translate(${x * 8.5} ${y * 5})`);
  hat.setAttribute('transform', `translate(${x * 4} ${y * 3}) rotate(${x * 2.5} 100 58)`);
  ears.setAttribute('transform', `translate(${x * 5} 0)`);
  pupils.forEach((p) => p.setAttribute('transform', `translate(${x * 3.4} ${y * 2.4})`));
}
function frame() {
  cur.x += (goal.x - cur.x) * EASE; cur.y += (goal.y - cur.y) * EASE;
  pose(cur.x, cur.y);
  if (Math.abs(goal.x - cur.x) + Math.abs(goal.y - cur.y) > 0.004) requestAnimationFrame(frame); else running = false;
}
const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

function lookAt(px, py) {
  const b = root.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2, dx = px - cx;
  // In a corner, "how far" is measured against the room on the pointer's side, so the left edge still turns the head fully left.
  goal.x = clamp(dx / (dx < 0 ? Math.max(120, cx) : innerWidth * REACH));
  goal.y = clamp((py - cy) / (innerHeight * REACH_Y));
  kick();
  clearTimeout(idle);
  idle = setTimeout(() => { goal.x = goal.y = 0; kick(); }, IDLE_MS);
}
addEventListener('pointermove', (e) => lookAt(e.clientX, e.clientY), { passive: true });
addEventListener('pointerdown', (e) => {
  lookAt(e.clientX, e.clientY);
  brows.classList.remove('up'); void brows.getBoundingClientRect(); brows.classList.add('up'); // restart the brow-raise
}, { passive: true });
document.addEventListener('mouseleave', () => { goal.x = goal.y = 0; kick(); });

// Hat-tip: once shortly after load, then every so often.
function tip() { root.classList.add('tipping'); setTimeout(() => root.classList.remove('tipping'), 1300); }
if (!reduce) { setTimeout(tip, 1600); setInterval(tip, 16000 + Math.random() * 6000); }
pose(0, 0);

// ---- Speech: a random fact in a bubble, typed out while the mouth moves; optional read-aloud voice ----
const say = $('#g-say'), textEl = $('#g-text'), btnNext = $('#g-next'), btnVoice = $('#g-voice'), btnChange = $('#g-change'), btnClose = $('#g-close');
const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
const VOICE_KEY = 'ogd-guide-voice', VOICE_NAME_KEY = 'ogd-guide-voice-name';
let voiceOn = false;
try { voiceOn = !!synth && localStorage.getItem(VOICE_KEY) === '1'; } catch {}
if (!synth) btnVoice.hidden = true;

// The voices are whatever this device ships with, so the accent cannot be guaranteed. The target is an upbeat,
// friendly Canadian man in his fifties: prefer an en-CA voice, then North American male voices, and never a novelty voice.
const NOVELTY = /^(bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|junior|kathy|ralph|grandma|grandpa)\b/i;
const MALE = ['reed', 'eddy', 'rocko', 'fred', 'aaron', 'evan', 'nathan', 'tom', 'alex', 'daniel', 'oliver', 'arthur', 'gordon', 'google us english', 'microsoft mark', 'microsoft david'];
function rank(v) {
  const lang = v.lang.replace('_', '-'), name = v.name.toLowerCase();
  const m = MALE.findIndex((n) => name.includes(n));
  return (/^en-CA$/i.test(lang) ? 0 : /^en-US$/i.test(lang) ? 100 : /^en-(GB|AU|IE)$/i.test(lang) ? 200 : 300) + (m < 0 ? 50 : m);
}
const englishVoices = () => (synth ? synth.getVoices() : []).filter((v) => /^en/i.test(v.lang) && !NOVELTY.test(v.name)).sort((a, b) => rank(a) - rank(b));
let voiceName = '';
try { voiceName = localStorage.getItem(VOICE_NAME_KEY) || ''; } catch {}
const currentVoice = () => { const vs = englishVoices(); return vs.find((v) => v.name === voiceName) || vs[0] || null; };
function showVoiceName() {
  const v = currentVoice(), el = $('#g-vname');
  btnChange.hidden = !(voiceOn && englishVoices().length > 1);
  el.hidden = !(voiceOn && v);
  if (v) el.textContent = `Voice: ${v.name.replace(/\s*\(.*\)$/, '')} (${v.lang.replace('_', '-')})${/^en-CA$/i.test(v.lang.replace('_', '-')) ? '' : ' · no Canadian voice on this device'}`;
}
const setVoice = (on) => {
  voiceOn = on; btnVoice.setAttribute('aria-pressed', String(on)); btnVoice.textContent = 'Voice: ' + (on ? 'on' : 'off');
  try { localStorage.setItem(VOICE_KEY, on ? '1' : '0'); } catch {}
  if (!on && synth) synth.cancel();
  showVoiceName();
};
if (synth) synth.addEventListener('voiceschanged', showVoiceName);   // many browsers load the list late
setVoice(voiceOn);

let bag = [], typing = 0, hideTimer = 0, nextTimer = 0, autoShown = 0, stopped = false, hovering = false;
const MAX_AUTO = 5;                                   // the guide speaks up on its own this many times, then waits to be asked
let first = true;
const OPENERS = ['Hey there!', 'Here\'s a good one!', 'Did you know?', 'Oh, I love this one!', 'Listen to this, friend!', 'Fun fact!', 'Now this is important!'];
const lively = (f) => f.replace(/\.$/, '!');                    // an upbeat ending
const fill = (f) => lively(f.replace('{n}', DOMAINS.length));
const pick = () => {                                  // shuffle bag: every fact once before any repeats
  if (first) { first = false; return 'Welcome in, friend! ' + fill(VALUE[Math.floor(Math.random() * VALUE.length)]); }   // open with the value of a good name
  if (!bag.length) bag = FACTS.map(fill).sort(() => Math.random() - 0.5);
  const f = bag.pop();
  return Math.random() < 0.6 ? OPENERS[Math.floor(Math.random() * OPENERS.length)] + ' ' + f : f;
};
const inStore = () => document.body.classList.contains('in-store');

// Each fact is revealed in step with how it is delivered. With the voice on, the words appear AS they are spoken
// (the browser's word-boundary events drive the text, like live captions), so what you read is exactly what you hear.
// With the voice off, it types out at a reading pace. `seq` makes sure a stale utterance never overwrites a newer fact.
let seq = 0, current = '';
function showFact(fact = pick()) {
  const mine = ++seq; current = fact;
  clearInterval(typing); clearTimeout(hideTimer);
  if (synth) synth.cancel();
  say.hidden = false; say.classList.add('on'); textEl.textContent = '';
  const reveal = (n) => { if (mine === seq) textEl.textContent = fact.slice(0, n); };
  const finish = () => { if (mine !== seq) return; clearInterval(typing); reveal(fact.length); root.classList.remove('talking'); hideLater(fact); };
  const timed = (msPerChar) => {                      // fallback pacing: no boundary events, or voice off
    let i = 0; root.classList.add('talking'); clearInterval(typing);
    typing = setInterval(() => { if (mine !== seq) return clearInterval(typing); reveal(++i); if (i >= fact.length) finish(); }, msPerChar);
  };
  if (!(voiceOn && synth)) return timed(reduce ? 14 : 24);

  const u = new SpeechSynthesisUtterance(fact);
  u.voice = currentVoice();
  if (u.voice) u.lang = u.voice.lang;
  u.rate = 1.06; u.pitch = 0.95;                       // brisk and eager, a touch lower for a man in his fifties
  let gotBoundary = false, fallback = 0;
  u.onstart = () => {
    if (mine !== seq) return;
    root.classList.add('talking');
    // some voices never send word boundaries: after a moment, pace the text to normal speech (~15 characters a second)
    fallback = setTimeout(() => { if (mine === seq && !gotBoundary) timed(64); }, 700);
  };
  u.onboundary = (e) => {
    if (mine !== seq || (e.name && e.name !== 'word')) return;
    gotBoundary = true; clearTimeout(fallback);
    let end = e.charLength ? e.charIndex + e.charLength : fact.indexOf(' ', e.charIndex);
    reveal(end < 0 ? fact.length : end);
  };
  u.onend = u.onerror = () => { clearTimeout(fallback); finish(); };
  synth.speak(u);
}
function hideLater(fact) {                            // leave it up long enough to read, unless the visitor is reading it
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => { if (hovering) return hideLater(fact); say.classList.remove('on'); setTimeout(() => { if (!say.classList.contains('on')) say.hidden = true; }, 300); }, 4500 + fact.length * 55);
}
function scheduleAuto(ms) {
  clearTimeout(nextTimer);
  if (stopped || autoShown >= MAX_AUTO) return;
  nextTimer = setTimeout(() => { if (inStore() || hovering) return scheduleAuto(4000); autoShown++; showFact(); scheduleAuto(18000 + Math.random() * 8000); }, ms);
}
btnNext.addEventListener('click', () => showFact());
btnVoice.addEventListener('click', () => { setVoice(!voiceOn); if (voiceOn && !say.hidden) showFact(current || undefined); }); // turning it on re-reads the fact aloud; turning it off leaves the text as is
btnChange.addEventListener('click', () => {         // step to the next English voice and say the current fact with it
  const vs = englishVoices(); if (!vs.length) return;
  const i = vs.findIndex((v) => v.name === (currentVoice() || {}).name);
  voiceName = vs[(i + 1) % vs.length].name;
  try { localStorage.setItem(VOICE_NAME_KEY, voiceName); } catch {}
  showVoiceName(); showFact(current || undefined);
});
btnClose.addEventListener('click', () => { stopped = true; seq++; clearTimeout(nextTimer); clearInterval(typing); clearTimeout(hideTimer); if (synth) synth.cancel(); root.classList.remove('talking'); say.classList.remove('on'); say.hidden = true; });
say.addEventListener('pointerenter', () => { hovering = true; });
say.addEventListener('pointerleave', () => { hovering = false; });
// entering a store: stop talking at once (the guide is hidden there)
new MutationObserver(() => { if (inStore()) { seq++; if (synth) synth.cancel(); root.classList.remove('talking'); } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
scheduleAuto(6500);
