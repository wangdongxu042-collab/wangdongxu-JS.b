// 无需安装依赖：在终端运行 node server.cjs，再访问终端中的地址。
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  let filename = path.resolve(root, '.' + pathname);
  if (filename !== root && !filename.startsWith(root + path.sep)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.stat(filename, (error, stat) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    if (stat.isDirectory()) filename = path.join(filename, 'index.html');
    fs.readFile(filename, (error, data) => {
      if (error) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
});
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? '端口 5173 已被占用，请关闭原来的服务后重试。' : error.message);
  process.exitCode = 1;
});
server.listen(5173, '127.0.0.1', () => console.log('学习页面：http://127.0.0.1:5173\n停止服务：Ctrl+C'));
