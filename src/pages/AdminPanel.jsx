import React, { useState } from 'react';
import {
  ShieldCheck, LayoutDashboard, BarChart3, Edit3, Users, FileText, Eye, ThumbsUp, Share2,
  Plus, Bell, CheckCircle2, X, UserPlus, Award, PenTool, ImageIcon, Bold, Italic, Upload, Send,
  LinkIcon
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const initialPosts = [
  { id: 1, title: 'Como planejar um canteiro de obras verdadeiramente eficiente usando IA', views: 1245 },
  { id: 2, title: 'Gestão de manutenção em edifícios públicos: O Case do Palácio', views: 890 },
  { id: 3, title: 'Erros comuns em laudos cautelares e como a tecnologia pode ajudar', views: 1560 },
];

const communityUsers = [
  { id: 'u1', name: 'Emanoel Amorim', roleLabel: 'Docente & Mentor', avatar: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg', followers: 1542 },
  { id: 'u2', name: 'Mariana Silva', roleLabel: 'Aluna ESUDA (Turma 2025)', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', followers: 120 },
  { id: 'u3', name: 'Construtora Alpha', roleLabel: 'Parceiro Comercial', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150', followers: 530 },
];

export default function AdminPanel() {
  const [adminTab, setAdminTab] = useState('dashboard');

  return (
    <div className="bg-slate-100 min-h-screen animate-in fade-in flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShieldCheck size={20} className="text-indigo-500"/> Modo Admin</h2>
          <p className="text-xs text-slate-500 mt-1">Gestão do Ecossistema</p>
        </div>
        <nav className="p-4 flex flex-col gap-2">
          <button onClick={() => setAdminTab('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${adminTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard size={18} /> Visão Geral</button>
          <div className="mt-4 mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gestão do Blog</div>
          <button onClick={() => setAdminTab('blog_analytics')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${adminTab === 'blog_analytics' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><BarChart3 size={18} /> Analítico (Posts)</button>
          <button onClick={() => setAdminTab('blog_editor')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${adminTab === 'blog_editor' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><Edit3 size={18} /> Criar Novo Artigo</button>
          <div className="mt-4 mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acesso Restrito</div>
          <button onClick={() => setAdminTab('community_mgmt')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${adminTab === 'community_mgmt' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><Users size={18} /> Comunidade & Membros</button>
        </nav>
        <div className="p-4 mt-auto">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">← Voltar ao Site</Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-grow p-6 md:p-10">
        {adminTab === 'dashboard' && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Bem-vindo ao Painel de Controle</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center cursor-pointer hover:border-indigo-500" onClick={() => setAdminTab('blog_analytics')}>
                <FileText className="text-indigo-500 mb-2" size={24} />
                <p className="text-slate-500 text-sm font-medium">Artigos Publicados</p>
                <p className="text-3xl font-extrabold text-slate-900">12</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center cursor-pointer hover:border-emerald-500" onClick={() => setAdminTab('community_mgmt')}>
                <Users className="text-emerald-500 mb-2" size={24} />
                <p className="text-slate-500 text-sm font-medium">Membros na Comunidade</p>
                <p className="text-3xl font-extrabold text-slate-900">458</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <Eye className="text-blue-500 mb-2" size={24} />
                <p className="text-slate-500 text-sm font-medium">Visualizações Totais</p>
                <p className="text-3xl font-extrabold text-slate-900">3.695</p>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'community_mgmt' && (
          <div className="animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-b border-slate-200 pb-4">
              <div><h2 className="text-2xl font-bold text-slate-900">Gestão da Comunidade</h2><p className="text-slate-600">Aprovações, Convites e Gerenciamento de Selos</p></div>
              <div className="flex gap-3">
                <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm"><LinkIcon size={16}/> Link Convite</button>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md text-sm"><UserPlus size={16}/> Criar Usuário</button>
              </div>
            </div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell size={18} className="text-amber-500"/> Solicitações de Acesso Pendentes</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">L</div>
                  <div><p className="font-bold text-slate-900">Lucas Mendes</p><p className="text-xs text-slate-500">lucas.mendes@eng.com.br • Aluno ESUDA</p></div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded" title="Rejeitar"><X size={18}/></button>
                  <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded bg-emerald-50" title="Aprovar"><CheckCircle2 size={18}/></button>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-slate-800 mb-4">Membros Ativos ({communityUsers.length})</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm text-slate-600 min-w-[700px]">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200"><tr><th className="px-6 py-4">Usuário</th><th className="px-6 py-4">Tipo (Role)</th><th className="px-6 py-4">Seguidores</th><th className="px-6 py-4 text-center">Ações</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {communityUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt=""/><span className="font-bold text-slate-900">{user.name}</span></div></td>
                      <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">{user.roleLabel}</span></td>
                      <td className="px-6 py-4 font-medium">{user.followers}</td>
                      <td className="px-6 py-4 text-center"><button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center justify-center w-full gap-1"><Award size={14}/> Atribuir Selo</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'blog_analytics' && (
          <div className="animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Desempenho do Blog</h2>
              <button onClick={() => setAdminTab('blog_editor')} className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"><Plus size={18} /> Novo Artigo</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><Eye className="text-blue-500 mb-2" size={24} /><p className="text-slate-500 text-sm font-medium">Visualizações Totais</p><p className="text-3xl font-extrabold text-slate-900">3.695</p></div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><ThumbsUp className="text-emerald-500 mb-2" size={24} /><p className="text-slate-500 text-sm font-medium">Curtidas</p><p className="text-3xl font-extrabold text-slate-900">969</p></div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><Share2 className="text-purple-500 mb-2" size={24} /><p className="text-slate-500 text-sm font-medium">Compartilhamentos</p><p className="text-3xl font-extrabold text-slate-900">254</p></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Artigos Publicados</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200"><tr><th className="px-6 py-4">Título do Post</th><th className="px-6 py-4 text-center">Views</th><th className="px-6 py-4 text-center">Ações</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {initialPosts.map(post => (
                    <tr key={post.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[300px]">{post.title}</td>
                      <td className="px-6 py-4 text-center font-bold">{post.views}</td>
                      <td className="px-6 py-4 text-center"><button className="text-indigo-600 hover:underline text-xs font-bold">Editar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'blog_editor' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in flex flex-col min-h-[800px]">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold"><PenTool className="text-indigo-600" /> Editor Profissional</div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg border border-slate-300">Salvar Rascunho</button>
                <button className="px-6 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md flex items-center gap-2"><Send size={16}/> Publicar</button>
              </div>
            </div>
            <div className="p-6 grid lg:grid-cols-3 gap-8 flex-grow">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <input type="text" placeholder="Título impactante..." className="w-full text-3xl font-extrabold text-slate-900 border-none outline-none bg-transparent" />
                <div className="sticky top-0 z-10 flex flex-wrap gap-1 bg-slate-900 p-2 rounded-xl">
                  <button className="p-2 text-slate-300 hover:text-white rounded"><Bold size={18}/></button>
                  <button className="p-2 text-slate-300 hover:text-white rounded"><Italic size={18}/></button>
                  <div className="w-px h-6 bg-slate-700 mx-1"></div>
                  <button className="p-2 text-slate-300 hover:text-white rounded flex items-center gap-1 text-sm"><ImageIcon size={18}/> Mídia</button>
                </div>
                <textarea placeholder="Escreva o conteúdo técnico..." className="w-full h-full min-h-[400px] text-lg text-slate-700 border-none outline-none resize-none bg-transparent leading-relaxed"></textarea>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Capa</label>
                  <div className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer bg-slate-100/50">
                    <Upload size={24} className="mb-2" /><span className="text-sm font-medium">Upload</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Resumo (SEO)</label>
                  <textarea rows="3" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}