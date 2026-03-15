import React, { useState } from 'react';
import {
  TrendingUp, BarChart3, Award, Calendar, FileText, CheckCircle,
  Lightbulb, Star, Users, Target, BookOpen, ChevronDown, Info,
  Briefcase, Network, ClipboardList, Cpu
} from 'lucide-react';

function RoiExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-800/50 border border-slate-600 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-700/50 transition-colors">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-slate-400 shrink-0" />
          <span className="text-slate-300 text-xs font-semibold">Como o ROI é calculado?</span>
        </div>
        <ChevronDown size={15} className={`text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 text-xs text-slate-400 space-y-3 border-t border-slate-700 pt-3">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-slate-300 font-mono text-[11px]">ROI = (Ganho Total − Investimento Total) ÷ Investimento Total × 100</p>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0 mt-1.5"></span>
              <p><span className="text-white font-semibold">Investimento Total:</span> soma de todos os custos diretos (mensalidades × alunos × 20% overhead).</p>
            </div>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
              <p><span className="text-white font-semibold">Ganho Total Agregado:</span> soma das receitas geradas por colocações profissionais, contratos, economias e valor monetário de produções tecnológicas dos alunos.</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-slate-300 font-semibold text-[11px] uppercase tracking-wide">Categorias de Impacto Consideradas:</p>
            {[
              { cat: 'Eventos', desc: 'Valor estimado de participação e organização de eventos técnicos (R$ 500/evento/aluno)' },
              { cat: 'Artigos', desc: 'Valor de publicação científica e autoridade acadêmica (R$ 2.000/artigo)' },
              { cat: 'Canteiros', desc: 'Visitas técnicas e aprendizado aplicado em obra (R$ 800/visita/aluno)' },
              { cat: 'Network', desc: 'Colocações profissionais: salário médio × 3 meses de retorno gerado' },
              { cat: 'Relatórios', desc: 'Laudos, relatórios técnicos e produções acadêmicas (R$ 1.500/relatório)' },
              { cat: 'Produções', desc: 'Produções tecnológicas: Edital Centelha e inovações (valor estimado de mercado)' },
            ].map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5"></span>
                <p><span className="text-indigo-300 font-semibold">{item.cat}:</span> {item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-3">
            <p className="text-emerald-400 font-semibold mb-1">Exemplo — Projeto 1 (28 alunos):</p>
            <p>Investimento: R$ 67.166 → Ganho: R$ 224.999</p>
            <p className="text-white font-mono mt-1">(224.999 − 67.166) ÷ 67.166 × 100 = <span className="text-emerald-400 font-bold">235%</span></p>
          </div>
          <p className="text-slate-500 text-[10px] italic">Um ROI de 235% significa que para cada R$1 investido, os alunos obtiveram R$2,35 de retorno líquido.</p>
        </div>
      )}
    </div>
  );
}

const PROJETOS = [
  {
    id: 1,
    label: 'Projeto nº 1 — 2025',
    title: 'Projeto de Incubadora Profissional nº 1',
    ano: '2025',
    inicio: '30/08/2025',
    fim: '29/05/2026',
    turma: 'Turma 01/2025.2 — Manutenção 4.0',
    totalDias: 272,
    diasDecorridos: 197,
    investimento: 'R$ 67.166,40',
    investimentoDesc: '28 alunos × R$ 1.999 + 20%',
    ganho: 'R$ 224.999,99',
    ganhoDesc: 'Através de 6 categorias de impacto',
    roi: '235,0%',
    metricas: [
      { icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/20', label: 'Eventos', valor: 3 },
      { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/20', label: 'Artigos', valor: 2 },
      { icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/20', label: 'Canteiros', valor: 1 },
      { icon: Users, color: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/20', label: 'Network', valor: 4 },
      { icon: ClipboardList, color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/20', label: 'Relatórios', valor: 0 },
      { icon: Cpu, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/20', label: 'Produções', valor: 1 },
    ],
    feed: [
      { type: 'Artigo Científico', cat: 'Artigos', icon: 'FileText', color: 'text-purple-400', bg: 'bg-purple-500/20', title: 'Eficiência e Inovação na Construção Civil: O Impacto Dos Sistemas Informatizados na Gestão De Obras', date: 'Nov/2025', autores: ['Nathálya Aguiar Leal de Melo', 'Vinícius de Assis Souto Maior Arruda', 'Emanoel Amorim'], fotosAutores: ['https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/568498f4f_WhatsAppImage2025-12-10at172355.jpeg', 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/fa93d6795_WhatsAppImage2025-12-10at214138.jpeg', 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg'] },
      { type: 'Artigo Científico', cat: 'Artigos', icon: 'FileText', color: 'text-purple-400', bg: 'bg-purple-500/20', title: 'Aplicações do BIM: Uma Abordagem Sistêmica para Compatibilização de Projetos', date: 'Nov/2025', autores: ['Nathálya Aguiar Leal de Melo', 'Vinícius de Assis Souto Maior Arruda', 'Emanoel Amorim'], fotosAutores: ['https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/568498f4f_WhatsAppImage2025-12-10at172355.jpeg', 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/fa93d6795_WhatsAppImage2025-12-10at214138.jpeg', 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg'] },
      { type: 'Evento', cat: 'Eventos', icon: 'Calendar', color: 'text-blue-400', bg: 'bg-blue-500/20', title: 'Construção 4.0 – Engenharia e Tecnologia Integradas para o Ciclo de Vida do Edifício', date: 'Out/2025' },
      { type: 'Evento', cat: 'Eventos', icon: 'Calendar', color: 'text-blue-400', bg: 'bg-blue-500/20', title: 'Construindo Lideranças: A Visão do PMI para a Manutenção Predial – Parte 2', date: 'Set/2025' },
      { type: 'Canteiro Didático', cat: 'Canteiros', icon: 'Award', color: 'text-emerald-400', bg: 'bg-emerald-500/20', title: 'Visita Técnica a Obra do Palácio Joaquim Nabuco', date: 'Set/2025' },
      { type: 'Evento', cat: 'Eventos', icon: 'Calendar', color: 'text-blue-400', bg: 'bg-blue-500/20', title: 'Construindo Lideranças: A Visão do PMI para a Manutenção Predial – Parte 1', date: 'Set/2025' },
    ],
    centelha: [
      { nome: 'Nathálya Aguiar Leal de Melo', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/568498f4f_WhatsAppImage2025-12-10at172355.jpeg' },
      { nome: 'Adrianne Oliveira Menezes', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/410684c1c_WhatsAppImage2026-01-29at111340.jpeg' },
    ],
    colocacoes: [
      { type: 'Freelancer', typeColor: 'text-teal-300', typeBg: 'bg-teal-500/10 border-teal-500/30', badgeBg: 'bg-teal-500/20', nome: 'Paulo Ewerton Ribeiro da Silva', funcao: 'Projetista', data: '30/09/2025', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/1f83a6303_WhatsAppImage2025-12-10at222424.jpeg' },
      { type: 'Empregado', typeColor: 'text-amber-300', typeBg: 'bg-amber-500/10 border-amber-500/30', badgeBg: 'bg-amber-500/20', nome: 'Hugo Ewerton Pereira Silva', funcao: 'Engenheiro Fiscal de Campo', data: '01/09/2025', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/be3ce88a4_1000436217.jpg' },
      { type: 'Empregado', typeColor: 'text-amber-300', typeBg: 'bg-amber-500/10 border-amber-500/30', badgeBg: 'bg-amber-500/20', nome: 'Adriana Gonçalves Araujo', funcao: 'Fiscal de Obras', data: '31/08/2025', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/6defa5f03_1000436126.jpg' },
      { type: 'Empregado', typeColor: 'text-amber-300', typeBg: 'bg-amber-500/10 border-amber-500/30', badgeBg: 'bg-amber-500/20', nome: 'Vinícius de Assis Souto Maior Arruda', funcao: 'Gerente de Obras', data: '31/08/2025', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/fa93d6795_WhatsAppImage2025-12-10at214138.jpeg' },
    ],
  },
  {
    id: 2,
    label: 'Projeto nº 2 — 2026',
    title: 'Projeto de Incubadora Profissional nº 2',
    ano: '2026',
    inicio: '31/01/2026',
    fim: '30/11/2026',
    turma: 'Turmas 02/2026.1 — GPO, BIM e Manutenção 4.0',
    totalDias: 303,
    diasDecorridos: 43,
    investimento: '-',
    investimentoDesc: 'Em levantamento',
    ganho: '-',
    ganhoDesc: 'Em andamento',
    roi: '-',
    metricas: [
      { icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/20', label: 'Eventos', valor: 0 },
      { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/20', label: 'Artigos', valor: 0 },
      { icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/20', label: 'Canteiros', valor: 0 },
      { icon: Users, color: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/20', label: 'Network', valor: 0 },
      { icon: ClipboardList, color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/20', label: 'Relatórios', valor: 0 },
      { icon: Cpu, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/20', label: 'Produções', valor: 0 },
    ],
    feed: [],
    centelha: [],
    colocacoes: [],
  },
];

const ICON_MAP = { FileText, Calendar, Award, Lightbulb, Users, ClipboardList, Cpu };

export default function IncubadoraSection() {
  const [projetoIdx, setProjetoIdx] = useState(0);
  const [showObjetivos, setShowObjetivos] = useState(false);
  const projeto = PROJETOS[projetoIdx];
  const progresso = Math.round((projeto.diasDecorridos / projeto.totalDias) * 100);

  return (
    <section className="py-20 bg-slate-900 text-white border-b border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-bold tracking-wide mb-4">
            <TrendingUp size={16} /> Aceleradora de Carreiras
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Incubadora Profissional</h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Capacitando alunos a integrarem conhecimentos teóricos com a prática do mercado de trabalho.
          </p>
          <button
            onClick={() => setShowObjetivos(!showObjetivos)}
            className="mt-4 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
          >
            <Info size={14} /> {showObjetivos ? 'Ocultar objetivos' : 'Ver objetivos e justificativa'}
            <ChevronDown size={14} className={`transition-transform ${showObjetivos ? 'rotate-180' : ''}`} />
          </button>
          {showObjetivos && (
            <div className="mt-6 max-w-3xl mx-auto text-left bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4 text-sm text-slate-300">
              <div>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2"><Target size={15} className="text-emerald-400" /> Objetivo Geral</h4>
                <p className="leading-relaxed text-justify">Capacitar os alunos a integrarem os conhecimentos teóricos com a prática do mercado de trabalho. Este projeto visa complementar a formação acadêmica dos alunos, proporcionando a vivência profissional e o desenvolvimento de habilidades e competências valorizadas pelas empresas.</p>
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2"><CheckCircle size={15} className="text-blue-400" /> Objetivos Específicos</h4>
                <ul className="space-y-1.5">
                  {[
                    'Aplicar os conhecimentos adquiridos nos módulos do curso',
                    'Desenvolver estudos de caso práticos em áreas específicas',
                    'Estabelecer elo entre ESUDA e instituições parceiras',
                    'Estimular pesquisa, extensão e inovação tecnológica',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2"><BookOpen size={15} className="text-indigo-400" /> Justificativa</h4>
                <p className="leading-relaxed text-justify">O projeto se insere nos Cursos de Pós-Graduação em Gestão e Tecnologias da Construção Civil, enfrentando os desafios do mercado e contribuindo para a otimização de processos. Visa preencher a lacuna no desenvolvimento profissional, alinhando teoria com prática.</p>
              </div>
            </div>
          )}
        </div>

        {/* Seletor de Projeto */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {PROJETOS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setProjetoIdx(i)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                projetoIdx === i
                  ? 'bg-emerald-500 text-slate-900 border-emerald-400 shadow-lg'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Card do Projeto Selecionado */}
        <div className="bg-slate-800/60 border border-slate-700 p-5 sm:p-6 rounded-2xl max-w-3xl mx-auto mb-12 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4">
            <div>
              <h4 className="font-bold text-lg text-white">{projeto.title}</h4>
              <p className="text-emerald-400 text-xs font-semibold mt-0.5">{projeto.turma}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                <span className="flex items-center gap-1"><Calendar size={11} /> Início: {projeto.inicio}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> Fim: {projeto.fim}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-emerald-400 font-extrabold text-3xl">{progresso}%</span>
              <p className="text-xs text-slate-400">{projeto.diasDecorridos} de {projeto.totalDias} dias</p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-3 rounded-full transition-all" style={{ width: `${progresso}%` }}></div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Coluna Esquerda: ROI */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white border-b border-slate-700 pb-3">
              <BarChart3 className="text-emerald-500" /> Transparência do ROI Financeiro
            </h3>

            {/* Cards investimento/ganho */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <p className="text-slate-400 text-sm font-medium mb-1">Investimento da Turma</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{projeto.investimento}</p>
                <p className="text-xs text-slate-500">{projeto.investimentoDesc}</p>
              </div>
              <div className="bg-emerald-900/20 rounded-xl p-5 border border-emerald-500/30">
                <p className="text-emerald-400 text-sm font-medium mb-1">Ganho Total Agregado</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{projeto.ganho}</p>
                <p className="text-xs text-emerald-500/70 font-medium">{projeto.ganhoDesc}</p>
              </div>
            </div>

            {/* ROI Banner */}
            {projeto.roi !== '-' ? (
              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <p className="text-emerald-100 text-sm font-bold uppercase tracking-wide mb-1">Retorno Médio sobre o Investimento</p>
                  <h4 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-md">{projeto.roi}</h4>
                  <p className="text-emerald-200 mt-2 font-medium">Retorno Positivo Comprovado</p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
                  <TrendingUp className="text-white w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/60 border border-dashed border-slate-600 rounded-xl p-6 flex items-center justify-center gap-3 text-slate-500">
                <TrendingUp size={20} />
                <p className="text-sm font-medium">ROI em apuração — projeto em andamento</p>
              </div>
            )}

            <RoiExplainer />

            {/* Métricas por Categoria */}
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Impacto por Categoria</h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {projeto.metricas.map((m, i) => (
                  <div key={i} className={`${m.bg} border ${m.border} rounded-xl p-3 flex flex-col items-center text-center gap-1`}>
                    <m.icon size={22} className={m.color} />
                    <span className={`text-xl font-extrabold text-white`}>{m.valor}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Feed */}
          <div className="lg:col-span-5 space-y-5">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white border-b border-slate-700 pb-3">
              <Award className="text-blue-500" /> Atividades e Conquistas
            </h3>

            {projeto.feed.length === 0 ? (
              <div className="bg-slate-800/50 border border-dashed border-slate-600 rounded-xl p-8 text-center text-slate-500">
                <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Atividades serão registradas ao longo do projeto.</p>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-xl p-2 max-h-[520px] overflow-y-auto border border-slate-700">
                <div className="flex flex-col gap-2 p-1">
                  {projeto.feed.map((item, idx) => {
                    const IconComp = ICON_MAP[item.icon] || FileText;
                    return (
                      <div key={idx} className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg hover:bg-slate-600/60 transition-colors">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.bg} ${item.color}`}>
                          <IconComp size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white leading-snug">{item.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{item.type}</p>
                          {item.autores && (
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              {item.fotosAutores?.map((foto, fi) => (
                                <img key={fi} src={foto} alt={item.autores[fi]} title={item.autores[fi]} className="w-5 h-5 rounded-full object-cover border border-slate-500" />
                              ))}
                              <span className="text-[10px] text-slate-400 ml-0.5">{item.autores.join(', ')}</span>
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 text-xs font-mono text-slate-500 pt-0.5">{item.date}</div>
                      </div>
                    );
                  })}

                  {/* Produção Tecnológica - Centelha */}
                  {projeto.centelha.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/40 rounded-xl p-3 hover:border-amber-400/70 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/30 flex items-center justify-center shrink-0">
                          <Cpu size={16} className="text-amber-400" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-400">Produção Tecnológica · Edital Centelha 3 · Jan/2026</span>
                          <p className="text-white text-xs font-bold leading-tight">Equipe Concorrente Selecionada</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-snug mb-2">
                        <span className="text-white font-semibold">Projeto:</span> "Amorim Tech — Ecossistema para Gestão Inteligente de Edifícios"
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {projeto.centelha.map((aluno, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-700/40 rounded-lg px-2 py-1.5">
                            <img src={aluno.foto} alt={aluno.nome} className="w-11 h-11 rounded-full object-cover border-2 border-amber-400/50 shrink-0" />
                            <span className="text-white text-[11px] font-semibold">{aluno.nome}</span>
                            <span className="text-slate-400 text-[10px] ml-auto">Arq. Urbanista</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colocações Profissionais */}
                  {projeto.colocacoes.length > 0 && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2 px-1 mb-2">
                        <div className="h-px flex-1 bg-slate-600"></div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Network — Colocações Profissionais</p>
                        <div className="h-px flex-1 bg-slate-600"></div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {projeto.colocacoes.map((aluno, idx) => (
                          <div key={idx} className={`border ${aluno.typeBg} rounded-xl p-3 flex items-center gap-3 hover:bg-slate-600/50 transition-colors`}>
                            <img src={aluno.foto} alt={aluno.nome} className="w-11 h-11 rounded-full object-cover border-2 border-slate-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-bold leading-tight truncate">{aluno.nome}</p>
                              <p className="text-slate-300 text-[11px] mt-0.5">{aluno.funcao}</p>
                              <p className="text-slate-500 text-[10px] font-mono mt-0.5">{aluno.data}</p>
                            </div>
                            <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${aluno.badgeBg} ${aluno.typeColor} border border-current/20`}>{aluno.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <p className="text-[10px] text-slate-500 text-center italic">* Os alunos autorizam expressamente a vinculação de sua imagem e conquistas como prova social da Incubadora Profissional.</p>
          </div>
        </div>
      </div>
    </section>
  );
}