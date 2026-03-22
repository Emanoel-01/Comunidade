import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { post_id } = await req.json();

    if (!post_id) {
      return Response.json({ error: 'post_id is required' }, { status: 400 });
    }

    const posts = await base44.asServiceRole.entities.BlogPost.filter({ id: post_id });
    if (!posts[0]) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = posts[0];
    const likedBy = post.liked_by || [];
    const alreadyLiked = likedBy.includes(user.id);

    const newLikedBy = alreadyLiked
      ? likedBy.filter((id) => id !== user.id)
      : [...likedBy, user.id];

    const newLikes = newLikedBy.length;

    await base44.asServiceRole.entities.BlogPost.update(post.id, {
      liked_by: newLikedBy,
      likes: newLikes,
    });

    return Response.json({
      success: true,
      likes: newLikes,
      liked_by: newLikedBy,
      liked: !alreadyLiked,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});