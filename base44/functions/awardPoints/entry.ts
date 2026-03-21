import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Tabela de pontos por tipo de atividade
const POINTS_MAP = {
  blog_post_read: { points: 5, category: 'Consumo de Conhecimento' },
  blog_post_liked: { points: 3, category: 'Consumo de Conhecimento' },
  blog_post_commented: { points: 10, category: 'Interação Comunitária' },
  material_downloaded: { points: 5, category: 'Consumo de Conhecimento' },
  forum_post_created: { points: 20, category: 'Produção de Conteúdo' },
  forum_post_liked: { points: 2, category: 'Interação Comunitária' },
  forum_comment_created: { points: 10, category: 'Interação Comunitária' },
  community_post_created: { points: 15, category: 'Produção de Conteúdo' },
  community_post_liked: { points: 2, category: 'Interação Comunitária' },
};

// Regras de badges automáticos
const BADGE_RULES = [
  { activity_type: 'blog_post_read', count: 1, badge_name: 'Primeiro Artigo', icon: '📖', color: 'bg-blue-100 text-blue-700', category: 'Consumo de Conhecimento' },
  { activity_type: 'blog_post_read', count: 10, badge_name: 'Leitor Assíduo', icon: '🎓', color: 'bg-indigo-100 text-indigo-700', category: 'Consumo de Conhecimento' },
  { activity_type: 'material_downloaded', count: 1, badge_name: 'Explorador de Recursos', icon: '📥', color: 'bg-emerald-100 text-emerald-700', category: 'Consumo de Conhecimento' },
  { activity_type: 'material_downloaded', count: 5, badge_name: 'Colecionador de Materiais', icon: '📚', color: 'bg-green-100 text-green-700', category: 'Consumo de Conhecimento' },
  { activity_type: 'forum_post_created', count: 1, badge_name: 'Voz do Fórum', icon: '💬', color: 'bg-purple-100 text-purple-700', category: 'Produção de Conteúdo' },
  { activity_type: 'forum_post_created', count: 5, badge_name: 'Especialista Técnico', icon: '🔧', color: 'bg-rose-100 text-rose-700', category: 'Produção de Conteúdo' },
  { activity_type: 'blog_post_commented', count: 3, badge_name: 'Engajador de Conteúdo', icon: '✍️', color: 'bg-amber-100 text-amber-700', category: 'Interação Comunitária' },
  { total_points: 100, badge_name: 'Membro Ativo', icon: '⭐', color: 'bg-yellow-100 text-yellow-700', category: 'Interação Comunitária' },
  { total_points: 500, badge_name: 'Colaborador 4.0', icon: '🚀', color: 'bg-orange-100 text-orange-700', category: 'Interação Comunitária' },
  { total_points: 1000, badge_name: 'Embaixador da Comunidade', icon: '🏆', color: 'bg-amber-100 text-amber-800', category: 'Interação Comunitária' },
];

const LEVEL_THRESHOLDS = [
  { min: 1000, level: 'Embaixador da Comunidade' },
  { min: 500, level: 'Especialista 4.0' },
  { min: 200, level: 'Colaborador Ativo' },
  { min: 50, level: 'Membro Engajado' },
  { min: 0, level: 'Membro Trainee' },
];

function getLevel(total) {
  for (const t of LEVEL_THRESHOLDS) {
    if (total >= t.min) return t.level;
  }
  return 'Membro Trainee';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { activity_type, related_entity_id, related_entity_title } = await req.json();

    const activityConfig = POINTS_MAP[activity_type];
    if (!activityConfig) return Response.json({ error: 'Tipo de atividade inválido' }, { status: 400 });

    const { points, category } = activityConfig;

    // Registrar a atividade
    await base44.entities.GamificationActivity.create({
      user_id: user.id,
      user_name: user.full_name,
      activity_type,
      related_entity_id: related_entity_id || '',
      related_entity_title: related_entity_title || '',
      points_awarded: points,
      category,
    });

    // Buscar perfil de gamificação do usuário
    const profiles = await base44.entities.UserProfile.filter({ user_id: user.id });
    const profile = profiles[0];

    const earnedBadges = [];

    if (profile) {
      const oldTotal = profile.gamification_score_total || 0;
      const newTotal = oldTotal + points;
      const newWeekly = (profile.weekly_score || 0) + points;
      const newMonthly = (profile.monthly_score || 0) + points;

      const oldLevel = getLevel(oldTotal);
      const newLevel = getLevel(newTotal);

      await base44.asServiceRole.entities.UserProfile.update(profile.id, {
        gamification_score_total: newTotal,
        weekly_score: newWeekly,
        monthly_score: newMonthly,
        current_level: newLevel,
      });

      // Notificação de pontos ganhos (via serviço role para bypasser o RLS de criação)
      await base44.asServiceRole.entities.Notification.create({
        user_id: user.id,
        type: 'gamification',
        title: `+${points} pontos ganhos!`,
        message: `Você ganhou ${points} pontos por "${activity_type.replace(/_/g, ' ')}"${related_entity_title ? ` em "${related_entity_title}"` : ''}.`,
        read: false,
      });

      // Notificação de subida de nível
      if (newLevel !== oldLevel) {
        await base44.asServiceRole.entities.Notification.create({
          user_id: user.id,
          type: 'gamification',
          title: `🎉 Novo nível desbloqueado!`,
          message: `Parabéns! Você subiu para o nível "${newLevel}".`,
          read: false,
        });
      }

      // Verificar badges
      const allActivities = await base44.entities.GamificationActivity.filter({ user_id: user.id });
      const existingBadges = await base44.entities.UserBadge.filter({ user_id: user.id });
      const existingBadgeNames = existingBadges.map(b => b.badge_name);

      for (const rule of BADGE_RULES) {
        if (existingBadgeNames.includes(rule.badge_name)) continue;

        let earned = false;
        if (rule.total_points && newTotal >= rule.total_points) {
          earned = true;
        } else if (rule.activity_type) {
          const count = allActivities.filter(a => a.activity_type === rule.activity_type).length;
          if (count >= rule.count) earned = true;
        }

        if (earned) {
          await base44.entities.UserBadge.create({
            user_id: user.id,
            user_name: user.full_name,
            badge_id: rule.badge_name.toLowerCase().replace(/ /g, '_'),
            badge_name: rule.badge_name,
            badge_icon: rule.icon,
            badge_category: rule.category,
            badge_color: rule.color,
          });

          earnedBadges.push(rule);

          // Notificação de novo badge
          await base44.asServiceRole.entities.Notification.create({
            user_id: user.id,
            type: 'gamification',
            title: `${rule.icon} Badge conquistado!`,
            message: `Você desbloqueou o badge "${rule.badge_name}". Continue assim!`,
            read: false,
          });
        }
      }
    }

    return Response.json({ success: true, points_awarded: points, category, earned_badges: earnedBadges });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});