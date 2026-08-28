// Servidor mínimo para ver los mockups. El HTML importa three.js como módulo,
// y Chrome bloquea los módulos abiertos con file://, por eso hace falta esto.
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const tipos = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml' };
http.createServer((req, res) => {
  let f = decodeURIComponent(req.url.split('?')[0]);
  if (f === '/') f = '/lolsito/index.html';
  if (f.endsWith('/')) f += 'index.html';
  const p = path.join(root, f);
  if (!p.startsWith(root)) { res.writeHead(403); return res.end('403'); }
  fs.readFile(p, (e, d) => {
    if (e) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(p)] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(4477, () => console.log('Mockup en http://localhost:4477/lolsito/'));
