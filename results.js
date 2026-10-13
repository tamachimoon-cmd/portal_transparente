export const waiting = { status: 'waiting', election: 'Presidente do Brasil · Segundo turno · 2026', source: 'Tribunal Superior Eleitoral', sourceUrl: 'https://www.tse.jus.br/', updatedAt: null, candidates: [], countedPercent: null };
export function normalize(data) {
  if (!Array.isArray(data.cand) || !data.cand.length || typeof data.dt !== 'string' || typeof data.ht !== 'string') throw new Error('Formato de resultado não reconhecido');
  const numeric = value => { const n = Number(String(value).replace(',', '.')); if (!Number.isFinite(n) || n < 0) throw new Error('Valor inválido'); return n; };
  const countedPercent = numeric(data.pst);
  if (countedPercent > 100) throw new Error('Percentual inválido');
  const candidates = data.cand.map(c => { if (!c.nm || !c.n) throw new Error('Candidato inválido'); const votes = numeric(c.vap); if (!Number.isSafeInteger(votes)) throw new Error('Votos inválidos'); return { name: c.nm, number: c.n, party: c.cc || '', votes }; }).sort((a,b) => b.votes-a.votes);
  const total = candidates.reduce((sum,c) => sum+c.votes,0);
  return { ...waiting, status: 'available', updatedAt: `${data.dt} ${data.ht}`, countedPercent, candidates: candidates.map(c => ({ ...c, percent: total ? c.votes/total*100 : 0 })) };
}
