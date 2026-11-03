// The guide: a portrait in the corner of the mall whose head follows the pointer (or the last touch), then settles
// back to face the visitor when they go still. It is drawn as a small 3D card: the person is cut out of the photo
// backdrop and stands OUT of a round frame, and the whole card tilts in perspective toward the pointer with a moving
// highlight and a shadow, so it turns smoothly between the photographed poses instead of only snapping. Same idea as a head-pose grid, but with the 6 photographed poses in
// assets/guide/ (cut from tools/guide/contact-sheet.png by tools/guide/build-poses.py):
//     level:  l2  l1  c  (r1)  (r2)      r1/r2 are l1/l2 mirrored by CSS, so only the left-facing files exist
//     up:     ul      uc      ur
// There are no look-down photos, so a pointer below the guide shows the level pose.
const POSES = {                                  // name -> [file, mirrored?]
  l2: ['l2', 0], l1: ['l1', 0], c: ['c', 0], r1: ['l1', 1], r2: ['l2', 1],
  ul: ['ul', 0], uc: ['uc', 0], ur: ['ur', 0],
};
const root = document.createElement('div');
root.id = 'guide';
root.setAttribute('aria-hidden', 'true');
root.innerHTML = '<div class="g-shadow"></div><div class="g-card"><div class="g-plate"></div><div class="g-sheen"></div><div class="g-who"></div></div>';
const card = root.querySelector('.g-card'), shadow = root.querySelector('.g-shadow'), who = root.querySelector('.g-who');
const imgs = {};
for (const [name, [file, flip]] of Object.entries(POSES)) {
  const im = new Image(); im.decoding = 'async'; im.alt = ''; im.draggable = false;
  im.src = `assets/guide/${file}.webp`;
  if (flip) im.classList.add('flip');
  who.appendChild(im); imgs[name] = im;
}
document.body.appendChild(root);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = reduce ? 1 : 0.12;     // share of the remaining turn per frame; lower = lazier head
const REACH = 0.45;                 // full sideways turn once the pointer is this share of the viewport width away
const REACH_Y = 0.9;                // ...and this share of the viewport height away, vertically
const IDLE_MS = 4500;               // after this long without movement, face the visitor again
const clamp = (v) => Math.max(-1, Math.min(1, v));

// Yaw zones on -1..1: |x| < 0.2 front, 0.2..0.6 three-quarter, beyond that profile. A pose only changes once the
// head is clearly past a boundary (HOLD), so it does not flicker between two poses at the edge.
const EDGES = [0.2, 0.6], HOLD = 0.06;
function yawZone(x, prev) {
  const raw = (v) => (v < 0 ? -1 : 1) * (Math.abs(v) < EDGES[0] ? 0 : Math.abs(v) < EDGES[1] ? 1 : 2);
  const k = Math.abs(prev);                                   // the range the head is currently in...
  const lo = k === 0 ? -EDGES[0] : EDGES[k - 1], hi = k === 2 ? 1.01 : k === 0 ? EDGES[0] : EDGES[1];
  const a = prev < 0 ? -hi : lo, z = prev < 0 ? -lo : hi;     // ...as signed bounds
  return x >= a - HOLD && x <= z + HOLD ? prev : raw(x);      // ...stays unless clearly beyond it
}

let goal = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, zone = 0, up = false, shown = 'c', running = false, idle = 0;
function show(name) {
  if (name === shown) return;
  imgs[shown].classList.remove('on'); imgs[name].classList.add('on'); shown = name;
}
function choose() {
  zone = yawZone(cur.x, zone);
  up = cur.y < (up ? -0.4 : -0.55);            // enter "looking up" a bit further out than it leaves it
  if (up) show(zone < 0 ? 'ul' : zone > 0 ? 'ur' : 'uc');
  else show(zone === 0 ? 'c' : zone === -1 ? 'l1' : zone === -2 ? 'l2' : zone === 1 ? 'r1' : 'r2');
}
// Continuous 3D tilt on top of the discrete poses: the card turns toward the pointer (up to ~16 deg), the person
// shifts against the frame for parallax, the highlight slides across the plate and the shadow swings the other way.
function tilt() {
  const x = cur.x, y = Math.max(-1, Math.min(0.6, cur.y));
  card.style.transform = `rotateY(${(x * 16).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg)`;
  who.style.transform = `translate3d(${(x * 6).toFixed(2)}px, ${(y * 4).toFixed(2)}px, 46px)`;
  card.style.setProperty('--sx', (50 + x * 32).toFixed(1) + '%');
  card.style.setProperty('--sy', (34 + y * 26).toFixed(1) + '%');
  shadow.style.transform = `translateX(${(-x * 12).toFixed(2)}px) scaleX(${(1 - Math.abs(x) * 0.1).toFixed(3)})`;
}
function frame() {
  cur.x += (goal.x - cur.x) * EASE; cur.y += (goal.y - cur.y) * EASE;
  choose();
  tilt();
  if (Math.abs(goal.x - cur.x) + Math.abs(goal.y - cur.y) > 0.01) requestAnimationFrame(frame); else running = false;
}
const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

function lookAt(px, py) {
  const b = root.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2, dx = px - cx, dy = py - cy;
  // The guide sits in a corner, so "how far" is measured against the room on the side the pointer is on:
  // the pointer reaching the screen's left edge turns the head fully left even though the guide is near it.
  const rx = dx < 0 ? Math.max(120, cx) : innerWidth * REACH;
  goal.x = clamp(dx / rx);
  goal.y = clamp(dy / (innerHeight * REACH_Y));
  kick();
  clearTimeout(idle);
  idle = setTimeout(() => { goal.x = goal.y = 0; kick(); }, IDLE_MS);
}
addEventListener('pointermove', (e) => lookAt(e.clientX, e.clientY), { passive: true });
addEventListener('pointerdown', (e) => lookAt(e.clientX, e.clientY), { passive: true });
document.addEventListener('mouseleave', () => { goal.x = goal.y = 0; kick(); });
imgs.c.classList.add('on');
tilt();
