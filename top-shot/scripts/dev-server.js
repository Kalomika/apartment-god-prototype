import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { extname, join, normalize, relative, sep } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 5174);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
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
  if (rel.startsWith('..') || rel.includes(`..${sep}`)) return null;
  return requested;
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://localhost:${port}`);
    let path = safePath(url.pathname === '/' ? '/index.html' : url.pathname);
    if (!path || !existsSync(path) || statSync(path).isDirectory()) throw new Error('Not found');
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    res.end('Not found');
  }
}).listen(port, () => console.log(`Top Shot running at http://localhost:${port}`));
