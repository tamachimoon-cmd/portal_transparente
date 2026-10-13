import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/results.js';

async function request(method = 'GET') {
  let status, headers, body;
  const res = { writeHead(s, h) { status = s; headers = h; }, end(b) { body = JSON.parse(b); } };
  await handler({ method }, res);
  return { status, headers, body };
}

test('endpoint Vercel: sem configuração aguarda sem votos e impede cache', async () => {
  const previous = process.env.TSE_RESULTS_URL;
  delete process.env.TSE_RESULTS_URL;
  try {
    const r = await request();
    assert.equal(r.status, 200);
    assert.equal(r.headers['Cache-Control'], 'no-store');
    assert.equal(r.body.status, 'waiting');
    assert.deepEqual(r.body.candidates, []);
  } finally {
    if (previous !== undefined) process.env.TSE_RESULTS_URL = previous;
  }
});

test('endpoint recusa escrita', async () => {
  const r = await request('POST');
  assert.equal(r.status, 405);
  assert.equal(r.headers.Allow, 'GET');
});

test('fonte fora do TSE é recusada antes de consulta', async () => {
  const previous = process.env.TSE_RESULTS_URL;
  process.env.TSE_RESULTS_URL = 'https://example.com/results.json';
  try {
    const r = await request();
    assert.equal(r.body.status, 'unavailable');
    assert.deepEqual(r.body.candidates, []);
  } finally {
    if (previous === undefined) delete process.env.TSE_RESULTS_URL;
    else process.env.TSE_RESULTS_URL = previous;
  }
});

test('UF inválida é rejeitada sem consultar a fonte', async () => {
  let status, body;
  await handler({method:'GET',url:'/api/results?uf=xx'}, {writeHead(s){status=s},end(b){body=JSON.parse(b)}});
  assert.equal(status,400); assert.equal(body.error,'UF inválida');
});

test('URL nacional não é usada para apresentar votos de um estado', async () => {
  const { resolveSource, regions, officialPage } = await import('../regions.js');
  assert.equal(regions.size,28);
  assert.equal(resolveSource('sp',{TSE_RESULTS_URL:'https://resultados.tse.jus.br/br.json'}),undefined);
  assert.equal(resolveSource('sp',{TSE_RESULTS_URL_TEMPLATE:'https://resultados.tse.jus.br/{uf}.json'}),'https://resultados.tse.jus.br/sp.json');
  assert.throws(()=>resolveSource('sp',{TSE_RESULTS_URL_TEMPLATE:'https://resultados.tse.jus.br/br.json'}));
  assert.ok(officialPage('sp').includes('/uf/sp/'));
});
