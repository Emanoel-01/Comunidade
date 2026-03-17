import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import JSZip from 'npm:jszip@3.10.1';

// Parser de DOCX manual via JSZip (DOCX = arquivo ZIP com XMLs)
async function extractDocxContent(uint8Array) {
  const zip = await JSZip.loadAsync(uint8Array);
  
  // O conteúdo principal fica em word/document.xml
  const docXml = zip.file('word/document.xml');
  if (!docXml) throw new Error('Arquivo DOCX inválido ou corrompido.');
  
  const xmlContent = await docXml.async('text');
  
  // Converte XML do DOCX para HTML
  return convertDocxXmlToHtml(xmlContent);
}

function convertDocxXmlToHtml(xml) {
  const lines = [];
  
  // Extrai parágrafos <w:p>
  const paraRegex = /<w:p[ >](.*?)<\/w:p>/gs;
  let paraMatch;
  
  while ((paraMatch = paraRegex.exec(xml)) !== null) {
    const paraXml = paraMatch[1];
    
    // Detecta estilo do parágrafo (Heading1, Heading2, etc.)
    const styleMatch = paraXml.match(/<w:pStyle w:val="([^"]+)"/);
    const style = styleMatch ? styleMatch[1].toLowerCase() : '';
    
    // Extrai o texto de todos os <w:t> dentro do parágrafo
    const textParts = [];
    const runRegex = /<w:r[ >](.*?)<\/w:r>/gs;
    let runMatch;
    
    while ((runMatch = runRegex.exec(paraXml)) !== null) {
      const runXml = runMatch[1];
      const isBold = /<w:b\/>|<w:b >/.test(runXml);
      const isItalic = /<w:i\/>|<w:i >/.test(runXml);
      
      const textMatch = runXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
      if (textMatch && textMatch[1].trim()) {
        let text = textMatch[1]
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        
        if (isBold) text = `<strong>${text}</strong>`;
        if (isItalic) text = `<em>${text}</em>`;
        textParts.push(text);
      }
    }
    
    const text = textParts.join('');
    if (!text.trim()) continue;
    
    // Mapeia estilos para tags HTML
    if (style.includes('heading1') || style === 'titulo') {
      lines.push(`<h1>${text}</h1>`);
    } else if (style.includes('heading2')) {
      lines.push(`<h2>${text}</h2>`);
    } else if (style.includes('heading3')) {
      lines.push(`<h3>${text}</h3>`);
    } else if (style.includes('listparagraph') || style.includes('list')) {
      lines.push(`<li>${text}</li>`);
    } else {
      lines.push(`<p>${text}</p>`);
    }
  }
  
  // Agrupa itens de lista
  const html = lines.join('\n')
    .replace(/(<li>.*?<\/li>\n?)+/gs, match => `<ul>${match}</ul>`);
  
  return html;
}

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

    const fileResponse = await fetch(file_url);
    if (!fileResponse.ok) {
      return Response.json({ error: 'Não foi possível baixar o arquivo.' }, { status: 400 });
    }

    const uint8Array = new Uint8Array(await fileResponse.arrayBuffer());
    const fileName = (file_name || '').toLowerCase();

    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const html = await extractDocxContent(uint8Array);
      return Response.json({ html });
    }

    // TXT e outros formatos de texto
    const text = new TextDecoder().decode(uint8Array);
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