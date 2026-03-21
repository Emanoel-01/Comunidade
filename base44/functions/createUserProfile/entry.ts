import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { user_id, full_name, role_type, role_label, license_type, license_start_date, license_end_date } = await req.json();

    if (!user_id) {
      return Response.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Verifica se já existe UserProfile para esse user_id (real ou email)
    const existingById = await base44.asServiceRole.entities.UserProfile.filter({ user_id });
    if (existingById && existingById.length > 0) {
      return Response.json({ created: false, message: 'Profile already exists', profile: existingById[0] });
    }

    const profile = await base44.asServiceRole.entities.UserProfile.create({
      user_id,
      display_name: full_name || '',
      role_type: role_type || 'aluno',
      role_label: role_label || full_name || '',
      license_type: license_type || 'pleno',
      license_start_date: license_start_date || new Date().toISOString().split('T')[0],
      license_end_date: license_type === 'vitalicio' ? '' : (license_end_date || ''),
      is_approved: true,
    });

    return Response.json({ created: true, profile });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});