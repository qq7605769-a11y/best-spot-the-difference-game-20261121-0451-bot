// Scenes for Lantern Hunt: three hand-drawn SVG worlds, each with 7 hidden
// differences. Every scene is one function that paints the same picture twice:
// variant 'a' is the original, variant 'b' is the twin with 7 small changes.
// The differences list gives the click target (viewBox coords) and a name for
// the "found" toast. Nothing here is copied from anywhere: all art is drawn
// from these shapes.

function star(cx, cy, r, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

function lantern(cx, cy, color, lit) {
  const glow = lit
    ? `<circle cx="${cx}" cy="${cy}" r="34" fill="${color}" opacity="0.18"/>`
    : '';
  return `${glow}<line x1="${cx}" y1="${cy - 34}" x2="${cx}" y2="${cy - 20}" stroke="#8a6d3b" stroke-width="2"/>`
    + `<ellipse cx="${cx}" cy="${cy}" rx="17" ry="21" fill="${color}" stroke="#7a2e1d" stroke-width="1.5"/>`
    + `<line x1="${cx - 13}" y1="${cy - 8}" x2="${cx + 13}" y2="${cy - 8}" stroke="#7a2e1d" stroke-width="1" opacity="0.6"/>`
    + `<line x1="${cx - 13}" y1="${cy + 8}" x2="${cx + 13}" y2="${cy + 8}" stroke="#7a2e1d" stroke-width="1" opacity="0.6"/>`
    + `<rect x="${cx - 5}" y="${cy - 25}" width="10" height="5" fill="#d9a441"/>`
    + `<line x1="${cx}" y1="${cy + 21}" x2="${cx}" y2="${cy + 32}" stroke="#d9a441" stroke-width="2"/>`;
}

function jar(cx, cy, color) {
  return `<rect x="${cx - 11}" y="${cy - 16}" width="22" height="30" rx="6" fill="${color}" stroke="#2c2118" stroke-width="1.5"/>`
    + `<rect x="${cx - 8}" y="${cy - 21}" width="16" height="6" rx="2" fill="#c9a25e"/>`
    + `<rect x="${cx - 6}" y="${cy - 8}" width="12" height="14" rx="3" fill="#ffffff" opacity="0.25"/>`;
}

function awning(x, y, w, c1, c2) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="26" fill="${c1}"/>`;
  const stripes = 6;
  for (let i = 0; i < stripes; i += 2) {
    s += `<rect x="${x + (w / stripes) * i}" y="${y}" width="${w / stripes}" height="26" fill="${c2}"/>`;
  }
  s += `<rect x="${x}" y="${y + 26}" width="${w}" height="6" fill="#00000033"/>`;
  return s;
}

// ---- Scene 1: Lantern Market ---------------------------------------------
function market(v) {
  const b = v === 'b';
  const moon = b
    ? `<circle cx="90" cy="70" r="26" fill="#f7e9b0"/><circle cx="82" cy="64" r="6" fill="#e5d18a"/><circle cx="98" cy="78" r="4" fill="#e5d18a"/>`
    : `<path d="M 108 48 A 26 26 0 1 0 108 92 A 20 20 0 1 1 108 48 Z" fill="#f7e9b0"/>`;
  const star2 = b ? '' : star(560, 60, 4, '#ffe9a8');
  const midLantern = lantern(320, 132, b ? '#3fae6a' : '#ff8c2e', true);
  const blueJar = b ? '' : jar(200, 352, '#4a90d9');
  const apple = b ? '' : `<circle cx="405" cy="352" r="9" fill="#e63946"/><line x1="405" y1="343" x2="408" y2="336" stroke="#5b8c3e" stroke-width="2"/>`;
  const tail = b
    ? `<path d="M 548 392 Q 566 400 560 420" stroke="#14100e" stroke-width="7" fill="none" stroke-linecap="round"/>`
    : `<path d="M 548 392 Q 570 372 556 352" stroke="#14100e" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  const groundGlow = b
    ? `<ellipse cx="300" cy="438" rx="14" ry="17" fill="#8d8d8d" stroke="#5c5c5c" stroke-width="1.5"/>`
    : `<circle cx="300" cy="438" r="26" fill="#ffd23f" opacity="0.25"/><ellipse cx="300" cy="438" rx="14" ry="17" fill="#ffd23f" stroke="#b8860b" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lantern market at night">
<defs><linearGradient id="mk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141b3d"/><stop offset="1" stop-color="#4a2b5c"/></linearGradient></defs>
<rect width="640" height="480" fill="url(#mk-sky)"/>
${star(40, 40, 3, '#fff')}${star(180, 30, 2.5, '#fff')}${star(300, 55, 3, '#ffe9a8')}${star(430, 35, 2.5, '#fff')}${star2}${star(610, 110, 3, '#fff')}${star(90, 140, 2, '#fff')}
${moon}
<path d="M 20 96 Q 320 150 620 92" stroke="#6b5a8a" stroke-width="2" fill="none"/>
<circle cx="120" cy="112" r="5" fill="#ffd23f"/><circle cx="250" cy="128" r="5" fill="#ff9f43"/><circle cx="390" cy="128" r="5" fill="#ffd23f"/><circle cx="520" cy="110" r="5" fill="#ff6b6b"/>
${lantern(150, 132, '#e63946', true)}${midLantern}${lantern(490, 132, '#ffd23f', true)}
${awning(40, 190, 240, '#e63946', '#f7ede2')}
<rect x="48" y="216" width="224" height="14" fill="#6b4226"/><rect x="56" y="230" width="208" height="110" fill="#8a5a33"/>
${jar(100, 352, '#3fae6a')}${jar(150, 352, '#d9a441')}${blueJar}
<rect x="60" y="300" width="70" height="26" rx="4" fill="#f7ede2"/><text x="95" y="318" font-size="16" text-anchor="middle" fill="#7a2e1d" font-family="Georgia, serif">TEA</text>
${awning(360, 190, 240, '#2a9d8f', '#f7ede2')}
<rect x="368" y="216" width="224" height="14" fill="#6b4226"/><rect x="376" y="230" width="208" height="110" fill="#8a5a33"/>
<ellipse cx="430" cy="330" rx="52" ry="14" fill="#a9713f"/><circle cx="405" cy="318" r="9" fill="#e63946"/><circle cx="425" cy="312" r="9" fill="#e63946"/><circle cx="445" cy="318" r="9" fill="#e63946"/><circle cx="455" cy="326" r="9" fill="#e63946"/>${apple}
<ellipse cx="540" cy="330" rx="52" ry="14" fill="#a9713f"/><circle cx="520" cy="318" r="9" fill="#ff8c2e"/><circle cx="540" cy="312" r="9" fill="#ff8c2e"/><circle cx="560" cy="318" r="9" fill="#ff8c2e"/>
<rect x="380" y="400" width="260" height="80" fill="#3a2c22"/>
<rect x="500" y="380" width="70" height="46" fill="#7a5a33" stroke="#5c3d1e" stroke-width="2"/>
<ellipse cx="535" cy="378" rx="26" ry="20" fill="#14100e"/><circle cx="528" cy="362" r="12" fill="#14100e"/><path d="M 520 352 L 518 340 L 526 350 Z" fill="#14100e"/><path d="M 534 350 L 536 338 L 542 350 Z" fill="#14100e"/>${tail}
${groundGlow}
<rect x="0" y="400" width="640" height="80" fill="#2c2118" opacity="0.55"/>
</svg>`;
}

