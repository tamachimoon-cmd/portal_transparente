# Portal Transparente
Portal público independente para acompanhar o segundo turno presidencial brasileiro de 2026.

## Desenvolvimento
Requer Node.js 22 ou superior. Sem dependências externas de execução.

```sh
npm test
npm run dev
```
Servidor na porta 3000 (substituível com `PORT`). `npm start` inicia sem watch.

## Integração oficial: pendente
Sem configuração, `/api/results` retorna `waiting`, sem candidatos ou votos simulados.
`TSE_RESULTS_URL` aceita exclusivamente HTTPS em domínio do TSE e não segue redirecionamentos. Configure somente após confirmar com o TSE a URL e o esquema oficiais de 2026. O adaptador preliminar espera `dt`, `ht`, `pst` e `cand` com `nm`, `n`, `vap`; sua compatibilidade com 2026 ainda não foi validada. Um formato diferente ou uma falha retorna `unavailable`, sem resultados fabricados. O frontend consulta a cada 30 segundos e usa o horário informado pela fonte.

A interface oferece seleção nacional, dos 26 estados e do Distrito Federal, com atualização automática e links oficiais por UF. Cache compartilhado, integração validada, limites de requisição e testes com dados reais precisam ser concluídos antes de publicação como serviço de apuração. Não declara vencedor e não substitui a divulgação do TSE.

## Apuração independente: pendente
A tela identifica esta segunda fonte, mas não implementa upload, armazenamento ou contagem de boletins. Antes da implementação, definir origem dos boletins, verificação de autenticidade, deduplicação por seção/turno/cargo e tratamento de conflitos. Totais independentes devem ser exibidos separadamente dos oficiais, com cobertura e proveniência próprias.

## Publicar um protótipo na Vercel
O frontend está em `public/` e a API serverless em `api/results.js`; o servidor local reutiliza essa mesma API. `vercel.json` configura a saída estática e executa os testes antes da publicação.

1. Envie os arquivos para seu repositório GitHub.
2. Na Vercel, crie um projeto importando `tamachimoon-cmd/portal_transparente`.
3. Use a raiz do repositório e mantenha a configuração de `vercel.json` (Framework: Other; Output Directory: public; Build Command: npm test). Selecione Node.js 24.x.
4. Faça o deploy. Ainda não configure `TSE_RESULTS_URL` com o link da página: ele é HTML, não um endpoint JSON validado.
5. Na URL gerada, verifique a página e `/api/results`: deve retornar `status: waiting` e `candidates: []`. Confirme também a aparência no celular.

Isso publica um protótipo para testar a interface; não uma apuração integrada. O funcionamento no runtime da Vercel precisa ser verificado após o deploy. Nenhuma credencial deve ser colocada no repositório ou no chat.

## Consulta por estado
`GET /api/results?uf=sp` seleciona uma UF; `br` é o padrão. UF desconhecida retorna HTTP 400. Para futura integração estadual, `TSE_RESULTS_URL_TEMPLATE` deve conter `{uf}`, substituído pela sigla em minúsculas, e apontar para um JSON oficial previamente validado. Sem template, `TSE_RESULTS_URL` é usada somente para Brasil: dados nacionais nunca são apresentados como estaduais. A URL de dados de 2026 e seu esquema ainda precisam ser confirmados.

Ao mudar de UF, a interface limpa os resultados anteriores e cancela a consulta anterior. Falhas removem resultados da tela e indicam indisponibilidade. Última consulta do portal e última atualização da fonte são exibidas separadamente.
