import * as THREE from 'three';
import { DOMAINS } from './domains.js';
import { windowTexture, signTexture, lobbyTexture, textPlane, wallEmblemTexture, ceilingTexture, recessTexture } from './art.js';
import { renderDirectory, markActive, openStore, closeStore, isStoreOpen, setBackHandler, isModalOpen, closeModal } from './ui.js';

const N = DOMAINS.length;
const STEP = 13;
const storeZ = (i) => -14 - i * STEP;
const sideOf = (i) => (i % 2 === 0 ? -1 : 1); // -1 = left wall, 1 = right wall
const Z0 = 8;
const Z1 = storeZ(N - 1) - 2;
const HALL_W = 12, HALL_H = 6.5;

const $ = (s) => document.querySelector(s);
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = matchMedia('(pointer:coarse)').matches;
const DOLLY_MS = 900;          // dolly duration; ui.openStore is scheduled to fire when it ends
const DOLLY_MS_UI = DOLLY_MS - 50; // openStore a hair before the end so the overlay cross-fades in
let mode = 'hall'; // 'hall' | 'store'
let current = -1;
let hover = -1;

// ---------- theme (light / dark) ----------
let scene, camera, renderer;
const doors = []; // { mesh, mat, accent, pool, index, k }
const camLights = [];
const THEME_KEY = 'ogd-theme';
const mqLight = matchMedia('(prefers-color-scheme: light)');
function storedTheme() { try { const t = localStorage.getItem(THEME_KEY); return t === 'light' || t === 'dark' ? t : null; } catch { return null; } }
let theme = root.getAttribute('data-theme') || storedTheme() || (mqLight.matches ? 'light' : 'dark');
// Per-theme scene look. Light = bright daylight atrium; emissive strips/pools toned down.
const LOOK = {
  dark: { bg: 0x1d1814, fog: 0.022, ambC: 0xd9b88c, amb: 2.6, wall: 0x4d4238, floor: 0x3a322b, floorR: 0.35, floorM: 0.25, ceil: 0xffffff, beam: 0x1c140d, glowO: 0.6, washO: 0.28,
          stone: 0x8a7459, plinth: 0x2a2118, panelK: 1, gold: 0xf5c26b, goldK: 1, strip: 0xffc27a, stripK: 2.2, accentK: 1, poolK: 1, hallPool: 0.5, lightK: 1, lobbyK: 1,
          dust: 0xffe9b8, dustO: 0.55, winC: 0xbbbbbb, hud: '#06060b' },
  light: { bg: 0xe9e6df, fog: 0.018, ambC: 0xffffff, amb: 3.1, wall: 0xe6e0d4, floor: 0xcfc8ba, floorR: 0.4, floorM: 0.08, ceil: 0xffffff, beam: 0xece4d2, glowO: 0, washO: 0,
          stone: 0xf1ece0, plinth: 0xe6dfd0, panelK: 0.14, gold: 0xa9760f, goldK: 0.8, strip: 0xfff4dc, stripK: 0.8, accentK: 0.75, poolK: 0.12, hallPool: 0.05, lightK: 0.22, lobbyK: 0.2,
          dust: 0xb59a64, dustO: 0.25, winC: 0xdddddd, hud: '#f6f2e9' },
};
const S = { washes: [] }; // scene refs for in-place retinting (no light added/removed, no material swapped)
function applySceneTheme() {
  if (!scene || !S.wall) return;
  const L = LOOK[theme];
  scene.background.setHex(L.bg); scene.fog.color.setHex(L.bg); scene.fog.density = L.fog;
  S.amb.color.setHex(L.ambC); S.amb.intensity = L.amb;
  S.wall.color.setHex(L.wall);
  S.floor.color.setHex(L.floor); S.floor.roughness = L.floorR; S.floor.metalness = L.floorM;
  S.ceil.color.setHex(L.ceil);
  S.gold.emissive.setHex(L.gold); S.gold.emissiveIntensity = 0.9 * L.goldK;
  S.guides.forEach((g) => { g.emissive.setHex(L.gold); g.emissiveIntensity = 0.5 * L.goldK; });
  S.strip.emissive.setHex(L.strip); S.strip.emissiveIntensity = L.stripK;
  S.beam.color.setHex(L.beam); S.ceilTex.userData.setTheme(theme);
  S.washes.forEach((w) => { w.material.opacity = L.washO; w.visible = L.washO > 0; });
  S.glows.forEach((g) => { g.material.opacity = L.glowO; g.visible = L.glowO > 0; });
  S.hallPools.forEach((p) => { p.material.opacity = L.hallPool; });
  S.dust.material.color.setHex(L.dust); S.dust.material.opacity = L.dustO;
  camLights.forEach((l, i) => { l.intensity = (i ? 30 : 45) * L.lightK; });
  S.lobbyLight.intensity = 30 * L.lobbyK;
  doors.forEach((d) => d.mat.color.setScalar(1)); // frame loop re-applies brightness
  (S.emblems || []).forEach((t) => t.userData.setTheme(theme));
  S.lobbyTex.userData.setTheme(theme); S.endTex.userData.setTheme(theme);
  if (S.dec) { const D = DECOR_LOOK[theme]; S.dec.wood.color.setHex(D.wood); S.dec.pot.color.setHex(D.pot); S.dec.leaf.color.setHex(D.leaf); }
  const K = S.kit; // storefront portal kit: shared materials/textures retinted in place
  if (K) { K.stone.color.setHex(L.stone); K.plinth.color.setHex(L.plinth); K.texs.forEach((t) => t.userData.setTheme(theme)); }
}
function applyTheme(t, persist) {
  theme = t;
  root.setAttribute('data-theme', t);
  if (persist) { try { localStorage.setItem(THEME_KEY, t); } catch {} }
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-pressed', String(t === 'dark'));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', LOOK[t].hud);
  applySceneTheme();
}
{
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark', true));
  // follow the OS only while the visitor has not made an explicit choice
  const onMq = () => { if (!storedTheme()) applyTheme(mqLight.matches ? 'light' : 'dark', false); };
  if (mqLight.addEventListener) mqLight.addEventListener('change', onMq);
  applyTheme(theme, false);
}