// ---- Scene 2: Harbour Dawn -------------------------------------------------
function harbour(v) {
  const b = v === 'b';
  const rays = b ? '' : `<g stroke="#ffb703" stroke-width="3" stroke-linecap="round"><line x1="500" y1="46" x2="500" y2="28"/><line x1="500" y1="134" x2="500" y2="152"/><line x1="456" y1="90" x2="438" y2="90"/><line x1="544" y1="90" x2="562" y2="90"/><line x1="469" y1="59" x2="456" y2="46"/><line x1="531" y1="59" x2="544" y2="46"/><line x1="469" y1="121" x2="456" y2="134"/><line x1="531" y1="121" x2="544" y2="134"/></g>`;
  const gull2 = b ? '' : `<path d="M 248 100 Q 256 92 264 100 Q 272 92 280 100" stroke="#2c3e50" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const cloud2 = b ? '' : `<g fill="#ffffff" opacity="0.9"><ellipse cx="300" cy="62" rx="42" ry="14"/><ellipse cx="322" cy="54" rx="26" ry="12"/></g>`;
  const beam = b ? '' : `<polygon points="96,232 210,196 210,268" fill="#ffe066" opacity="0.35"/>`;
  const fish = b ? '' : `<path d="M 372 322 Q 380 306 390 322 Q 380 314 372 322 Z" fill="#5b8c9e"/><path d="M 366 326 Q 380 332 396 324" stroke="#ffffff" stroke-width="2" fill="none"/>`;
  return `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Harbour at dawn">
<defs><linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb2d9"/><stop offset="0.55" stop-color="#ffd9a0"/><stop offset="1" stop-color="#ffb703"/></linearGradient>
<linearGradient id="hb-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e6f8e"/><stop offset="1" stop-color="#174a63"/></linearGradient></defs>
<rect width="640" height="300" fill="url(#hb-sky)"/>
<circle cx="500" cy="90" r="30" fill="#ffb703"/>${rays}
<g fill="#ffffff" opacity="0.9"><ellipse cx="120" cy="82" rx="46" ry="15"/><ellipse cx="142" cy="72" rx="28" ry="12"/></g>${cloud2}
<g fill="#ffffff" opacity="0.85"><ellipse cx="430" cy="132" rx="38" ry="12"/><ellipse cx="448" cy="124" rx="22" ry="10"/></g>
<path d="M 188 120 Q 196 112 204 120 Q 212 112 220 120" stroke="#2c3e50" stroke-width="2.5" fill="none" stroke-linecap="round"/>${gull2}
<path d="M 328 140 Q 336 132 344 140 Q 352 132 360 140" stroke="#2c3e50" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<rect y="300" width="640" height="180" fill="url(#hb-sea)"/>
<path d="M 0 320 Q 80 310 160 320 T 320 320 T 480 320 T 640 320" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.5"/>
<path d="M 0 360 Q 80 350 160 360 T 320 360 T 480 360 T 640 360" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.35"/>
<path d="M 0 410 Q 80 400 160 410 T 320 410 T 480 410 T 640 410" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.25"/>
<polygon points="52,300 44,196 76,196 68,300" fill="#f4f1de"/><rect x="40" y="186" width="40" height="14" fill="#e63946"/><rect x="48" y="172" width="24" height="14" fill="#e63946"/><circle cx="60" cy="162" r="10" fill="#ffe066"/>${beam}
<path d="M 30 300 L 90 300 L 84 330 L 36 330 Z" fill="#5b4a3a"/>
<polygon points="150,330 150,240 196,330" fill="${b ? '#2a6f97' : '#e63946'}"/><polygon points="156,330 156,258 128,330" fill="#f7ede2"/>
<rect x="146" y="238" width="4" height="94" fill="#5b4a3a"/><path d="M 118 332 L 210 332 L 198 352 L 130 352 Z" fill="#7a4a21"/>
<path d="M 420 352 L 510 352 L 498 372 L 432 372 Z" fill="#3d5a80"/><rect x="452" y="330" width="26" height="22" fill="#e9c46a"/><line x1="480" y1="330" x2="480" y2="306" stroke="#5b4a3a" stroke-width="3"/><polygon points="480,306 500,312 480,318" fill="#e63946"/>
<ellipse cx="300" cy="402" rx="14" ry="9" fill="${b ? '#f7ede2' : '#e63946'}"/><rect x="294" y="388" width="12" height="8" fill="${b ? '#f7ede2' : '#e63946'}"/>
<ellipse cx="520" cy="422" rx="14" ry="9" fill="#f7ede2"/><rect x="514" y="408" width="12" height="8" fill="#f7ede2"/>
${fish}
</svg>`;
}

// ---- Scene 3: Greenhouse ----------------------------------------------------
function greenhouse(v) {
  const b = v === 'b';
  const beam2 = b ? '' : `<polygon points="330,0 380,0 300,480 250,480" fill="#ffe066" opacity="0.12"/>`;
  const butterfly = b ? '' : `<g><ellipse cx="272" cy="138" rx="10" ry="14" fill="#e63946" transform="rotate(-25 272 138)"/><ellipse cx="290" cy="138" rx="10" ry="14" fill="#e63946" transform="rotate(25 290 138)"/><ellipse cx="276" cy="152" rx="7" ry="10" fill="#ff8c2e" transform="rotate(-15 276 152)"/><ellipse cx="286" cy="152" rx="7" ry="10" fill="#ff8c2e" transform="rotate(15 286 152)"/><line x1="281" y1="136" x2="281" y2="156" stroke="#2c2118" stroke-width="2"/></g>`;
  const drops = b ? '' : `<g fill="#7fb2d9"><circle cx="212" cy="318" r="4"/><circle cx="224" cy="330" r="3.5"/><circle cx="204" cy="334" r="3"/></g>`;
  const planter = b ? '' : `<g><line x1="500" y1="0" x2="500" y2="120" stroke="#8a6d3b" stroke-width="2"/><path d="M 472 122 L 528 122 L 520 152 L 480 152 Z" fill="#b5651d"/><circle cx="490" cy="112" r="12" fill="#3fae6a"/><circle cx="510" cy="108" r="12" fill="#57b368"/><circle cx="500" cy="100" r="10" fill="#3fae6a"/></g>`;
  const stone = b ? '' : `<ellipse cx="320" cy="432" rx="42" ry="12" fill="#b8b0a4"/>`;
  const cactus = b ? '' : `<g><rect x="414" y="176" width="32" height="24" rx="4" fill="#e07a5f"/><rect x="424" y="150" width="12" height="28" rx="6" fill="#3fae6a"/><circle cx="430" cy="146" r="7" fill="#57b368"/></g>`;
  return `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A sunny greenhouse">
<defs><linearGradient id="gh-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcecc9"/><stop offset="1" stop-color="#a8c686"/></linearGradient></defs>
<rect width="640" height="480" fill="url(#gh-wall)"/>
<polygon points="0,0 90,0 40,480 0,480" fill="#8a6d3b" opacity="0.18"/><polygon points="120,0 210,0 160,480 70,480" fill="#8a6d3b" opacity="0.18"/>
<polygon points="150,0 200,0 120,480 70,480" fill="#ffe066" opacity="0.14"/>${beam2}
<rect x="420" y="60" width="160" height="110" fill="#bfe3f0" stroke="#6b4226" stroke-width="4"/><line x1="500" y1="60" x2="500" y2="170" stroke="#6b4226" stroke-width="3"/><line x1="420" y1="115" x2="580" y2="115" stroke="#6b4226" stroke-width="3"/>
<circle cx="540" cy="88" r="16" fill="#ffd23f"/>
<rect x="60" y="196" width="520" height="12" fill="#8a5a33"/><rect x="80" y="208" width="10" height="60" fill="#6b4226"/><rect x="550" y="208" width="10" height="60" fill="#6b4226"/>
<g><rect x="104" y="176" width="32" height="24" rx="4" fill="#e07a5f"/><circle cx="120" cy="162" r="14" fill="${b ? '#ffd23f' : '#ef476f'}"/><circle cx="112" cy="154" r="6" fill="#ffffff" opacity="0.5"/><line x1="120" y1="176" x2="120" y2="158" stroke="#3fae6a" stroke-width="3"/></g>
<g><rect x="204" y="176" width="32" height="24" rx="4" fill="#4a90d9"/><circle cx="220" cy="162" r="13" fill="#ffd23f"/><line x1="220" y1="176" x2="220" y2="158" stroke="#3fae6a" stroke-width="3"/></g>
<g><rect x="304" y="176" width="32" height="24" rx="4" fill="#2a9d8f"/><ellipse cx="312" cy="158" rx="6" ry="16" fill="#3fae6a" transform="rotate(-20 312 158)"/><ellipse cx="330" cy="156" rx="6" ry="18" fill="#57b368" transform="rotate(15 330 156)"/></g>
${cactus}
${butterfly}
<rect x="60" y="300" width="220" height="12" fill="#8a5a33"/><rect x="80" y="312" width="10" height="70" fill="#6b4226"/><rect x="250" y="312" width="10" height="70" fill="#6b4226"/>
<path d="M 130 300 L 130 268 L 168 268 L 168 300 Z" fill="#b8b0a4"/><path d="M 168 272 L 196 286 L 196 296 L 168 292 Z" fill="#8a9ba8"/>${drops}
<rect x="220" y="282" width="34" height="18" rx="3" fill="#e63946" transform="rotate(-8 237 291)"/><rect x="222" y="266" width="30" height="16" rx="3" fill="#2a9d8f" transform="rotate(-8 237 274)"/>
<ellipse cx="470" cy="330" rx="34" ry="30" fill="#3fae6a"/><ellipse cx="440" cy="340" rx="22" ry="18" fill="#57b368"/><ellipse cx="500" cy="344" rx="22" ry="16" fill="#2f8f5b"/>
${planter}
<rect y="420" width="640" height="60" fill="#7a5a33"/>
<ellipse cx="160" cy="432" rx="42" ry="12" fill="#b8b0a4"/>${stone}<ellipse cx="480" cy="432" rx="42" ry="12" fill="#b8b0a4"/>
<path d="M 60 420 Q 90 360 70 330 Q 110 350 100 300" stroke="#2f8f5b" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="72" cy="330" rx="22" ry="12" fill="#3fae6a" transform="rotate(-30 72 330)"/>
</svg>`;
}

export const SCENES = [
  {
    id: 'market', name: 'Lantern Market', tag: 'Night market · Easy',
    build: market,
    diffs: [
      { x: 90, y: 70, r: 30, name: 'the moon' },
      { x: 560, y: 60, r: 16, name: 'a star' },
      { x: 320, y: 132, r: 28, name: 'the middle lantern' },
      { x: 200, y: 352, r: 20, name: 'the blue jar' },
      { x: 405, y: 352, r: 18, name: 'an apple' },
      { x: 548, y: 378, r: 24, name: 'the cat\u2019s tail' },
      { x: 300, y: 438, r: 22, name: 'the ground lantern' },
    ],
  },
  {
    id: 'harbour', name: 'Harbour Dawn', tag: 'Sunrise harbour · Medium',
    build: harbour,
    diffs: [
      { x: 500, y: 90, r: 34, name: 'the sun\u2019s rays' },
      { x: 264, y: 100, r: 16, name: 'a gull' },
      { x: 160, y: 290, r: 30, name: 'the sail' },
      { x: 96, y: 232, r: 26, name: 'the lighthouse beam' },
      { x: 300, y: 400, r: 18, name: 'the red buoy' },
      { x: 300, y: 60, r: 24, name: 'a cloud' },
      { x: 380, y: 320, r: 18, name: 'the jumping fish' },
    ],
  },
  {
    id: 'greenhouse', name: 'Greenhouse', tag: 'Sunny greenhouse · Hard',
    build: greenhouse,
    diffs: [
      { x: 281, y: 144, r: 20, name: 'the butterfly' },
      { x: 120, y: 162, r: 20, name: 'the pink flower' },
      { x: 212, y: 326, r: 18, name: 'the water drops' },
      { x: 315, y: 240, r: 26, name: 'a sunbeam' },
      { x: 500, y: 132, r: 24, name: 'the hanging planter' },
      { x: 320, y: 432, r: 22, name: 'a stepping stone' },
      { x: 430, y: 170, r: 22, name: 'the cactus' },
    ],
  },
];
