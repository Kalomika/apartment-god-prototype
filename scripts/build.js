import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const item of ['index.html', 'styles.css', 'src']) {
  cpSync(join(root, item), join(dist, item), { recursive: true });
}

console.log('Built static site into dist/');