// ---------- directory + overlay wiring (works even without WebGL) ----------
renderDirectory(DOMAINS, (i) => {
  if (mode === 'store') return;
  scrollToStore(i);
  setTimeout(() => enterStore(i), reduceMotion ? 0 : 1100);
});
setBackHandler(() => history.state && history.state.store != null ? history.back() : exitStore());

function maxScroll() { return Math.max(1, root.scrollHeight - innerHeight); }
function scrollToStore(i) {
  const p = (Z0 - storeZ(i)) / (Z0 - Z1);
  scrollTo({ top: p * maxScroll(), behavior: reduceMotion ? 'auto' : 'smooth' });
}

function enterStore(i, push = true) {
  if (mode === 'store') return;
  mode = 'store'; current = i;
  root.classList.add('locked');
  document.body.classList.add('in-store');
  $('#hint').classList.remove('on');
  if (push) history.pushState({ store: i }, '', '#' + DOMAINS[i].id);
  startDolly(true);
  setTimeout(() => { if (mode === 'store') openStore(DOMAINS[i], i); }, reduceMotion || !scene ? 0 : DOLLY_MS_UI);
}

function exitStore() {
  if (mode !== 'store') return;
  closeStore();
  const wasCurrent = current;
  mode = 'hall'; current = -1;
  if (wasCurrent >= 0) startDolly(false);
  root.classList.remove('locked');
  document.body.classList.remove('in-store');
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
}

addEventListener('popstate', (e) => {
  if (e.state && e.state.store != null) enterStore(e.state.store, false);
  else exitStore();
});
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (isModalOpen()) closeModal();
  else if (isStoreOpen()) setBackHandlerSafe();
});
function setBackHandlerSafe() { history.state && history.state.store != null ? history.back() : exitStore(); }

// ---------- 3D scene ----------
let doorMeshes = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0, 0);
const look = new THREE.Vector3(0, 1.6, -10);
const wantPos = new THREE.Vector3(0, 1.7, Z0);
const wantLook = new THREE.Vector3(0, 1.6, Z0 - 10);
let dust;
let baseFov = 58;
const ZOOM_FOV = 0.83;
let dpr = 1, maxDpr = 2, cachedMax = 1, lastW = 0, lastH = 0;
const tmpPos = new THREE.Vector3(), tmpLook = new THREE.Vector3();
const tween = { on: false, t0: 0, fromPos: new THREE.Vector3(), fromLook: new THREE.Vector3(), toPos: new THREE.Vector3(), toLook: new THREE.Vector3(), fromFov: 58, toFov: 58 };
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function storePose(i, pos, lk) {
  const s = sideOf(i);
  pos.set(s * 2.4, 1.7, storeZ(i));
  lk.set(s * 8, 2.5, storeZ(i));
}
function hallPose(pos, lk, bob = 0) {
  const p = Math.min(1, Math.max(0, scrollY / cachedMax));
  const z = Z0 + (Z1 - Z0) * p;
  pos.set(pointer.x * 0.5, 1.7 + bob, z);
  lk.set(pointer.x * 2.6, 1.6 + pointer.y * 0.9, z - 10);
  return p;
}
function startDolly(entering) {
  if (!scene || reduceMotion) { if (scene && !entering) { camera.fov = baseFov; camera.updateProjectionMatrix(); } return; }
  tween.fromPos.copy(camera.position); tween.fromLook.copy(look); tween.fromFov = camera.fov;
  if (entering) { storePose(current, tween.toPos, tween.toLook); tween.toFov = baseFov * ZOOM_FOV; }
  else { hallPose(tween.toPos, tween.toLook); tween.toFov = baseFov; }
  tween.t0 = performance.now(); tween.on = true;
}

