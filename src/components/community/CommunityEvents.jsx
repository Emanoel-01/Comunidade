import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, MapPin, Users, Plus, X, ExternalLink, CheckCircle2, Clock, Bell } from 'lucide-react';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const typeColors = {
  'Webinar': 'bg-blue-100 text-blue-700 border-blue-200',
  'Visita Técnica': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Masterclass': 'bg-purple-100 text-purple-700 border-purple-200',
  'Workshop': 'bg-amber-100 text-amber-700 border-amber-200',
  'Evento Presencial': 'bg-rose-100 text-rose-700 border-rose-200',
};

const typeIcons = {
  'Webinar': '🖥️',
  'Visita Técnica': '🏗️',
  'Masterclass': '🎓',
  'Workshop': '🔧',
  'Evento Presencial': '📍',
};

function EventCard({ ev, user, onRegistrationChange }) {
  const [registering, setRegistering] = useState(false);
  const [isReg, setIsReg] = useState((ev.registrations || []).includes(user.id));
  const past = ev.event_date && isPast(new Date(ev.event_date));

  const handleRegister = async () => {
    setRegistering(true);
    const res = await base44.functions.invoke('toggleEventRegistration', { event_id: ev.id });
    const { registered, registrations } = res.data;
    setIsReg(registered);
    onRegistrationChange(ev.id, registrations);
    setRegistering(false);
  };

  const timeUntil = !past && ev.event_date
    ? formatDistanceToNow(new Date(ev.event_date), { addSuffix: true, locale: ptBR })
    : null;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${past ? 'opacity-60 border-slate-200' : 'border-slate-200 border-t-4'}`}
      style={!past ? { borderTopColor: ev.type === 'Webinar' ? '#3b82f6' : ev.type === 'Masterclass' ? '#a855f7' : ev.type === 'Workshop' ? '#f59e0b' : ev.type === 'Evento Presencial' ? '#ef4444' : '#10b981' } : {}}>
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${typeColors[ev.type] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {typeIcons[ev.type]} {ev.type}
              </span>
              {past && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">Encerrado</span>}
              {!past && timeUntil && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  <Clock size={10} /> {timeUntil}
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{ev.title}</h3>
            {ev.description && <p className="text-sm text-slate-600 mt-1 leading-relaxed">{ev.description}</p>}
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500 font-medium">
              {ev.event_date && <span className="flex items-center gap-1"><Calendar size={12} className="text-indigo-400" />{format(new Date(ev.event_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>}
              {ev.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-rose-400" />{ev.location}</span>}
              <span className="flex items-center gap-1"><Users size={12} className="text-emerald-400" />{(ev.registrations || []).length} inscritos{ev.max_participants ? ` / ${ev.max_participants}` : ''}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 sm:items-end">
            {!past && (
              <button
                onClick={handleRegister}
                disabled={registering}
                className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-60 whitespace-nowrap shadow-sm ${
                  isReg
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {registering ? (
                  <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Processando</>
                ) : isReg ? (
                  <><CheckCircle2 size={16} /> Inscrito</>
                ) : (
                  <><Bell size={15} /> Inscrever-me</>
                )}
              </button>
            )}
            {ev.link && (
              <a href={ev.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium">
                <ExternalLink size={12} /> {past ? 'Ver gravação' : 'Acessar link'}
              </a>
            )}
          </div>
        </div>

        {isReg && !past && (
          <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center gap-2 text-xs text-emerald-700 font-medium bg-emerald-50 rounded-xl px-3 py-2">
            <CheckCircle2 size={14} /> Você receberá uma notificação com os detalhes do evento.
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommunityEvents({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', type: 'Webinar', link: '', max_participants: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('proximos');
  const [notifyAll, setNotifyAll] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await base44.entities.CommunityEvent.list('-event_date');
    setEvents(data);
    setLoading(false);
  };

  const handleRegistrationChange = (evId, newRegs) => {
    setEvents(prev => prev.map(e => e.id === evId ? { ...e, registrations: newRegs } : e));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.CommunityEvent.create({ ...form, registrations: [], max_participants: form.max_participants ? Number(form.max_participants) : undefined });
    setForm({ title: '', description: '', event_date: '', location: '', type: 'Webinar', link: '', max_participants: '' });
    setShowForm(false);
    await loadEvents();
    setSaving(false);
  };

  const now = new Date();
  const upcoming = events.filter(e => e.event_date && !isPast(new Date(e.event_date)));
  const past = events.filter(e => e.event_date && isPast(new Date(e.event_date)));
  const filtered = filter === 'proximos' ? upcoming : past;

  return (
    <div className="animate-in fade-in space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2"><Calendar size={20} /> Calendário de Eventos</h2>
            <p className="text-indigo-200 text-sm mt-1">Webinars, visitas técnicas e masterclasses exclusivos.</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow transition-colors">
              <Plus size={16} /> Criar Evento
            </button>
          )}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center"><p className="font-extrabold text-lg">{upcoming.length}</p><p className="text-indigo-200 text-xs">Próximos</p></div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center"><p className="font-extrabold text-lg">{events.reduce((acc, e) => acc + (e.registrations || []).length, 0)}</p><p className="text-indigo-200 text-xs">Inscrições totais</p></div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4 text-lg">Novo Evento</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Título *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Tipo</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {['Webinar', 'Visita Técnica', 'Masterclass', 'Workshop', 'Evento Presencial'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Data e Hora *</label><input required type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Local / Plataforma</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ex: Zoom, Google Meet, Presencial..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Vagas máx. (opcional)</label><input type="number" min={1} value={form.max_participants} onChange={e => setForm({ ...form, max_participants: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Link de Acesso</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            </div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm disabled:opacity-50">{saving ? 'Salvando...' : 'Criar Evento'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Filtro */}
      <div className="flex gap-2">
        {[['proximos', `Próximos (${upcoming.length})`], ['passados', `Passados (${past.length})`]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === v ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-200 h-40 animate-pulse"></div>)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Calendar size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-slate-600">{filter === 'proximos' ? 'Nenhum evento agendado.' : 'Nenhum evento passado.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(ev => <EventCard key={ev.id} ev={ev} user={user} onRegistrationChange={handleRegistrationChange} />)}
        </div>
      )}
    </div>
  );
}