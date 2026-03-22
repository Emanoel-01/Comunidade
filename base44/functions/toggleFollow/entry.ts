import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetProfileId, action } = await req.json();

    if (!targetProfileId) {
      return Response.json({ error: 'targetProfileId is required' }, { status: 400 });
    }

    if (!['follow', 'unfollow'].includes(action)) {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    const [myProfiles, targetProfiles] = await Promise.all([
      base44.asServiceRole.entities.UserProfile.filter({ user_id: user.id }),
      base44.asServiceRole.entities.UserProfile.filter({ id: targetProfileId }),
    ]);

    if (!myProfiles[0]) {
      return Response.json({ error: 'Authenticated user profile not found' }, { status: 404 });
    }

    if (!targetProfiles[0]) {
      return Response.json({ error: 'Target profile not found' }, { status: 404 });
    }

    const my = myProfiles[0];
    const target = targetProfiles[0];

    if (target.user_id === user.id) {
      return Response.json({ error: 'You cannot follow yourself' }, { status: 400 });
    }

    const willFollow = action === 'follow';

    const newFollowing = willFollow
      ? [...new Set([...(my.following || []), target.user_id])]
      : (my.following || []).filter((id) => id !== target.user_id);

    const newFollowers = willFollow
      ? [...new Set([...(target.followers || []), user.id])]
      : (target.followers || []).filter((id) => id !== user.id);

    await Promise.all([
      base44.asServiceRole.entities.UserProfile.update(my.id, {
        following: newFollowing,
      }),
      base44.asServiceRole.entities.UserProfile.update(target.id, {
        followers: newFollowers,
      }),
    ]);

    return Response.json({
      success: true,
      action,
      following: newFollowing,
      followers: newFollowers,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});