async function loadFonts() {
  if (!document.fonts) return;
  const loads = ['700 100px Cinzel', '100px "Bebas Neue"', '500 40px "JetBrains Mono"', '500 40px Inter', '700 70px "Noto Sans Devanagari"']
    .map((f) => document.fonts.load(f, 'ॐAa').catch(() => {}));
  await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 2500))]);
}

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch { return false; }
}

let _pool;
function poolTex() {
  if (_pool) return _pool;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  _pool = new THREE.CanvasTexture(c); _pool.colorSpace = THREE.SRGBColorSpace;
  return _pool;
}

function emissive(color, intensity = 1) {
  return new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(color), emissiveIntensity: intensity });
}

const RD = 1.2, OW = 1.6, OH = 4.6; // recess depth, opening half-width, opening height

// Shared geometry/materials for every storefront portal (built once).
function portalKit() {
  const P = (w, h) => new THREE.PlaneGeometry(w, h);
  const K = { boxes: {} };
  const tSide = recessTexture('side', theme), tSoffit = recessTexture('soffit', theme), tThresh = recessTexture('threshold', theme), tGlass = recessTexture('glass', theme);
  K.texs = [tSide, tSoffit, tThresh, tGlass];
  K.hitGeo = P(3.8, 5.2); K.hitMat = new THREE.MeshBasicMaterial({ visible: false });
  K.backGeo = P(2 * OW, OH);
  K.retL = P(RD, OH);
  K.retR = K.retL.clone();
  const uv = K.retR.attributes.uv; for (let n = 0; n < uv.count; n++) uv.setX(n, 1 - uv.getX(n)); // mirror so u runs front->back on both sides
  K.retMat = new THREE.MeshBasicMaterial({ map: tSide });
  K.soffitGeo = P(2 * OW, RD); K.soffitMat = new THREE.MeshBasicMaterial({ map: tSoffit });
  K.threshGeo = P(4.2, 2.2);
  K.threshMat = new THREE.MeshBasicMaterial({ map: tThresh, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  K.glassGeo = P(2 * OW, OH);
  K.glassMat = new THREE.MeshBasicMaterial({ map: tGlass, transparent: true, depthWrite: false, fog: false });
  K.stone = new THREE.MeshLambertMaterial({ color: 0x8a7459 });
  K.plinth = new THREE.MeshLambertMaterial({ color: 0x2a2118 });
  K.plinthA = new THREE.BoxGeometry(0.8, 0.8, 0.8); K.plinthB = new THREE.BoxGeometry(0.6, 1.15, 0.6);
  K.capA = new THREE.BoxGeometry(0.84, 0.03, 0.84); K.capB = new THREE.BoxGeometry(0.64, 0.03, 0.64);
  K.prodGeo = new THREE.OctahedronGeometry(0.2, 0);
  K.panelGeo = P(1, 1);
  K.washGeo = P(1, 1); K.poolGeo = P(3.2, 1.8); K.signGeo = P(3.6, 0.9);
  return K;
}

function buildStore(d, i) {
  const K = S.kit || (S.kit = portalKit());
  const side = sideOf(i), z = storeZ(i);
  const g = new THREE.Group();
  g.position.set(side * (HALL_W / 2), 0, z);
  g.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2; // local +z faces the hallway; the recess runs to local -z (into the wall)
  const add = (geo, m, x, y, zz) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, zz); g.add(o); return o; };
  const box = (w, h, dp, m, x, y, zz) => add(K.boxes[w + ',' + h + ',' + dp] || (K.boxes[w + ',' + h + ',' + dp] = new THREE.BoxGeometry(w, h, dp)), m, x, y, zz);

  const accent = emissive(d.accent, 1.6);
  const winMat = new THREE.MeshBasicMaterial({ map: windowTexture(d), color: 0xbbbbbb });

  // deepest layer: the store window art, flush with the back of the recess
  add(K.backGeo, winMat, 0, OH / 2, -RD + 0.002);
  // reveal: side returns, soffit, threshold floor (baked AO in the textures)
  add(K.retL, K.retMat, -OW, OH / 2, -RD / 2).rotation.y = Math.PI / 2;
  add(K.retR, K.retMat, OW, OH / 2, -RD / 2).rotation.y = -Math.PI / 2;
  add(K.soffitGeo, K.soffitMat, 0, OH, -RD / 2).rotation.x = Math.PI / 2;
  add(K.threshGeo, K.threshMat, 0, 0.012, -0.1).rotation.x = -Math.PI / 2;

  // interior parallax layers: backlit panel, then two plinths at different depths with a glowing piece each
  const panel = add(K.panelGeo, new THREE.MeshBasicMaterial({ map: poolTex(), color: d.accent, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), 0, 2.3, -1.0);
  panel.scale.set(2.8, 4.0, 1); panel.renderOrder = 1;
  add(K.plinthA, K.plinth, -0.7, 0.4, -0.85); add(K.capA, accent, -0.7, 0.815, -0.85);
  const prod = add(K.prodGeo, accent, -0.7, 1.08, -0.85);
  add(K.plinthB, K.plinth, 0.75, 0.575, -0.62); add(K.capB, accent, 0.75, 1.165, -0.62);
  add(K.prodGeo, accent, 0.75, 1.42, -0.62).scale.setScalar(0.7);

  // glass across the opening: faint tint + baked specular streaks (no reflector)
  const glass = add(K.glassGeo, K.glassMat, 0, OH / 2, -0.4); glass.renderOrder = 3;

  // portal frame: pilasters with base, shaft, outer moulding, capital; architrave, header, cornice
  for (const sx of [-1, 1]) {
    box(0.64, 0.25, 0.34, K.stone, sx * 1.88, 0.125, 0.17);
    box(0.5, 4.15, 0.22, K.stone, sx * 1.85, 2.325, 0.11);
    box(0.1, 4.4, 0.3, K.stone, sx * 2.15, 2.2, 0.15);
    box(0.03, 4.2, 0.26, S.gold, sx * 2.0, 2.35, 0.13);   // fluting line
    box(0.64, 0.2, 0.34, K.stone, sx * 1.88, 4.5, 0.17);
    box(0.03, 4.5, 0.04, accent, sx * (OW + 0.015), 2.3, 0.02); // slim accent light-line along each jamb
  }
  box(4.0, 0.1, 0.4, S.gold, 0, 4.65, 0.2);
  box(3.2, 0.035, 0.04, accent, 0, OH - 0.04, 0.03);       // accent light-line under the lintel
  box(5.0, 1.5, 0.34, K.stone, 0, 5.45, 0.17);
  box(5.2, 0.16, 0.5, K.stone, 0, 6.28, 0.25);
  box(5.2, 0.03, 0.52, S.gold, 0, 6.37, 0.26);
  add(K.signGeo, new THREE.MeshBasicMaterial({ map: signTexture(d) }), 0, 5.45, 0.35);

  // faint warm wash on the wall around the lit opening (additive, no light)
  const wash = add(K.washGeo, new THREE.MeshBasicMaterial({ map: poolTex(), color: 0xffb25a, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), 0, 3.0, 0.02);
  wash.scale.set(8, 8.5, 1); S.washes.push(wash);

  const pool = add(K.poolGeo, new THREE.MeshBasicMaterial({ map: poolTex(), color: d.accent, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }), 0, 0.03, 1.7);
  pool.scale.set(3.4, 3.6, 1); pool.rotation.x = -Math.PI / 2;

  // click/hover target: the whole portal opening plus a margin (invisible, raycast only)
  const hit = add(K.hitGeo, K.hitMat, 0, 2.5, 0.06);
  hit.userData.index = i;
  doors.push({
    mesh: hit, mat: winMat, accent, index: i, k: 0, pool, panel, prod,
    // presentation: the store reaches toward the viewer when they turn its way
    side, present: 0, hitZ: hit.position.z, prodZ: prod.position.z,
  });

  scene.add(g);
}

function buildHall() {
  const len = 110, cz = -len / 2 + 22; // spans z 22 .. -88
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x15151f }); S.wall = wallMat;
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a12, roughness: 0.22, metalness: 0.65 });
  S.floor = floorMat;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, len), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, cz); scene.add(floor);
  // ceiling: baked bay pattern, one tile per 6.5 m bay; edges land on bay boundaries (z = 15.25 - 6.5k)
  const BAY = 6.5, BAYS = 17;
  S.ceilTex = ceilingTexture(BAYS, theme);
  S.ceil = new THREE.MeshBasicMaterial({ map: S.ceilTex });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, BAY * BAYS), S.ceil);
  ceil.rotation.x = Math.PI / 2; ceil.position.set(0, HALL_H, 15.25 - BAY * BAYS / 2); scene.add(ceil);
  [-1, 1].forEach((s) => { // side walls are shapes with a notch cut for each storefront opening
    const lx = (zz) => (s < 0 ? -zz : zz), x0 = Math.min(lx(22), lx(-88)), x1 = Math.max(lx(22), lx(-88));
    const cs = DOMAINS.map((_, i) => i).filter((i) => sideOf(i) === s).map((i) => lx(storeZ(i))).sort((p, q) => p - q);
    const sh = new THREE.Shape(); sh.moveTo(x0, 0);
    cs.forEach((c) => { sh.lineTo(c - OW, 0); sh.lineTo(c - OW, OH); sh.lineTo(c + OW, OH); sh.lineTo(c + OW, 0); });
    sh.lineTo(x1, 0); sh.lineTo(x1, HALL_H); sh.lineTo(x0, HALL_H); sh.closePath();
    const w = new THREE.Mesh(new THREE.ShapeGeometry(sh), wallMat);
    w.rotation.y = s < 0 ? Math.PI / 2 : -Math.PI / 2; w.position.set(s * HALL_W / 2, 0, 0); scene.add(w);
  });

  // gold trim, floor guide lines, ceiling light strips
  const gold = emissive(0xf5c26b, 0.9); S.gold = gold; S.guides = []; S.hallPools = [];
  [-1, 1].forEach((s) => {
    // wall trims, interrupted at each storefront portal
    const cuts = DOMAINS.map((_, i) => i).filter((i) => sideOf(i) === s).map((i) => storeZ(i)).sort((p, q) => q - p);
    let cur = 22;
    [...cuts.map((c) => [c + 2.7, c - 2.7]), [-88, -88]].forEach(([e, nxt]) => {
      if (cur - e > 0.01) [0.25, HALL_H - 0.2].forEach((y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, cur - e), gold); m.position.set(s * 5.97, y, (cur + e) / 2); scene.add(m); });
      cur = nxt;
    });
    const gm = emissive(0xf5c26b, 0.5); S.guides.push(gm);
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, len), gm); f.position.set(s * 1.4, 0.01, cz); scene.add(f);
  });
  // warm fixtures, one per bay on the centre line; glow + floor pool line up under each (no real lights)
  const strip = emissive(0xffc27a, 2.2); S.strip = strip; S.glows = [];
  S.beam = new THREE.MeshBasicMaterial({ color: 0x1c140d });
  const beamGeo = new THREE.BoxGeometry(HALL_W, 0.34, 0.3), beamTrim = new THREE.BoxGeometry(HALL_W, 0.03, 0.34);
  for (let k = 0; k <= 15; k++) { // beams on bay boundaries
    const bz = 15.25 - BAY * k;
    const b = new THREE.Mesh(beamGeo, S.beam); b.position.set(0, HALL_H - 0.17, bz); scene.add(b);
    const tr = new THREE.Mesh(beamTrim, gold); tr.position.set(0, HALL_H - 0.35, bz); scene.add(tr);
  }
  const bezelGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.05, 32), lampGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.06, 32);
  const glowGeo = new THREE.PlaneGeometry(1, 1), poolGeo = new THREE.PlaneGeometry(1, 1);
  for (let k = 0; k < 15; k++) {
    const z = 12 - BAY * k;
    const bz = new THREE.Mesh(bezelGeo, gold); bz.position.set(0, HALL_H - 0.03, z); scene.add(bz);
    const lamp = new THREE.Mesh(lampGeo, strip); lamp.position.set(0, HALL_H - 0.07, z); scene.add(lamp);
    const gl = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ map: poolTex(), color: 0xffb860, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    gl.scale.set(5.5, 4.5, 1); gl.rotation.x = Math.PI / 2; gl.position.set(0, HALL_H - 0.02, z); scene.add(gl); S.glows.push(gl);
    // floor pool directly beneath
    const pl = new THREE.Mesh(poolGeo, new THREE.MeshBasicMaterial({ map: poolTex(), color: 0xffbf70, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    S.hallPools.push(pl); pl.scale.set(6.5, 6.0, 1); pl.rotation.x = -Math.PI / 2; pl.position.set(0, 0.015, z); scene.add(pl);
  }

  // end wall
  const end = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), new THREE.MeshBasicMaterial({ map: (S.endTex = textPlane('MORE DOORS OPENING SOON', 'OGDomains.com', theme)), transparent: true }));
  end.position.set(0, 3, storeZ(N - 1) - 16); scene.add(end);
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, HALL_H), wallMat);
  endWall.position.set(0, HALL_H / 2, storeZ(N - 1) - 16.1); scene.add(endWall);

  // brand emblems on the walls: hand-authored (deterministic) layout, sparse, clear of storefront windows/signs
  // z/side chosen at the wall segments opposite a store, so nothing shares a wall span with a window or sign
  S.emblems = [];
  const EMB = [
    [-1, -27, 'monogram', 2.0, 4.1], [-1, -53, 'seal', 2.3, 3.8], [-1, -79, 'wordmark', 3.8, 4.3], [-1, -7, 'seal', 1.7, 4.4],
    [1, -14, 'wordmark', 3.6, 4.0], [1, -40, 'seal', 2.1, 4.2], [1, -66, 'monogram', 2.2, 3.9], [1, -6, 'monogram', 1.6, 4.3],
  ];
  const embTex = {};
  EMB.forEach(([s, z, v, w, y]) => {
    const tx = embTex[v] || (embTex[v] = wallEmblemTexture(v, theme)); // one texture per variant, shared
    if (!S.emblems.includes(tx)) S.emblems.push(tx);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, v === 'wordmark' ? w / 4 : w),
      new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    mesh.rotation.y = s < 0 ? Math.PI / 2 : -Math.PI / 2; mesh.position.set(s * (HALL_W / 2 - 0.03), y, z); scene.add(mesh);
  });

  // lobby sign: hangs over the entrance, camera passes beneath it
  const img = new Image(); img.src = 'assets/emblem.png';
  const lobby = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ map: (S.lobbyTex = lobbyTexture(img, theme)), transparent: true, depthWrite: false }));
  lobby.position.set(0, 4.3, -2); scene.add(lobby);
  [-1.5, 1.5].forEach((x) => { const c = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.6, 0.03), gold); c.position.set(x, HALL_H - 0.8, -2); scene.add(c); });
  // real lights, fixed at init (changing the count later would recompile every shader):
  // desktop = 2 camera-following + lobby, mobile = 1 camera-following + lobby
  const nCam = isMobile ? 1 : 2;
  for (let i = 0; i < nCam; i++) { const l = new THREE.PointLight(0xffe2b0, i ? 30 : 45, 26, 2); scene.add(l); camLights.push(l); }
  const lobbyLight = new THREE.PointLight(0xf5c26b, 30, 14, 2); S.lobbyLight = lobbyLight; lobbyLight.position.set(0, 3.2, 1); scene.add(lobbyLight);
}

