import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const legacyDist = join(root, 'Dist');
const phaserSource = join(root, 'node_modules', 'phaser', 'dist', 'phaser.esm.js');

for (const output of [dist, legacyDist]) {
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });

  for (const item of ['index.html', 'styles.css', 'src']) {
    const source = join(root, item);
    if (!existsSync(source)) throw new Error(`Missing required build source: ${item}`);
    cpSync(source, join(output, item), { recursive: true });
  }

  if (!existsSync(phaserSource)) {
    throw new Error('Missing Phaser vendor file. Run npm install before npm run build.');
  }
  const phaserTarget = join(output, 'vendor', 'phaser.esm.js');
  mkdirSync(dirname(phaserTarget), { recursive: true });
  cpSync(phaserSource, phaserTarget);
}

console.log('Built Phaser static site into dist/ and Dist/');
