import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, Edit3, UserPlus, UserMinus, Award, ShieldCheck, Linkedin, Instagram, MessageCircle, Save, X, Plus, Upload, MapPin, Link2, GraduationCap, Briefcase } from 'lucide-react';

export default function CommunityProfile({ userId, currentUser, currentProfile, onBack, onProfileUpdate, onStartChat }) {
  const [profile, setProfile] = useState(null);
  const [viewedUserName, setViewedUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [followLoading, setFollowLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const isOwn = userId === currentUser?.id;
  const isFollowing = (currentProfile?.following || []).includes(userId);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    const profiles = await base44.entities.UserProfile.filter({ user_id: userId });
    if (profiles.length > 0) {
      setProfile(profiles[0]);
      setEditForm(profiles[0]);
    }
    // Carrega o nome do usuário visualizado via lista de usuários
    if (!isOwn) {
      const users = await base44.entities.User.list();
      const found = users.find(u => u.id === userId);
      if (found) setViewedUserName(found.full_name);
    }
    setLoading(false);
  };

  const handleFollowToggle = async () => {
    if (!currentProfile) return;
    setFollowLoading(true);
    const currentFollowing = currentProfile.following || [];
    const targetFollowers = profile.followers || [];

    let newFollowing, newFollowers;
    if (isFollowing) {
      newFollowing = currentFollowing.filter(id => id !== userId);
      newFollowers = targetFollowers.filter(id => id !== currentUser.id);
    } else {
      newFollowing = [...currentFollowing, userId];
      newFollowers = [...targetFollowers, currentUser.id];
    }

    // Atualiza perfil do usuário atual
    await base44.entities.UserProfile.update(currentProfile.id, { following: newFollowing });
    if (onProfileUpdate) onProfileUpdate({ ...currentProfile, following: newFollowing });

    // Atualiza perfil do visualizado
    await base44.entities.UserProfile.update(profile.id, { followers: newFollowers });
    setProfile(prev => ({ ...prev, followers: newFollowers }));
    setFollowLoading(false);
  };

  const handleStartChat = async () => {
    if (!onStartChat) return;
    // Verifica se já existe conversa
    const all = await base44.entities.ChatConversation.list();
    const existing = all.find(c =>
      c.participant_ids?.includes(currentUser.id) && c.participant_ids?.includes(userId)
    );
    if (existing) {
      onStartChat(existing);
      return;
    }
    // Cria nova conversa
    const myIdx = 0;
    const otherIdx = 1;
    const avatars = [currentProfile?.avatar_url || '', profile?.avatar_url || ''];
    const names = [currentUser.full_name, viewedUserName || 'Membro'];
    const conv = await base44.entities.ChatConversation.create({
      participant_ids: [currentUser.id, userId],
      participant_names: names,
      participant_avatars: avatars,
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
      bio: editForm.bio,
      role_label: editForm.role_label,
      role_type: editForm.role_type,
      avatar_url: editForm.avatar_url,
      banner_url: editForm.banner_url,
      linkedin: editForm.linkedin,
      instagram: editForm.instagram,
      whatsapp: editForm.whatsapp,
      website: editForm.website,
      location: editForm.location,
      formation: editForm.formation,
      institution: editForm.institution,
      crea_cau: editForm.crea_cau,
      specialization: editForm.specialization,
      experience_years: editForm.experience_years,
      certifications: editForm.certifications || [],
      skills: editForm.skills || [],
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

  const removeSkill = (idx) => {
    setEditForm(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  };

  if (loading) return <div className="bg-white rounded-2xl h-96 animate-pulse border border-slate-200"></div>;
  if (!profile) return <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">Perfil não encontrado.</div>;

  return (
    <div className="animate-in fade-in space-y-5">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline text-sm">
          <ChevronLeft size={18} /> Voltar ao Feed
        </button>
      )}

      {/* Header do Perfil */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 sm:h-44 bg-slate-900 bg-cover bg-center relative" style={{ backgroundImage: profile.banner_url ? `url(${profile.banner_url})` : undefined }}>
          {!profile.banner_url && <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900"></div>}
        </div>
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md -mt-12 overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl relative z-10">
              {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : currentUser?.full_name?.charAt(0)}
            </div>
            {isOwn ? (
              <button onClick={() => setEditing(!editing)} className="mt-2 flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-sm transition-colors">
                <Edit3 size={15} /> {editing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`flex items-center gap-2 px-5 py-2 font-bold rounded-lg text-sm shadow-sm transition-colors disabled:opacity-50 ${isFollowing ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                  {isFollowing ? <><UserMinus size={15} /> Seguindo</> : <><UserPlus size={15} /> Seguir</>}
                </button>
                {onStartChat && (
                  <button
                    onClick={handleStartChat}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 font-bold rounded-lg text-sm transition-colors"
                  >
                    <MessageCircle size={15} /> Mensagem
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              {isOwn ? currentUser?.full_name : (viewedUserName || 'Membro')}
              {profile.role_label?.toLowerCase().includes('docente') && <ShieldCheck size={20} className="text-indigo-500" title="Verificado" />}
            </h2>
            <p className="text-sm font-bold text-indigo-600 mt-1">{profile.role_label}</p>
            {profile.bio && <p className="text-slate-600 text-sm mt-2 leading-relaxed">{profile.bio}</p>}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-slate-100 text-sm">
            <div className="text-center"><p className="font-extrabold text-slate-900">{(profile.followers || []).length}</p><p className="text-slate-500">Seguidores</p></div>
            <div className="text-center"><p className="font-extrabold text-slate-900">{(profile.following || []).length}</p><p className="text-slate-500">Seguindo</p></div>
          </div>

          {/* Redes Sociais */}
          <div className="flex gap-3 mt-4">
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition-colors"><Linkedin size={16} /></a>}
            {profile.instagram && <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors"><Instagram size={16} /></a>}
            {profile.whatsapp && <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"><MessageCircle size={16} /></a>}
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      {editing && isOwn && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 space-y-5">
          <h3 className="font-bold text-slate-900 text-lg">Editar Perfil</h3>

          {/* Fotos */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Foto de Perfil</label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center shrink-0">
                  {editForm.avatar_url ? <img src={editForm.avatar_url} className="w-full h-full object-cover" alt="" /> : <span className="text-indigo-700 font-bold text-2xl">{currentUser?.full_name?.charAt(0)}</span>}
                </div>
                <label className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm font-bold cursor-pointer hover:bg-indigo-50 ${uploadingAvatar ? 'opacity-50' : ''}`}>
                  <Upload size={15} /> {uploadingAvatar ? 'Enviando...' : 'Fazer Upload'}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Imagem do Banner</label>
              <div className="h-16 rounded-lg overflow-hidden bg-slate-200 relative flex items-center justify-center">
                {editForm.banner_url ? <img src={editForm.banner_url} className="w-full h-full object-cover" alt="" /> : <span className="text-slate-400 text-xs">Sem banner</span>}
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 cursor-pointer transition-opacity rounded-lg">
                  <span className="text-white text-xs font-bold flex items-center gap-1"><Upload size={13} /> Upload</span>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" disabled={uploadingAvatar} />
                </label>
              </div>
            </div>
          </div>

          {/* Identificação */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Identificação</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Perfil</label>
                <select value={editForm.role_type || 'aluno'} onChange={e => setEditForm({ ...editForm, role_type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {[['aluno','Aluno / Estudante'],['engenheiro','Engenheiro Civil'],['arquiteto','Arquiteto'],['docente','Docente / Professor'],['parceiro','Parceiro Comercial'],['gestor_condominial','Gestor Condominial'],['consultor_bim','Consultor BIM'],['perito_judicial','Perito Judicial'],['corretor','Corretor de Imóveis'],['investidor','Investidor']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Título / Cargo</label>
                <input value={editForm.role_label || ''} onChange={e => setEditForm({ ...editForm, role_label: e.target.value })} placeholder="Ex: Engenheiro Sênior" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Bio</label>
                <textarea rows={3} value={editForm.bio || ''} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1"><MapPin size={11} className="inline mr-1" />Cidade / Estado</label>
                <input value={editForm.location || ''} onChange={e => setEditForm({ ...editForm, location: e.target.value })} placeholder="Recife, PE" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1"><Link2 size={11} className="inline mr-1" />Website / Portfólio</label>
                <input value={editForm.website || ''} onChange={e => setEditForm({ ...editForm, website: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
          </div>

          {/* Formação e Experiência */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Formação & Experiência</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1"><GraduationCap size={11} className="inline mr-1" />Formação Acadêmica</label>
                <input value={editForm.formation || ''} onChange={e => setEditForm({ ...editForm, formation: e.target.value })} placeholder="Ex: Engenharia Civil" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Instituição</label>
                <input value={editForm.institution || ''} onChange={e => setEditForm({ ...editForm, institution: e.target.value })} placeholder="Ex: UFPE, ESUDA..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">CREA / CAU</label>
                <input value={editForm.crea_cau || ''} onChange={e => setEditForm({ ...editForm, crea_cau: e.target.value })} placeholder="Ex: CREA-PE 123456" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1"><Briefcase size={11} className="inline mr-1" />Anos de Experiência</label>
                <input type="number" min={0} value={editForm.experience_years || ''} onChange={e => setEditForm({ ...editForm, experience_years: Number(e.target.value) })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Especialização / Pós-graduação</label>
                <input value={editForm.specialization || ''} onChange={e => setEditForm({ ...editForm, specialization: e.target.value })} placeholder="Ex: Gestão de Obras, BIM, Direito Imobiliário..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Redes Sociais</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">LinkedIn</label><input value={editForm.linkedin || ''} onChange={e => setEditForm({ ...editForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Instagram</label><input value={editForm.instagram || ''} onChange={e => setEditForm({ ...editForm, instagram: e.target.value })} placeholder="https://instagram.com/..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">WhatsApp</label><input value={editForm.whatsapp || ''} onChange={e => setEditForm({ ...editForm, whatsapp: e.target.value })} placeholder="5581999..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Habilidades</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(editForm.skills || []).map((skill, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                  {skill}
                  <button onClick={() => removeSkill(idx)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Adicionar habilidade..." className="flex-grow border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <button onClick={addSkill} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><Plus size={16} /></button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditing(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
              <Save size={15} /> {saving ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </div>
        </div>
      )}

      {/* Badges */}
      {(profile.badges || []).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Award className="text-amber-500" size={18} /> Conquistas & Selos</h3>
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                <Award size={16} className="text-amber-500" />
                <span className="text-sm font-bold text-slate-800">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(profile.skills || []).length > 0 && !editing && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="bg-indigo-50 text-indigo-700 text-sm font-bold px-3 py-1.5 rounded-full border border-indigo-100">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}