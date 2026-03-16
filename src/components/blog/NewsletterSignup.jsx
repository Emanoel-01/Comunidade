import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function NewsletterSignup({ post }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    setError('');

    await base44.entities.NewsletterSubscriber.create({
      email: email.trim(),
      name: name.trim(),
      source_post_id: post?.id,
      source_post_title: post?.title,
    });

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8 text-center my-12">
        <CheckCircle2 className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-900 mb-1">Inscrição confirmada!</h3>
        <p className="text-slate-600">Obrigado! Você receberá novidades sobre novos artigos em breve.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-8 my-12 text-white">
      <div className="flex items-center gap-3 mb-2">
        <Mail className="w-6 h-6 text-indigo-300" />
        <h3 className="text-xl font-bold">Receba novos artigos no seu e-mail</h3>
      </div>
      <p className="text-indigo-200 mb-6 text-sm">Inscreva-se gratuitamente e fique por dentro das novidades sobre Construção 4.0, BIM e Gestão.</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Seu nome (opcional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40"
        />
        <input
          type="email"
          placeholder="Seu melhor e-mail *"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          required
          className="flex-1 bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-60 shrink-0"
        >
          <Send size={16} />
          {loading ? 'Inscrevendo...' : 'Inscrever-se'}
        </button>
      </form>
      {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
    </div>
  );
}