import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function collect(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...collect(path));
    else if (name.endsWith('.js')) out.push(path);
  }
  return out.sort();
}

for (const file of [...collect(join(process.cwd(), 'src')), ...collect(join(process.cwd(), 'tests')), ...collect(join(process.cwd(), 'scripts'))]) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('Top Shot syntax check passed');
