import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { event_id } = await req.json();
    if (!event_id) return Response.json({ error: 'event_id required' }, { status: 400 });

    const events = await base44.asServiceRole.entities.CommunityEvent.filter({ id: event_id });
    if (!events.length) return Response.json({ error: 'Event not found' }, { status: 404 });

    const ev = events[0];
    const regs = ev.registrations || [];
    const isReg = regs.includes(user.id);
    const willRegister = !isReg;
    const newRegs = willRegister ? [...regs, user.id] : regs.filter(r => r !== user.id);

    await base44.asServiceRole.entities.CommunityEvent.update(ev.id, { registrations: newRegs });

    if (willRegister) {
      // Notifica o próprio usuário
      await base44.asServiceRole.entities.Notification.create({
        user_id: user.id,
        type: 'event',
        title: 'Inscrição confirmada! 🎉',
        message: `Você está inscrito em "${ev.title}".`,
        link: '/Comunidade',
        read: false
      });
    }

    return Response.json({ registered: willRegister, registrations: newRegs });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});