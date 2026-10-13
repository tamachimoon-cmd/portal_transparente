export const regions = new Set(['br','ac','al','ap','am','ba','ce','df','es','go','ma','mt','ms','mg','pa','pb','pr','pe','pi','rj','rn','rs','ro','rr','sc','sp','se','to']);
export function officialPage(uf) {
  return `https://resultados.tse.jus.br/oficial/app/index.html#/eleicao/6258/uf/${uf}/cargo/1/vis/nominal/resultados`;
}
export function resolveSource(uf, config = process.env) {
  const template = config.TSE_RESULTS_URL_TEMPLATE;
  if (template) {
    if (!template.includes('{uf}')) throw new Error('Template deve conter {uf}');
    return template.replaceAll('{uf}', uf);
  }
  return uf === 'br' ? config.TSE_RESULTS_URL : undefined;
}
