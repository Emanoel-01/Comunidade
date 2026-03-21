import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { LockKeyhole, CheckCircle2, Send } from 'lucide-react';
import AccessRequestForm from '../components/community/AccessRequestForm';
import CommunityFeed from '../components/community/CommunityFeed';
import CommunityJobs from '../components/community/CommunityJobs';
import CommunityMaterials from '../components/community/CommunityMaterials';
import CommunityEvents from '../components/community/CommunityEvents';
import CommunityProfile from '../components/community/CommunityProfile';
import CommunitySidebar from '../components/community/CommunitySidebar';
import CommunityNotifications from '../components/community/CommunityNotifications';
import CommunityChat from '../components/community/CommunityChat';
import CommunityForum from '../components/community/CommunityForum';
import UserGamificationDashboard from '../components/gamification/UserGamificationDashboard';
import HallOfFame from '../components/gamification/HallOfFame';
import GamificationToast from '../components/gamification/GamificationToast';

export default function Comunidade() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [viewingProfileId, setViewingProfileId] = useState(null);
  const [chatConversation, setChatConversation] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      const me = await base44.auth.me();
      setUser(me);
      await loadProfile(me);
    }
    setIsLoading(false);
  };

  const loadProfile = async (u) => {
    const profiles = await base44.entities.UserProfile.filter({ user_id: u.id });
    if (profiles.length > 0) {
      setProfile(profiles[0]);
    } else {
      // Cria perfil padrão para novos usuários
      const newProfile = await base44.entities.UserProfile.create({
        user_id: u.id,
        role_label: u.role === 'admin' ? 'Docente & Mentor' : 'Membro da Comunidade',
        badges: [],
        skills: [],
        followers: [],
        following: [],
        is_approved: true
      });
      setProfile(newProfile);
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.pathname);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-slate-100 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-3xl border border-slate-200">
          <div className="md:w-1/2 bg-slate-900 text-white p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000')] bg-cover bg-center"></div>
            <div className="relative z-10">
              <LockKeyhole className="text-emerald-400 w-12 h-12 mb-6" />
              <h2 className="text-3xl font-extrabold mb-4">Comunidade Business 4.0</h2>
              <p className="text-slate-300 mb-5 text-sm leading-relaxed">Além do Diploma: O ponto de encontro entre quem resolve e quem contrata na Construção Civil.</p>
              <ul className="space-y-3 text-sm mb-6">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span><strong className="text-white">Gestão Estratégica & Diagnóstica:</strong> Soluções em laudos, eficiência e segurança predial.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span><strong className="text-white">Ecossistema Digital SaaS:</strong> Tecnologia inteligente para a gestão de ativos e edifícios.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span><strong className="text-white">Liderança e Prática:</strong> Networking com os protagonistas que dominam a convergência tecnológica.</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span><strong className="text-white">Hub de Oportunidades:</strong> Onde a engenharia consultiva encontra as parcerias de alto nível.</span></li>
              </ul>

            </div>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            {showRequestForm ? (
              <AccessRequestForm onClose={() => setShowRequestForm(false)} />
            ) : (
              <div className="p-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Acessar Plataforma</h3>
                <button
                  onClick={handleLogin}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-md text-lg mb-3"
                >
                  Entrar com minha conta
                </button>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="w-full border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Send size={15} /> Solicitar Acesso ao Administrador
                </button>
                <p className="text-xs text-slate-500 mt-4 text-center">Área restrita.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen pb-20 md:pb-0">
      <GamificationToast user={user} />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Sidebar Esquerda */}
        <CommunitySidebar
          user={user}
          profile={profile}
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); setViewingProfileId(null); }}
        />

        {/* Área Central */}
        <div className="lg:col-span-6 space-y-4">
          {activeTab === 'feed' && !viewingProfileId && (
            <CommunityFeed user={user} profile={profile} onViewProfile={setViewingProfileId} />
          )}
          {activeTab === 'forum' && !viewingProfileId && (
            <CommunityForum user={user} profile={profile} />
          )}
          {activeTab === 'vagas' && !viewingProfileId && (
            <CommunityJobs user={user} />
          )}
          {activeTab === 'materiais' && !viewingProfileId && (
            <CommunityMaterials user={user} />
          )}
          {activeTab === 'eventos' && !viewingProfileId && (
            <CommunityEvents user={user} />
          )}
          {activeTab === 'chat' && !viewingProfileId && (
            <CommunityChat
              user={user}
              profile={profile}
              initialConversation={chatConversation}
              onClearInitialConversation={() => setChatConversation(null)}
            />
          )}
          {(activeTab === 'perfil' || viewingProfileId) && (
            <CommunityProfile
              userId={viewingProfileId || user.id}
              currentUser={user}
              currentProfile={profile}
              onBack={viewingProfileId ? () => setViewingProfileId(null) : null}
              onProfileUpdate={setProfile}
              onStartChat={(conv) => { setChatConversation(conv); setViewingProfileId(null); setActiveTab('chat'); }}
            />
          )}
          {activeTab === 'notificacoes' && !viewingProfileId && (
            <CommunityNotifications user={user} />
          )}
          {activeTab === 'ranking' && !viewingProfileId && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">🏆 Meu Painel de Gamificação</h2>
                <p className="text-sm text-slate-500 mb-5">Acompanhe sua evolução, pontuação e medalhas conquistadas.</p>
                <UserGamificationDashboard user={user} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Direita */}
        <aside className="lg:col-span-3 space-y-5 hidden lg:block">
          <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-2xl border border-emerald-700 p-5 text-white">
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-emerald-300">Próximos Eventos</h4>
            <RecentEventsMini />
          </div>
          <HallOfFame compact currentUserId={user?.id} onViewProfile={setViewingProfileId} />
          <TopMembersMini onViewProfile={setViewingProfileId} />
        </aside>
      </div>
    </div>
  );
}

