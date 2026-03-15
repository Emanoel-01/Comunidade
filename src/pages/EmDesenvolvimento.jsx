import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Cpu, ArrowLeft, Clock } from 'lucide-react';

export default function EmDesenvolvimento() {
  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-indigo-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
        <Cpu className="w-10 h-10 text-indigo-300" />
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-800/60 text-indigo-300 rounded-full text-sm font-bold tracking-wide mb-6 border border-indigo-600/40">
        <Clock size={14} /> Em Breve
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
        Amorim Tech
      </h1>
      <p className="text-indigo-200 text-lg md:text-xl mb-4 max-w-xl leading-relaxed font-light">
        Estamos construindo algo incrível.
      </p>
      <p className="text-indigo-400 text-base mb-10 max-w-md">
        O ecossistema digital da Amorim Tech está em desenvolvimento e será lançado em breve. Fique atento!
      </p>
      <Link
        to={createPageUrl('Home')}
        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all"
      >
        <ArrowLeft size={18} /> Voltar ao Início
      </Link>
    </div>
  );
}