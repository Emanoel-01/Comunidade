import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Award, X, Trash2, Save, ChevronDown, ChevronUp, Shield, Clock, Star, Infinity, BookOpen, MessageSquare, Pencil, GraduationCap, Info } from 'lucide-react';

const BADGE_LEGEND = [
  {
    category: 'Consumo de Conhecimento',
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badges: [
      { name: 'Explorador do Saber', desc: 'Acessa muitos artigos e materiais' },
      { name: 'Leitor Assíduo', desc: 'Interage com vários posts do blog' },
      { name: 'Aspirante a Mestre', desc: 'Consome conteúdo técnico avançado' },
      { name: 'Download Master', desc: 'Baixa materiais e planilhas úteis' },
    ]
  },
  {
    category: 'Interação Comunitária',
    icon: MessageSquare,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badges: [
      { name: 'Voz Ativa', desc: 'Faz muitos comentários e perguntas' },
      { name: 'Conector da Comunidade', desc: 'Curte, compartilha e engaja bastante' },
      { name: 'Participante Engajado', desc: 'Participa de eventos e discussões' },
      { name: 'Bem-Vindo à ESUDA', desc: 'Selo de boas-vindas para novos membros' },
    ]
  },
  {
    category: 'Produção de Conteúdo',
    icon: Pencil,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    badges: [
      { name: 'Criador de Ideias', desc: 'Inicia novos tópicos no fórum' },
      { name: 'Colaborador Inspirador', desc: 'Posta conteúdo relevante na comunidade' },
      { name: 'Compartilhador de Valor', desc: 'Compartilha materiais e links úteis' },
    ]
  },
  {
    category: 'Evolução Profissional',
    icon: GraduationCap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badges: [
      { name: 'Jornada de Aprendizagem', desc: 'Conclui módulos ou cursos' },
      { name: 'Especialista BIM', desc: 'Expertise comprovada em BIM' },
      { name: 'Especialista Gestão 4.0', desc: 'Expertise em Gestão 4.0' },
      { name: 'Mentor ESUDA', desc: 'Ajuda outros membros com dúvidas' },
      { name: 'Pioneiro ESUDA', desc: 'Membro fundador ou de longa data' },
      { name: 'Presença Constante', desc: 'Acessa a plataforma regularmente' },
      { name: 'Fiel à Comunidade', desc: 'Longo tempo de permanência ativo' },
    ]
  },
];

function BadgeLegendPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
          <Info size={15} className="text-indigo-500" />
          Legenda de Selos Predefinidos
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && (
        <div className="border-t border-slate-100 p-4 grid sm:grid-cols-2 gap-4">
          {BADGE_LEGEND.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.category} className={`rounded-lg border ${cat.border} ${cat.bg} p-3`}>
                <div className={`flex items-center gap-2 font-bold text-xs mb-2 ${cat.color}`}>
                  <Icon size={13} /> {cat.category}
                </div>
                <div className="space-y-1.5">
                  {cat.badges.map(b => (
                    <div key={b.name} className="flex items-start gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-white border border-amber-200 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        <Award size={9} />{b.name}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">{b.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const LICENSE_OPTIONS = [
  { value: 'teste', label: 'Teste', color: 'bg-slate-100 text-slate-600', icon: Clock },
  { value: 'estudantil', label: 'Estudantil', color: 'bg-blue-100 text-blue-700', icon: Star },
  { value: 'pleno', label: 'Pleno', color: 'bg-indigo-100 text-indigo-700', icon: Shield },
  { value: 'vitalicio', label: 'Vitalício', color: 'bg-amber-100 text-amber-700', icon: Infinity },
];

function LicenseBadge({ type }) {
  const opt = LICENSE_OPTIONS.find(o => o.value === type) || LICENSE_OPTIONS[0];
  const Icon = opt.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${opt.color}`}>
      <Icon size={10} /> {opt.label}
    </span>
  );
}

function isLicenseExpired(profile) {
  if (profile.license_type === 'vitalicio') return false;
  if (!profile.license_end_date) return false;
  return new Date(profile.license_end_date) < new Date();
}

export default function AdminMembers() {
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [badgeInput, setBadgeInput] = useState({});
  const [search, setSearch] = useState('');
  const [filterLicense, setFilterLicense] = useState('all');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const [profileData, userData] = await Promise.all([
      base44.entities.UserProfile.list('-created_date'),
      base44.entities.User.list()
    ]);
    const userMap = {};
    userData.forEach(u => {
      userMap[u.id] = u;
      if (u.email) userMap[u.email] = u; // mapeia também por email para perfis pré-login
    });
    setUsers(userMap);
    setProfiles(profileData);
    setLoading(false);
  };

  const startEdit = (profile) => {
    const u = users[profile.user_id];
    setEditingId(profile.id);
    setEditForm({
      display_name: profile.display_name || '',
      license_type: profile.license_type || 'teste',
      license_start_date: profile.license_start_date || '',
      license_end_date: profile.license_end_date || '',
      role_label: profile.role_label || '',
      role_type: profile.role_type || 'aluno',
      user_role: u?.role || 'user',
    });
  };

  const saveEdit = async (profile) => {
    setSaving(true);
    const { user_role, ...profileUpdates } = editForm;
    // Se display_name vazio, usa o full_name do usuário como fallback automático
    if (!profileUpdates.display_name?.trim()) {
      const u = users[profile.user_id];
      profileUpdates.display_name = u?.full_name || '';
    }
    if (profileUpdates.license_type === 'vitalicio') {
      profileUpdates.license_end_date = '';
    }
    const promises = [base44.entities.UserProfile.update(profile.id, profileUpdates)];
    const u = users[profile.user_id];
    if (u && user_role !== u.role) {
      promises.push(base44.entities.User.update(u.id, { role: user_role }));
    }
    await Promise.all(promises);
    setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, ...profileUpdates } : p));
    if (u && user_role !== u.role) {
      setUsers(prev => ({ ...prev, [u.id]: { ...u, role: user_role } }));
    }
    setEditingId(null);
    setSaving(false);
  };

  const deleteProfile = async (profile) => {
    if (!confirm(`Excluir o membro "${getDisplayName(profile)}"? Esta ação não pode ser desfeita.`)) return;
    await base44.entities.UserProfile.delete(profile.id);
    setProfiles(prev => prev.filter(p => p.id !== profile.id));
  };

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

  const isEmailId = (user_id) => user_id && user_id.includes('@');

  const getDisplayName = (profile) => {
    if (profile.display_name) return profile.display_name;
    const u = users[profile.user_id];
    if (u?.full_name) return u.full_name;
    return profile.role_label || profile.user_id || 'Membro';
  };

  const getEmail = (profile) => {
    const u = users[profile.user_id];
    if (u?.email) return u.email;
    if (isEmailId(profile.user_id)) return profile.user_id;
    return '';
  };

  const filtered = profiles.filter(p => {
    const name = getDisplayName(p);
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase());
    const matchLicense = filterLicense === 'all' || p.license_type === filterLicense;
    return matchSearch && matchLicense;
  });

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">Membros da Comunidade</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar membro..."
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-44"
          />
          <select
            value={filterLicense}
            onChange={e => setFilterLicense(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">Todas as licenças</option>
            {LICENSE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LICENSE_OPTIONS.map(opt => {
          const count = profiles.filter(p => (p.license_type || 'teste') === opt.value).length;
          const Icon = opt.icon;
          return (
            <div key={opt.value} className={`rounded-xl border p-3 flex items-center gap-3 cursor-pointer ${filterLicense === opt.value ? 'ring-2 ring-indigo-400' : ''} bg-white border-slate-200`} onClick={() => setFilterLicense(filterLicense === opt.value ? 'all' : opt.value)}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${opt.color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900 leading-none">{count}</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">{opt.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda de Selos */}
      <BadgeLegendPanel />

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-slate-200"></div>)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(profile => {
            const expired = isLicenseExpired(profile);
            const isEditing = editingId === profile.id;
            return (
              <div key={profile.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${expired ? 'border-red-200' : 'border-slate-200'}`}>
                {/* Header */}
                <div className="flex items-center gap-3 p-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shrink-0 overflow-hidden">
                    {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" /> : getDisplayName(profile).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-900 truncate">{getDisplayName(profile)}</p>
                      <LicenseBadge type={profile.license_type || 'teste'} />
                      {expired && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">EXPIRADA</span>}
                      {isEmailId(profile.user_id) && <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">Aguardando 1º login</span>}
                    </div>
                    <p className="text-xs text-slate-400 truncate">✉ {getEmail(profile) || profile.user_id}</p>
                    {profile.license_end_date && profile.license_type !== 'vitalicio' && (
                      <p className="text-[11px] text-slate-500">Expira: {new Date(profile.license_end_date).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => isEditing ? setEditingId(null) : startEdit(profile)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      {isEditing ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {isEditing ? 'Fechar' : 'Editar'}
                    </button>
                    <button onClick={() => deleteProfile(profile)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Painel de Edição */}
                {isEditing && (
                  <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-4">
                    <h4 className="text-sm font-bold text-slate-700">Editar Licença e Perfil</h4>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Tipo de Licença */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Tipo de Licença</label>
                        <div className="grid grid-cols-2 gap-2">
                          {LICENSE_OPTIONS.map(opt => {
                            const Icon = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setEditForm(f => ({ ...f, license_type: opt.value }))}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-bold transition-all ${editForm.license_type === opt.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-400' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                              >
                                <Icon size={14} /> {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Datas */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Data de Início</label>
                          <input
                            type="date"
                            value={editForm.license_start_date}
                            onChange={e => setEditForm(f => ({ ...f, license_start_date: e.target.value }))}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                        {editForm.license_type !== 'vitalicio' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Data de Expiração</label>
                            <input
                              type="date"
                              value={editForm.license_end_date}
                              onChange={e => setEditForm(f => ({ ...f, license_end_date: e.target.value }))}
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                          </div>
                        )}
                        {editForm.license_type === 'vitalicio' && (
                          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold bg-amber-50 p-3 rounded-lg border border-amber-200">
                            <Infinity size={14} /> Sem data de expiração
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Identificação */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Nome</label>
                        <input
                          value={users[profile.user_id]?.full_name || ''}
                          readOnly
                          className="w-full border border-slate-200 bg-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">E-mail</label>
                        <input
                          value={users[profile.user_id]?.email || (isEmailId(profile.user_id) ? profile.user_id : '')}
                          readOnly
                          className="w-full border border-slate-200 bg-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Nome de Exibição */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Nome de Exibição <span className="text-indigo-500">(aparece no perfil)</span></label>
                      <input
                        value={editForm.display_name}
                        onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))}
                        placeholder={users[profile.user_id]?.full_name || 'Nome que aparecerá no perfil'}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Se vazio, usa o nome registrado na conta.</p>
                    </div>

                    {/* Título/Cargo */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Título / Nome do Membro</label>
                        <input
                          value={editForm.role_label}
                          onChange={e => setEditForm(f => ({ ...f, role_label: e.target.value }))}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Papel (Sistema)</label>
                        <select
                          value={editForm.user_role}
                          onChange={e => setEditForm(f => ({ ...f, user_role: e.target.value }))}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          disabled={!users[profile.user_id]}
                        >
                          <option value="user">Usuário</option>
                          <option value="admin">Administrador</option>
                        </select>
                        {!users[profile.user_id] && <p className="text-[10px] text-slate-400 mt-1">Disponível após 1º login</p>}
                      </div>
                    </div>

                    {/* Tipo de Perfil */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Perfil</label>
                      <select
                        value={editForm.role_type}
                        onChange={e => setEditForm(f => ({ ...f, role_type: e.target.value }))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        {['aluno','engenheiro','arquiteto','docente','parceiro','gestor_condominial','consultor_bim','perito_judicial','corretor','investidor','admin'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
                      <button onClick={() => saveEdit(profile)} disabled={saving} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
                        <Save size={13} /> {saving ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Selos */}
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(profile.badges || []).map((badge, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        <Award size={10} />{badge}
                        <button onClick={() => removeBadge(profile, idx)} className="ml-0.5 hover:text-red-500"><X size={9} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={badgeInput[profile.id] || ''}
                      onChange={e => setBadgeInput(prev => ({ ...prev, [profile.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addBadge(profile)}
                      placeholder="Adicionar selo..."
                      className="border border-slate-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 w-36"
                    />
                    <button onClick={() => addBadge(profile)} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold">
                      <Award size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
              <Users size={36} className="mx-auto mb-2 opacity-30" />
              <p>Nenhum membro encontrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}