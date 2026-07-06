import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const manifestPath = join(root, 'assets', 'manifests', 'sprite-pipeline.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const atlasImage = join(root, manifest.atlas.image);
const atlasJson = join(root, manifest.atlas.json);
const padding = manifest.atlas.padding ?? 2;
const maxSize = manifest.atlas.max_size ?? 2048;

const entries = [];
for (const sprite of manifest.sprites) {
  if (sprite.file && existsSync(join(root, sprite.file))) entries.push({ id: sprite.id, file: sprite.file, anchor: sprite.anchor, scale: sprite.scale });
}
for (const animation of manifest.animations) {
  for (const frame of animation.frames) {
    if (frame.file && existsSync(join(root, frame.file))) entries.push({ id: `${animation.state_id}/${frame.id}`, file: frame.file, anchor: animation.anchor, scale: animation.scale });
  }
}

mkdirSync(dirname(atlasImage), { recursive: true });
mkdirSync(dirname(atlasJson), { recursive: true });

if (!entries.length) {
  const png = await sharp({ create: { width: 8, height: 8, channels: 4, background: '#00000000' } }).png().toBuffer();
  writeFileSync(atlasImage, png);
  writeFileSync(atlasJson, JSON.stringify({ meta: { image: manifest.atlas.image, generated: new Date().toISOString(), note: 'No sprite PNGs found yet.' }, frames: {} }, null, 2));
  console.log('Created empty sprite atlas placeholder. Add PNGs under assets/sprites and rerun npm run assets:atlas.');
  process.exit(0);
}

const loaded = [];
for (const entry of entries) {
  const image = sharp(join(root, entry.file));
  const meta = await image.metadata();
  loaded.push({ ...entry, buffer: await image.png().toBuffer(), width: meta.width || 1, height: meta.height || 1 });
}

let x = padding;
let y = padding;
let rowH = 0;
let atlasW = 0;
let atlasH = 0;
const composites = [];
const frames = {};

for (const item of loaded) {
  if (x + item.width + padding > maxSize) {
    x = padding;
    y += rowH + padding;
    rowH = 0;
  }
  composites.push({ input: item.buffer, left: x, top: y });
  frames[item.id] = {
    frame: { x, y, w: item.width, h: item.height },
    anchor: item.anchor,
    scale: item.scale,
    source: item.file
  };
  atlasW = Math.max(atlasW, x + item.width + padding);
  atlasH = Math.max(atlasH, y + item.height + padding);
  rowH = Math.max(rowH, item.height);
  x += item.width + padding;
}

await sharp({ create: { width: Math.max(8, atlasW), height: Math.max(8, atlasH), channels: 4, background: '#00000000' } })
  .composite(composites)
  .png()
  .toFile(atlasImage);

writeFileSync(atlasJson, JSON.stringify({ meta: { image: manifest.atlas.image, generated: new Date().toISOString() }, frames }, null, 2));
console.log(`Built sprite atlas with ${Object.keys(frames).length} frames: ${manifest.atlas.image}`);
