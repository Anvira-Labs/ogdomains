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
      wash.addColorStop(0, th === 'light' ? 'rgba(40,22,8,.20)' : 'rgba(240,120,50,.42)');
      wash.addColorStop(0.55, th === 'light' ? 'rgba(40,22,8,.07)' : 'rgba(214,74,8,.18)');
      wash.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, 1024, 1024);
      const glowCol = th === 'light' ? 'rgba(28,16,6,.62)' : 'rgba(240,120,50,.85)';
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
