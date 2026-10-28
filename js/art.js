import * as THREE from 'three';

// Canvas-painted textures for storefront windows and signs (no image assets needed).
const make = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
};
const vgrad = (ctx, w, h, stops) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
};
const glow = (ctx, x, y, r, color) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
};
const tex = (c) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const W = 512, H = 768;

const painters = {
  swami(ctx) {
    vgrad(ctx, W, H, [[0, '#07061a'], [0.6, '#17123d'], [1, '#05050f']]);
    glow(ctx, 256, 360, 320, 'rgba(123,224,255,.40)');
    // hologram beam
    const beam = ctx.createLinearGradient(0, 120, 0, 650);
    beam.addColorStop(0, 'rgba(123,224,255,0)'); beam.addColorStop(1, 'rgba(123,224,255,.35)');
    ctx.fillStyle = beam;
    ctx.beginPath(); ctx.moveTo(210, 130); ctx.lineTo(302, 130); ctx.lineTo(420, 650); ctx.lineTo(92, 650); ctx.fill();
    // projector rings
    ctx.lineWidth = 3;
    [90, 135, 180].forEach((r, i) => {
      ctx.strokeStyle = `rgba(245,194,107,${0.85 - i * 0.22})`;
      ctx.beginPath(); ctx.ellipse(256, 650, r, r * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
    });
    // seated silhouette
    const body = ctx.createLinearGradient(0, 260, 0, 620);
    body.addColorStop(0, 'rgba(255,230,170,.95)'); body.addColorStop(1, 'rgba(123,224,255,.55)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(256, 300, 40, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(256, 346); ctx.bezierCurveTo(180, 350, 150, 430, 130, 560);
    ctx.lineTo(160, 600); ctx.lineTo(352, 600); ctx.lineTo(382, 560);
    ctx.bezierCurveTo(362, 430, 332, 350, 256, 346); ctx.fill();
    // halo
    ctx.strokeStyle = 'rgba(245,194,107,.8)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(256, 300, 66, 0, Math.PI * 2); ctx.stroke();
    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2);
  },

  bollywood(ctx) {
    vgrad(ctx, W, H, [[0, '#2a0510'], [0.55, '#8a0f2c'], [1, '#14020a']]);
    glow(ctx, 256, 380, 300, 'rgba(255,207,74,.45)');
    // film strips
    ctx.fillStyle = '#0b0206';
    ctx.fillRect(0, 0, 56, H); ctx.fillRect(W - 56, 0, 56, H);
    ctx.fillStyle = '#f6e7c1';
    for (let y = 14; y < H; y += 44) {
      ctx.fillRect(16, y, 24, 28); ctx.fillRect(W - 40, y, 24, 28);
    }
    // star
    ctx.fillStyle = '#ffcf4a';
    ctx.shadowColor = '#ffcf4a'; ctx.shadowBlur = 40;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 70 : 160, a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx.lineTo(256 + Math.cos(a) * r, 380 + Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffe9a8'; ctx.textAlign = 'center';
    ctx.font = '64px "Bebas Neue", Impact, sans-serif';
    ctx.fillText('NOW SHOWING', 256, 110);
    ctx.fillText('HOUSEFULL', 256, 690);
    // marquee bulbs
    for (let x = 70; x < W - 60; x += 38) {
      [30, H - 30].forEach((y) => {
        glow(ctx, x, y, 16, 'rgba(255,230,140,.9)');
        ctx.fillStyle = '#fff6d6'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      });
    }
  },

  temple(ctx) {
    vgrad(ctx, W, H, [[0, '#1b0508'], [0.5, '#6b1d10'], [1, '#2b0a05']]);
    glow(ctx, 256, 300, 300, 'rgba(255,157,60,.45)');
    // shikhara tiers
    const tier = (w, h, y, c) => {
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.moveTo(256 - w / 2, y + h); ctx.lineTo(256, y); ctx.lineTo(256 + w / 2, y + h); ctx.fill();
    };
    tier(320, 160, 250, '#8a3a12'); tier(260, 140, 200, '#b9561a');
    tier(200, 120, 150, '#df7a28'); tier(140, 100, 100, '#ff9d3c');
    ctx.fillStyle = '#ffd98a'; ctx.fillRect(250, 70, 12, 40);
    ctx.beginPath(); ctx.arc(256, 62, 12, 0, Math.PI * 2); ctx.fill();
    // sanctum base + arch door
    ctx.fillStyle = '#4a1a0c'; ctx.fillRect(110, 410, 292, 230);
    ctx.fillStyle = '#12040a';
    ctx.beginPath(); ctx.moveTo(206, 640); ctx.lineTo(206, 500); ctx.arc(256, 500, 50, Math.PI, 0); ctx.lineTo(306, 640); ctx.fill();
    glow(ctx, 256, 560, 70, 'rgba(255,200,100,.7)');
    // om
    ctx.fillStyle = '#ffd98a'; ctx.textAlign = 'center'; ctx.font = '700 70px "Noto Sans Devanagari", serif';
    ctx.fillText('ॐ', 256, 400);
    // diyas
    for (let i = 0; i < 5; i++) {
      const x = 90 + i * 83, y = 712;
      glow(ctx, x, y - 14, 36, 'rgba(255,190,90,.9)');
      ctx.fillStyle = '#c1672a'; ctx.beginPath(); ctx.ellipse(x, y, 24, 9, 0, 0, Math.PI); ctx.fill();
      ctx.fillStyle = '#fff2c4'; ctx.beginPath(); ctx.ellipse(x, y - 14, 5, 12, 0, 0, Math.PI * 2); ctx.fill();
    }
  },

  portfolio(ctx) {
    vgrad(ctx, W, H, [[0, '#06121a'], [1, '#0a1f2b']]);
    glow(ctx, 256, 300, 300, 'rgba(61,227,193,.22)');
    ctx.strokeStyle = 'rgba(138,164,255,.18)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // cards
    const card = (x, y, w, h, c) => {
      ctx.fillStyle = 'rgba(8,24,34,.9)'; ctx.strokeStyle = c; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.stroke();
    };
    card(48, 90, 416, 220, '#3de3c1');
    card(48, 340, 196, 150, '#8aa4ff'); card(268, 340, 196, 150, '#8aa4ff');
    ctx.fillStyle = '#3de3c1'; ctx.textAlign = 'center';
    ctx.font = '500 120px "JetBrains Mono", monospace';
    ctx.fillText('</>', 256, 235);
    ctx.fillStyle = 'rgba(138,164,255,.7)';
    [0, 1].forEach((k) => {
      const x = 70 + k * 220;
      ctx.fillRect(x, 372, 150, 10); ctx.fillRect(x, 398, 110, 10); ctx.fillRect(x, 424, 130, 10);
    });
    ctx.fillStyle = '#e8fff9'; ctx.textAlign = 'left';
    ctx.font = '500 34px "JetBrains Mono", monospace';
    ctx.fillText('hello, I\'m Vipan_', 52, 580);
    ctx.fillStyle = '#3de3c1'; ctx.fillRect(52, 620, 180, 44);
    ctx.fillStyle = '#04120f'; ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.fillText('View work →', 70, 650);
  },

  soon(ctx) {
    vgrad(ctx, W, H, [[0, '#0d0e15'], [1, '#161824']]);
    ctx.strokeStyle = 'rgba(154,160,180,.6)'; ctx.lineWidth = 4; ctx.setLineDash([18, 14]);
    ctx.strokeRect(40, 60, W - 80, H - 120); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(154,160,180,.9)'; ctx.textAlign = 'center';
    ctx.font = '700 220px Cinzel, serif'; ctx.fillText('05', 256, 420);
    ctx.font = '500 34px Inter, sans-serif'; ctx.fillText('FITTING OUT', 256, 500);
  },
};

export function windowTexture(d) {
  const [c, ctx] = make(W, H);
  (painters[d.theme] || painters.soon)(ctx);
  return tex(c);
}

export function signTexture(d) {
  const [c, ctx] = make(1024, 256);
  const g = ctx.createLinearGradient(0, 0, 1024, 0);
  g.addColorStop(0, '#0b0b12'); g.addColorStop(0.5, '#171722'); g.addColorStop(1, '#0b0b12');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 256);
  ctx.strokeStyle = d.accent; ctx.lineWidth = 6; ctx.strokeRect(10, 10, 1004, 236);
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1.5; ctx.strokeRect(22, 22, 980, 212);
  ctx.fillStyle = d.accent; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = d.accent; ctx.shadowBlur = 24;
  let size = 124;
  const font = d.theme === 'bollywood' ? '"Bebas Neue", Impact' : d.theme === 'portfolio' ? '"JetBrains Mono", monospace' : 'Cinzel, serif';
  do { ctx.font = `700 ${size}px ${font}`; size -= 4; } while (ctx.measureText(d.name).width > 900 && size > 40);
  ctx.fillText(d.name, 512, 132);
  return tex(c);
}

// Text colours per theme for the canvas-painted hall signage (light text on dark, dark on light).
const INK = {
  dark: { main: '#f3e3b8', sub: 'rgba(243,227,184,.6)', glow: '#f5c26b', blur: 20 },
  light: { main: '#3a2708', sub: 'rgba(58,39,8,.78)', glow: 'rgba(0,0,0,0)', blur: 0 },
};

// Emblem (transparent cutout, already contains the OG Domains wordmark) + one small caption.
// t.userData.setTheme('light'|'dark') repaints in place (same texture object, no new materials).
export function lobbyTexture(img, theme = 'dark') {
  const [c, ctx] = make(1024, 1024);
  const t = tex(c);
  let th = theme;
  const draw = () => {
    const ink = INK[th] || INK.dark;
    ctx.clearRect(0, 0, 1024, 1024);
    if (img && img.complete && img.naturalWidth) {
      // lockup: emblem + caption, centred vertically as a group
      const s = Math.min(940 / img.naturalWidth, 800 / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      const gap = 36, capH = 44, total = h + gap + capH, top = (1024 - total) / 2;
      const x = (1024 - w) / 2;
      // Glow: a warm wash behind the mark, then layered shadow passes that bloom
      // around the cutout's own alpha rather than around a rectangle.
      const cx = 512, cy = top + h / 2;
      const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.78);
      wash.addColorStop(0, th === 'light' ? 'rgba(240,120,50,.30)' : 'rgba(240,120,50,.42)');
      wash.addColorStop(0.55, th === 'light' ? 'rgba(214,74,8,.12)' : 'rgba(214,74,8,.18)');
      wash.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, 1024, 1024);
      const glowCol = th === 'light' ? 'rgba(188,60,0,.60)' : 'rgba(240,120,50,.85)';
      for (const blur of [64, 36, 18]) {
        ctx.save();
        ctx.shadowColor = glowCol;
        ctx.shadowBlur = blur;
        ctx.drawImage(img, x, top, w, h);
        ctx.restore();
      }
      ctx.drawImage(img, x, top, w, h);
      drawCaption(top + h + gap + capH * 0.8, ink);
    } else drawCaption(900, ink);
    t.needsUpdate = true;
  };
  const drawCaption = (y, ink) => {
    ctx.textAlign = 'center'; ctx.fillStyle = ink.sub;
    ctx.shadowColor = ink.glow; ctx.shadowBlur = ink.blur;
    ctx.font = '600 44px Inter, sans-serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '18px';
    ctx.fillText('THE MALL', 512 + 9, y);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    ctx.shadowBlur = 0;
  };
  t.userData.setTheme = (n) => { th = n; draw(); };
  draw();
  if (img && !img.complete) img.addEventListener('load', draw);
  return t;
}

