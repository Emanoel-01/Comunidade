import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

// Permite que um usuário siga/dessiga outro, atualizando ambos os perfis via service role
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { myProfileId, targetProfileId, action } = await req.json();
    // action: 'follow' | 'unfollow'

    const [myProfile, targetProfile] = await Promise.all([
      base44.asServiceRole.entities.UserProfile.filter({ id: myProfileId }),
      base44.asServiceRole.entities.UserProfile.filter({ id: targetProfileId }),
    ]);

    if (!myProfile[0] || !targetProfile[0]) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    const my = myProfile[0];
    const target = targetProfile[0];
    const willFollow = action === 'follow';

    const newFollowing = willFollow
      ? [...new Set([...(my.following || []), target.user_id])]
      : (my.following || []).filter(id => id !== target.user_id);

    const newFollowers = willFollow
      ? [...new Set([...(target.followers || []), user.id])]
      : (target.followers || []).filter(id => id !== user.id);

    await Promise.all([
      base44.asServiceRole.entities.UserProfile.update(my.id, { following: newFollowing }),
      base44.asServiceRole.entities.UserProfile.update(target.id, { followers: newFollowers }),
    ]);

    return Response.json({ following: newFollowing, followers: newFollowers });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});