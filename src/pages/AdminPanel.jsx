import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  ShieldCheck, LayoutDashboard, Users, FileText,
  Plus, Bell, CheckCircle2, X, UserPlus, Award, PenTool, Upload, Send,
  Briefcase, Download, Calendar, Trash2, Save, AlertTriangle, LogOut, MessagesSquare, MessageSquare, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminInviteUsers from '../components/admin/AdminInviteUsers';
import AdminForum from '../components/admin/AdminForum';
import MediaUploader from '../components/shared/MediaUploader';

const BLANK_POST = { title: '', content: '', excerpt: '', cover_image: '', media_urls: [], category: 'Gestão 4.0', tags: [], author_name: 'Emanoel Amorim', author_role: 'CEO Amorim Tech', author_avatar: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg', read_time: '5 min', status: 'draft' };

export default function AdminPanel() {
  const [adminTab, setAdminTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(me => { setUser(me); setAuthChecked(true); })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.pathname);
      });
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center shadow-xl max-w-md">
          <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Restrito</h2>
          <p className="text-slate-600 mb-6">Esta área é exclusiva para administradores do sistema.</p>
          <Link to={createPageUrl('Home')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">Voltar ao Início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShieldCheck size={20} className="text-indigo-400" /> Painel Admin</h2>
          <p className="text-xs text-slate-500 mt-1">Gestão do Ecossistema</p>
        </div>
        <nav className="p-3 flex flex-col gap-1 flex-grow overflow-y-auto">
          <NavItem id="dashboard" label="Visão Geral" icon={LayoutDashboard} active={adminTab} onClick={setAdminTab} />
          <div className="mt-3 mb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Blog</div>
          <NavItem id="blog_list" label="Posts Publicados" icon={FileText} active={adminTab} onClick={setAdminTab} />
          <NavItem id="blog_editor" label="Novo Artigo" icon={PenTool} active={adminTab} onClick={setAdminTab} />
          <div className="mt-3 mb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comunidade</div>
          <NavItem id="community_users" label="Membros" icon={Users} active={adminTab} onClick={setAdminTab} />
          <NavItem id="community_forum" label="Fórum" icon={MessagesSquare} active={adminTab} onClick={setAdminTab} />
          <NavItem id="community_jobs" label="Vagas" icon={Briefcase} active={adminTab} onClick={setAdminTab} />
          <NavItem id="community_materials" label="Materiais" icon={Download} active={adminTab} onClick={setAdminTab} />
          <NavItem id="community_events" label="Eventos" icon={Calendar} active={adminTab} onClick={setAdminTab} />
          <NavItem id="notifications_send" label="Enviar Notificação" icon={Bell} active={adminTab} onClick={setAdminTab} />
          <NavItem id="testimonials" label="Depoimentos" icon={MessageSquare} active={adminTab} onClick={setAdminTab} />
          <NavItem id="invite_users" label="Convites e Acessos" icon={UserPlus} active={adminTab} onClick={setAdminTab} />
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-800 w-full">
            ← Voltar ao Site
          </Link>
          <button
            onClick={() => base44.auth.logout('/')}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors px-2 py-1.5 rounded-lg w-full"
          >
            <LogOut size={15} /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-grow p-5 md:p-8 overflow-auto">
        {adminTab === 'dashboard' && <AdminDashboard onNavigate={setAdminTab} />}
        {adminTab === 'blog_list' && <AdminBlogList onEdit={(post) => setAdminTab('blog_editor')} />}
        {adminTab === 'blog_editor' && <AdminBlogEditor onBack={() => setAdminTab('blog_list')} />}
        {adminTab === 'community_forum' && <AdminForum />}
        {adminTab === 'community_users' && <AdminUsers />}
        {adminTab === 'community_jobs' && <AdminJobs />}
        {adminTab === 'community_materials' && <AdminMaterials />}
        {adminTab === 'community_events' && <AdminEvents />}
        {adminTab === 'notifications_send' && <AdminSendNotification />}
        {adminTab === 'testimonials' && <AdminTestimonials />}
        {adminTab === 'invite_users' && <AdminInviteUsers />}
      </div>
    </div>
  );
}

