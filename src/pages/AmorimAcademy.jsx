import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, ArrowRight, Briefcase, Target, TrendingUp,
  CheckCircle2, ChevronDown, BookOpen, Award, FileText, Users, Info,
  Network, ClipboardList, Cpu, Scale, Sparkles, ShieldCheck, MessageCircle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// SEÇÃO 1 — CURSO PREDIAL 4.0
// ═══════════════════════════════════════════════════════════
function CursoPredial40Section() {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide mb-6">
            <BookOpen size={16} /> Turma única · Recife · 27 a 29 de novembro de 2026
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Curso Predial 4.0</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Formação em Inspeção Predial com IA. Domine a Engenharia Diagnóstica e emita laudos técnicos com muito mais velocidade, aplicando a NBR 16747 na prática, com apoio do ecossistema Predial 4.0.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14 max-w-3xl mx-auto">
          {[
            { label: '30h', desc: 'total' },
            { label: '20h', desc: 'presencial · Recife' },
            { label: '10h', desc: 'mentoria em grupo' },
            { label: '40', desc: 'vagas na turma' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
              <p className="text-3xl font-extrabold text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Users, title: 'Presencial em Recife', desc: 'Três dias intensivos: fundamentos de patologia das construções, leitura de manifestações, checklist técnico, prática de campo guiada e Skills Claude aplicadas a orçamento de obras.' },
            { icon: Cpu, title: 'Acesso à plataforma', desc: 'Acesso à plataforma Predial 4.0 para emitir laudos profissionais na prática — registro de fotos, diagnóstico sugerido por IA e montagem automática do documento técnico.' },
            { icon: MessageCircle, title: 'Mentoria em grupo', desc: 'Rodadas de acompanhamento ao vivo com o grupo da turma, para tirar dúvidas sobre os laudos reais em produção.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <item.icon className="text-indigo-600 mb-4" size={28} />
              <h4 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Vagas limitadas — acesso antecipado</h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">As condições de lançamento serão reveladas exclusivamente para os profissionais na Lista de Interessados.</p>
          <a href="https://chat.whatsapp.com/FHW24nsYmDv6gktpTeRyOp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg">
            Entrar na Lista de Interessados <ArrowRight size={18} />
          </a>
          <p className="text-slate-400 text-xs mt-4">
            <strong>O acesso à Comunidade Business 4.0 está incluído</strong> para todos os matriculados no curso.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// SEÇÃO 2 — INCUBADORA
// ═══════════════════════════════════════════════════════════
const PROJETO_ATUAL = {
  roi: '235,0%',
  investimento: 'R$ 67.166,40',
  ganho: 'R$ 224.999,99',
  metricas: [
    { icon: Users, label: 'Contratações', valor: 4 },
    { icon: Cpu, label: 'Inovações', valor: 1 },
    { icon: FileText, label: 'Artigos', valor: 2 },
    { icon: ClipboardList, label: 'Relatórios', valor: 1 },
  ],
  colocacoes: [
    { type: 'Freelancer', typeColor: 'text-teal-300', badgeBg: 'bg-teal-500/20', nome: 'Paulo Ewerton Ribeiro da Silva', funcao: 'Projetista', data: '30/09/2025' },
    { type: 'Contratado', typeColor: 'text-amber-300', badgeBg: 'bg-amber-500/20', nome: 'Hugo Ewerton Pereira Silva', funcao: 'Engenheiro Fiscal de Campo', data: '01/09/2025' },
    { type: 'Contratada', typeColor: 'text-amber-300', badgeBg: 'bg-amber-500/20', nome: 'Adriana Gonçalves Araujo', funcao: 'Fiscal de Obras', data: '31/08/2025' },
    { type: 'Contratado', typeColor: 'text-amber-300', badgeBg: 'bg-amber-500/20', nome: 'Vinícius de Assis Souto Maior Arruda', funcao: 'Gerente de Obras', data: '31/08/2025' },
  ],
};

function IncubadoraSection() {
  const [showObjetivos, setShowObjetivos] = useState(false);
  const projeto = PROJETO_ATUAL;

  return (
    <section className="py-20 sm:py-24 bg-slate-900 text-white border-t-[8px] border-emerald-500 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold tracking-wide mb-6">
            <TrendingUp size={16} /> Mais do que um curso. Uma Aceleradora de Carreiras.
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Incubadora Profissional</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Não basta ter o diploma se não tem a oportunidade. Nossos profissionais são inseridos ativamente no mercado, fecham contratos reais e publicam artigos durante a formação.
          </p>
          <button onClick={() => setShowObjetivos(!showObjetivos)} className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm font-semibold transition-colors bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
            <Info size={16} /> {showObjetivos ? 'Ocultar detalhes' : 'Entenda os bastidores do programa'}
            <ChevronDown size={16} className={`transition-transform ${showObjetivos ? 'rotate-180' : ''}`} />
          </button>
          {showObjetivos && (
            <div className="mt-6 max-w-3xl mx-auto text-left bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4 text-sm text-slate-300">
              <div>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2"><Target size={15} className="text-emerald-400" /> Objetivo Geral</h4>
                <p className="leading-relaxed text-justify">Capacitar profissionais a integrarem os conhecimentos teóricos com a prática do mercado de trabalho, complementando a formação técnica com vivência profissional real.</p>
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2"><CheckCircle2 size={15} className="text-indigo-400" /> Objetivos Específicos</h4>
                <ul className="space-y-1.5">
                  {['Aplicar os conhecimentos adquiridos na prática', 'Desenvolver estudos de caso reais', 'Estabelecer conexões com o mercado e instituições parceiras', 'Estimular pesquisa, extensão e inovação tecnológica'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2"></span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-slate-800/80 border border-slate-700 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white mb-6"><Target className="text-emerald-500" /> O Retorno Financeiro (ROI)</h3>
              <div className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center mb-6 border border-emerald-500/30">
                <p className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Retorno Médio Comprovado</p>
                <h4 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter">{projeto.roi}</h4>
                <p className="text-emerald-200 mt-4 font-medium text-sm max-w-xs mx-auto">Cada R$ investido volta multiplicado para o bolso dos profissionais.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Investimento da Turma</p>
                  <p className="text-2xl font-bold text-white">{projeto.investimento}</p>
                </div>
                <div className="bg-emerald-900/30 rounded-xl p-5 border border-emerald-500/40">
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-1">Ganhos Gerados</p>
                  <p className="text-2xl font-bold text-white">{projeto.ganho}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {projeto.metricas.map((m, i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center text-center gap-2">
                  <m.icon size={24} className="text-emerald-400" />
                  <span className="block text-2xl font-extrabold text-white">{m.valor}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white border-b border-slate-800 pb-4"><Award className="text-indigo-400" /> Prova Social: resultados reais</h3>
            <div className="bg-slate-800/30 rounded-3xl p-2 border border-slate-700">
              <div className="flex flex-col gap-3 p-2">
                {projeto.colocacoes.map((aluno, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="border-l-4 border-amber-500/50 bg-slate-800/80 rounded-r-xl p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{aluno.nome}</p>
                      <p className="text-emerald-400 text-xs font-semibold mt-1">{aluno.funcao}</p>
                      <p className="text-slate-500 text-[11px] font-mono mt-1">Colocado em: {aluno.data}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-md ${aluno.badgeBg} ${aluno.typeColor}`}>{aluno.type}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center italic">* Os profissionais autorizam expressamente a vinculação da sua imagem e conquistas como prova social da Incubadora.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// SEÇÃO 3 — MENTOR ANJO (teaser)
// ═══════════════════════════════════════════════════════════
function MentorAnjoSection() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-indigo-50 to-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold tracking-wide mb-6">
          <ShieldCheck size={16} /> Mentoria Técnica
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Mentor Anjo</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Um programa de mentoria e corresponsabilidade técnica para profissionais que estão dando os primeiros passos na emissão de laudos — com acompanhamento próximo e revisão técnica individual de cada trabalho produzido.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Scale, title: 'Corresponsabilidade Técnica', desc: 'Cada laudo produzido é revisado individualmente por um corresponsável técnico experiente.' },
            { icon: Network, title: 'Acompanhamento Próximo', desc: 'Mentoria direta para profissionais em início de trajetória na área.' },
            { icon: Sparkles, title: 'Prática Guiada', desc: 'Aprenda emitindo laudos reais, com suporte técnico em cada etapa.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <item.icon className="text-indigo-600 mb-3 mx-auto" size={26} />
              <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md">
          Saber mais sobre o Mentor Anjo <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function AmorimAcademy() {
  return (
    <div className="animate-in fade-in">
      <div className="text-center py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold tracking-wide mb-6">
          <GraduationCap size={16} /> Amorim Academy
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 max-w-3xl mx-auto px-4">Formação, mercado e mentoria em um só lugar</h1>
      </div>
      <CursoPredial40Section />
      <IncubadoraSection />
      <MentorAnjoSection />
    </div>
  );
}