export function textPlane(text, sub, theme = 'dark') {
  const [c, ctx] = make(1024, 256);
  const t = tex(c);
  const draw = (th) => {
    const ink = INK[th] || INK.dark;
    ctx.clearRect(0, 0, 1024, 256);
    ctx.textAlign = 'center'; ctx.fillStyle = ink.main;
    ctx.font = '700 56px Cinzel, serif'; ctx.fillText(text, 512, 120);
    ctx.fillStyle = ink.sub; ctx.font = '500 34px Inter, sans-serif'; ctx.fillText(sub, 512, 180);
    t.needsUpdate = true;
  };
  t.userData.setTheme = draw;
  draw(theme);
  return t;
}

// ---- Wall emblems: copper relief baked into a canvas (fake top-left light; no real geometry/lights) ----
// Palette (owner-supplied): primary #BC3C00, highlight #F07832, mid #D64A08, dark edge #922900, deep shadow #681B00.
const RELIEF = {
  dark: { shadow: 'rgba(104,27,0,.95)', blur: 14, sx: 9, sy: 11, edge: '#922900', face: ['#D64A08', '#BC3C00'], hi: '#F07832' },
  light: { shadow: 'rgba(48,18,0,.6)', blur: 20, sx: 10, sy: 13, edge: '#681B00', face: ['#BC3C00', '#922900'], hi: '#F07832' },
};
export function wallEmblemTexture(variant = 'monogram', theme = 'dark') {
  const wide = variant === 'wordmark';
  const [c, ctx] = make(wide ? 1024 : 512, wide ? 256 : 512);
  const t = tex(c);
  const cx = c.width / 2, cy = c.height / 2;
  const shape = () => {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (variant === 'wordmark') {
      let size = 120;
      do { ctx.font = `700 ${size}px Cinzel, serif`; size -= 4; } while (ctx.measureText('OGDOMAINS.COM').width > 900 && size > 40);
      ctx.fillText('OGDOMAINS.COM', cx, cy + 4);
    } else if (variant === 'seal') {
      ctx.beginPath(); ctx.arc(cx, cy, 215, 0, Math.PI * 2); ctx.arc(cx, cy, 175, 0, Math.PI * 2, true); ctx.fill('evenodd');
      ctx.font = '700 170px Cinzel, serif'; ctx.fillText('OG', cx, cy + 8);
      ctx.beginPath(); ctx.arc(cx, cy + 128, 9, 0, Math.PI * 2); ctx.arc(cx, cy - 128, 9, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.font = '700 300px Cinzel, serif'; ctx.fillText('OG', cx, cy + 12);
    }
  };
  const paint = (th) => {
    const R = RELIEF[th] || RELIEF.dark;
    ctx.clearRect(0, 0, c.width, c.height);
    // contact shadow beneath (down-right)
    ctx.save(); ctx.shadowColor = R.shadow; ctx.shadowBlur = R.blur; ctx.shadowOffsetX = R.sx; ctx.shadowOffsetY = R.sy;
    ctx.fillStyle = R.edge; shape(); ctx.restore();
    // shaded (bottom-right) edge
    ctx.save(); ctx.translate(4, 4); ctx.fillStyle = R.edge; shape(); ctx.restore();
    // lit (top-left) bevel
    ctx.save(); ctx.translate(-3, -3); ctx.fillStyle = R.hi; shape(); ctx.restore();
    // face
    const g = ctx.createLinearGradient(cx - 200, cy - 200, cx + 200, cy + 200);
    g.addColorStop(0, R.face[0]); g.addColorStop(1, R.face[1]);
    ctx.fillStyle = g; shape();
    t.needsUpdate = true;
  };
  t.userData.setTheme = paint;
  paint(theme);
  return t;
}

// ---- Coffered / skylight ceiling: one 12 x 6.5 m bay baked into a tile, repeated down the hall ----
// dark = bronze coffers with gold trim and a warm spill around each fixture; light = glazed skylight bays with daylight.
export function ceilingTexture(bays, theme = 'dark') {
  const [c, ctx] = make(1024, 512);           // power of two (repeat-safe); drawn in world units so it maps back undistorted
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, bays);
  const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
  const paint = (th) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1024, 512);
    ctx.setTransform(1024 / 12, 0, 0, 512 / 6.5, 0, 0);
    const cx = 6, cy = 3.25;
    if (th === 'light') {
      ctx.fillStyle = '#efe8d8'; ctx.fillRect(0, 0, 12, 6.5);                       // cream frame
      rr(0.55, 0.5, 10.9, 5.5, 0.12); ctx.fillStyle = '#b9893a'; ctx.fill();         // gold-bronze surround
      rr(0.7, 0.65, 10.6, 5.2, 0.08);
      const g = ctx.createRadialGradient(cx, cy, 0.3, cx, cy, 6);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#f4f8fc'); g.addColorStop(1, '#d6e4f0');
      ctx.fillStyle = g; ctx.fill();                                                  // glass: sky
      const warm = ctx.createRadialGradient(cx, cy, 0, cx, cy, 3.2);
      warm.addColorStop(0, 'rgba(255,226,150,.55)'); warm.addColorStop(1, 'rgba(255,226,150,0)');
      ctx.fillStyle = warm; ctx.fillRect(0.7, 0.65, 10.6, 5.2);
      ctx.strokeStyle = '#c9bda3'; ctx.lineWidth = 0.07;                              // mullions: 4 x 2 panes
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0.7 + i * 2.65, 0.65); ctx.lineTo(0.7 + i * 2.65, 5.85); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(0.7, cy); ctx.lineTo(11.3, cy); ctx.stroke();
      ctx.strokeStyle = 'rgba(122,79,0,.7)'; ctx.lineWidth = 0.05; rr(0.7, 0.65, 10.6, 5.2, 0.08); ctx.stroke();
    } else {
      ctx.fillStyle = '#1f1710'; ctx.fillRect(0, 0, 12, 6.5);
      rr(0.5, 0.45, 11, 5.6, 0.15);                                                   // recessed coffer
      const g = ctx.createRadialGradient(cx, cy, 0.2, cx, cy, 6);
      g.addColorStop(0, '#8a5c28'); g.addColorStop(0.35, '#473019'); g.addColorStop(1, '#2a1d11');
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = 'rgba(245,194,107,.7)'; ctx.lineWidth = 0.06; ctx.stroke();
      ctx.strokeStyle = 'rgba(245,194,107,.35)'; ctx.lineWidth = 0.035; rr(0.95, 0.9, 10.1, 4.7, 0.1); ctx.stroke(); // stepped inner line
      rr(1.4, 1.35, 9.2, 3.8, 0.08); ctx.stroke();
      ctx.lineWidth = 0.05; ctx.strokeStyle = 'rgba(245,194,107,.6)';                  // medallion rings + 8-point star
      [1.5, 1.15].forEach((r) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });
      ctx.beginPath();
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? 1.0 : 1.9; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
      ctx.closePath(); ctx.stroke();
      ctx.fillStyle = 'rgba(245,194,107,.55)';                                         // corner diamonds + side ornaments
      [[1.0, 0.95], [11.0, 0.95], [1.0, 5.55], [11.0, 5.55], [2.9, cy], [9.1, cy]].forEach(([x, y]) => {
        ctx.beginPath(); ctx.moveTo(x, y - 0.22); ctx.lineTo(x + 0.22, y); ctx.lineTo(x, y + 0.22); ctx.lineTo(x - 0.22, y); ctx.fill();
      });
    }
    t.needsUpdate = true;
  };
  t.userData.setTheme = paint;
  paint(theme);
  return t;
}

