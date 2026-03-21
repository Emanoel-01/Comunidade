import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { title, message, type, link } = await req.json();

    if (!title || !message || !type) {
      return Response.json({ error: 'Title, message, and type are required' }, { status: 400 });
    }

    const profiles = await base44.asServiceRole.entities.UserProfile.list();
    const userIds = profiles.map(p => p.user_id);

    const notifications = userIds.map(uid => ({
      user_id: uid,
      type: type,
      title: title,
      message: message,
      link: link || '',
      read: false
    }));

    await base44.asServiceRole.entities.Notification.bulkCreate(notifications);

    return Response.json({ success: true, count: notifications.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});