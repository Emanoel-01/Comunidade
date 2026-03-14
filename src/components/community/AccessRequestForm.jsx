import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, X, Send } from 'lucide-react';

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

export default function AccessRequestForm({ onClose }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', profession: '', requested_role: 'aluno', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.entities.AccessRequest.create({ ...form, status: 'pending' });
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-10 px-6">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Solicitação Enviada!</h3>
        <p className="text-slate-500 text-sm mb-6">Sua solicitação foi enviada ao administrador. Você receberá um convite por e-mail assim que aprovado.</p>
        <button onClick={onClose} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Fechar</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg w-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-slate-900">Solicitar Acesso</h3>
        {onClose && <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={20} /></button>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo *</label>
            <input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">E-mail *</label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Telefone / WhatsApp</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(81) 99999-9999" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Profissão / Cargo</label>
            <input value={form.profession} onChange={e => setForm({ ...form, profession: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Perfil *</label>
          <select required value={form.requested_role} onChange={e => setForm({ ...form, requested_role: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Por que deseja entrar na comunidade?</label>
          <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
        </div>
        <button type="submit" disabled={sending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
          <Send size={16} /> {sending ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </form>
    </div>
  );
}