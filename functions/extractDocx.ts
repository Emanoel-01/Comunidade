import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import mammoth from 'npm:mammoth@1.8.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const fileName = file.name?.toLowerCase() || '';
    const arrayBuffer = await file.arrayBuffer();

    // Extração DOCX via mammoth
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value || '';
      return Response.json({ html, messages: result.messages });
    }

    // Extração de texto básico para outros formatos
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