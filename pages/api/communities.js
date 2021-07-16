import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response) {
  if (request.method === 'POST') {
    const TOKEN = 'd79469996a5d2acfaec82d3354a5ad';
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: '968615',
      ...request.body,
    })
    response.json({
      dados: 'Algum dado',
      registroCriado: registroCriado,
    })
    return;
  }


}