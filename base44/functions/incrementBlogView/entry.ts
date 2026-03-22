import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { post_id } = await req.json();

    if (!post_id) {
      return Response.json({ error: 'post_id is required' }, { status: 400 });
    }

    const posts = await base44.asServiceRole.entities.BlogPost.filter({ id: post_id });
    if (!posts[0]) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = posts[0];
    const newViews = (post.views || 0) + 1;

    await base44.asServiceRole.entities.BlogPost.update(post.id, {
      views: newViews,
    });

    return Response.json({
      success: true,
      views: newViews,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});