function buildDust() {
  const n = 420, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 11; pos[i * 3 + 1] = Math.random() * HALL_H; pos[i * 3 + 2] = 14 - Math.random() * 100; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dust = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe9b8, size: 0.04, transparent: true, opacity: 0.55, depthWrite: false }));
  S.dust = dust; scene.add(dust);
}


// ---------- corridor decorations: benches + planters against the solid wall opposite each storefront ----------
// Instanced (5 draw calls total), no lights, never in the doors array so they can't be picked.
const DECOR_LOOK = {
  dark: { wood: 0x4a3322, pot: 0x6b4630, leaf: 0x35552f },
  light: { wood: 0xb08a5c, pot: 0xd8c7a8, leaf: 0x6a9456 },
};
function buildDecor() {
  const D = DECOR_LOOK[theme];
  const wood = new THREE.MeshLambertMaterial({ color: D.wood }), pot = new THREE.MeshLambertMaterial({ color: D.pot }), leaf = new THREE.MeshLambertMaterial({ color: D.leaf });
  S.dec = { wood, pot, leaf };
  const benches = [], planters = [];
  for (let i = 0; i < N; i++) { // wall opposite store i has no opening at this z
    const s = -sideOf(i), z = storeZ(i);
    benches.push([s, z]); planters.push([s, z - 2.5], [s, z + 2.5]);
  }
  const mk = (geo, mat, list) => { const m = new THREE.InstancedMesh(geo, mat, list.length); m.raycast = () => {}; scene.add(m); return m; };
  const seat = mk(new THREE.BoxGeometry(0.5, 0.07, 1.8), wood, benches), back = mk(new THREE.BoxGeometry(0.06, 0.5, 1.8), wood, benches);
  const legs = mk(new THREE.BoxGeometry(0.4, 0.45, 0.06), wood, benches.concat(benches));
  const pots = mk(new THREE.CylinderGeometry(0.28, 0.22, 0.6, 16), pot, planters);
  const leaves = mk(new THREE.SphereGeometry(0.5, 14, 10), leaf, planters.concat(planters));
  const o = new THREE.Object3D(), put = (m, k, x, y, z, sx = 1, sy = 1, sz = 1) => { o.position.set(x, y, z); o.scale.set(sx, sy, sz); o.updateMatrix(); m.setMatrixAt(k, o.matrix); };
  benches.forEach(([s, z], k) => {
    put(seat, k, s * 5.7, 0.45, z); put(back, k, s * 5.93, 0.78, z);
    put(legs, k, s * 5.7, 0.225, z - 0.8); put(legs, k + benches.length, s * 5.7, 0.225, z + 0.8);
  });
  planters.forEach(([s, z], k) => {
    put(pots, k, s * 5.45, 0.3, z);
    put(leaves, k, s * 5.45, 1.15, z, 1, 1.25, 1);
    put(leaves, k + planters.length, s * 5.5 + 0.08, 1.75, z + 0.06, 0.7, 0.8, 0.7);
  });
}

