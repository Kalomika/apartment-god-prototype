import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 5173);
const root = process.cwd();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${port}`);
  let path = normalize(url.pathname).replace(/^\/+/, '');
  if (!path) path = 'index.html';
  let full = join(root, path);
  if (!existsSync(full) || statSync(full).isDirectory()) full = join(root, 'index.html');
  const ext = extname(full);
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  res.end(readFileSync(full));
}).listen(port, () => {
  console.log(`Apartment God running at http://localhost:${port}`);
});