// ---- Storefront recess textures: baked ambient occlusion + warm spill so the alcove reads as depth (no lights) ----
// kind: 'side' (return wall, u = front->back, v = floor->soffit), 'soffit' (u across, canvas top = front lip),
// 'threshold' (4.2 x 2.2 m, canvas top = deep end, wall line 1.2 m down), 'glass' (diagonal specular streaks).
export function recessTexture(kind, theme = 'dark') {
  const dims = { side: [128, 512], soffit: [256, 128], threshold: [512, 256], glass: [128, 256] }[kind];
  const [c, ctx] = make(dims[0], dims[1]);
  const t = tex(c);
  const w = c.width, h = c.height;
  const lin = (x0, y0, x1, y1, stops) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };
  const painters = {
    side(dark) {
      ctx.fillStyle = lin(0, 0, w, 0, dark ? [[0, '#7a6550'], [1, '#4d3c2c']] : [[0, '#f3ede1'], [1, '#ddd3bf']]);
      ctx.fillRect(0, 0, w, h);
      // inset panel moulding
      ctx.strokeStyle = dark ? 'rgba(245,194,107,.35)' : 'rgba(150,110,40,.35)'; ctx.lineWidth = 2;
      ctx.strokeRect(14, 70, w - 28, h - 150);
      if (dark) { // warm spill from the lit interior, strongest toward the back
        const g = ctx.createRadialGradient(w, h * 0.62, 0, w, h * 0.62, 260);
        g.addColorStop(0, 'rgba(255,190,110,.35)'); g.addColorStop(1, 'rgba(255,190,110,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      } else { // daylight from the corridor, strongest at the front
        ctx.fillStyle = lin(0, 0, w * 0.7, 0, [[0, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(0, 0, w, h);
      }
      const ao = dark ? 1 : 0.45;
      ctx.fillStyle = lin(0, 0, 0, 150, [[0, `rgba(0,0,0,${0.6 * ao})`], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(0, 0, w, 150);          // under soffit
      ctx.fillStyle = lin(w * 0.62, 0, w, 0, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${0.55 * ao})`]]); ctx.fillRect(0, 0, w, h);      // back corner
      ctx.fillStyle = lin(0, h - 40, 0, h, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${0.45 * ao})`]]); ctx.fillRect(0, h - 40, w, 40);  // floor contact
    },
    soffit(dark) {
      ctx.fillStyle = dark ? '#3b2d21' : '#f1ebdf'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = lin(0, 0, 0, h * 0.55, dark ? [[0, 'rgba(255,205,130,.7)'], [1, 'rgba(255,205,130,0)']] : [[0, 'rgba(255,248,225,.9)'], [1, 'rgba(255,248,225,0)']]);
      ctx.fillRect(0, 0, w, h);                                                                 // downlight cove at the front lip
      ctx.strokeStyle = dark ? 'rgba(245,194,107,.45)' : 'rgba(150,110,40,.4)'; ctx.lineWidth = 2; ctx.strokeRect(24, 20, w - 48, h - 40);
      const ao = dark ? 1 : 0.4;
      ctx.fillStyle = lin(0, 0, 36, 0, [[0, `rgba(0,0,0,${0.6 * ao})`], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(0, 0, 36, h);
      ctx.fillStyle = lin(w - 36, 0, w, 0, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${0.6 * ao})`]]); ctx.fillRect(w - 36, 0, 36, h);
      ctx.fillStyle = lin(0, h - 40, 0, h, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${0.6 * ao})`]]); ctx.fillRect(0, h - 40, w, 40);
    },
    threshold(dark) {
      const px = w / 4.2, py = h / 2.2, wallY = 1.2 * py, x0 = w / 2 - 1.6 * px, x1 = w / 2 + 1.6 * px;
      // interior floor (deep end at top): polished stone
      ctx.fillStyle = dark ? '#1a140f' : '#bdb29d'; ctx.fillRect(0, 0, w, wallY);
      const gl = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 0, 190);
      gl.addColorStop(0, dark ? 'rgba(255,190,110,.35)' : 'rgba(255,245,215,.5)'); gl.addColorStop(1, 'rgba(255,190,110,0)');
      ctx.fillStyle = gl; ctx.fillRect(0, 0, w, wallY);
      // diamond inlay
      ctx.strokeStyle = dark ? 'rgba(245,194,107,.6)' : 'rgba(150,110,40,.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(w / 2, wallY * 0.25); ctx.lineTo(w / 2 + 70, wallY * 0.58); ctx.lineTo(w / 2, wallY * 0.92); ctx.lineTo(w / 2 - 70, wallY * 0.58); ctx.closePath(); ctx.stroke();
      const ao = dark ? 1 : 0.4;
      ctx.fillStyle = lin(x0, 0, x0 + 34, 0, [[0, `rgba(0,0,0,${0.6 * ao})`], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x0, 0, 34, wallY);
      ctx.fillStyle = lin(x1 - 34, 0, x1, 0, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${0.6 * ao})`]]); ctx.fillRect(x1 - 34, 0, 34, wallY);
      ctx.fillStyle = lin(0, 0, 0, 30, [[0, `rgba(0,0,0,${0.55 * ao})`], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(0, 0, w, 30);
      // apron in the corridor: different, lighter honed stone with a brass border
      ctx.fillStyle = lin(0, wallY, 0, h, dark ? [[0, '#7a6851'], [1, '#5a4a3a']] : [[0, '#e3d9c4'], [1, '#d3c8b0']]); ctx.fillRect(0, wallY, w, h - wallY);
      ctx.strokeStyle = dark ? 'rgba(245,194,107,.7)' : 'rgba(150,110,40,.7)'; ctx.lineWidth = 3; ctx.strokeRect(10, wallY + 22, w - 20, h - wallY - 32);
      ctx.lineWidth = 1.5; ctx.strokeRect(18, wallY + 30, w - 36, h - wallY - 48);
      // brass threshold bar across the opening
      ctx.fillStyle = lin(0, wallY, 0, wallY + 12, [[0, dark ? '#f5c26b' : '#c9a24f'], [1, dark ? '#a9760f' : '#8a6420']]); ctx.fillRect(x0 - 8, wallY - 2, x1 - x0 + 16, 12);
      ctx.fillStyle = lin(0, wallY - 14, 0, wallY, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${0.35 * ao})`]]); ctx.fillRect(x0, wallY - 14, x1 - x0, 14);
    },
    glass(dark) {
      ctx.fillStyle = dark ? 'rgba(170,195,220,.07)' : 'rgba(190,220,245,.12)'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = lin(0, 0, 0, h * 0.45, [[0, dark ? 'rgba(255,225,180,.16)' : 'rgba(255,255,255,.3)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(0, 0, w, h);
      const a = dark ? 0.2 : 0.4;
      [[10, 26], [52, 10], [86, 6]].forEach(([x, bw]) => {
        const g = lin(x, 0, x + bw, 0, [[0, 'rgba(255,255,255,0)'], [0.5, `rgba(255,255,255,${a})`], [1, 'rgba(255,255,255,0)']]);
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + 60, 0); ctx.lineTo(x + 60 + bw, 0); ctx.lineTo(x + bw - 60, h); ctx.lineTo(x - 60, h); ctx.closePath(); ctx.fill();
      });
    },
  };
  const paint = (th) => { ctx.clearRect(0, 0, w, h); painters[kind](th !== 'light'); t.needsUpdate = true; };
  t.userData.setTheme = paint;
  paint(theme);
  return t;
}

