import React from 'react';
import { Mail, Send, MessageCircle } from 'lucide-react';

export default function Contato() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold tracking-wide mb-6">
          <Mail size={16} /> Central de Atendimento
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Como podemos ajudar hoje?</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="lg:col-span-3 p-6 sm:p-8 md:p-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Envie sua mensagem</h3>
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada com sucesso!'); }}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qual o assunto principal? *</label>
              <select required className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Amorim Arquitetura</option>
                <option>Amorim Tech</option>
                <option>Academia ESUDA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
              <input type="text" required className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
                <input type="email" required className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp *</label>
                <input type="tel" required className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem *</label>
              <textarea rows="4" required className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full bg-indigo-900 hover:bg-indigo-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                Enviar Mensagem <Send size={18} />
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">Nossa equipe técnica responderá em até 24h úteis.</p>
            </div>
          </form>
        </div>
        <div className="lg:col-span-2 bg-slate-900 p-6 sm:p-8 md:p-12 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 text-indigo-500/10 pointer-events-none"><Mail size={250} /></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-8">Contatos Diretos</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MessageCircle className="text-emerald-400 mt-1"/>
                <div>
                  <p className="text-sm font-bold text-indigo-300 uppercase">Atendimento (WhatsApp)</p>
                  <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 transition-colors">(81) 99129-8803</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-indigo-400 mt-1"/>
                <div>
                  <p className="text-sm font-bold text-indigo-300 uppercase">E-mail</p>
                  <a href="mailto:emanoel@amorimarquitetura.com.br" className="text-white hover:text-indigo-300 transition-colors break-all text-sm">emanoel@amorimarquitetura.com.br</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}