let resizeRaf = 0;
function resize() {
  if (!renderer) return;
  const w = innerWidth, h = innerHeight;
  // Mobile URL-bar show/hide changes only the height by a little: keep the old scroll
  // mapping and scroll position, and skip the (expensive) buffer reallocation.
  const heightOnly = lastW === w && lastH && Math.abs(h - lastH) / lastH < 0.25;
  if (!heightOnly) cachedMax = maxScroll();
  else if (!isMobile) cachedMax = maxScroll();
  lastW = w; lastH = h;
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  baseFov = w < 700 ? 72 : 58; // wider on portrait phones
  if (!tween.on) camera.fov = mode === 'store' ? baseFov * ZOOM_FOV : baseFov;
  camera.updateProjectionMatrix();
}
const onResize = () => { cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(resize); };

// adaptive DPR: one-way ratchet down (never raises, so it cannot oscillate), floor 1
let ftSum = 0, ftN = 0, ftWarm = 0, ftCool = 0;
function sampleFrame(raw) {
  if (raw > 0.25 || ftN === 0 && ++ftWarm < 45) return; // ignore tab-switch gaps and warm-up
  if (tween.on || ftCool > 0) { ftCool = Math.max(0, ftCool - 1); return; }
  ftSum += raw; ftN++;
  if (ftN < 90) return;
  const avg = ftSum / ftN; ftSum = 0; ftN = 0;
  if (avg > 0.024 && dpr > 1) {
    dpr = Math.max(1, dpr - 0.25);
    renderer.setPixelRatio(dpr); renderer.setSize(innerWidth, innerHeight, false);
    ftCool = 120;
  }
}

