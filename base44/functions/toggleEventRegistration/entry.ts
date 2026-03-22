import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { event_id } = await req.json();

    if (!event_id) {
      return Response.json({ error: 'event_id is required' }, { status: 400 });
    }

    const events = await base44.asServiceRole.entities.CommunityEvent.filter({ id: event_id });
    if (!events[0]) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = events[0];
    const registrations = event.registrations || [];
    const isRegistered = registrations.includes(user.id);

    const isPast = event.event_date && new Date(event.event_date) < new Date();
    if (isPast) {
      return Response.json({ error: 'Past event cannot be changed' }, { status: 400 });
    }

    const maxParticipants = event.max_participants || null;
    if (!isRegistered && maxParticipants && registrations.length >= maxParticipants) {
      return Response.json({ error: 'Event is full' }, { status: 400 });
    }

    const newRegistrations = isRegistered
      ? registrations.filter((id) => id !== user.id)
      : [...registrations, user.id];

    await base44.asServiceRole.entities.CommunityEvent.update(event.id, {
      registrations: newRegistrations,
    });

    if (!isRegistered) {
      const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
      await Promise.all(
        admins.map((a) =>
          base44.asServiceRole.entities.Notification.create({
            user_id: a.id,
            type: 'event',
            title: `Nova inscrição: ${event.title}`,
            message: `${user.full_name} se inscreveu.`,
            link: '/Comunidade',
            read: false,
          })
        )
      );
    }

    return Response.json({
      success: true,
      registered: !isRegistered,
      registrations: newRegistrations,
      registrations_count: newRegistrations.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});