import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  ChevronLeft, Edit3, UserPlus, UserMinus, Award, ShieldCheck,
  Linkedin, Instagram, MessageCircle, Save, X, Plus, Upload,
  MapPin, Link2, GraduationCap, Briefcase, Star, Trophy, Zap,
  FileText, Users, TrendingUp
} from 'lucide-react';
import FollowersModal from './FollowersModal';

const roleEmojis = {
  aluno: '🎓', engenheiro: '⚙️', arquiteto: '🏛️', docente: '👨‍🏫',
  parceiro: '🤝', gestor_condominial: '🏢', consultor_bim: '💻',
  perito_judicial: '⚖️', corretor: '🏠', investidor: '📈', admin: '🛡️'
};

const badgeColors = [
  'bg-amber-50 border-amber-200 text-amber-700',
  'bg-indigo-50 border-indigo-200 text-indigo-700',
  'bg-emerald-50 border-emerald-200 text-emerald-700',
  'bg-purple-50 border-purple-200 text-purple-700',
  'bg-rose-50 border-rose-200 text-rose-700',
];

export default function CommunityProfile({ userId, currentUser, currentProfile, onBack, onProfileUpdate, onStartChat, onViewProfile }) {
  const [profile, setProfile] = useState(null);
  const [viewedUserName, setViewedUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [followLoading, setFollowLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [memberPosts, setMemberPosts] = useState([]);
  const [followersModal, setFollowersModal] = useState(null); // 'followers' | 'following' | null

  const isOwn = userId === currentUser?.id;
  const isFollowing = (currentProfile?.following || []).includes(userId);

  useEffect(() => { loadProfile(); }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    const [profiles, posts] = await Promise.all([
      base44.entities.UserProfile.filter({ user_id: userId }),
      base44.entities.CommunityPost.filter({ author_id: userId, status: 'active' }),
    ]);
    if (profiles.length > 0) {
      const p = profiles[0];
      setProfile(p);
      setEditForm(p);
      // Nome do usuário: usa display_name do perfil (acessível por todos), sem precisar listar User
      if (!isOwn && !viewedUserName) {
        setViewedUserName(p.display_name || p.role_label || 'Membro');
      }
    }
    setPostCount(posts.length);
    setMemberPosts(posts.filter(p => !p.is_forum).sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    setLoading(false);
  };

  const handleFollowToggle = async () => {
    if (!currentProfile) return;
    setFollowLoading(true);
    const willFollow = !isFollowing;
    const res = await base44.functions.invoke('toggleFollow', {
      myProfileId: currentProfile.id,
      targetProfileId: profile.id,
      action: willFollow ? 'follow' : 'unfollow',
    });
    if (onProfileUpdate) onProfileUpdate({ ...currentProfile, following: res.data.following });
    setProfile(prev => ({ ...prev, followers: res.data.followers }));
    setFollowLoading(false);
  };

  const handleStartChat = async () => {
    if (!onStartChat) return;
    const all = await base44.entities.ChatConversation.list();
    const existing = all.find(c => c.participant_ids?.includes(currentUser.id) && c.participant_ids?.includes(userId));
    if (existing) { onStartChat(existing); return; }
    const conv = await base44.entities.ChatConversation.create({
      participant_ids: [currentUser.id, userId],
      participant_names: [currentUser.full_name, viewedUserName || 'Membro'],
      participant_avatars: [currentProfile?.avatar_url || '', profile?.avatar_url || ''],
      unread_by: []
    });
    onStartChat(conv);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setEditForm(prev => ({ ...prev, avatar_url: file_url }));
    setUploadingAvatar(false);
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setEditForm(prev => ({ ...prev, banner_url: file_url }));
    setUploadingAvatar(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = await base44.entities.UserProfile.update(profile.id, {
      bio: editForm.bio, role_label: editForm.role_label, role_type: editForm.role_type,
      avatar_url: editForm.avatar_url, banner_url: editForm.banner_url,
      linkedin: editForm.linkedin, instagram: editForm.instagram, whatsapp: editForm.whatsapp,
      website: editForm.website, location: editForm.location, formation: editForm.formation,
      institution: editForm.institution, crea_cau: editForm.crea_cau,
      specialization: editForm.specialization, experience_years: editForm.experience_years,
      certifications: editForm.certifications || [], skills: editForm.skills || [],
    });
    setProfile(updated);
    if (onProfileUpdate) onProfileUpdate(updated);
    setEditing(false);
    setSaving(false);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setEditForm(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill.trim()] }));
    setNewSkill('');
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 h-64 animate-pulse"></div>
      <div className="bg-white rounded-2xl border border-slate-200 h-32 animate-pulse"></div>
    </div>
  );
  if (!profile) return <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">Perfil não encontrado.</div>;

  const displayName = profile?.display_name || (isOwn ? currentUser?.full_name : (profile?.role_label || 'Membro da Comunidade'));
  const roleEmoji = roleEmojis[profile.role_type] || '👤';

  return (
    <div className="animate-in fade-in space-y-4">
      {followersModal && (
        <FollowersModal
          title={followersModal === 'followers' ? `Seguidores (${(profile.followers || []).length})` : `Seguindo (${(profile.following || []).length})`}
          userIds={followersModal === 'followers' ? (profile.followers || []) : (profile.following || [])}
          onClose={() => setFollowersModal(null)}
          onViewProfile={(uid) => { setFollowersModal(null); if (onViewProfile) onViewProfile(uid); }}
        />
      )}
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline text-sm">
          <ChevronLeft size={16} /> Voltar ao Feed
        </button>
      )}

      {/* Card Principal do Perfil */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-36 sm:h-48 relative overflow-hidden">
          {profile.banner_url
            ? <img src={profile.banner_url} className="w-full h-full object-cover" alt="" />
            : <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800"></div>
          }
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-14 mb-4">
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl">
                {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : displayName?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-lg shadow-sm border border-slate-100">
                {roleEmoji}
              </div>
            </div>

            {isOwn ? (
              <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-sm transition-colors shadow-sm">
                <Edit3 size={14} /> {editing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleFollowToggle} disabled={followLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl text-sm shadow-sm transition-all disabled:opacity-50 ${isFollowing ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                  {isFollowing ? <><UserMinus size={14} /> Seguindo</> : <><UserPlus size={14} /> Seguir</>}
                </button>
                {onStartChat && (
                  <button onClick={handleStartChat} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 font-bold rounded-xl text-sm transition-colors">
                    <MessageCircle size={14} /> Mensagem
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
              {displayName}
              {profile.role_label?.toLowerCase().includes('docente') && <ShieldCheck size={18} className="text-indigo-500" />}
            </h2>
            <p className="text-sm font-bold text-indigo-600 mt-0.5">{profile.role_label}</p>
            {profile.bio && <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-prose">{profile.bio}</p>}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
            <button onClick={() => setFollowersModal('followers')} className="bg-slate-50 hover:bg-indigo-50 rounded-xl p-3 text-center transition-colors group">
              <Users size={16} className="text-indigo-600 mx-auto mb-1" />
              <p className="font-extrabold text-slate-900 text-lg leading-none">{(profile.followers || []).length}</p>
              <p className="text-xs text-slate-500 mt-0.5 group-hover:text-indigo-600">Seguidores</p>
            </button>
            <button onClick={() => setFollowersModal('following')} className="bg-slate-50 hover:bg-emerald-50 rounded-xl p-3 text-center transition-colors group">
              <TrendingUp size={16} className="text-emerald-600 mx-auto mb-1" />
              <p className="font-extrabold text-slate-900 text-lg leading-none">{(profile.following || []).length}</p>
              <p className="text-xs text-slate-500 mt-0.5 group-hover:text-emerald-600">Seguindo</p>
            </button>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <FileText size={16} className="text-amber-600 mx-auto mb-1" />
              <p className="font-extrabold text-slate-900 text-lg leading-none">{postCount}</p>
              <p className="text-xs text-slate-500 mt-0.5">Posts</p>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-slate-500">
            {profile.location && <span className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-400" />{profile.location}</span>}
            {profile.formation && <span className="flex items-center gap-1.5"><GraduationCap size={12} className="text-blue-400" />{profile.formation}{profile.institution ? ` — ${profile.institution}` : ''}</span>}
            {profile.crea_cau && <span className="flex items-center gap-1.5 font-mono bg-slate-100 px-2 py-0.5 rounded-md font-bold">{profile.crea_cau}</span>}
            {profile.experience_years > 0 && <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-amber-400" />{profile.experience_years} anos de experiência</span>}
            {profile.specialization && <span className="flex items-center gap-1.5"><Star size={12} className="text-purple-400" />{profile.specialization}</span>}
            {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:underline"><Link2 size={12} />Portfólio</a>}
          </div>

          {/* Redes */}
          <div className="flex gap-2 mt-4">
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"><Linkedin size={13} /> LinkedIn</a>}
            {profile.instagram && <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-pink-50 text-pink-600 hover:bg-pink-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"><Instagram size={13} /> Instagram</a>}
            {profile.whatsapp && <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"><MessageCircle size={13} /> WhatsApp</a>}
          </div>
        </div>
      </div>

      {/* Badges / Conquistas */}
      {(profile.badges || []).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2 text-sm"><Trophy size={16} className="text-amber-500" /> Conquistas & Selos</h3>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge, idx) => (
              <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${badgeColors[idx % badgeColors.length]}`}>
                <Award size={13} /> {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(profile.skills || []).length > 0 && !editing && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2 text-sm"><Zap size={15} className="text-indigo-500" /> Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Posts do Membro */}
      {!editing && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2 text-sm">
            <FileText size={15} className="text-indigo-500" /> Postagens de {displayName}
          </h3>
          {memberPosts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">{isOwn ? 'Você ainda não fez nenhuma postagem.' : `${displayName} ainda não fez nenhuma postagem.`}</p>
          ) : (
            <div className="space-y-4">
              {memberPosts.map(post => (
                <div key={post.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  {post.image_url && <img src={post.image_url} className="mt-3 rounded-lg object-cover max-h-48 w-full" alt="" />}
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <span>👍 {post.likes || 0}</span>
                    <span>💬 {post.comments_count || 0}</span>
                    <span className="ml-auto">{post.created_date ? new Date(post.created_date).toLocaleDateString('pt-BR') : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Formulário de Edição */}
      {editing && isOwn && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 space-y-6">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><Edit3 size={18} className="text-indigo-500" /> Editar Perfil</h3>

          {/* Fotos */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Foto de Perfil</label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-indigo-100 flex items-center justify-center shrink-0 border border-slate-200">
                  {editForm.avatar_url ? <img src={editForm.avatar_url} className="w-full h-full object-cover" alt="" /> : <span className="text-indigo-700 font-bold text-2xl">{currentUser?.full_name?.charAt(0)}</span>}
                </div>
                <label className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl text-sm font-bold cursor-pointer hover:bg-indigo-50 transition-colors ${uploadingAvatar ? 'opacity-50' : ''}`}>
                  <Upload size={14} /> {uploadingAvatar ? 'Enviando...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Banner do Perfil</label>
              <div className="h-16 rounded-xl overflow-hidden bg-slate-200 relative border border-slate-200">
                {editForm.banner_url ? <img src={editForm.banner_url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900"></div>}
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 cursor-pointer transition-opacity rounded-xl">
                  <span className="text-white text-xs font-bold flex items-center gap-1"><Upload size={12} /> Trocar banner</span>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" disabled={uploadingAvatar} />
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Identificação</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Perfil</label>
                <select value={editForm.role_type || 'aluno'} onChange={e => setEditForm({ ...editForm, role_type: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {[['aluno','🎓 Aluno / Estudante'],['engenheiro','⚙️ Engenheiro Civil'],['arquiteto','🏛️ Arquiteto'],['docente','👨‍🏫 Docente / Professor'],['parceiro','🤝 Parceiro Comercial'],['gestor_condominial','🏢 Gestor Condominial'],['consultor_bim','💻 Consultor BIM'],['perito_judicial','⚖️ Perito Judicial'],['corretor','🏠 Corretor de Imóveis'],['investidor','📈 Investidor']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Título / Cargo</label><input value={editForm.role_label || ''} onChange={e => setEditForm({ ...editForm, role_label: e.target.value })} placeholder="Ex: Engenheiro Sênior" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div className="sm:col-span-2"><label className="block text-xs font-bold text-slate-600 mb-1">Bio</label><textarea rows={3} value={editForm.bio || ''} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">📍 Cidade / Estado</label><input value={editForm.location || ''} onChange={e => setEditForm({ ...editForm, location: e.target.value })} placeholder="Recife, PE" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">🌐 Website / Portfólio</label><input value={editForm.website || ''} onChange={e => setEditForm({ ...editForm, website: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Formação & Experiência</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Formação Acadêmica</label><input value={editForm.formation || ''} onChange={e => setEditForm({ ...editForm, formation: e.target.value })} placeholder="Ex: Engenharia Civil" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Instituição</label><input value={editForm.institution || ''} onChange={e => setEditForm({ ...editForm, institution: e.target.value })} placeholder="Ex: UFPE, ESUDA..." className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">CREA / CAU</label><input value={editForm.crea_cau || ''} onChange={e => setEditForm({ ...editForm, crea_cau: e.target.value })} placeholder="Ex: CREA-PE 123456" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Anos de Experiência</label><input type="number" min={0} value={editForm.experience_years || ''} onChange={e => setEditForm({ ...editForm, experience_years: Number(e.target.value) })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div className="sm:col-span-2"><label className="block text-xs font-bold text-slate-600 mb-1">Especialização / Pós-graduação</label><input value={editForm.specialization || ''} onChange={e => setEditForm({ ...editForm, specialization: e.target.value })} placeholder="Ex: Gestão de Obras, BIM..." className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Redes Sociais</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">LinkedIn</label><input value={editForm.linkedin || ''} onChange={e => setEditForm({ ...editForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Instagram</label><input value={editForm.instagram || ''} onChange={e => setEditForm({ ...editForm, instagram: e.target.value })} placeholder="https://instagram.com/..." className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">WhatsApp</label><input value={editForm.whatsapp || ''} onChange={e => setEditForm({ ...editForm, whatsapp: e.target.value })} placeholder="5581999..." className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Habilidades</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {(editForm.skills || []).map((skill, idx) => (
                <span key={idx} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">
                  {skill} <button onClick={() => setEditForm(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="ml-0.5 hover:text-red-500 transition-colors"><X size={11} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Nova habilidade (Enter para adicionar)..." className="flex-grow border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <button onClick={addSkill} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"><Plus size={16} /></button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={() => setEditing(false)} className="px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl text-sm transition-colors">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 transition-colors">
              <Save size={14} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}