function pick() {
  if (mode !== 'hall') return -1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(doorMeshes, false)[0];
  return hit ? hit.object.userData.index : -1;
}

const clock = new THREE.Clock();
const hintEl = $('#hint'), progEl = $('#progress i'), introEl = $('#intro');
function frame() {
  const raw = clock.getDelta();
  const dt = Math.min(raw, 0.05);
  const t = clock.elapsedTime;
  sampleFrame(raw);

  const LK = LOOK[theme];
  // hover easing (~0.25s) for every door
  for (const d of doors) {
    d.k = THREE.MathUtils.damp(d.k, d.index === hover ? 1 : 0, 14, dt);

    // Turning toward a side of the corridor presents that storefront: as you look or
    // swipe left/right while near it, the whole shopfront eases out of the wall and
    // angles toward you, so it reads as offering itself and is far easier to hit.
    let want = 0;
    if (mode === 'hall') {
      // Only stores still AHEAD of the camera are worth presenting: one level with you
      // sits at 90° on the side wall, out of frame. Peaks a few metres before you reach it.
      const ahead = camera.position.z - storeZ(d.index);
      const near = ahead > 0.5 ? Math.max(0, 1 - Math.abs(ahead - 7) / 11) : 0;
      // pointer.x is -1..1; reward turning toward this door's own side
      const toward = Math.max(0, pointer.x * d.side);
      want = near * near * Math.min(1, toward * 1.35) + near * near * 0.12 + d.k * 0.45;
      want = Math.min(1, want);
    }
    d.present = THREE.MathUtils.damp(d.present, want, reduceMotion ? 60 : 6, dt);
    const pr = d.present;
    // The shell itself stays welded to the wall: the side walls are cut with a notch
    // around each opening, so translating the portal would tear a gap and show through.
    // Instead the store reaches out — a bigger target stepped into the corridor, the
    // display easing forward in the recess, and light spilling further across the floor.
    d.mesh.position.z = d.hitZ + pr * 0.95;
    d.mesh.scale.setScalar(1 + pr * 0.3);
    d.prod.position.z = d.prodZ + pr * 0.4;
    d.pool.scale.set(3.4 + pr * 2.2, 3.6 + pr * 1.5, 1);
    const c = (0.73 + 0.27 * d.k) * (theme === 'light' ? 0.97 : 1);
    d.mat.color.setScalar(c);
    d.accent.emissiveIntensity = (1.6 + d.k * 1.4 + d.present * 0.9) * LK.accentK;
    d.pool.material.opacity = (0.55 + d.k * 0.3) * LK.poolK;
    d.panel.material.opacity = (0.45 + d.k * 0.3) * LK.panelK;
    if (!reduceMotion) d.prod.rotation.y = t * 0.7;
  }

  if (tween.on) {
    const x = Math.min(1, (performance.now() - tween.t0) / DOLLY_MS), e = easeInOutCubic(x);
    camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
    look.lerpVectors(tween.fromLook, tween.toLook, e);
    camera.fov = tween.fromFov + (tween.toFov - tween.fromFov) * e;
    camera.updateProjectionMatrix();
    if (x >= 1) tween.on = false;
    camera.lookAt(look);
  } else {
    if (mode === 'hall') {
      const bob = reduceMotion ? 0 : Math.sin(t * 1.6) * 0.03;
      const p = hallPose(wantPos, wantLook, bob);
      const z = wantPos.z;
      progEl.style.transform = `scaleY(${p})`;
      introEl.style.opacity = String(Math.max(0, 1 - p * 9));
      // nearest store gets highlighted in the directory
      let near = -1, best = 8;
      for (let i = 0; i < N; i++) { const dz = Math.abs(z - storeZ(i)); if (dz < best) { best = dz; near = i; } }
      markActive(near);
      const h = pick();
      if (h !== hover) {
        hover = h;
        if (h >= 0) { hintEl.textContent = `Enter ${DOMAINS[h].name}`; hintEl.classList.add('on'); } else hintEl.classList.remove('on');
        canvasEl.style.cursor = h >= 0 ? 'pointer' : 'default';
      }
    } else if (current >= 0) {
      storePose(current, wantPos, wantLook);
    }
    const k = 1 - Math.exp(-dt * (mode === 'store' ? 2.6 : 5));
    camera.position.lerp(wantPos, reduceMotion ? 1 : k);
    look.lerp(wantLook, reduceMotion ? 1 : k);
    camera.lookAt(look);
  }
  if (hover !== -1 && mode !== 'hall') hover = -1;
  if (dust && !reduceMotion) dust.position.y = Math.sin(t * 0.3) * 0.15;

  // moving lights follow the camera (no allocation)
  for (let i = 0; i < camLights.length; i++) camLights[i].position.set(camera.position.x * 0.5, HALL_H - 1.2, camera.position.z - 3 - i * 11);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

const canvasEl = $('#gl');
async function init() {
  await loadFonts();
  if (!webglOK()) { document.body.classList.add('no-gl'); $('#loading').remove(); return; }

  renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: !isMobile || devicePixelRatio < 2, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  maxDpr = isMobile ? 1.5 : 2;
  dpr = Math.min(devicePixelRatio || 1, maxDpr);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06060b);
  scene.fog = new THREE.FogExp2(0x06060b, 0.03);
  camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 140);
  camera.position.copy(wantPos);
  S.amb = new THREE.AmbientLight(0x7a7aa0, 1.5); scene.add(S.amb);

  buildHall();
  DOMAINS.forEach(buildStore);
  buildDust();
  buildDecor();
  doorMeshes = doors.map((d) => d.mesh);
  applySceneTheme();
  resize();
  addEventListener('resize', onResize);
  addEventListener('orientationchange', onResize);

  addEventListener('pointermove', (e) => {
    pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  }, { passive: true });
  canvasEl.addEventListener('click', (e) => {
    pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    const h = pick();
    if (h >= 0) enterStore(h);
  });

  // precompile every shader variant before revealing, so the first scroll doesn't hitch
  try { if (renderer.compileAsync) await renderer.compileAsync(scene, camera); else renderer.compile(scene, camera); } catch {}
  renderer.render(scene, camera);
  $('#loading').classList.add('gone');
  // Deep links. '#hindutample' opens that store; '#hall-hindutample' returns you to the
  // hallway standing at that door, which is where a domain's own site sends you back to.
  const hall = /^#hall-(.+)$/.exec(location.hash);
  const idx = hall
    ? DOMAINS.findIndex((d) => d.id === hall[1])
    : DOMAINS.findIndex((d) => '#' + d.id === location.hash);
  if (idx >= 0) {
    const p = (Z0 - storeZ(idx)) / (Z0 - Z1);
    scrollTo(0, p * maxScroll());
    if (hall) {
      // Land in the corridor, no overlay, and drop the hash so a reload stays put.
      camera.position.set(0, 1.7, storeZ(idx) + 7);
      history.replaceState(null, '', location.pathname + location.search);
    } else {
      history.replaceState({ store: idx }, '', location.hash);
      camera.position.set(0, 1.7, storeZ(idx) + 4);
      enterStore(idx, false);
    }
  }
  frame();
}

init();