// ---- Crowd impostors: one atlas of baked, softly lit figure silhouettes (no real lights, no models) ----
// Overhead warm fixtures => warm rim on head/shoulders, floor bounce on legs, darker mid-body. Painted per theme.
// Cell = 256x512 px for a single person (1px = 1.95/512 m, feet 16px above the cell bottom); pairs are 512 wide.
const CR_FY = 496, CR_H = 460;
const CR_SPECS = (() => {
  const T = (h, s, d, l) => [h, s, d, l]; // [hue, sat, lightness dark, lightness light]
  const person = (o) => Object.assign({ b: 1, style: 'jacket', hair: 'short', sleeve: 'long', stride: 15, arm: 9, bag: null, bagSide: 1, lean: 0, stoop: 0 }, o);
  const skinA = T(24, 34, 22, 66), skinB = T(20, 38, 16, 54), skinC = T(28, 30, 27, 72), skinD = T(18, 40, 12, 42);
  const blk = T(25, 15, 6, 30), brn = T(22, 28, 12, 38), gry = T(215, 6, 20, 70), sand = T(30, 22, 18, 64);
  const bagGold = T(38, 45, 30, 66), bagRed = T(8, 40, 22, 62), bagTeal = T(180, 20, 22, 60);
  const pA = person({ b: 1.1, top: T(215, 14, 12, 46), bot: T(220, 10, 9, 38), skin: skinA, hairC: blk, bag: 'shop', bagC: bagGold, bagSide: 1 });
  const pB = person({ b: 0.85, style: 'coat', top: T(30, 38, 24, 70), bot: T(30, 38, 24, 70), legC: blk, skin: skinC, hair: 'long', hairC: brn, bag: 'hand', bagC: T(15, 30, 10, 40) });
  const pC = person({ b: 0.95, style: 'tee', sleeve: 'long', hair: 'cap', top: T(200, 8, 16, 52), bot: T(225, 20, 11, 40), skin: skinB, hairC: blk, cap: T(0, 0, 8, 34), bag: 'back', bagC: T(10, 15, 10, 36), stride: 18 });
  const pD = person({ b: 0.82, style: 'dress', top: T(350, 35, 15, 52), legC: T(20, 20, 8, 44), skin: skinA, hair: 'bun', hairC: T(25, 25, 8, 36) });
  const pE = person({ b: 1.05, style: 'coat', top: T(40, 8, 17, 58), bot: T(40, 8, 17, 58), legC: gry, skin: skinC, hair: 'bald', hairC: gry, stoop: 1, lean: 0.035, stride: 10, arm: 6 });
  const pF = person({ b: 0.88, top: T(150, 20, 14, 58), bot: T(30, 15, 9, 36), skin: skinB, hair: 'short', hairC: T(30, 40, 14, 44), bag: 'shop', bagC: bagRed, bagSide: -1 });
  const pG = person({ b: 0.9, style: 'coat', top: T(220, 12, 8, 32), bot: T(220, 12, 8, 32), legC: blk, skin: skinD, hair: 'short', hairC: blk, stride: 13, arm: 7 });
  const pH = person({ b: 1.32, style: 'tee', sleeve: 'short', top: T(12, 30, 20, 62), bot: T(30, 20, 14, 52), skin: skinA, hair: 'bald', hairC: blk, stride: 20, arm: 13 });
  const pI = person({ b: 0.8, style: 'hoodie', top: T(270, 25, 18, 60), bot: sand, skin: skinC, hair: 'long', hairC: T(35, 45, 22, 58), bag: 'back', bagC: T(200, 25, 14, 50) });
  const pJ = person({ b: 0.86, style: 'skirt', top: T(0, 0, 9, 34), bot: T(0, 0, 9, 34), legC: skinB, skin: skinB, hair: 'long', hairC: blk, bag: 'shop', bagC: bagTeal, bagSide: 1 });
  const pK = person({ b: 1.0, style: 'suit', top: T(225, 20, 10, 36), bot: T(225, 20, 10, 36), skin: skinD, hair: 'short', hairC: blk, stride: 14 });
  const pL = person({ b: 0.84, style: 'coat', top: T(5, 30, 12, 44), bot: T(5, 30, 12, 44), legC: blk, skin: skinA, hair: 'bun', hairC: T(35, 30, 20, 55), bag: 'hand', bagC: blk });
  // pairs: [left, right] with per-person scale
  const pairA = [[person({ b: 1.05, top: T(35, 20, 15, 56), bot: T(215, 12, 10, 40), skin: skinA, hairC: brn, stride: 14 }), 1.03], [person({ b: 0.83, style: 'coat', top: T(200, 20, 14, 50), bot: T(200, 20, 14, 50), legC: blk, skin: skinC, hair: 'long', hairC: T(30, 40, 18, 56), bag: 'hand', bagC: T(15, 30, 10, 40), bagSide: -1 }), 0.94]];
  const pairB = [[person({ b: 0.85, style: 'dress', top: T(160, 25, 15, 54), legC: skinB, skin: skinB, hair: 'long', hairC: blk, bag: 'shop', bagC: bagGold, bagSide: -1 }), 0.96], [person({ b: 0.9, style: 'skirt', top: T(25, 35, 20, 64), bot: T(25, 35, 20, 64), legC: skinB, skin: skinC, hair: 'bun', hairC: brn, stride: 12 }), 0.92]];
  return { singles: [pA, pB, pC, pD, pE, pF, pG, pH, pI, pJ, pK, pL], pairs: [pairA, pairB] };
})();

