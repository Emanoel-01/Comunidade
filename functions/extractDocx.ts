import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import mammoth from 'npm:mammoth@1.8.0';

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

    // Baixar o arquivo da URL
    const fileResponse = await fetch(file_url);
    if (!fileResponse.ok) {
      return Response.json({ error: 'Não foi possível baixar o arquivo.' }, { status: 400 });
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const fileName = (file_name || file_url).toLowerCase();

    // Extração DOCX via mammoth
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value || '';
      return Response.json({ html });
    }

    // Extração de texto básico para outros formatos (txt, etc.)
    const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
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