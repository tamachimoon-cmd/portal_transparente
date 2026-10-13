import http from 'node:http';
import { readFile } from 'node:fs/promises';
import resultsHandler from './api/results.js';
const port = Number(process.env.PORT || 3000);
const files = { '/': ['index.html','text/html; charset=utf-8'], '/style.css': ['style.css','text/css'], '/app.js': ['app.js','text/javascript'] };
http.createServer(async (req,res) => {
  const path = new URL(req.url,'http://localhost').pathname;
  if (path === '/api/results') {
    await resultsHandler(req,res); return;
  }
  if (!files[path]) { res.writeHead(404); res.end('Não encontrado'); return; }
  try { const [file,type] = files[path]; res.writeHead(200,{'Content-Type':type}); res.end(await readFile(new URL(`./public/${file}`,import.meta.url))); }
  catch { res.writeHead(500); res.end('Erro interno'); }
}).listen(port,'0.0.0.0',() => console.log(`Portal iniciado na porta ${port}`));
