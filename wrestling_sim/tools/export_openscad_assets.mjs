import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const scadDir = join(rootDir, 'assets', 'scad');
const stlDir = join(rootDir, 'assets', 'generated', 'stl');
const threeMfDir = join(rootDir, 'assets', 'generated', '3mf');

mkdirSync(stlDir, { recursive: true });
mkdirSync(threeMfDir, { recursive: true });

const openscadCheck = spawnSync('openscad', ['--version'], {
  encoding: 'utf8',
  shell: true
});

if (openscadCheck.error || openscadCheck.status !== 0) {
  console.error('OpenSCAD CLI was not found. Install OpenSCAD and make sure `openscad` is available on PATH.');
  process.exit(1);
}

const scadFiles = readdirSync(scadDir)
  .filter((fileName) => extname(fileName) === '.scad')
  .sort();

if (scadFiles.length === 0) {
  console.log('No .scad files found.');
  process.exit(0);
}

for (const fileName of scadFiles) {
  const sourcePath = join(scadDir, fileName);
  const assetName = fileName.replace(/\.scad$/, '');
  const stlPath = join(stlDir, `${assetName}.stl`);
  const threeMfPath = join(threeMfDir, `${assetName}.3mf`);

  console.log(`Exporting ${relative(rootDir, sourcePath)}`);

  const stlResult = spawnSync('openscad', ['-o', stlPath, sourcePath], {
    encoding: 'utf8',
    shell: true
  });

  if (stlResult.status !== 0) {
    console.error(stlResult.stderr || stlResult.stdout);
    process.exit(stlResult.status ?? 1);
  }

  const threeMfResult = spawnSync('openscad', ['-o', threeMfPath, sourcePath], {
    encoding: 'utf8',
    shell: true
  });

  if (threeMfResult.status !== 0) {
    console.warn(`3MF export failed for ${fileName}. STL export still succeeded.`);
    console.warn(threeMfResult.stderr || threeMfResult.stdout);
  }
}

console.log('OpenSCAD export complete.');
