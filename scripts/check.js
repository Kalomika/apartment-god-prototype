import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const src = join(process.cwd(), 'src');
const files = readdirSync(src).filter(name => name.endsWith('.js')).sort();
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', join(src, file)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log(`Checked ${files.length} source files`);
