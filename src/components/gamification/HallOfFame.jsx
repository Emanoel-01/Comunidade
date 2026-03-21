import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Trophy, Star, TrendingUp, Crown, Medal, Award, User } from 'lucide-react';

const LEVEL_COLORS = {
  'Membro Trainee': 'bg-slate-100 text-slate-600',
  'Membro Engajado': 'bg-blue-100 text-blue-700',
  'Colaborador Ativo': 'bg-emerald-100 text-emerald-700',
  'Especialista 4.0': 'bg-purple-100 text-purple-700',
  'Embaixador da Comunidade': 'bg-amber-100 text-amber-800',
};

const RANK_STYLES = [
  { bg: 'bg-amber-50 border-amber-200', icon: <Crown size={18} className="text-amber-500" />, label: '🥇' },
  { bg: 'bg-slate-50 border-slate-200', icon: <Medal size={18} className="text-slate-400" />, label: '🥈' },
  { bg: 'bg-orange-50 border-orange-200', icon: <Medal size={18} className="text-orange-400" />, label: '🥉' },
  { bg: 'bg-white border-slate-100', icon: <Star size={16} className="text-slate-300" />, label: '4°' },
  { bg: 'bg-white border-slate-100', icon: <Star size={16} className="text-slate-300" />, label: '5°' },
];

function RankingCard({ profile, rank, scoreKey, scoreLabel, onViewProfile }) {
  const style = RANK_STYLES[rank] || RANK_STYLES[4];
  const score = profile[scoreKey] || 0;

  return (
    <button
      onClick={() => onViewProfile && onViewProfile(profile.user_id)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border ${style.bg} transition-all hover:opacity-80 text-left`}
    >
      <div className="text-lg font-black w-7 text-center">{style.label}</div>
      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
        {profile.avatar_url
          ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
          : (profile.user_name || '?').charAt(0).toUpperCase()
        }
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-bold text-slate-900 text-sm truncate">{profile.user_name || 'Membro'}</p>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${LEVEL_COLORS[profile.current_level] || 'bg-slate-100 text-slate-600'}`}>
          {profile.current_level || 'Membro Trainee'}
        </span>
      </div>
      <div className="text-right shrink-0">
        <p className="font-extrabold text-indigo-700 text-sm">{score.toLocaleString('pt-BR')}</p>
        <p className="text-[10px] text-slate-400">{scoreLabel}</p>
      </div>
    </button>
  );
}

export default function HallOfFame({ compact = false, currentUserId, onViewProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [tab, setTab] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [currentUserId]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.UserProfile.list('-gamification_score_total', 20);
      const enriched = data.map(p => ({
        ...p,
        user_name: p.display_name || p.role_label || 'Membro',
      }));
      setProfiles(enriched);
      if (currentUserId) {
        const mine = enriched.find(p => p.user_id === currentUserId);
        setMyProfile(mine || null);
      }
    } catch (e) {
      setProfiles([]);
    }
    setLoading(false);
  };

  const weeklyTop = [...profiles].sort((a, b) => (b.weekly_score || 0) - (a.weekly_score || 0)).slice(0, 5);
  const monthlyTop = [...profiles].sort((a, b) => (b.monthly_score || 0) - (a.monthly_score || 0)).slice(0, 5);
  const current = tab === 'weekly' ? weeklyTop : monthlyTop;

  const scoreKey = tab === 'weekly' ? 'weekly_score' : 'monthly_score';
  const myScore = myProfile?.[scoreKey] || 0;
  const myRank = [...profiles].sort((a, b) => (b[scoreKey] || 0) - (a[scoreKey] || 0)).findIndex(p => p.user_id === currentUserId);
  const leader = current[0];
  const leaderScore = leader?.[scoreKey] || 0;
  const diff = leaderScore - myScore;

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 ${compact ? 'p-4' : 'p-6'}`}>
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-white" />
            <h3 className="font-extrabold text-white text-base">Hall da Fama</h3>
          </div>
          <TrendingUp size={16} className="text-amber-100" />
        </div>
        <p className="text-amber-100 text-xs mt-0.5">Os membros mais ativos do ecossistema</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setTab('weekly')}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors ${tab === 'weekly' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Esta Semana
        </button>
        <button
          onClick={() => setTab('monthly')}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors ${tab === 'monthly' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Este Mês
        </button>
      </div>

      {/* Ranking */}
      <div className={`${compact ? 'p-4' : 'p-5'} space-y-2`}>
        {current.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Award size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Ainda sem membros no ranking.</p>
            <p className="text-xs mt-1">Comece a interagir para aparecer aqui!</p>
          </div>
        ) : (
          current.map((profile, idx) => (
            <RankingCard
              key={profile.id}
              profile={profile}
              rank={idx}
              scoreKey={scoreKey}
              scoreLabel={tab === 'weekly' ? 'pts semana' : 'pts mês'}
              onViewProfile={onViewProfile}
            />
          ))
        )}

        {/* Comparação com o usuário logado */}
        {currentUserId && myProfile && myRank >= 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                {myProfile.avatar_url
                  ? <img src={myProfile.avatar_url} className="w-full h-full object-cover" alt="" />
                  : <User size={16} />
                }
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-bold text-indigo-800 truncate">Você • {myRank + 1}° lugar</p>
                <p className="text-[11px] text-indigo-500">
                  {myRank === 0
                    ? '🏆 Você está no topo!'
                    : diff > 0
                      ? `Faltam ${diff.toLocaleString('pt-BR')} pts para o 1° lugar`
                      : 'Continue engajando!'
                  }
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-indigo-700 text-sm">{myScore.toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-slate-400">{tab === 'weekly' ? 'pts semana' : 'pts mês'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}