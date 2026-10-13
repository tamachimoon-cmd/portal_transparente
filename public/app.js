const $ = id => document.getElementById(id);
const number = new Intl.NumberFormat('pt-BR');
const states = {ac:'Acre',al:'Alagoas',ap:'Amapá',am:'Amazonas',ba:'Bahia',ce:'Ceará',df:'Distrito Federal',es:'Espírito Santo',go:'Goiás',ma:'Maranhão',mt:'Mato Grosso',ms:'Mato Grosso do Sul',mg:'Minas Gerais',pa:'Pará',pb:'Paraíba',pr:'Paraná',pe:'Pernambuco',pi:'Piauí',rj:'Rio de Janeiro',rn:'Rio Grande do Norte',rs:'Rio Grande do Sul',ro:'Rondônia',rr:'Roraima',sc:'Santa Catarina',sp:'São Paulo',se:'Sergipe',to:'Tocantins'};
for (const [uf,name] of Object.entries(states)) {
  const option = document.createElement('option'); option.value=uf; option.textContent=name; $('uf').append(option);
}
let controller, generation=0, timer;
function clearResults(message) {
  $('percent').textContent='—%'; $('progress').style.width='0%'; $('updated').textContent='Ainda não disponível';
  const box=document.createElement('div'); box.className='empty';
  const title=document.createElement('h3'); title.textContent=message;
  const text=document.createElement('p'); text.textContent='Consulte a página oficial do TSE pelo link ao lado. Nenhum voto estimado ou simulado é exibido.';
  box.append(title,text); $('results').replaceChildren(box);
}
async function refresh() {
  clearTimeout(timer); controller?.abort(); controller=new AbortController();
  const current=++generation, uf=$('uf').value;
  $('source').href=`https://resultados.tse.jus.br/oficial/app/index.html#/eleicao/6258/uf/${uf}/cargo/1/vis/nominal/resultados`;
  $('country').textContent=uf==='br'?'BRASIL':uf.toUpperCase();
  $('scope').textContent=uf==='br'?'RESULTADO NACIONAL · TSE':`${states[uf].toUpperCase()} · TSE`;
  try {
    const response=await fetch(`/api/results?uf=${uf}`,{signal:controller.signal});
    if (!response.ok) throw new Error('Falha na consulta');
    const data=await response.json(); if(current!==generation) return;
    $('checked').textContent=new Date().toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})+' · Brasília';
    $('badge').textContent=data.status==='available'?'● Dados oficiais disponíveis':data.status==='unavailable'?'● Fonte temporariamente indisponível':'● Aguardando dados oficiais';
    $('official-state').textContent=data.status==='available'?'Consulta automática a cada 30 segundos. O horário dos dados é informado pela fonte.':'Integração dos resultados desta localidade ainda não disponível.';
    if(data.status!=='available') { clearResults(data.status==='unavailable'?'Não foi possível consultar a fonte':'Aguardando a apuração oficial'); return; }
    $('percent').textContent=`${data.countedPercent.toLocaleString('pt-BR')}%`; $('progress').style.width=`${data.countedPercent}%`;
    $('updated').textContent=data.updatedAt; $('source').href=data.sourceUrl;
    $('results').replaceChildren(...data.candidates.map(c=>{
      const article=document.createElement('article'); article.className='candidate';
      const title=document.createElement('h3'); title.textContent=c.name;
      const p=document.createElement('p'), votes=document.createElement('span'), percent=document.createElement('strong');
      votes.textContent=`${number.format(c.votes)} votos`; percent.textContent=`${c.percent.toFixed(2).replace('.',',')}%`; p.append(votes,percent);
      const track=document.createElement('div'); track.className='track'; const fill=document.createElement('div'); fill.style.width=`${c.percent}%`; track.append(fill); article.append(title,p,track); return article;
    }));
  } catch(error) {
    if(current!==generation || error.name==='AbortError') return;
    $('badge').textContent='● Falha na conexão'; $('official-state').textContent='Nova tentativa em 30 segundos.'; clearResults('Não foi possível atualizar os resultados');
  } finally {
    if(current===generation) timer=setTimeout(refresh,30000);
  }
}
$('uf').addEventListener('change',()=>{ clearResults('Consultando localidade selecionada…'); refresh(); });
refresh();
