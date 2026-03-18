import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle2, Clock, X, UserCheck, UserX, Mail, Phone, RefreshCw } from 'lucide-react';

const LICENSE_OPTIONS = [
  { value: 'teste', label: 'Teste' },
  { value: 'estudantil', label: 'Estudantil' },
  { value: 'pleno', label: 'Pleno' },
  { value: 'vitalicio', label: 'Vitalício' },
];

const ROLE_OPTIONS = [
  { value: 'aluno', label: 'Aluno / Estudante' },
  { value: 'engenheiro', label: 'Engenheiro Civil' },
  { value: 'arquiteto', label: 'Arquiteto' },
  { value: 'docente', label: 'Docente / Professor' },
  { value: 'parceiro', label: 'Parceiro Comercial' },
  { value: 'gestor_condominial', label: 'Gestor Condominial' },
  { value: 'consultor_bim', label: 'Consultor BIM' },
  { value: 'perito_judicial', label: 'Perito Judicial' },
  { value: 'corretor', label: 'Corretor de Imóveis' },
  { value: 'investidor', label: 'Investidor' },
];

const ROLE_LABELS = {
  aluno: 'Aluno',
  engenheiro: 'Engenheiro Civil',
  arquiteto: 'Arquiteto',
  docente: 'Docente',
  parceiro: 'Parceiro',
  gestor_condominial: 'Gestor Condominial',
  consultor_bim: 'Consultor BIM',
  perito_judicial: 'Perito Judicial',
  corretor: 'Corretor',
  investidor: 'Investidor',
};