function crowdPerson(ctx, p, th, ox, sc) {
  const L = th === 'light' ? 1 : 0;
  const col = (c) => `hsl(${c[0]} ${c[1]}% ${c[2 + L]}%)`;
  const b = p.b, H = CR_H;
  const sh = 46 * (0.78 + 0.22 * b) * (b > 1.2 ? 1.08 : 1), wa = 36 * b, hp = 40 * (0.8 + 0.2 * b), nk = 9;
  const yS = -H * 0.815, yC = -H * 0.72, yW = -H * 0.63, yHip = -H * 0.52;
  const hem = { jacket: -H * 0.44, suit: -H * 0.45, coat: -H * 0.27, dress: -H * 0.31, skirt: -H * 0.36, tee: -H * 0.49, hoodie: -H * 0.43 }[p.style];
  const hemW = (p.style === 'dress' || p.style === 'skirt' ? hp + 15 : p.style === 'coat' ? hp + 9 : hp + 1);
  const hx = (p.stoop ? 7 : 0), hy = -H + 31 + (p.stoop ? 9 : 0);
  ctx.save(); ctx.translate(ox, CR_FY); ctx.scale(sc, sc); ctx.transform(1, 0, p.lean, 1, 0, 0);
  const skin = col(p.skin), top = col(p.top), bot = col(p.bot || p.top), hair = col(p.hairC);
  const smooth = (pts, first) => { // quadratic through midpoints
    first ? ctx.moveTo(pts[0][0], pts[0][1]) : ctx.lineTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
    ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  };
  const el = (x, y, rx, ry, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); };
  const rr = (x, y, w, h, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); };
  // behind: long hair, backpack
  if (p.hair === 'long') { ctx.fillStyle = hair; ctx.beginPath(); ctx.roundRect(hx - 25, hy - 28, 50, 98, 22); ctx.fill(); }
  if (p.bag === 'back') rr(-sh - 7, yS + 2, 2 * sh + 14, 92, 14, col(p.bagC));
  // legs
  const legC = p.legC ? col(p.legC) : bot, dressy = p.style === 'dress' || p.style === 'skirt' || p.style === 'coat';
  for (const s of [-1, 1]) {
    const st = p.stride * (s < 0 ? 1 : 0.7);
    ctx.fillStyle = dressy ? legC : bot; ctx.beginPath();
    ctx.moveTo(s * hp, yHip - 6); ctx.quadraticCurveTo(s * (hp * 0.7 + st * 0.5), -H * 0.27, s * (st + 9), -16);
    ctx.lineTo(s * (st - 8), -16); ctx.quadraticCurveTo(s * (st * 0.4 + 6), -H * 0.27, s * 3, yHip - 6); ctx.closePath(); ctx.fill();
    el(s * (st + 1), -6, 14, 7, col([20, 10, 5, 28]));
  }
  // torso
  const left = [[-nk, yS - 12], [-sh * 0.75, yS - 5], [-sh, yS + 10], [-sh * 0.92, yC], [-wa, yW], [-hp, yHip], [-hemW, hem]];
  const right = left.map(([x, y]) => [-x, y]).reverse();
  ctx.fillStyle = (p.style === 'dress' || p.style === 'coat' || p.style === 'hoodie' || p.style === 'jacket' || p.style === 'suit') ? top : top;
  ctx.beginPath(); smooth(left, true); ctx.lineTo(right[0][0], right[0][1]); smooth(right, false); ctx.closePath(); ctx.fill();
  if (p.style === 'tee' || p.style === 'jacket') { // trousers show under the shirt line at the hips for two-tone clothing
    ctx.fillStyle = bot; ctx.beginPath(); ctx.moveTo(-hp, yHip + 4); ctx.lineTo(hp, yHip + 4); ctx.lineTo(hp - 2, hem + 2); ctx.lineTo(-hp + 2, hem + 2); ctx.fill();
  }
  if (p.style === 'skirt') { ctx.fillStyle = bot; ctx.beginPath(); ctx.moveTo(-wa, yW + 14); ctx.lineTo(wa, yW + 14); ctx.lineTo(hemW, hem); ctx.lineTo(-hemW, hem); ctx.fill(); }
  // arms (+ bag in hand)
  const handY = -H * 0.46;
  for (const s of [-1, 1]) {
    const hxA = s * (sh + p.arm * (s === p.bagSide && p.bag === 'hand' ? 0.3 : 1)), sx = s * (sh - 6);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = top; ctx.lineWidth = p.style === 'dress' && p.b < 0.9 ? 12 : 16 * (0.85 + 0.15 * b);
    ctx.beginPath(); ctx.moveTo(sx, yS + 14); ctx.quadraticCurveTo(s * (sh + p.arm * 0.9), -H * 0.62, hxA, p.sleeve === 'short' ? -H * 0.66 : handY + 10); ctx.stroke();
    if (p.sleeve === 'short') { ctx.strokeStyle = skin; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(hxA, -H * 0.66); ctx.quadraticCurveTo(s * (sh + p.arm + 3), -H * 0.55, s * (sh + p.arm + 1), handY + 10); ctx.stroke(); }
    el(s * (sh + p.arm + (p.sleeve === 'short' ? 1 : 0)), handY + 17, 7, 9, skin);
    if (p.bag && s === p.bagSide && p.bag !== 'back') {
      const bx = s * (sh + p.arm + 2), by = handY + 20, c = col(p.bagC);
      ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx - 10, by + 14); ctx.quadraticCurveTo(bx, by - 8, bx + 10, by + 14); ctx.stroke();
      p.bag === 'shop' ? rr(bx - 21, by + 12, 42, 58, 3, c) : rr(bx - 18, by + 10, 36, 30, 7, c);
    }
  }
  // neck + head + hair
  ctx.strokeStyle = skin; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, yS - 4); ctx.lineTo(hx, hy + 16); ctx.stroke();
  if (p.style === 'hoodie') el(0, yS - 4, 22, 11, top);
  el(hx, hy + 2, 18.5, 25, skin);
  if (p.hair === 'bald') { /* nothing: just skin */ }
  else if (p.hair === 'long') { ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(hx, hy - 8, 22, 22, 0, Math.PI, 0); ctx.fill(); rr(hx - 23, hy - 12, 8, 50, 4, hair); rr(hx + 15, hy - 12, 8, 50, 4, hair); }
  else { ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(hx, hy - 7, 21, 20, 0, Math.PI, 0); ctx.fill(); }
  if (p.hair === 'bun') el(hx, hy - 33, 11, 10, hair);
  if (p.hair === 'cap') { ctx.fillStyle = col(p.cap); ctx.beginPath(); ctx.ellipse(hx, hy - 10, 21, 17, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(hx + 6, hy - 9, 26, 5, 0, 0, 7); ctx.fill(); }
  ctx.restore();
}

