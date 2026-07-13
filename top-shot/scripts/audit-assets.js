import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const allowed = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.glb', '.gltf']);
const files = walk(root).filter(file => allowed.has(extname(file).toLowerCase()));
const failures = [];
for (const file of files) {
  const bytes = readFileSync(file);
  if (!bytes.length) failures.push(`${relative(root, file)} is empty`);
  if (/\s/.test(relative(root, file))) failures.push(`${relative(root, file)} contains whitespace`);
}
if (!existsSync(join(root, 'asset_inbox', 'ASSET_MANIFEST.md'))) failures.push('asset_inbox/ASSET_MANIFEST.md is missing');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Top Shot asset audit passed, ${files.length} binary assets checked`);

function walk(dir) {
  const output = [];
  for (const name of readdirSync(dir)) {
    if (['node_modules', 'dist', '.git'].includes(name)) continue;
    const file = join(dir, name);
    if (statSync(file).isDirectory()) output.push(...walk(file));
    else output.push(file);
  }
  return output;
}
