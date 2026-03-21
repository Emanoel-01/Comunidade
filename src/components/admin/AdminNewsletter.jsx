import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Send, Users, Loader2, CheckCircle2, Trash2, RefreshCw } from 'lucide-react';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { loadSubscribers(); }, []);

  const loadSubscribers = async () => {
    setLoading(true);
    const data = await base44.entities.NewsletterSubscriber.list('-created_date');
    setSubscribers(data);
    setLoading(false);
  };

  const handleSendNewsletter = async () => {
    if (!confirm(`Enviar resumo automático para ${subscribers.length} assinante(s)?`)) return;
    setSending(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('sendNewsletterSummary', {});
      setResult({ success: true, ...res.data });
    } catch (err) {
      setResult({ success: false, error: err.message });
    }
    setSending(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este assinante?')) return;
    await base44.entities.NewsletterSubscriber.delete(id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Mail size={22} className="text-indigo-500" /> Newsletter
        </h2>
        <button
          onClick={loadSubscribers}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Atualizar"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Painel de Disparo */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Disparar Resumo Automático</h3>
            <p className="text-indigo-200 text-sm">O sistema usa IA para resumir os 7 últimos posts e envia para todos os assinantes.</p>
            <div className="flex items-center gap-2 mt-2">
              <Users size={14} className="text-indigo-300" />
              <span className="text-sm text-indigo-200 font-bold">{subscribers.length} assinante(s)</span>
            </div>
          </div>
          <button
            onClick={handleSendNewsletter}
            disabled={sending || subscribers.length === 0}
            className="flex items-center gap-2 bg-white text-indigo-900 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {sending ? 'Enviando...' : 'Disparar Agora'}
          </button>
        </div>

        {result && (
          <div className={`mt-4 p-3 rounded-xl text-sm font-bold ${result.success ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'}`}>
            {result.success
              ? `✅ Newsletter enviada para ${result.sent} assinante(s)! Posts incluídos: ${result.posts_count}`
              : `❌ Erro: ${result.error}`}
          </div>
        )}
      </div>

      {/* Lista de Assinantes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Assinantes</h3>
          <span className="bg-indigo-100 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-full">{subscribers.length}</span>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Mail size={32} className="mx-auto mb-2 opacity-30" />
            <p>Nenhum assinante ainda.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">E-mail</th>
                <th className="px-5 py-3 text-left">Nome</th>
                <th className="px-5 py-3 text-left">Origem</th>
                <th className="px-5 py-3 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{s.email}</td>
                  <td className="px-5 py-3 text-slate-600">{s.name || '—'}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs truncate max-w-[160px]">{s.source_post_title || 'Blog Banner'}</td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}