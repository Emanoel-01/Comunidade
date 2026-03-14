import React from 'react';
import { LayoutDashboard, Briefcase, Download, Calendar, UserCircle, Bell, LogOut, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const tabs = [
  { id: 'feed', TabIcon: LayoutDashboard, label: 'Fórum e Feed' },
  { id: 'vagas', TabIcon: Briefcase, label: 'Vagas e Contratos' },
  { id: 'materiais', TabIcon: Download, label: 'Materiais Exclusivos' },
  { id: 'eventos', TabIcon: Calendar, label: 'Calendário de Eventos' },
  { id: 'chat', TabIcon: MessageSquare, label: 'Mensagens' },
  { id: 'notificacoes', TabIcon: Bell, label: 'Notificações' },
  { id: 'perfil', TabIcon: UserCircle, label: 'Meu Perfil' },
];

export default function CommunitySidebar({ user, profile, activeTab, onTabChange }) {
  return (
    <aside className="lg:col-span-3 space-y-5 hidden md:block">
      {/* Card Usuário */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div
          className="h-16 bg-slate-900 bg-cover bg-center"
          style={{ backgroundImage: profile?.banner_url ? `url(${profile.banner_url})` : undefined }}
        ></div>
        <div className="px-4 pb-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm mx-auto -mt-8 mb-2 overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.full_name?.charAt(0) || '?'
            )}
          </div>
          <h3 className="font-bold text-slate-900 text-sm leading-tight">{user?.full_name}</h3>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">{profile?.role_label || user?.role}</p>
          <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="text-center"><p className="font-bold text-slate-800">{profile?.followers?.length || 0}</p><p>Seguidores</p></div>
            <div className="text-center"><p className="font-bold text-slate-800">{profile?.following?.length || 0}</p><p>Seguindo</p></div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
        {tabs.map(({ id, TabIcon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${activeTab === id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TabIcon size={18} /> {label}
          </button>
        ))}
        <div className="border-t border-slate-100 mt-2 pt-2">
          <button
            onClick={() => base44.auth.logout('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium text-sm transition-colors"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>
    </aside>
  );
}