import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, MapPin, Users, Plus, X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const typeColors = {
  'Webinar': 'bg-blue-100 text-blue-700',
  'Visita Técnica': 'bg-emerald-100 text-emerald-700',
  'Masterclass': 'bg-purple-100 text-purple-700',
  'Workshop': 'bg-amber-100 text-amber-700',
  'Evento Presencial': 'bg-rose-100 text-rose-700',
};

export default function CommunityEvents({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', type: 'Webinar', link: '' });
  const [saving, setSaving] = useState(false);
  const [registered, setRegistered] = useState({});

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await base44.entities.CommunityEvent.list('-event_date');
    setEvents(data);
    const regState = {};
    data.forEach(ev => {
      if ((ev.registrations || []).includes(user.id)) regState[ev.id] = true;
    });
    setRegistered(regState);
    setLoading(false);
  };

  const handleRegister = async (event) => {
    const regs = event.registrations || [];
    const alreadyReg = regs.includes(user.id);
    const newRegs = alreadyReg ? regs.filter(r => r !== user.id) : [...regs, user.id];
    await base44.entities.CommunityEvent.update(event.id, { registrations: newRegs });
    setRegistered(prev => ({ ...prev, [event.id]: !alreadyReg }));
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, registrations: newRegs } : e));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.CommunityEvent.create({ ...form, registrations: [] });
    setForm({ title: '', description: '', event_date: '', location: '', type: 'Webinar', link: '' });
    setShowForm(false);
    await loadEvents();
    setSaving(false);
  };

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Calendário de Eventos</h2>
          <p className="text-sm text-slate-500">Webinars, visitas técnicas e masterclasses.</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-colors">
            <Plus size={16} /> Criar Evento
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4">Novo Evento</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Título *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Tipo</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {['Webinar', 'Visita Técnica', 'Masterclass', 'Workshop', 'Evento Presencial'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Data e Hora *</label><input required type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Local / Link de Acesso</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm disabled:opacity-50">{saving ? 'Salvando...' : 'Criar Evento'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2].map(i => <div key={i} className="bg-white rounded-xl border border-slate-200 h-36 animate-pulse"></div>)}</div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400"><Calendar size={40} className="mx-auto mb-3 opacity-30" /><p className="font-bold text-slate-600">Nenhum evento agendado.</p></div>
      ) : (
        <div className="space-y-4">
          {events.map(ev => {
            const isPast = ev.event_date && new Date(ev.event_date) < new Date();
            return (
              <div key={ev.id} className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${isPast ? 'opacity-60 border-slate-200' : 'border-slate-200 border-l-4 border-l-indigo-500'}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeColors[ev.type] || 'bg-slate-100 text-slate-700'}`}>{ev.type}</span>
                      {isPast && <span className="text-xs text-slate-400 font-medium">Encerrado</span>}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{ev.title}</h3>
                    {ev.description && <p className="text-sm text-slate-600 mb-3 line-clamp-2">{ev.description}</p>}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                      {ev.event_date && <span className="flex items-center gap-1"><Calendar size={13} />{format(new Date(ev.event_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>}
                      {ev.location && <span className="flex items-center gap-1"><MapPin size={13} />{ev.location}</span>}
                      <span className="flex items-center gap-1"><Users size={13} />{(ev.registrations || []).length} inscritos</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {!isPast && (
                      <button onClick={() => handleRegister(ev)} className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap ${registered[ev.id] ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                        {registered[ev.id] ? <><CheckCircle2 size={16} /> Inscrito</> : 'Inscrever-me'}
                      </button>
                    )}
                    {ev.link && <a href={ev.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline justify-center"><ExternalLink size={12} /> Acessar Link</a>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}