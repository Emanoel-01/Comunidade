import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { file_url, file_name } = body;

    if (!file_url) {
      return Response.json({ error: 'file_url é obrigatório.' }, { status: 400 });
    }

    const fileName = (file_name || '').toLowerCase();

    // Para DOCX: usa InvokeLLM com o arquivo para extrair o conteúdo
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Você é um assistente de extração de conteúdo. 
Extraia TODO o conteúdo textual deste documento Word e converta para HTML bem formatado.
Use tags HTML apropriadas: <h1>, <h2>, <h3> para títulos, <p> para parágrafos, <ul>/<li> para listas, <strong> para negrito, <em> para itálico, <blockquote> para citações.
Retorne APENAS o HTML do conteúdo, sem tags <html>, <head> ou <body>.
Preserve toda a estrutura e formatação do documento original.`,
        file_urls: [file_url],
        model: 'claude_sonnet_4_6',
      });

      const html = typeof result === 'string' ? result : (result?.html || result?.content || '');
      // Limpar possíveis marcadores de código
      const cleanHtml = html.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();
      return Response.json({ html: cleanHtml });
    }

    // Para TXT: baixa e converte em parágrafos HTML
    const fileResponse = await fetch(file_url);
    if (!fileResponse.ok) {
      return Response.json({ error: 'Não foi possível baixar o arquivo.' }, { status: 400 });
    }
    const text = await fileResponse.text();
    const html = text
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<p>${line.trim()}</p>`)
      .join('');

    return Response.json({ html });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});