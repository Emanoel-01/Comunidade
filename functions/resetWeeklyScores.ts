import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Reset weekly scores for all profiles
    const profiles = await base44.asServiceRole.entities.UserProfile.list();
    
    let updated = 0;
    for (const profile of profiles) {
      if ((profile.weekly_score || 0) > 0) {
        await base44.asServiceRole.entities.UserProfile.update(profile.id, { weekly_score: 0 });
        updated++;
      }
    }

    return Response.json({ success: true, updated, message: `Reset semanal concluído: ${updated} perfis atualizados.` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});