// Light the silhouette: soft edges, warm overhead rim on head/shoulders, floor bounce on the lower body.
function crowdLit(out, src, w, h, th, tmp) {
  const warm = th === 'light' ? [255, 244, 222] : [255, 196, 120], bounce = th === 'light' ? [226, 206, 176] : [190, 128, 70];
  const o = out.getContext('2d'), t = tmp.getContext('2d');
  o.clearRect(0, 0, w, h);
  o.save(); o.filter = 'blur(0.9px)'; o.drawImage(src, 0, 0); o.restore();
  o.globalCompositeOperation = 'source-atop'; // body shading: lit from above, falling to cool/dark near the floor
  const g = o.createLinearGradient(0, 30, 0, CR_FY);
  if (th === 'light') { g.addColorStop(0, 'rgba(255,248,232,.30)'); g.addColorStop(0.45, 'rgba(120,140,170,.10)'); g.addColorStop(1, 'rgba(70,90,130,.28)'); }
  else { g.addColorStop(0, `rgba(${warm},.20)`); g.addColorStop(0.3, 'rgba(0,0,0,.06)'); g.addColorStop(1, 'rgba(0,0,0,.34)'); }
  o.fillStyle = g; o.fillRect(0, 0, w, h);
  o.globalCompositeOperation = 'source-over';
  const crescent = (dx, dy, grad, alpha) => {
    t.clearRect(0, 0, w, h); t.globalCompositeOperation = 'source-over'; t.drawImage(out, 0, 0);
    t.globalCompositeOperation = 'destination-out'; t.drawImage(out, dx, dy);
    t.globalCompositeOperation = 'source-in'; t.fillStyle = grad; t.fillRect(0, 0, w, h);
    o.save(); o.filter = 'blur(1.2px)'; o.globalAlpha = alpha; o.drawImage(tmp, 0, 0); o.restore();
  };
  const rim = t.createLinearGradient(0, 24, 0, CR_FY - CR_H * 0.38);
  rim.addColorStop(0, `rgba(${warm},1)`); rim.addColorStop(0.3, `rgba(${warm},.7)`); rim.addColorStop(1, `rgba(${warm},0)`);
  crescent(0, 5, rim, th === 'light' ? 0.75 : 1); crescent(0, 14, rim, th === 'light' ? 0.25 : 0.4);
  crescent(1.5, 3, rim, 0.25); crescent(-1.5, 3, rim, 0.25);
  const bn = t.createLinearGradient(0, CR_FY - CR_H * 0.42, 0, CR_FY);
  bn.addColorStop(0, `rgba(${bounce},0)`); bn.addColorStop(1, `rgba(${bounce},.55)`);
  crescent(0, -5, bn, th === 'light' ? 0.5 : 0.8);
}

