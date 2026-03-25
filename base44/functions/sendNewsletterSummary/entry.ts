import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Busca os últimos 7 posts publicados
    const recentPosts = await base44.asServiceRole.entities.BlogPost.filter(
      { status: 'published' },
      '-created_date',
      7
    );

    if (!recentPosts || recentPosts.length === 0) {
      return Response.json({ error: 'Nenhum post publicado encontrado.' }, { status: 400 });
    }

    // Gera resumo com LLM
    const postsText = recentPosts.map((p, i) =>
      `${i + 1}. **${p.title}** (${p.category || 'Geral'})\n${p.summary || ''}`
    ).join('\n\n');

    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Você é o assistente editorial do blog "Blog Mundo 4.0" de Emanoel Amorim, especialista em Construção 4.0, Gestão e Tecnologia.

Crie um e-mail de newsletter em português brasileiro, amigável e profissional, resumindo os artigos mais recentes abaixo. O e-mail deve:
- Ter uma saudação calorosa
- Apresentar brevemente cada artigo em 1-2 frases envolventes que gerem curiosidade
- Ter um CTA final incentivando o leitor a acessar o blog
- Tom: especialista mas acessível, inspirador

Posts recentes:
${postsText}

Formate como HTML simples (use <h2>, <p>, <ul>, <li>, <strong>, <a>) pronto para enviar por e-mail.`,
      response_json_schema: {
        type: 'object',
        properties: {
          subject: { type: 'string' },
          html_body: { type: 'string' },
        }
      }
    });

    const subject = llmResult?.subject || `📚 Novidades do Blog Mundo 4.0 - ${new Date().toLocaleDateString('pt-BR')}`;
    const htmlBody = llmResult?.html_body || `<p>Confira os últimos artigos em <a href="https://emanoelamorim.base44.app/Blog">Blog Mundo 4.0</a></p>`;

    // Busca todos os assinantes
    const subscribers = await base44.asServiceRole.entities.NewsletterSubscriber.list();
    if (!subscribers || subscribers.length === 0) {
      return Response.json({ error: 'Nenhum assinante encontrado.' }, { status: 400 });
    }

    // Envia e-mails em lotes de 5, com pausa de 2s entre lotes para evitar rate limit
    let sent = 0;
    const BATCH_SIZE = 5;
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(sub =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to: sub.email,
          subject,
          body: htmlBody,
          from_name: 'Emanoel Amorim | Blog Mundo 4.0'
        })
      ));
      sent += batch.length;
      if (i + BATCH_SIZE < subscribers.length) {
        await sleep(2000); // pausa 2s entre lotes
      }
    }

    return Response.json({ success: true, sent, subject, posts_count: recentPosts.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});