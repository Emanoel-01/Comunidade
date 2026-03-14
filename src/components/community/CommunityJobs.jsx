import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2, MapPin, Briefcase, Plus, X, ExternalLink } from 'lucide-react';

export default function CommunityJobs({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', type: 'CLT', location: '', description: '', requirements: '', contact_link: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const data = await base44.entities.JobListing.filter({ status: 'active' }, '-created_date');
    setJobs(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.JobListing.create({ ...form, status: 'active' });
    setForm({ title: '', company: '', type: 'CLT', location: '', description: '', requirements: '', contact_link: '' });
    setShowForm(false);
    await loadJobs();
    setSaving(false);
  };

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mural de Vagas</h2>
          <p className="text-sm text-slate-500">Oportunidades exclusivas para membros da comunidade.</p>
        </div>
        {(user?.role === 'admin') && (
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-colors">
            <Plus size={16} /> Postar Vaga
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4">Nova Vaga</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Título *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Empresa *</label>
                <input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tipo *</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {['CLT', 'PJ', 'Freelance', 'Estágio', 'Remoto'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Local *</label>
                <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Link / Contato</label>
              <input value={form.contact_link} onChange={e => setForm({ ...form, contact_link: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm disabled:opacity-50">
                {saving ? 'Salvando...' : 'Publicar Vaga'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl border border-slate-200 h-24 animate-pulse"></div>)}</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-slate-600">Nenhuma vaga publicada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1 font-medium">
                    <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  </div>
                  {job.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{job.description}</p>}
                </div>
                {job.contact_link ? (
                  <a href={job.contact_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm px-5 py-2.5 whitespace-nowrap transition-colors">
                    Candidatar-se <ExternalLink size={14} />
                  </a>
                ) : (
                  <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm px-5 py-2.5 whitespace-nowrap transition-colors">Candidatar-se</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}