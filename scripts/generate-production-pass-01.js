import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { deflateSync } from 'node:zlib';

const root = process.cwd();
const runtimeRoot = join(root, 'public/assets/production_pass_01');
const mirrorRoot = join(root, 'apartment-god-production/generated_runtime_assets/pass_01');

const W = 960;
const H = 720;

const assets = [
  ...['floor1_base', 'floor2_base', 'walls_dark_base', 'living_room_base', 'kitchen_base', 'bathroom_base', 'bedroom_base', 'office_base', 'stairs_base', 'neon_lighting_overlay'].map(name => ({ category: 'environment', name })),
  ...['male_idle_a', 'male_idle_b', 'male_walk_north_a', 'male_walk_south_a', 'male_walk_east_a', 'male_walk_west_a', 'male_sit_b', 'male_sleep_b', 'male_phone_b', 'male_laptop_b', 'male_eat_b', 'male_transition_a'].map(name => ({ category: 'male', name })),
  ...['female_idle_a', 'female_idle_b', 'female_walk_north_a', 'female_walk_south_a', 'female_walk_east_a', 'female_walk_west_a', 'female_sit_b', 'female_sleep_b', 'female_phone_b', 'female_laptop_b', 'female_eat_b', 'female_transition_a'].map(name => ({ category: 'female', name })),
  ...['dog_idle_a', 'dog_idle_b', 'dog_walk_north_a', 'dog_walk_south_a', 'dog_walk_east_a', 'dog_walk_west_a', 'dog_sit_b', 'dog_sleep_b', 'dog_eat_b', 'dog_alert_b'].map(name => ({ category: 'dog', name })),
  ...['joint_conversation_b', 'joint_couch_shared_b', 'joint_bed_shared_b', 'joint_hug_b', 'joint_pet_dog_b'].map(name => ({ category: 'joint', name }))
];

const registryEntries = [];

class Raster {
  constructor(w, h, transparent = true) {
    this.w = w;
    this.h = h;
    this.data = Buffer.alloc(w * h * 4, 0);
    if (!transparent) this.clear('#10141d');
  }

  clear(color) {
    this.fillRect(0, 0, this.w, this.h, color);
  }

  set(x, y, color) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const rgba = parseColor(color);
    const i = (y * this.w + x) * 4;
    const a = rgba[3] / 255;
    const inv = 1 - a;
    this.data[i] = Math.round(rgba[0] * a + this.data[i] * inv);
    this.data[i + 1] = Math.round(rgba[1] * a + this.data[i + 1] * inv);
    this.data[i + 2] = Math.round(rgba[2] * a + this.data[i + 2] * inv);
    this.data[i + 3] = Math.min(255, Math.round(rgba[3] + this.data[i + 3] * inv));
  }

  fillRect(x, y, w, h, color) {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.w, Math.ceil(x + w));
    const y1 = Math.min(this.h, Math.ceil(y + h));
    for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) this.set(xx, yy, color);
  }

  strokeRect(x, y, w, h, color, width = 1) {
    this.fillRect(x, y, w, width, color);
    this.fillRect(x, y + h - width, w, width, color);
    this.fillRect(x, y, width, h, color);
    this.fillRect(x + w - width, y, width, h, color);
  }

  line(x0, y0, x1, y1, color, width = 1) {
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.4));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      this.ellipse(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, width / 2, width / 2, color);
    }
  }

  ellipse(cx, cy, rx, ry, color) {
    const x0 = Math.floor(cx - rx);
    const x1 = Math.ceil(cx + rx);
    const y0 = Math.floor(cy - ry);
    const y1 = Math.ceil(cy + ry);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        if (nx * nx + ny * ny <= 1) this.set(x, y, color);
      }
    }
  }

  polygon(points, color) {
    const ys = points.map(p => p[1]);
    const y0 = Math.floor(Math.min(...ys));
    const y1 = Math.ceil(Math.max(...ys));
    for (let y = y0; y <= y1; y++) {
      const nodes = [];
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i];
        const [xj, yj] = points[j];
        if ((yi < y && yj >= y) || (yj < y && yi >= y)) nodes.push(xi + ((y - yi) / (yj - yi)) * (xj - xi));
      }
      nodes.sort((a, b) => a - b);
      for (let k = 0; k < nodes.length; k += 2) {
        for (let x = Math.floor(nodes[k]); x <= Math.ceil(nodes[k + 1]); x++) this.set(x, y, color);
      }
    }
  }
}