export default function AdminInviteUsers() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteForm, setInviteForm] = useState({ email: '', full_name: '', role_type: 'aluno', role_label: '', license_type: 'pleno', license_start_date: new Date().toISOString().split('T')[0], license_end_date: '' });
  const [inviting, setInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await base44.entities.AccessRequest.list('-created_date');
    setRequests(data);
    setLoading(false);
  };

  const createProfileForUser = async ({ user_id, full_name, role_type, role_label, license_type, license_start_date, license_end_date }) => {
    // Verifica se já existe um UserProfile para este user_id ou email para não duplicar
    const existing = await base44.entities.UserProfile.filter({ user_id });
    if (existing && existing.length > 0) return; // já existe, não cria
    await base44.entities.UserProfile.create({
      user_id: user_id || full_name, // fallback enquanto o usuário não aceitou o convite
      role_type: role_type || 'aluno',
      role_label: role_label || ROLE_LABELS[role_type] || full_name,
      license_type: license_type || 'pleno',
      license_start_date: license_start_date || new Date().toISOString().split('T')[0],
      license_end_date: license_type === 'vitalicio' ? '' : (license_end_date || ''),
      is_approved: true,
    });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    // Envia convite via SDK do Base44 (integra com dashboard)
    await base44.users.inviteUser(inviteForm.email, 'user');
    await base44.entities.AccessRequest.create({
      full_name: inviteForm.full_name,
      email: inviteForm.email,
      requested_role: inviteForm.role_type,
      status: 'approved',
      admin_notes: `Convidado. Perfil: ${inviteForm.role_label || ROLE_LABELS[inviteForm.role_type]}. Licença: ${inviteForm.license_type}`
    });
    // Cria UserProfile automaticamente para aparecer em Membros
    await createProfileForUser({
      user_id: inviteForm.email, // usa email como identificador temporário
      full_name: inviteForm.full_name,
      role_type: inviteForm.role_type,
      role_label: inviteForm.role_label || ROLE_LABELS[inviteForm.role_type],
      license_type: inviteForm.license_type,
      license_start_date: inviteForm.license_start_date,
      license_end_date: inviteForm.license_end_date,
    });
    setInviting(false);
    setInviteSent(true);
    setInviteForm({ email: '', full_name: '', role_type: 'aluno', role_label: '', license_type: 'pleno', license_start_date: new Date().toISOString().split('T')[0], license_end_date: '' });
    setTimeout(() => setInviteSent(false), 4000);
  };

  const approveRequest = async (req) => {
    setProcessingId(req.id);
    // Envia convite pelo Base44
    await base44.users.inviteUser(req.email, 'user');
    // Atualiza status da solicitação
    await base44.entities.AccessRequest.update(req.id, { status: 'approved' });
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
    // Cria UserProfile automaticamente para aparecer em Membros
    await createProfileForUser({
      user_id: req.email,
      full_name: req.full_name,
      role_type: req.requested_role,
      role_label: ROLE_LABELS[req.requested_role] || req.full_name,
      license_type: 'pleno',
      license_start_date: new Date().toISOString().split('T')[0],
      license_end_date: '',
    });
    setProcessingId(null);
  };

  const rejectRequest = async (req) => {
    setProcessingId(req.id);
    await base44.entities.AccessRequest.update(req.id, { status: 'rejected' });
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
    setProcessingId(null);
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="animate-in fade-in space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-slate-900">Convites e Acessos</h2>

      {/* Formulário de Convite Direto */}
      <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Send size={18} className="text-indigo-600" /> Convidar Novo Membro
        </h3>
        {inviteSent && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl font-bold flex items-center gap-2">
            <CheckCircle2 size={16} /> Convite enviado com sucesso! O usuário receberá um e-mail.
          </div>
        )}
        <form onSubmit={handleInvite} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo *</label>
            <input required value={inviteForm.full_name} onChange={e => setInviteForm({ ...inviteForm, full_name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">E-mail *</label>
            <input required type="email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Perfil *</label>
            <select required value={inviteForm.role_type} onChange={e => setInviteForm({ ...inviteForm, role_type: e.target.value, role_label: ROLE_LABELS[e.target.value] })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Título Customizado (opcional)</label>
            <input value={inviteForm.role_label} onChange={e => setInviteForm({ ...inviteForm, role_label: e.target.value })} placeholder={`Ex: ${ROLE_LABELS[inviteForm.role_type]}`} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Licença *</label>
            <select required value={inviteForm.license_type} onChange={e => setInviteForm({ ...inviteForm, license_type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {LICENSE_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Início da Licença</label>
            <input type="date" value={inviteForm.license_start_date} onChange={e => setInviteForm({ ...inviteForm, license_start_date: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          {inviteForm.license_type !== 'vitalicio' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Expiração da Licença</label>
              <input type="date" value={inviteForm.license_end_date} onChange={e => setInviteForm({ ...inviteForm, license_end_date: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          )}
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={inviting} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm disabled:opacity-50">
              <Send size={15} /> {inviting ? 'Enviando...' : 'Enviar Convite por E-mail'}
            </button>
          </div>
        </form>
      </div>

      {/* Solicitações Pendentes */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-amber-500" /> Solicitações Pendentes
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
            </h3>
            <button onClick={loadRequests} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><RefreshCw size={15} /></button>
          </div>
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {req.full_name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-slate-900">{req.full_name}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1"><Mail size={11} />{req.email}</span>
                    {req.phone && <span className="flex items-center gap-1"><Phone size={11} />{req.phone}</span>}
                    <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">{ROLE_LABELS[req.requested_role] || req.requested_role}</span>
                  </div>
                  {req.message && <p className="text-xs text-slate-600 mt-2 italic">"{req.message}"</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => approveRequest(req)}
                    disabled={processingId === req.id}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs disabled:opacity-50"
                  >
                    <UserCheck size={13} /> Aprovar e Convidar
                  </button>
                  <button
                    onClick={() => rejectRequest(req)}
                    disabled={processingId === req.id}
                    className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg text-xs disabled:opacity-50"
                  >
                    <UserX size={13} /> Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico */}
      {processedRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Histórico de Solicitações</h3>
          <div className="space-y-2">
            {processedRequests.map(req => (
              <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`w-2 h-2 rounded-full shrink-0 ${req.status === 'approved' ? 'bg-emerald-500' : 'bg-red-400'}`}></div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{req.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{req.email} • {ROLE_LABELS[req.requested_role] || req.requested_role}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {req.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="h-32 bg-white rounded-xl animate-pulse border border-slate-200"></div>}
      {!loading && requests.length === 0 && pendingRequests.length === 0 && (
        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Mail size={36} className="mx-auto mb-2 opacity-30" />
          <p>Nenhuma solicitação de acesso ainda.</p>
        </div>
      )}
    </div>
  );
}