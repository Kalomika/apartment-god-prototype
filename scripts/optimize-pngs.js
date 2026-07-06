import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const inputRoot = join(root, 'assets', 'sprites');
const outputRoot = join(root, 'assets', 'optimized');

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.toLowerCase().endsWith('.png')) out.push(full);
  }
  return out;
}

const files = walk(inputRoot);
if (!files.length) {
  console.log('No PNG sprites found under assets/sprites yet.');
  process.exit(0);
}

for (const file of files) {
  const rel = relative(inputRoot, file);
  const target = join(outputRoot, rel);
  mkdirSync(join(target, '..'), { recursive: true });
  await sharp(file).png({ compressionLevel: 9, adaptiveFiltering: true, palette: false }).toFile(target);
}

console.log(`Optimized ${files.length} PNG files into assets/optimized.`);
