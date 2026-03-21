import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { currentProfileId, targetProfileId, currentFollowing, targetFollowers, willFollow } = await req.json();

    const newFollowing = willFollow
      ? [...(currentFollowing || []), targetProfileId.userId]
      : (currentFollowing || []).filter(id => id !== targetProfileId.userId);

    const newFollowers = willFollow
      ? [...(targetFollowers || []), user.id]
      : (targetFollowers || []).filter(id => id !== user.id);

    await Promise.all([
      base44.asServiceRole.entities.UserProfile.update(currentProfileId, { following: newFollowing }),
      base44.asServiceRole.entities.UserProfile.update(targetProfileId.id, { followers: newFollowers }),
    ]);

    return Response.json({ following: newFollowing, followers: newFollowers });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});