export function crowdTexture(theme = 'dark') {
  const AW = 2048, AH = 1024;
  const [c, ctx] = make(AW, AH);
  const t = tex(c); t.anisotropy = 4;
  const cells = [];
  for (let k = 0; k < 8; k++) cells.push({ x: k * 256, y: 0, w: 256, h: 512, who: [[CR_SPECS.singles[k], 1, 128]] });
  CR_SPECS.pairs.forEach((pr, k) => cells.push({ x: k * 512, y: 512, w: 512, h: 512, who: [[pr[0][0], pr[0][1], 150], [pr[1][0], pr[1][1], 366]] }));
  for (let k = 0; k < 4; k++) cells.push({ x: 1024 + k * 256, y: 512, w: 256, h: 512, who: [[CR_SPECS.singles[8 + k], 1, 128]] });
  t.userData.cells = cells.map((e) => ({ u0: e.x / AW, v0: 1 - (e.y + e.h) / AH, du: e.w / AW, dv: e.h / AH, wm: e.w * 1.95 / 512, hm: 1.95, pair: e.w > 256 }));
  const [sc_, sctx] = make(512, 512), [oc] = make(512, 512), [tc] = make(512, 512);
  t.userData.setTheme = (th) => {
    ctx.clearRect(0, 0, AW, AH);
    for (const e of cells) {
      sctx.clearRect(0, 0, 512, 512);
      for (const [p, s, ox] of e.who) crowdPerson(sctx, p, th, ox, s);
      crowdLit(oc, sc_, e.w, e.h, th, tc);
      ctx.drawImage(oc, 0, 0, e.w, e.h, e.x, e.y, e.w, e.h);
    }
    t.needsUpdate = true;
  };
  t.userData.setTheme(theme);
  return t;
}

// Soft elliptical contact shadow, white-on-alpha (tinted per theme by the material colour), darkest at the feet.
export function crowdShadowTexture() {
  const [c, ctx] = make(128, 128);
  ctx.translate(64, 64); ctx.scale(1, 1);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 62);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.28, 'rgba(255,255,255,.72)'); g.addColorStop(0.6, 'rgba(255,255,255,.24)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(-64, -64, 128, 128);
  return tex(c);
}
