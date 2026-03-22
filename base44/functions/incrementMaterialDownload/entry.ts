import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    const { material_id } = await req.json();

    if (!material_id) {
      return Response.json({ error: 'material_id is required' }, { status: 400 });
    }

    const materials = await base44.asServiceRole.entities.Material.filter({ id: material_id });
    if (!materials[0]) {
      return Response.json({ error: 'Material not found' }, { status: 404 });
    }

    const material = materials[0];
    const newDownloads = (material.downloads || 0) + 1;

    await base44.asServiceRole.entities.Material.update(material.id, {
      downloads: newDownloads,
    });

    if (user) {
      await base44.asServiceRole.entities.Notification.create({
        user_id: user.id,
        type: 'material',
        title: `Download: +5 pontos 🏆`,
        message: `Você baixou "${material.title}". Continue aprendendo!`,
        link: '/Comunidade',
        read: false,
      });
    }

    return Response.json({
      success: true,
      downloads: newDownloads,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});