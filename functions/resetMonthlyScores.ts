import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Reset monthly scores for all profiles
    const profiles = await base44.asServiceRole.entities.UserProfile.list();
    
    let updated = 0;
    for (const profile of profiles) {
      if ((profile.monthly_score || 0) > 0) {
        await base44.asServiceRole.entities.UserProfile.update(profile.id, { monthly_score: 0 });
        updated++;
      }
    }

    return Response.json({ success: true, updated, message: `Reset mensal concluído: ${updated} perfis atualizados.` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});