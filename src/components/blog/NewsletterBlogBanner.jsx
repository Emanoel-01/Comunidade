import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';

export default function NewsletterBlogBanner() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      // Verifica se já está inscrito
      const existing = await base44.entities.NewsletterSubscriber.filter({ email });
      if (existing && existing.length > 0) {
        setStatus('success');
        return;
      }
      await base44.entities.NewsletterSubscriber.create({ email, name });
      setStatus('success');
    } catch (err) {
      setErrorMsg('Erro ao se inscrever. Tente novamente.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-6 py-5 flex items-center gap-4">
        <CheckCircle2 className="text-indigo-600 shrink-0" size={28} />
        <div>
          <p className="font-bold text-indigo-900">Inscrição confirmada!</p>
          <p className="text-sm text-indigo-700">Você receberá os próximos resumos do Blog Mundo 4.0 no seu e-mail.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-2xl px-6 py-7 text-white">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={20} className="text-indigo-300" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Newsletter</span>
          </div>
          <h3 className="text-xl font-extrabold mb-1">Receba os melhores conteúdos</h3>
          <p className="text-indigo-200 text-sm">Resumos semanais sobre Construção 4.0, Gestão e Tecnologia direto no seu e-mail.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:shrink-0 md:w-auto w-full">
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/40 w-full sm:w-32"
          />
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/40 w-full sm:w-52"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-indigo-900 font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : null}
            Inscrever-se
          </button>
        </form>
      </div>
      {status === 'error' && <p className="text-red-300 text-xs mt-3">{errorMsg}</p>}
    </div>
  );
}