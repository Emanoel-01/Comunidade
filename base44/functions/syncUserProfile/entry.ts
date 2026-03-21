import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

// Chamada no primeiro login do usuário para migrar o perfil temporário (user_id=email) para o ID real
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verifica se já tem perfil com o ID real
    const existingById = await base44.asServiceRole.entities.UserProfile.filter({ user_id: user.id });
    if (existingById && existingById.length > 0) {
      // Já sincronizado, retorna o perfil existente
      return Response.json({ synced: false, profile: existingById[0] });
    }

    // Verifica se existe perfil temporário com user_id = email do usuário
    const existingByEmail = await base44.asServiceRole.entities.UserProfile.filter({ user_id: user.email });
    if (existingByEmail && existingByEmail.length > 0) {
      // Migra: atualiza o user_id do perfil temporário para o ID real
      const tempProfile = existingByEmail[0];
      const updated = await base44.asServiceRole.entities.UserProfile.update(tempProfile.id, {
        user_id: user.id,
        display_name: tempProfile.display_name || user.full_name || '',
      });
      return Response.json({ synced: true, migrated: true, profile: updated });
    }

    // Não tem perfil temporário — cria um novo perfil padrão
    const newProfile = await base44.asServiceRole.entities.UserProfile.create({
      user_id: user.id,
      display_name: user.full_name || '',
      role_type: 'aluno',
      role_label: user.full_name || 'Membro',
      license_type: 'teste',
      license_start_date: new Date().toISOString().split('T')[0],
      is_approved: true,
    });
    return Response.json({ synced: true, created: true, profile: newProfile });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});