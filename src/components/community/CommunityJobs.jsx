import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2, MapPin, Briefcase, Plus, X, ExternalLink, CheckCircle2, Send, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const typeColors = {
  'CLT': 'bg-blue-100 text-blue-700',
  'PJ': 'bg-purple-100 text-purple-700',
  'Freelance': 'bg-amber-100 text-amber-700',
  'Estágio': 'bg-emerald-100 text-emerald-700',
  'Remoto': 'bg-indigo-100 text-indigo-700',
};

function JobCard({ job, user }) {
  const [expanded, setExpanded] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyMsg, setApplyMsg] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyMsg.trim()) return;
    setApplying(true);

    // Notifica admins
    const admins = await base44.entities.User.list();
    const adminUsers = admins.filter(u => u.role === 'admin');
    await Promise.all(adminUsers.map(admin =>
      base44.entities.Notification.create({
        user_id: admin.id,
        type: 'job',
        title: `Nova candidatura: ${job.title}`,
        message: `${user.full_name} se candidatou à vaga "${job.title}" em ${job.company}. Mensagem: "${applyMsg}"`,
        link: '/Comunidade',
        read: false
      })
    ));

    setApplied(true);
    setApplying(false);
    setShowApply(false);
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${applied ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 border-l-4 border-l-emerald-500'}`}>
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeColors[job.type] || 'bg-slate-100 text-slate-600'}`}>{job.type}</span>
              {applied && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"><CheckCircle2 size={10} /> Candidatura enviada</span>}
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1.5">
              <span className="flex items-center gap-1 font-medium"><Building2 size={13} /> {job.company}</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? 'Menos' : 'Detalhes'}
            </button>
            {applied ? (
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl">
                <CheckCircle2 size={16} /> Enviado
              </div>
            ) : (
              <button
                onClick={() => setShowApply(!showApply)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm px-5 py-2.5 transition-colors"
              >
                <Send size={14} /> Candidatar-se
              </button>
            )}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            {job.description && <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>}
            {job.requirements && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Requisitos</p>
                <p className="text-sm text-slate-600 leading-relaxed">{job.requirements}</p>
              </div>
            )}
            {job.contact_link && (
              <a href={job.contact_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mt-2">
                <ExternalLink size={12} /> Aplicar via link externo
              </a>
            )}
          </div>
        )}

        {showApply && !applied && (
          <form onSubmit={handleApply} className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <p className="text-sm font-bold text-slate-700">Enviar candidatura para <span className="text-indigo-600">{job.title}</span></p>
            <p className="text-xs text-slate-500">Sua candidatura será encaminhada ao administrador da comunidade.</p>
            <textarea
              value={applyMsg}
              onChange={e => setApplyMsg(e.target.value)}
              rows={3}
              placeholder="Apresente-se brevemente e explique por que você é o candidato ideal..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              required
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowApply(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={applying || !applyMsg.trim()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
                <Send size={14} /> {applying ? 'Enviando...' : 'Enviar Candidatura'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CommunityJobs({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', type: 'CLT', location: '', description: '', requirements: '', contact_link: '' });
  const [saving, setSaving] = useState(false);
  const [notifyAll, setNotifyAll] = useState(true);

  useEffect(() => {
    base44.entities.JobListing.filter({ status: 'active' }, '-created_date').then(d => { setJobs(d); setLoading(false); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.JobListing.create({ ...form, status: 'active' });
    setForm({ title: '', company: '', type: 'CLT', location: '', description: '', requirements: '', contact_link: '' });
    setShowForm(false);
    const d = await base44.entities.JobListing.filter({ status: 'active' }, '-created_date');
    setJobs(d);
    setSaving(false);
  };

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2"><Briefcase size={20} /> Mural de Vagas</h2>
            <p className="text-slate-300 text-sm mt-1">Oportunidades exclusivas para membros da comunidade.</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow transition-colors">
              <Plus size={16} /> Postar Vaga
            </button>
          )}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center"><p className="font-extrabold text-lg">{jobs.length}</p><p className="text-slate-300 text-xs">Vagas ativas</p></div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4 text-lg">Nova Vaga</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Título *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Empresa *</label><input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Tipo *</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {['CLT', 'PJ', 'Freelance', 'Estágio', 'Remoto'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Local *</label><input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Requisitos</label><textarea rows={2} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Link Externo (opcional)</label><input value={form.contact_link} onChange={e => setForm({ ...form, contact_link: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm disabled:opacity-50">{saving ? 'Salvando...' : 'Publicar Vaga'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-200 h-28 animate-pulse"></div>)}</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-slate-600">Nenhuma vaga publicada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => <JobCard key={job.id} job={job} user={user} />)}
        </div>
      )}
    </div>
  );
}