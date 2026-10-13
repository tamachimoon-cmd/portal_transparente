import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, waiting } from '../results.js';
test('aguarda sem inventar resultados',()=>{assert.equal(waiting.status,'waiting');assert.deepEqual(waiting.candidates,[]);assert.equal(waiting.countedPercent,null)});
test('normaliza formato compatível e calcula percentual de votos válidos',()=>{const r=normalize({dt:'25/10/2026',ht:'18:00:00',pst:'50,5',cand:[{nm:'Candidato A',n:'1',vap:'60'},{nm:'Candidato B',n:'2',vap:'40'}]});assert.equal(r.countedPercent,50.5);assert.equal(r.candidates[0].percent,60);});
test('recusa resultados incompletos e percentuais inválidos',()=>{assert.throws(()=>normalize({}));assert.throws(()=>normalize({dt:'x',ht:'x',pst:'101',cand:[{nm:'A',n:'1',vap:'10'}]}));});
