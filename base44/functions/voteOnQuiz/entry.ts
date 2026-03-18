import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { post_id, option_index } = await req.json();
    if (!post_id || option_index === undefined) {
      return Response.json({ error: 'post_id e option_index são obrigatórios' }, { status: 400 });
    }

    const post = await base44.asServiceRole.entities.CommunityPost.get(post_id);
    if (!post) return Response.json({ error: 'Post não encontrado' }, { status: 404 });
    if (!post.is_quiz) return Response.json({ error: 'Este post não é uma enquete' }, { status: 400 });

    const votesMap = post.quiz_votes || {};
    // Verifica se o usuário já votou em alguma opção
    const hasVoted = Object.values(votesMap).some(voters => voters.includes(user.id));
    if (hasVoted) return Response.json({ error: 'Você já votou nesta enquete' }, { status: 400 });

    const optionVoters = votesMap[option_index] || [];
    const newVotesMap = { ...votesMap, [option_index]: [...optionVoters, user.id] };

    await base44.asServiceRole.entities.CommunityPost.update(post_id, { quiz_votes: newVotesMap });

    return Response.json({ success: true, quiz_votes: newVotesMap });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});