function parseColor(color) {
  if (Array.isArray(color)) return color;
  let hex = color.replace('#', '');
  let alpha = 255;
  if (hex.length === 8) {
    alpha = Number.parseInt(hex.slice(6, 8), 16);
    hex = hex.slice(0, 6);
  }
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
    alpha
  ];
}

function crc32(buffer) {
  let c = ~0;
  for (const byte of buffer) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([len, name, data, crc]);
}

function pngFromRaster(r) {
  const raw = Buffer.alloc((r.w * 4 + 1) * r.h);
  for (let y = 0; y < r.h; y++) {
    raw[y * (r.w * 4 + 1)] = 0;
    r.data.copy(raw, y * (r.w * 4 + 1) + 1, y * r.w * 4, (y + 1) * r.w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(r.w, 0);
  ihdr.writeUInt32BE(r.h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function save(category, name, raster, intendedUse, fallbackBehavior) {
  const rel = `${category}/${name}.png`;
  const runtimePath = join(runtimeRoot, rel);
  const mirrorPath = join(mirrorRoot, rel);
  const png = pngFromRaster(raster);
  mkdirSync(dirname(runtimePath), { recursive: true });
  mkdirSync(dirname(mirrorPath), { recursive: true });
  writeFileSync(runtimePath, png);
  writeFileSync(mirrorPath, png);
  registryEntries.push({
    file: `${name}.png`,
    path: `public/assets/production_pass_01/${rel}`,
    category,
    intended_use: intendedUse,
    fallback_behavior: fallbackBehavior,
    runtime_integrated: category !== 'joint',
    mirrored_source_copy: `apartment-god-production/generated_runtime_assets/pass_01/${rel}`
  });
}

function drawApartmentBase(floor = 0) {
  const r = new Raster(W, H, false);
  r.clear('#101219');
  r.fillRect(0, 0, W, H, '#111218');
  const rooms = floor === 0
    ? [
        [24, 36, 416, 292, '#2b3443'], [456, 36, 318, 292, '#2f3440'], [790, 36, 146, 292, '#27333e'],
        [24, 344, 912, 174, '#252d39'], [720, 534, 216, 150, '#202734']
      ]
    : [
        [24, 36, 440, 340, '#2b3242'], [480, 36, 284, 340, '#273243'], [780, 36, 156, 340, '#263640'],
        [24, 392, 912, 126, '#242c38'], [720, 534, 216, 150, '#202734']
      ];
  for (const [x, y, w, h, c] of rooms) {
    r.fillRect(x, y, w, h, c);
    r.strokeRect(x, y, w, h, '#0a0c10', 8);
    r.strokeRect(x + 5, y + 5, w - 10, h - 10, '#465467', 2);
  }
  for (let x = 44; x < 900; x += 58) r.line(x, 50, x + 18, 650, '#3f48584c', 1);
  drawNeonStrips(r, floor);
  drawEnvironmentClutter(r, floor);
  return r;
}

function drawNeonStrips(r, floor) {
  const cyan = '#00e5ffcc';
  const magenta = '#ff2bd6aa';
  const amber = '#ffb23f99';
  r.fillRect(116, 35, 86, 4, cyan);
  r.fillRect(618, 35, 82, 4, magenta);
  if (floor === 1) {
    r.fillRect(142, 35, 96, 4, cyan);
    r.fillRect(564, 35, 88, 4, magenta);
  }
  r.fillRect(34, 508, 888, 3, '#00e5ff55');
  r.fillRect(450, 42, 3, 280, '#ff2bd655');
  r.ellipse(410, 62, 13, 13, amber);
  r.ellipse(430, 62, 13, 13, amber);
}

function drawEnvironmentClutter(r, floor) {
  const small = floor === 0
    ? [[92, 272], [154, 264], [356, 152], [520, 238], [704, 156], [592, 286], [850, 276]]
    : [[108, 260], [246, 236], [552, 190], [688, 228], [832, 284], [360, 430]];
  for (const [x, y] of small) {
    r.fillRect(x, y, 18, 8, '#6b7280');
    r.fillRect(x + 4, y - 5, 9, 5, '#00e5ff88');
  }
  for (let i = 0; i < 8; i++) r.line(80 + i * 34, 330 + (i % 3) * 9, 120 + i * 31, 336 + (i % 2) * 12, '#07090dcc', 2);
}

function drawRoomOverlay(name) {
  const r = new Raster(W, H);
  const map = {
    living_room_base: [24, 36, 416, 292, '#30405799'],
    kitchen_base: [456, 36, 318, 292, '#37384299'],
    bathroom_base: [790, 36, 146, 292, '#29414b99'],
    bedroom_base: [24, 36, 440, 340, '#30385299'],
    office_base: [480, 36, 284, 340, '#263b5599'],
    stairs_base: [720, 534, 216, 150, '#1e283899']
  };
  const box = map[name] || [0, 0, W, H, '#00000000'];
  r.fillRect(...box);
  r.strokeRect(box[0] + 6, box[1] + 6, box[2] - 12, box[3] - 12, '#00e5ff66', 2);
  return r;
}

function drawWalls() {
  const r = new Raster(W, H);
  r.strokeRect(12, 24, 936, 672, '#080a0fee', 18);
  r.strokeRect(24, 36, 912, 648, '#1a2030ee', 6);
  r.fillRect(438, 36, 18, 300, '#080a0fcc');
  r.fillRect(774, 36, 18, 300, '#080a0fcc');
  r.fillRect(24, 328, 912, 16, '#080a0fcc');
  r.fillRect(704, 518, 232, 16, '#080a0fcc');
  return r;
}

function drawNeonOverlay() {
  const r = new Raster(W, H);
  for (let i = 0; i < 5; i++) {
    r.line(38, 52 + i * 118, 920, 52 + i * 118, '#00e5ff18', 5);
    r.line(52 + i * 176, 44, 52 + i * 176, 670, '#ff2bd614', 5);
  }
  r.fillRect(34, 336, 898, 4, '#ff2bd688');
  r.fillRect(34, 516, 898, 4, '#00e5ffaa');
  return r;
}

function drawHuman(kind, pose) {
  const r = new Raster(pose === 'sleep_b' ? 128 : 96, pose === 'sleep_b' ? 84 : 128);
  const male = kind === 'male';
  const skin = male ? '#4b2d24' : '#5a3428';
  const hair = '#111111';
  const shirt = male ? '#182333' : '#25203a';
  const pants = male ? '#1d2730' : '#1a2633';
  const accent = male ? '#00e5ff' : '#ff2bd6';
  const outline = '#07090d';
  const cx = r.w / 2;
  const top = pose === 'sleep_b' ? 28 : 18;

  if (pose === 'sleep_b') {
    r.ellipse(cx, 42, 48, 18, '#00000044');
    r.ellipse(cx + 8, 40, 42, 15, shirt);
    r.ellipse(cx - 38, 36, 14, 13, skin);
    r.ellipse(cx - 42, 32, 14, 10, hair);
    r.line(cx - 4, 52, cx + 32, 65, pants, 9);
    r.line(cx + 8, 26, cx + 38, 16, skin, 7);
    r.line(cx - 6, 50, cx - 32, 64, skin, 6);
    r.ellipse(cx + 4, 40, 43, 15, '#00000000');
    r.strokeRect(5, 5, r.w - 10, r.h - 10, '#00e5ff00', 1);
    return r;
  }

  if (pose.includes('walk_north')) drawWalkingHuman(r, cx, top, skin, hair, shirt, pants, accent, outline, 0, -1);
  else if (pose.includes('walk_south')) drawWalkingHuman(r, cx, top, skin, hair, shirt, pants, accent, outline, 0, 1);
  else if (pose.includes('walk_east')) drawWalkingHuman(r, cx, top, skin, hair, shirt, pants, accent, outline, 1, 0);
  else if (pose.includes('walk_west')) drawWalkingHuman(r, cx, top, skin, hair, shirt, pants, accent, outline, -1, 0);
  else if (pose === 'sit_b') drawSittingHuman(r, cx, top, skin, hair, shirt, pants, accent);
  else if (pose === 'phone_b') drawStandingHuman(r, cx, top, skin, hair, shirt, pants, accent, { phone: true });
  else if (pose === 'laptop_b') drawSittingHuman(r, cx, top, skin, hair, shirt, pants, accent, { laptop: true });
  else if (pose === 'eat_b') drawSittingHuman(r, cx, top, skin, hair, shirt, pants, accent, { eat: true });
  else if (pose === 'transition_a') drawStandingHuman(r, cx, top, skin, hair, shirt, pants, accent, { crouch: true });
  else drawStandingHuman(r, cx, top, skin, hair, shirt, pants, accent, { shift: pose.endsWith('_b') });
  return r;
}

function drawStandingHuman(r, cx, top, skin, hair, shirt, pants, accent, opts = {}) {
  const shift = opts.shift ? 4 : 0;
  const crouch = opts.crouch ? 10 : 0;
  r.ellipse(cx, 72 + crouch, 18, 36 - crouch / 2, '#00000033');
  r.line(cx - 9, 70, cx - 18 - shift, 112 - crouch, pants, 8);
  r.line(cx + 9, 70, cx + 18 + shift, 112 - crouch, pants, 8);
  r.line(cx - 17, 39 + crouch, cx - 32, 76, skin, 7);
  r.line(cx + 17, 39 + crouch, cx + 32, 76, skin, 7);
  if (opts.phone) r.fillRect(cx + 28, 62, 8, 12, accent);
  r.ellipse(cx, 54 + crouch, 19, 31, shirt);
  r.line(cx - 13, 38 + crouch, cx + 13, 38 + crouch, accent, 3);
  r.ellipse(cx, 22 + crouch, 15, 13, skin);
  r.ellipse(cx, 17 + crouch, 15, 9, hair);
}

function drawWalkingHuman(r, cx, top, skin, hair, shirt, pants, accent, outline, dx, dy) {
  r.ellipse(cx, 73, 19, 36, '#00000033');
  const side = dx || 1;
  const legA = dy < 0 ? -8 : 8;
  r.line(cx - 8, 68, cx - 20 * side, 111 + legA, pants, 8);
  r.line(cx + 8, 68, cx + 20 * side, 111 - legA, pants, 8);
  r.line(cx - 15, 40, cx - 30 * side, 70 - legA, skin, 7);
  r.line(cx + 15, 40, cx + 30 * side, 70 + legA, skin, 7);
  r.ellipse(cx + dx * 4, 53 + dy * 2, 18, 30, shirt);
  r.line(cx - 11, 38, cx + 11, 38, accent, 3);
  r.ellipse(cx + dx * 3, 22 + dy * 2, 15, 13, skin);
  r.ellipse(cx + dx * 3, 17 + dy * 2, 15, 9, hair);
}

function drawSittingHuman(r, cx, top, skin, hair, shirt, pants, accent, opts = {}) {
  r.ellipse(cx, 80, 24, 26, '#00000033');
  r.line(cx - 10, 72, cx - 29, 100, pants, 8);
  r.line(cx + 10, 72, cx + 29, 100, pants, 8);
  r.line(cx - 17, 43, cx - 33, 69, skin, 7);
  r.line(cx + 17, 43, cx + 33, 69, skin, 7);
  if (opts.laptop) {
    r.fillRect(cx - 18, 71, 36, 20, '#151923');
    r.fillRect(cx - 14, 74, 28, 11, '#8cf6ff');
  }
  if (opts.eat) r.ellipse(cx, 82, 14, 8, '#d5dde8');
  r.ellipse(cx, 56, 21, 28, shirt);
  r.line(cx - 14, 40, cx + 14, 40, accent, 3);
  r.ellipse(cx, 25, 15, 13, skin);
  r.ellipse(cx, 20, 15, 9, hair);
}

function drawDog(pose) {
  const r = new Raster(96, 72);
  const fur = '#e8e3d8';
  const shadow = '#00000033';
  const line = '#b6afa3';
  const bodyCx = 45;
  const bodyCy = pose === 'sleep_b' ? 42 : 36;
  if (pose === 'sleep_b') {
    r.ellipse(46, 42, 34, 17, shadow);
    r.ellipse(44, 38, 31, 15, fur);
    r.ellipse(23, 36, 12, 11, fur);
    r.ellipse(68, 42, 10, 6, line);
    r.line(14, 37, 7, 34, fur, 5);
    return r;
  }
  const dx = pose.includes('east') ? 8 : pose.includes('west') ? -8 : 0;
  const dy = pose.includes('north') ? -4 : pose.includes('south') ? 4 : 0;
  const sit = pose === 'sit_b';
  const alert = pose === 'alert_b';
  const eat = pose === 'eat_b';
  r.ellipse(bodyCx, bodyCy, sit ? 23 : 30, sit ? 17 : 15, shadow);
  r.ellipse(bodyCx, bodyCy, sit ? 22 : 29, sit ? 16 : 14, fur);
  r.ellipse(bodyCx + 24 + dx, bodyCy - 8 + dy, 13, 10, fur);
  r.ellipse(bodyCx + 31 + dx, bodyCy - 9 + dy, 7, 5, '#d9d2c4');
  r.line(bodyCx - 14, bodyCy + 9, bodyCx - 20, bodyCy + 22, fur, 5);
  r.line(bodyCx + 8, bodyCy + 9, bodyCx + 16, bodyCy + 22, fur, 5);
  r.line(bodyCx - 29, bodyCy - 1, bodyCx - 40, bodyCy - 9, fur, 5);
  if (alert) {
    r.line(bodyCx + 20, bodyCy - 18, bodyCx + 14, bodyCy - 28, fur, 4);
    r.line(bodyCx + 28, bodyCy - 18, bodyCx + 34, bodyCy - 28, fur, 4);
  }
  if (eat) r.ellipse(bodyCx + 34, bodyCy + 20, 13, 7, '#b43f4e');
  return r;
}

function drawJoint(name) {
  const r = new Raster(156, 128);
  const male = drawHuman('male', name.includes('bed') ? 'sleep_b' : 'sit_b');
  const female = drawHuman('female', name.includes('bed') ? 'sleep_b' : 'sit_b');
  blit(r, male, name.includes('bed') ? 12 : 22, name.includes('bed') ? 28 : 6);
  blit(r, female, name.includes('bed') ? 46 : 54, name.includes('bed') ? 40 : 10);
  if (name.includes('hug')) {
    r.line(58, 54, 98, 54, '#5a3428', 7);
    r.line(96, 59, 57, 59, '#4b2d24', 7);
  }
  if (name.includes('pet_dog')) {
    const dog = drawDog('sit_b');
    blit(r, dog, 52, 68);
  }
  return r;
}

function blit(dest, src, x, y) {
  for (let yy = 0; yy < src.h; yy++) {
    for (let xx = 0; xx < src.w; xx++) {
      const i = (yy * src.w + xx) * 4;
      if (src.data[i + 3]) dest.set(x + xx, y + yy, [src.data[i], src.data[i + 1], src.data[i + 2], src.data[i + 3]]);
    }
  }
}

function assetRaster(asset) {
  if (asset.category === 'environment') {
    if (asset.name === 'floor1_base') return drawApartmentBase(0);
    if (asset.name === 'floor2_base') return drawApartmentBase(1);
    if (asset.name === 'walls_dark_base') return drawWalls();
    if (asset.name === 'neon_lighting_overlay') return drawNeonOverlay();
    return drawRoomOverlay(asset.name);
  }
  if (asset.category === 'male') return drawHuman('male', asset.name.replace('male_', ''));
  if (asset.category === 'female') return drawHuman('female', asset.name.replace('female_', ''));
  if (asset.category === 'dog') return drawDog(asset.name.replace('dog_', ''));
  return drawJoint(asset.name.replace('joint_', ''));
}

function intendedUse(asset) {
  if (asset.category === 'environment') return 'Environment base or overlay behind existing interactive objects and characters.';
  if (asset.category === 'joint') return 'First-pass joint sprite available for future safe shared-action integration; runtime currently keeps procedural joint fallback.';
  return `First-pass top-down ${asset.category} runtime sprite selected by current action or movement state.`;
}

function fallbackBehavior(asset) {
  if (asset.category === 'environment') return 'If missing or not loaded, draw the existing procedural apartment world.';
  if (asset.category === 'joint') return 'Current separate procedural characters remain visible until joint positioning is explicitly integrated.';
  return 'If missing or not loaded, draw the existing procedural entity renderer.';
}

for (const asset of assets) save(asset.category, asset.name, assetRaster(asset), intendedUse(asset), fallbackBehavior(asset));

writeFileSync(join(runtimeRoot, 'ASSET_REGISTRY.json'), JSON.stringify({
  schema_version: '1.0.0',
  pass: 'production_pass_01',
  generated_by: 'scripts/generate-production-pass-01.js',
  png_count: registryEntries.length,
  reference_library_used_as_runtime_assets: false,
  feature_flag: 'USE_PRODUCTION_PASS_01_ASSETS',
  entries: registryEntries
}, null, 2));

const files = registryEntries.map(e => e.path);
const runtimeChanged = [
  'src/productionAssets.js',
  'src/renderWorld.js',
  'src/renderEntities.js',
  'scripts/build.js',
  'package.json'
];

writeFileSync(join(mirrorRoot, 'ASSET_CREATION_REPORT.md'), `# Asset Creation Report

Pass: production_pass_01
Generator: scripts/generate-production-pass-01.js
Runtime PNG count: ${registryEntries.length}
Mirrored PNG count: ${registryEntries.length}
Reference Library images copied: no
External AI generation used: no

## Runtime PNG Files

${files.map(file => `- ${file}`).join('\n')}

## Mirror Location

Mirrored source copies are stored under:

\`\`\`txt
apartment-god-production/generated_runtime_assets/pass_01/
\`\`\`
`);

writeFileSync(join(mirrorRoot, 'VISUAL_IMPLEMENTATION_REPORT.md'), `# Visual Implementation Report

Branch: single-pass-visual-implementation
Pass: production_pass_01

## Summary

Created ${registryEntries.length} original first-pass runtime PNG assets with deterministic Node drawing code and integrated them behind safe procedural fallbacks.

## Runtime Files Changed

${runtimeChanged.map(file => `- ${file}`).join('\n')}

## Exact PNG Files Created

${files.map(file => `- ${file}`).join('\n')}

## Enable Or Disable

The production pass is controlled by:

\`\`\`js
USE_PRODUCTION_PASS_01_ASSETS
\`\`\`

Set it to \`false\` in \`src/productionAssets.js\` to force the original procedural renderer.

## Integrated

- Environment floor base PNGs and neon overlay draw behind existing objects and characters when loaded.
- Resident uses male PNGs for idle, walk, sit, sleep, phone, laptop, eating, and transition-like states.
- Girlfriend uses female PNGs for idle, walk, sit, sleep, phone, laptop, eating, and transition-like states.
- Dog uses dog PNGs for idle, walk, sit, sleep, eat, and alert-like states.
- Missing or failed image loads fall back to the existing procedural renderer.

## Procedural Fallback Still Used

- Existing object drawing remains procedural.
- Joint state PNGs are generated but not drawn yet because safe combined positioning requires a focused interaction pass.
- Unsupported action variants, partial loads, and failed image loads fall back to procedural drawing.

## Known Visual Limitations

- First-pass assets are deterministic pixel/vector-style top-down PNGs, not final polished sprite sheets.
- Character animations use a minimal single-frame mapping for most actions.
- Female locomotion uses directional runtime files even though the prior manifest only had coarse walk/run entries.
- Joint sprites are available but intentionally not activated until shared-anchor placement is reviewed.

## Run And Test

\`\`\`txt
npm run build
npm run check
npm start
\`\`\`
`);

console.log(`Generated ${registryEntries.length} runtime PNG assets and ${registryEntries.length} mirrored PNG copies.`);
