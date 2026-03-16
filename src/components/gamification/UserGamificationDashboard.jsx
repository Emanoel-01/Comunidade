import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Trophy, Star, Zap, TrendingUp, Award, Target, ChevronRight, Lock } from 'lucide-react';

const LEVELS = [
  { name: 'Membro Trainee', min: 0, max: 49, color: 'bg-slate-400', textColor: 'text-slate-600', icon: '🌱' },
  { name: 'Membro Engajado', min: 50, max: 199, color: 'bg-blue-500', textColor: 'text-blue-600', icon: '⚡' },
  { name: 'Colaborador Ativo', min: 200, max: 499, color: 'bg-emerald-500', textColor: 'text-emerald-600', icon: '🔥' },
  { name: 'Especialista 4.0', min: 500, max: 999, color: 'bg-purple-500', textColor: 'text-purple-600', icon: '🎯' },
  { name: 'Embaixador da Comunidade', min: 1000, max: Infinity, color: 'bg-amber-500', textColor: 'text-amber-600', icon: '🏆' },
];

const CATEGORY_COLORS = {
  'Consumo de Conhecimento': 'bg-blue-50 border-blue-200 text-blue-700',
  'Interação Comunitária': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'Produção de Conteúdo': 'bg-purple-50 border-purple-200 text-purple-700',
  'Evolução Acadêmica': 'bg-amber-50 border-amber-200 text-amber-700',
};

const CATEGORY_ICONS = {
  'Consumo de Conhecimento': '📖',
  'Interação Comunitária': '🤝',
  'Produção de Conteúdo': '✍️',
  'Evolução Acadêmica': '🎓',
};

function ProgressBar({ value, max, colorClass }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 100);
  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <div className={`h-2.5 rounded-full transition-all duration-700 ${colorClass}`} style={{ width: `${pct}%` }}></div>
    </div>
  );
}

export default function UserGamificationDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [profiles, userBadges, userActivities] = await Promise.all([
      base44.entities.UserProfile.filter({ user_id: user.id }),
      base44.entities.UserBadge.filter({ user_id: user.id }),
      base44.entities.GamificationActivity.filter({ user_id: user.id }, '-created_date', 10),
    ]);
    setProfile(profiles[0] || null);
    setBadges(userBadges);
    setActivities(userActivities);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-slate-100 rounded-2xl"></div>
        <div className="h-48 bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  const totalScore = profile?.gamification_score_total || 0;
  const currentLevelData = LEVELS.find(l => totalScore >= l.min && totalScore <= l.max) || LEVELS[0];
  const nextLevelData = LEVELS[LEVELS.indexOf(currentLevelData) + 1] || null;
  const progressToNext = nextLevelData ? totalScore - currentLevelData.min : currentLevelData.max;
  const rangeToNext = nextLevelData ? nextLevelData.min - currentLevelData.min : currentLevelData.max;

  // Agrupar badges por categoria
  const badgesByCategory = badges.reduce((acc, b) => {
    const cat = b.badge_category || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(b);
    return acc;
  }, {});

  // Pontos por categoria
  const pointsByCategory = activities.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + (a.points_awarded || 0);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Card principal - Nível e pontuação */}
      <div className={`rounded-2xl p-5 text-white bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wide">Seu Nível Atual</p>
            <h3 className="text-xl font-extrabold mt-0.5 flex items-center gap-2">
              <span>{currentLevelData.icon}</span> {currentLevelData.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">{totalScore.toLocaleString('pt-BR')}</p>
            <p className="text-indigo-200 text-xs">pontos totais</p>
          </div>
        </div>

        {nextLevelData && (
          <div>
            <div className="flex justify-between text-xs text-indigo-200 mb-1.5">
              <span>{currentLevelData.name}</span>
              <span>{nextLevelData.icon} {nextLevelData.name}</span>
            </div>
            <ProgressBar value={progressToNext} max={rangeToNext} colorClass="bg-emerald-400" />
            <p className="text-xs text-indigo-200 mt-1.5">
              <span className="text-white font-bold">{(nextLevelData.min - totalScore).toLocaleString('pt-BR')} pontos</span> para o próximo nível
            </p>
          </div>
        )}

        {!nextLevelData && (
          <div className="mt-2 bg-amber-400/20 rounded-xl px-3 py-2">
            <p className="text-amber-200 text-xs font-bold text-center">🏆 Nível Máximo Alcançado! Você é um Embaixador!</p>
          </div>
        )}
      </div>

      {/* Stats da semana/mês */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <TrendingUp size={18} className="text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-extrabold text-slate-900">{(profile?.weekly_score || 0).toLocaleString('pt-BR')}</p>
          <p className="text-xs text-slate-500 mt-0.5">pts esta semana</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <Star size={18} className="text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-extrabold text-slate-900">{(profile?.monthly_score || 0).toLocaleString('pt-BR')}</p>
          <p className="text-xs text-slate-500 mt-0.5">pts este mês</p>
        </div>
      </div>

      {/* Pontos por pilar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Target size={16} className="text-indigo-600" /> Pontos por Pilar
        </h4>
        <div className="space-y-3">
          {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => {
            const pts = pointsByCategory[cat] || 0;
            const maxPts = Math.max(...Object.values(pointsByCategory), 1);
            return (
              <div key={cat}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">{icon} {cat}</span>
                  <span className="text-xs font-extrabold text-indigo-700">{pts} pts</span>
                </div>
                <ProgressBar value={pts} max={maxPts} colorClass="bg-indigo-500" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges conquistados */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award size={16} className="text-amber-500" /> Medalhas Conquistadas
          <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{badges.length}</span>
        </h4>
        {badges.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <Lock size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm text-slate-500">Nenhuma medalha ainda.</p>
            <p className="text-xs mt-1">Interaja com a comunidade para ganhar badges!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(badgesByCategory).map(([cat, catBadges]) => (
              <div key={cat}>
                <p className={`text-xs font-bold px-2 py-1 rounded-lg inline-block mb-2 border ${CATEGORY_COLORS[cat] || 'bg-slate-100 text-slate-600'}`}>
                  {CATEGORY_ICONS[cat]} {cat}
                </p>
                <div className="flex flex-wrap gap-2">
                  {catBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      title={badge.badge_name}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${badge.badge_color || 'bg-slate-100 text-slate-700'}`}
                    >
                      <span>{badge.badge_icon}</span>
                      {badge.badge_name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Atividades recentes */}
      {activities.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-emerald-500" /> Atividades Recentes
          </h4>
          <div className="space-y-2">
            {activities.slice(0, 5).map((act, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{CATEGORY_ICONS[act.category]}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 leading-tight">{act.related_entity_title || act.activity_type}</p>
                    <p className="text-[10px] text-slate-400">{act.category}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-600">+{act.points_awarded}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}