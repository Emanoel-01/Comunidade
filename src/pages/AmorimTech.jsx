import React from 'react';
import { Cpu, CheckCircle2, ExternalLink, ClipboardCheck, ShieldCheck, Smartphone, Camera, FileCheck } from 'lucide-react';

export default function AmorimTech() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
      {/* HEADER */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold tracking-wide mb-6"><Cpu size={16} /> Ecossistema Digital & Inteligência Artificial</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Predial 4.0</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto text-justify md:text-center">O copiloto técnico para engenheiros e arquitetos que fazem vistorias e emitem laudos. Digitaliza o fluxo completo, da vistoria em campo à entrega do documento técnico, com apoio de inteligência artificial.</p>
      </div>

      {/* APP DESTAQUE */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden mb-16 shadow-2xl text-white">
        <div className="p-8 sm:p-12 md:p-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg">P</div>
            <div className="text-left"><span className="text-cyan-400 font-bold text-sm tracking-wider uppercase">Plataforma Principal</span><h3 className="text-3xl font-bold">Predial 4.0</h3></div>
          </div>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">Prancheta de campo offline-first, registro fotográfico vinculado à ficha técnica, diagnóstico assistido por IA e emissão automática do laudo em PDF — tudo em um só lugar.</p>
          <a href="https://predial40-app.netlify.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all shadow-lg"><ExternalLink size={20} /> Acessar o Predial 4.0</a>
        </div>
      </div>

      {/* OS DOIS MÓDULOS */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Dois módulos, um só ecossistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6"><ClipboardCheck size={26} /></div>
            <h4 className="font-bold text-xl text-slate-900 mb-2">Inspeção Predial</h4>
            <p className="text-slate-600 mb-6 flex-grow leading-relaxed">Laudo técnico completo de inspeção predial, conforme a NBR 16747. Diagnóstico assistido por IA, classificação de criticidade (P1/P2/P3) e emissão do documento com numeração sequencial.</p>
            <ul className="space-y-2.5">
              {['Checklist técnico por sistema construtivo', 'Ficha de dano com foto e diagnóstico por IA', 'Classificação de criticidade conforme NBR 5674 e NBR 16747', 'Laudo em PDF pronto para ART/RRT'].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" /> {f}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6"><ShieldCheck size={26} /></div>
            <h4 className="font-bold text-xl text-slate-900 mb-2">Vistoria Cautelar de Vizinhança</h4>
            <p className="text-slate-600 mb-6 flex-grow leading-relaxed">Registro preventivo do estado de conservação de imóveis vizinhos antes do início de uma obra, conforme a Norma IBAPE/SP e a NBR 13752 — proteção técnica para construtoras e vizinhos.</p>
            <ul className="space-y-2.5">
              {['Cadastro da obra e dos imóveis vizinhos', 'Checklist fotográfico por ambiente', 'Registro de ocorrências com classificação técnica', 'Laudo consolidado em PDF, com numeração oficial'].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" /> {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Como funciona</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Smartphone, title: 'Vistoria em campo', desc: 'Prancheta digital offline-first — funciona mesmo sem sinal, sincroniza quando a conexão voltar.' },
            { icon: Camera, title: 'Registro fotográfico', desc: 'Cada ocorrência vira uma ficha técnica com foto, localização e diagnóstico assistido por IA.' },
            { icon: FileCheck, title: 'Laudo em PDF', desc: 'Documento técnico gerado automaticamente, pronto para ART/RRT e entrega ao cliente.' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><item.icon className="text-slate-700" size={28} /></div>
              <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Quer conhecer a ferramenta de perto?</h3>
        <p className="text-slate-600 mb-6">Fale com a gente pelo WhatsApp e veja o sistema funcionando na prática.</p>
        <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">Falar no WhatsApp</a>
      </div>
    </div>
  );
}