import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

// Permite que qualquer usuário autenticado curta/descurta um post via service role
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { post_id } = await req.json();

    const posts = await base44.asServiceRole.entities.CommunityPost.filter({ id: post_id });
    if (!posts[0]) return Response.json({ error: 'Post not found' }, { status: 404 });

    const post = posts[0];
    const likedBy = post.liked_by || [];
    const alreadyLiked = likedBy.includes(user.id);

    const newLikedBy = alreadyLiked
      ? likedBy.filter(id => id !== user.id)
      : [...likedBy, user.id];
    const newLikes = newLikedBy.length;

    await base44.asServiceRole.entities.CommunityPost.update(post_id, {
      likes: newLikes,
      liked_by: newLikedBy,
    });

    return Response.json({ likes: newLikes, liked_by: newLikedBy });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});