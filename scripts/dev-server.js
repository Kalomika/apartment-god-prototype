import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, relative, sep } from 'node:path';

const port = Number(process.env.PORT || 5173);
const root = process.cwd();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml; charset=utf-8'
};

function safePath(urlPath) {
  const normalized = normalize(decodeURIComponent(urlPath || '/')).replace(/^[/\\]+/, '');
  const requested = join(root, normalized || 'index.html');
  const rel = relative(root, requested);
  if (rel.startsWith('..') || rel.includes(`..${sep}`)) return join(root, 'index.html');
  return requested;
}

createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${port}`);
  let full = safePath(url.pathname);
  if (!existsSync(full) || statSync(full).isDirectory()) full = join(root, 'index.html');
  const ext = extname(full);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  res.end(readFileSync(full));
}).listen(port, () => {
  console.log(`Apartment God running at http://localhost:${port}`);
});
