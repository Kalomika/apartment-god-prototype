import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });
for (const item of ['index.html', 'styles.css', 'src', 'vendor']) {
  const source = join(root, item);
  if (!existsSync(source)) throw new Error(`Missing build source: ${item}`);
  cpSync(source, join(dist, item), { recursive: true, force: true });
}
console.log('Top Shot built into dist/');
