# Estudo de despesas e produção legislativa

## Escopo confirmado
Deputados federais eleitos em 2022; despesas de janeiro de 2023 até a última competência disponível de 2026. O período corrente é parcial. A Câmara iniciou a 57ª legislatura em fevereiro de 2023: gastos de janeiro precisam ser atribuídos ao mandato anterior, e o painel de mandato deve iniciar na posse de cada deputado.

## Fontes e medidas
- TSE: votos nominais, UF, cargo, situação de eleição e partido na eleição de 2022. Identificar eleitos e suplentes separadamente; contar exercício efetivo do mandato.
- Dados Abertos da Câmara: cadastro, exercício, despesas da cota parlamentar, proposições e tramitações.
- Câmara: verbas de gabinete e execução institucional, quando houver detalhamento público verificável. A ausência de dados não significa gasto zero.

O ranking de votos e o ranking de despesas são independentes. Votos por UF estão sujeitos a tamanhos diferentes de eleitorado. Exibir votos brutos e proporção dos votos válidos do cargo na UF quando disponível. Despesa por voto é uma razão descritiva, não uma medida de eficácia.

Não chamar a soma da cota parlamentar de custo total dos parlamentares. Salários, encargos, assessores, cotas e despesas institucionais são categorias diferentes; identificar cobertura e evitar dupla contagem. Verba autorizada não é valor efetivamente gasto. Emendas orçamentárias são execução de políticas públicas, não despesas pessoais do parlamentar.

Apurar valores nominais em reais, competência, data de atualização, cobertura e fonte. Ajustes, devoluções, parcelas e páginas da API precisam ser tratados antes de totalizar; usar valores líquidos conforme semântica documentada da fonte, sem descartar ajustes negativos. Comparar anos completos e ano corrente separadamente.

## Perfil de parlamentar
Resolver identidade pelo cadastro oficial; verificar partido atual e manter partido da eleição como atributo distinto. Não atribuir sigla com base somente no nome ou na descrição fornecida.

Mostrar despesas por categoria/ano e projetos de autoria ou coautoria com número, ementa, tramitação, status e link. Diferenciar aprovação em comissão, aprovação na Câmara e conversão em lei. Coautoria não é autoria exclusiva; lei não é resultado exclusivo de um autor.

Emenda orçamentária é diferente de emenda ao texto de uma proposição. Não afirmar que um projeto foi aprovado “sem emenda” com base na simples ausência de registros: verificar o histórico e explicitar limitações. O usuário confirmou que o filtro desejado é de projetos que viraram lei; não filtrar pela ausência de emendas ao texto.

## Estado da pesquisa
A consulta à API da Câmara foi bloqueada por HTTP 403 no proxy de rede deste ambiente. Os domínios necessários foram solicitados no rascunho de configuração; isso não aplica a mudança à máquina atual. Nenhum custo, votação, filiação ou resultado legislativo foi confirmado. Não apresentar valores simulados como resultados.
