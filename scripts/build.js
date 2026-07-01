import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const legacyDist = join(root, 'Dist');

for (const output of [dist, legacyDist]) {
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });

  for (const item of ['index.html', 'styles.css', 'src', 'public']) {
    const source = join(root, item);
    if (!existsSync(source) && item === 'public') continue;
    if (!existsSync(source)) {
      throw new Error(`Missing required build source: ${item}`);
    }
    cpSync(source, join(output, item), { recursive: true });
  }
}

console.log('Built static site into dist/ and Dist/');
