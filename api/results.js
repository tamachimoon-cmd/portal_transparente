import { waiting, normalize } from '../results.js';
import { regions, officialPage, resolveSource } from '../regions.js';

export default async function resultsHandler(req, res) {
  if (req.method !== 'GET') {
    res.writeHead(405, { Allow: 'GET', 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Método não permitido' }));
    return;
  }
  const params = new URL(req.url || '/api/results', 'http://localhost').searchParams;
  const uf = (params.get('uf') || 'br').toLowerCase();
  if (!regions.has(uf)) {
    res.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'UF inválida' }));
    return;
  }
  let result = { ...waiting, uf, sourceUrl: officialPage(uf) };
  try {
    const source = resolveSource(uf);
    if (source) {
      const url = new URL(source);
      if (url.protocol !== 'https:' || url.username || url.password ||
          (url.port && url.port !== '443') ||
          !(url.hostname === 'tse.jus.br' || url.hostname.endsWith('.tse.jus.br'))) {
        throw new Error('Fonte deve pertencer ao TSE');
      }
      const response = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: 'error' });
      if (!response.ok) throw new Error('Fonte indisponível');
      result = { ...normalize(await response.json()), uf, sourceUrl: officialPage(uf), dataSourceUrl: url.href };
    }
  } catch {
    result = { ...waiting, uf, sourceUrl: officialPage(uf), status: 'unavailable' };
  }
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(result));
}