function RecentEventsMini() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    base44.entities.CommunityEvent.list('-event_date', 2).then(setEvents);
  }, []);

  if (events.length === 0) return <p className="text-emerald-300 text-sm">Nenhum evento em breve.</p>;
  return (
    <div className="space-y-3">
      {events.map(ev => (
        <div key={ev.id} className="bg-white/10 rounded-lg p-3">
          <p className="text-xs font-bold text-emerald-300">{ev.event_date ? new Date(ev.event_date).toLocaleDateString('pt-BR') : ''}</p>
          <p className="text-sm font-bold text-white">{ev.title}</p>
          <p className="text-xs text-slate-300">{ev.type}</p>
        </div>
      ))}
    </div>
  );
}

function TopMembersMini({ onViewProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const load = async () => {
      const [profs, users] = await Promise.all([
        base44.entities.UserProfile.list('-created_date', 6),
        base44.entities.User.list()
      ]);
      const map = {};
      users.forEach(u => { map[u.id] = u; });
      setUserMap(map);
      setProfiles(profs);
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h4 className="font-bold text-slate-900 mb-4 text-sm">Membros Recentes</h4>
      <div className="space-y-2">
        {profiles.map(p => {
          const u = userMap[p.user_id];
          const name = p.display_name || u?.full_name || p.role_label || 'Membro';
          return (
            <button key={p.id} className="w-full flex items-center gap-3 cursor-pointer group hover:bg-slate-50 rounded-xl p-1.5 transition-colors text-left" onClick={() => onViewProfile(p.user_id)}>
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                {p.avatar_url
                  ? <img src={p.avatar_url} className="w-full h-full object-cover" alt="" />
                  : name?.charAt(0)?.toUpperCase()
                }
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600">{name}</p>
                {p.role_label && <p className="text-xs text-slate-400 truncate">{p.role_label}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}