function NavItem({ id, label, icon: Icon, active, onClick }) {
  return (
    <button onClick={() => onClick(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors w-full text-left ${active === id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
      <Icon size={16} /> {label}
    </button>
  );
}

function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({ posts: 0, members: 0, jobs: 0, events: 0, pendingTestimonials: 0 });
  useEffect(() => {
    Promise.all([
      base44.entities.BlogPost.filter({ status: 'published' }),
      base44.entities.UserProfile.list(),
      base44.entities.JobListing.filter({ status: 'active' }),
      base44.entities.CommunityEvent.list(),
      base44.entities.Testimonial.filter({ approved: false }),
    ]).then(([posts, members, jobs, events, pending]) => setStats({ posts: posts.length, members: members.length, jobs: jobs.length, events: events.length, pendingTestimonials: pending.length }));
  }, []);

  return (
    <div className="animate-in fade-in space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Visão Geral</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Artigos Publicados', value: stats.posts, icon: FileText, color: 'indigo', tab: 'blog_list' },
          { label: 'Membros', value: stats.members, icon: Users, color: 'emerald', tab: 'community_users' },
          { label: 'Vagas Ativas', value: stats.jobs, icon: Briefcase, color: 'amber', tab: 'community_jobs' },
          { label: 'Eventos', value: stats.events, icon: Calendar, color: 'purple', tab: 'community_events' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate(s.tab)}>
            <s.icon className={`text-${s.color}-500 mb-2`} size={24} />
            <p className="text-slate-500 text-sm font-medium">{s.label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>
      {stats.pendingTestimonials > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-amber-500 shrink-0" size={24} />
            <div>
              <p className="font-bold text-amber-900">Depoimentos aguardando aprovação</p>
              <p className="text-sm text-amber-700">{stats.pendingTestimonials} depoimento(s) enviado(s) pelos visitantes precisam de revisão.</p>
            </div>
          </div>
          <button onClick={() => onNavigate('testimonials')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap">Revisar</button>
        </div>
      )}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <h3 className="font-bold text-indigo-900 mb-2">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3 mt-3">
          <button onClick={() => onNavigate('blog_editor')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-lg"><Plus size={14} /> Novo Artigo</button>
          <button onClick={() => onNavigate('community_jobs')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-lg"><Plus size={14} /> Nova Vaga</button>
          <button onClick={() => onNavigate('community_events')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-2 rounded-lg"><Plus size={14} /> Novo Evento</button>
          <button onClick={() => onNavigate('notifications_send')} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-lg"><Bell size={14} /> Enviar Aviso</button>
        </div>
      </div>
    </div>
  );
}

function AdminBlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await base44.entities.BlogPost.list('-created_date');
    setPosts(data);
    setLoading(false);
  };

  const toggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await base44.entities.BlogPost.update(post.id, { status: newStatus });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
  };

  const deletePost = async (id) => {
    if (!confirm('Excluir este artigo?')) return;
    await base44.entities.BlogPost.delete(id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  if (editingPost) return <AdminBlogEditor post={editingPost} onBack={() => { setEditingPost(null); loadPosts(); }} />;

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Posts do Blog</h2>
        <button onClick={() => setEditingPost(BLANK_POST)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm"><Plus size={16} /> Novo Artigo</button>
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-slate-200"></div>)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr><th className="px-5 py-3 text-left">Título</th><th className="px-5 py-3 text-center">Views</th><th className="px-5 py-3 text-center">Status</th><th className="px-5 py-3 text-center">Ações</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900 max-w-xs truncate">{post.title}</td>
                  <td className="px-5 py-3 text-center text-slate-600">{post.views || 0}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{post.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setEditingPost(post)} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs">Editar</button>
                      <button onClick={() => toggleStatus(post)} className="text-amber-600 hover:text-amber-800 font-bold text-xs">{post.status === 'published' ? 'Ocultar' : 'Publicar'}</button>
                      <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && <div className="text-center py-12 text-slate-400"><FileText size={36} className="mx-auto mb-2 opacity-30" /><p>Nenhum artigo criado ainda.</p></div>}
        </div>
      )}
    </div>
  );
}

function AdminBlogEditor({ post: initialPost, onBack }) {
  const [form, setForm] = useState(initialPost || BLANK_POST);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const save = async (status) => {
    setSaving(true);
    const data = { ...form, status };
    if (form.id) {
      await base44.entities.BlogPost.update(form.id, data);
    } else {
      await base44.entities.BlogPost.create(data);
    }
    setSaving(false);
    if (onBack) onBack();
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm(f => ({ ...f, tags: [...(f.tags || []), tagInput.trim()] }));
    setTagInput('');
  };

  const removeTag = (idx) => setForm(f => ({ ...f, tags: f.tags.filter((_, i) => i !== idx) }));

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-indigo-600 font-bold hover:underline text-sm flex items-center gap-1">← Voltar</button>
        <div className="flex gap-2">
          <button onClick={() => save('draft')} disabled={saving} className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50">Salvar Rascunho</button>
          <button onClick={() => save('published')} disabled={saving} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"><Send size={14} /> {saving ? 'Salvando...' : 'Publicar'}</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <input type="text" placeholder="Título do artigo..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full text-2xl font-extrabold text-slate-900 border-none outline-none bg-transparent placeholder-slate-300" />
            <input type="text" placeholder="Resumo (aparece nos cards do blog)..." value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full text-slate-600 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <textarea
              placeholder="Escreva o conteúdo do artigo aqui... (use linha em branco para separar parágrafos)"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={16}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm leading-relaxed"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Configurações</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Categoria</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {['Gestão 4.0', 'Manutenção Predial', 'Tecnologia BIM', 'Engenharia Legal', 'Carreira'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">URL da Capa</label>
              <input value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              {form.cover_image && <img src={form.cover_image} className="mt-2 w-full aspect-video object-cover rounded-lg" alt="" />}
            </div>
            <div>
              <MediaUploader
                mediaUrls={form.media_urls || []}
                onChange={urls => setForm({ ...form, media_urls: urls })}
                label="Mídias do artigo (fotos, vídeos, áudios)"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Tempo de Leitura</label>
              <input value={form.read_time} onChange={e => setForm({ ...form, read_time: e.target.value })} placeholder="5 min de leitura" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Tags</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {(form.tags || []).map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">
                    {tag} <button onClick={() => removeTag(idx)} className="hover:text-red-500"><X size={10} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Adicionar tag..." className="flex-grow border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <button onClick={addTag} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"><Plus size={14} /></button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Autor</h3>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Nome</label><input value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Cargo</label><input value={form.author_role} onChange={e => setForm({ ...form, author_role: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">URL do Avatar</label><input value={form.author_avatar} onChange={e => setForm({ ...form, author_avatar: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [badgeInput, setBadgeInput] = useState({});

  useEffect(() => {
    base44.entities.UserProfile.list('-created_date').then(data => { setProfiles(data); setLoading(false); });
  }, []);

  const addBadge = async (profile) => {
    const badge = badgeInput[profile.id]?.trim();
    if (!badge) return;
    const newBadges = [...(profile.badges || []), badge];
    await base44.entities.UserProfile.update(profile.id, { badges: newBadges });
    setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, badges: newBadges } : p));
    setBadgeInput(prev => ({ ...prev, [profile.id]: '' }));
  };

  const removeBadge = async (profile, idx) => {
    const newBadges = profile.badges.filter((_, i) => i !== idx);
    await base44.entities.UserProfile.update(profile.id, { badges: newBadges });
    setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, badges: newBadges } : p));
  };

  return (
    <div className="animate-in fade-in space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Membros da Comunidade</h2>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-slate-200"></div>)}</div>
      ) : (
        <div className="space-y-4">
          {profiles.map(profile => (
            <div key={profile.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                  {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" /> : profile.user_id?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-slate-900">{profile.role_label || 'Membro'}</p>
                  <p className="text-xs text-slate-500 mb-3">ID: {profile.user_id}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(profile.badges || []).map((badge, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                        <Award size={11} />{badge}
                        <button onClick={() => removeBadge(profile, idx)} className="ml-1 hover:text-red-500"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={badgeInput[profile.id] || ''}
                      onChange={e => setBadgeInput(prev => ({ ...prev, [profile.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addBadge(profile)}
                      placeholder="Adicionar selo..."
                      className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 w-40"
                    />
                    <button onClick={() => addBadge(profile)} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold"><Award size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {profiles.length === 0 && <div className="text-center py-12 text-slate-400"><Users size={36} className="mx-auto mb-2 opacity-30" /><p>Nenhum membro registrado.</p></div>}
        </div>
      )}
    </div>
  );
}

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', type: 'CLT', location: '', description: '', requirements: '', contact_link: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    setLoading(true);
    base44.entities.JobListing.list('-created_date').then(data => { setJobs(data); setLoading(false); });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.JobListing.create({ ...form, status: 'active' });
    setForm({ title: '', company: '', type: 'CLT', location: '', description: '', requirements: '', contact_link: '' });
    setShowForm(false);
    await loadJobs();
    setSaving(false);
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    await base44.entities.JobListing.update(job.id, { status: newStatus });
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
  };

  const deleteJob = async (id) => {
    if (!confirm('Excluir esta vaga?')) return;
    await base44.entities.JobListing.delete(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciar Vagas</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm">
          <Plus size={16} /> Nova Vaga
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4">Nova Vaga</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Título *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Empresa *</label><input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Tipo</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {['CLT', 'PJ', 'Freelance', 'Estágio', 'Remoto'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Local *</label><input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Requisitos</label><textarea rows={2} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Link / Contato</label><input value={form.contact_link} onChange={e => setForm({ ...form, contact_link: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"><Save size={14} />{saving ? 'Salvando...' : 'Publicar Vaga'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="h-32 bg-white rounded-xl animate-pulse border border-slate-200"></div> : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold"><tr><th className="px-5 py-3 text-left">Vaga</th><th className="px-5 py-3 text-center">Status</th><th className="px-5 py-3 text-center">Ações</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3"><p className="font-medium text-slate-900">{job.title}</p><p className="text-xs text-slate-500">{job.company} • {job.type}</p></td>
                  <td className="px-5 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{job.status === 'active' ? 'Ativa' : 'Encerrada'}</span></td>
                  <td className="px-5 py-3 text-center"><div className="flex items-center justify-center gap-2"><button onClick={() => toggleStatus(job)} className="text-amber-600 hover:text-amber-800 font-bold text-xs">{job.status === 'active' ? 'Encerrar' : 'Reativar'}</button><button onClick={() => deleteJob(job.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && <div className="text-center py-10 text-slate-400"><Briefcase size={32} className="mx-auto mb-2 opacity-30" /><p>Nenhuma vaga cadastrada.</p></div>}
        </div>
      )}
    </div>
  );
}

function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Planilhas', file_url: '', media_urls: [] });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadMaterials(); }, []);

  const loadMaterials = async () => {
    setLoading(true);
    base44.entities.Material.list('-created_date').then(data => { setMaterials(data); setLoading(false); });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, file_url }));
    setUploading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Material.create({ ...form, downloads: 0 });
    setForm({ title: '', description: '', category: 'Planilhas', file_url: '', media_urls: [] });
    setShowForm(false);
    await loadMaterials();
    setSaving(false);
  };

  const deleteMaterial = async (id) => {
    if (!confirm('Excluir este material?')) return;
    await base44.entities.Material.delete(id);
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciar Materiais</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm">
          <Plus size={16} /> Novo Material
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4">Novo Material</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Título *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Categoria</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {['Planilhas', 'Normas ABNT', 'E-books', 'Apresentações', 'Modelos de Laudo', 'Outros'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Arquivo *</label>
              <div className="flex items-center gap-3">
                <label className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm font-bold cursor-pointer hover:bg-indigo-50 ${uploading ? 'opacity-50' : ''}`}>
                  <Upload size={15} /> {uploading ? 'Enviando...' : 'Fazer Upload do Arquivo'}
                  <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>
                {form.file_url && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={13} /> Arquivo enviado!</span>}
              </div>
              <input value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} placeholder="Ou cole a URL do arquivo..." className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <MediaUploader
              mediaUrls={form.media_urls || []}
              onChange={urls => setForm({ ...form, media_urls: urls })}
              label="Mídias de pré-visualização (foto, vídeo ou áudio)"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving || uploading || !form.file_url} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"><Save size={14} />{saving ? 'Salvando...' : 'Publicar Material'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="h-32 bg-white rounded-xl animate-pulse border border-slate-200"></div> : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold"><tr><th className="px-5 py-3 text-left">Material</th><th className="px-5 py-3 text-center">Downloads</th><th className="px-5 py-3 text-center">Excluir</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3"><p className="font-medium text-slate-900">{m.title}</p><p className="text-xs text-slate-500">{m.category}</p></td>
                  <td className="px-5 py-3 text-center font-bold text-slate-700">{m.downloads || 0}</td>
                  <td className="px-5 py-3 text-center"><button onClick={() => deleteMaterial(m.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {materials.length === 0 && <div className="text-center py-10 text-slate-400"><Download size={32} className="mx-auto mb-2 opacity-30" /><p>Nenhum material cadastrado.</p></div>}
        </div>
      )}
    </div>
  );
}

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', type: 'Webinar', link: '', image_url: '', max_participants: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    setLoading(true);
    base44.entities.CommunityEvent.list('-event_date').then(data => { setEvents(data); setLoading(false); });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.CommunityEvent.create({ ...form, registrations: [], max_participants: form.max_participants ? Number(form.max_participants) : undefined });
    setForm({ title: '', description: '', event_date: '', location: '', type: 'Webinar', link: '', image_url: '', max_participants: '' });
    setShowForm(false);
    await loadEvents();
    setSaving(false);
  };

  const deleteEvent = async (id) => {
    if (!confirm('Excluir este evento?')) return;
    await base44.entities.CommunityEvent.delete(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciar Eventos</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm">
          <Plus size={16} /> Novo Evento
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4">Novo Evento</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Título *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Tipo</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {['Webinar', 'Visita Técnica', 'Masterclass', 'Workshop', 'Evento Presencial'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Data e Hora *</label><input required type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Local / Plataforma</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ex: Zoom, Google Meet, Recife-PE" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Link de Acesso</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Vagas (opcional)</label><input type="number" min={1} value={form.max_participants} onChange={e => setForm({ ...form, max_participants: e.target.value })} placeholder="Ex: 50" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">URL da Imagem de Capa (opcional)</label><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"><Save size={14} />{saving ? 'Salvando...' : 'Criar Evento'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold"><tr><th className="px-5 py-3 text-left">Evento</th><th className="px-5 py-3 text-center">Data</th><th className="px-5 py-3 text-center">Inscritos</th><th className="px-5 py-3 text-center">Ações</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {events.map(ev => (
              <tr key={ev.id} className="hover:bg-slate-50">
                <td className="px-5 py-3"><p className="font-medium text-slate-900">{ev.title}</p><p className="text-xs text-slate-500">{ev.type}</p></td>
                <td className="px-5 py-3 text-center text-xs text-slate-600">{ev.event_date ? format(new Date(ev.event_date), 'dd/MM/yy HH:mm', { locale: ptBR }) : '-'}</td>
                <td className="px-5 py-3 text-center font-bold">{(ev.registrations || []).length}</td>
                <td className="px-5 py-3 text-center"><button onClick={() => deleteEvent(ev.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div className="text-center py-10 text-slate-400"><Calendar size={32} className="mx-auto mb-2 opacity-30" /><p>Nenhum evento cadastrado.</p></div>}
      </div>
    </div>
  );
}

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { loadTestimonials(); }, [filter]);

  const loadTestimonials = async () => {
    setLoading(true);
    const data = filter === 'pending'
      ? await base44.entities.Testimonial.filter({ approved: false })
      : await base44.entities.Testimonial.filter({ approved: true });
    setTestimonials(data);
    setLoading(false);
  };

  const approve = async (id) => {
    await base44.entities.Testimonial.update(id, { approved: true });
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const reject = async (id) => {
    if (!confirm('Excluir este depoimento?')) return;
    await base44.entities.Testimonial.delete(id);
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Depoimentos</h2>
        <div className="flex gap-2">
          <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg font-bold text-sm ${filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-white border border-slate-300 text-slate-600'}`}>Pendentes</button>
          <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded-lg font-bold text-sm ${filter === 'approved' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-600'}`}>Aprovados</button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-slate-200"></div>)}</div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-400">
          <MessageSquare size={36} className="mx-auto mb-2 opacity-30" />
          <p>{filter === 'pending' ? 'Nenhum depoimento pendente.' : 'Nenhum depoimento aprovado.'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {t.author_photo && (
                <div className="aspect-square overflow-hidden">
                  <img src={t.author_photo} alt={t.author_name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 flex flex-col gap-2 flex-grow">
                <p className="font-bold text-slate-900">{t.author_name}</p>
                {t.author_email && <p className="text-xs text-slate-500">{t.author_email}</p>}
                {t.author_phone && <p className="text-xs text-slate-500">{t.author_phone}</p>}
                <p className="text-sm text-slate-600 line-clamp-3 flex-grow">{t.text}</p>
                {filter === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => approve(t.id)} className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm">
                      <ThumbsUp size={14} /> Aprovar
                    </button>
                    <button onClick={() => reject(t.id)} className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-sm">
                      <ThumbsDown size={14} /> Rejeitar
                    </button>
                  </div>
                )}
                {filter === 'approved' && (
                  <button onClick={() => reject(t.id)} className="mt-2 flex items-center justify-center gap-1 border border-red-300 text-red-500 hover:bg-red-50 font-bold py-2 rounded-lg text-sm">
                    <Trash2 size={14} /> Remover
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminSendNotification() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ target: 'all', user_id: '', type: 'admin', title: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    base44.entities.UserProfile.list().then(setProfiles);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    const targets = form.target === 'all' ? profiles.map(p => p.user_id) : [form.user_id];
    await Promise.all(targets.map(uid => base44.entities.Notification.create({
      user_id: uid,
      type: form.type,
      title: form.title,
      message: form.message,
      read: false
    })));
    setSent(true);
    setSending(false);
    setForm({ target: 'all', user_id: '', type: 'admin', title: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="animate-in fade-in space-y-5 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900">Enviar Notificação</h2>
      {sent && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl font-bold flex items-center gap-2"><CheckCircle2 size={18} /> Notificação enviada com sucesso!</div>}
      <form onSubmit={handleSend} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Destinatário</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer"><input type="radio" value="all" checked={form.target === 'all'} onChange={() => setForm({ ...form, target: 'all' })} /> Todos os Membros</label>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer"><input type="radio" value="single" checked={form.target === 'single'} onChange={() => setForm({ ...form, target: 'single' })} /> Membro Específico</label>
          </div>
          {form.target === 'single' && (
            <select value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })} required className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">Selecionar membro...</option>
              {profiles.map(p => <option key={p.id} value={p.user_id}>{p.role_label || p.user_id}</option>)}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Tipo</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {['admin', 'event', 'job', 'material', 'mention'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Título *</label>
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Mensagem *</label>
          <textarea required rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
        </div>
        <button type="submit" disabled={sending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
          <Bell size={16} /> {sending ? 'Enviando...' : 'Enviar Notificação'}
        </button>
      </form>
    </div>
  );
}