import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  GraduationCap, ArrowRight, Briefcase, Target, TrendingUp, 
  CheckCircle, CheckCircle2, X, ChevronDown, BookOpen, 
  Monitor, Calendar, Clock, Timer, CalendarCheck, Star,
  BarChart3, Award, FileText, Lightbulb, Users, Info,
  Network, ClipboardList, Cpu, Zap,
  Building, Laptop, Settings, Scale, Brain, Palette, Volume2
} from 'lucide-react';

// --- DADOS DA ACADEMIA ---
const esudaCourses = [
  {
    id: 'gpo', title: 'Gestão de Projetos e Obras', profile: 'O Perfil Business',
    status: 'Turma Iniciada (Aceitando novos alunos)', statusType: 'iniciada',
    color: 'indigo', duration: '10 meses', hours: '360h',
    format: 'Presencial, Remoto (ao vivo)',
    dias: 'Sáb', horario: '08:00 - 17:00',
    inscricoes: '15/12/25 até 28/03/26', inicioAulas: '30/01/26',
    pagamentos: [
      { label: '10 x R$ 249,00 no cartão de crédito', melhor: true },
      { label: '05 x R$ 499,00 no boleto', melhor: false },
      { label: '10 x R$ 373,00 no boleto', melhor: false },
    ],
    description: 'Focado em Dinheiro e Prazo. Seja o gestor que protege a margem de lucro, domina os pleitos (claims) e garante o equilíbrio financeiro da obra.',
    specificCycle: ['Técnicas de Orçamentos, Cobranças e Custos de Projetos', 'Técnicas de Orçamentos, Cobranças e Custos de Obras', 'Técnicas de Coordenação e Compatibilização de Projetos', 'Técnicas de Planejamento e Coordenação de Obras', 'Eficiência Energética e Sustentabilidade na Construção Civil', 'Lean Construction, Last Planner System e Logística de Canteiro', 'Engenharia de Segurança e Normas de Desempenho', 'Administração Contratual, Medições e Gestão de Pleitos (Claims)', 'Sistemas Informatizados de Gestão Integrada e BI (ERP, CDE e Power BI)']
  },
  {
    id: 'manutencao', title: 'Engenharia e Gestão da Manutenção Predial 4.0', profile: 'O Perfil Operações',
    status: 'Turma Iniciada (Aceitando novos alunos)', statusType: 'iniciada',
    color: 'indigo', duration: '10 meses', hours: '360h',
    format: 'Presencial, Remoto (ao vivo)',
    dias: 'Sáb', horario: '08:00 - 17:00',
    inscricoes: '15/12/25 até 28/03/26', inicioAulas: '30/01/26',
    pagamentos: [
      { label: '10 x R$ 249,00 no cartão de crédito', melhor: true },
      { label: '05 x R$ 499,00 no boleto', melhor: false },
      { label: '10 x R$ 373,00 no boleto', melhor: false },
    ],
    description: 'Focado em Vida Útil e Gestão de Ativos. Lidere a era da Gestão de Facilities utilizando IoT, Drones e BIM FM para valorizar o patrimônio.',
    specificCycle: ['Engenharia Diagnóstica: Terapia Predial e Plano de Intervenção', 'Patologias Construtivas em Estruturas e Sistemas de Envoltória', 'Manutenção Avançada em Instalações Prediais (Elétrica, Hidráulica, HVAC)', 'CMMS/GMAO: Implementação de Sistemas de Gestão da Manutenção', 'Manutenção Preditiva: IoT, Sensores Inteligentes e Automação Predial', 'Termografia Infravermelha e Drones na Inspeção de Ativos', 'Gestão de Ativos com BIM 7D (FM) e Orçamentação Preditiva', 'Engenharia Condominial e Gestão de Sistemas de Segurança e Transporte', 'Gestão da Manutenção: Planejamento, KPIs e Conformidade Operacional']
  },
  {
    id: 'bim', title: 'Tecnologia BIM na Construção Civil', profile: 'O Perfil Tech',
    status: 'Turma Iniciada (Aceitando novos alunos)', statusType: 'iniciada',
    color: 'indigo', duration: '10 meses', hours: '360h',
    format: 'Presencial, Remoto (ao vivo)',
    dias: 'Sáb', horario: '08:00 - 17:00',
    inscricoes: '15/12/25 até 28/03/26', inicioAulas: '30/01/26',
    pagamentos: [
      { label: '10 x R$ 249,00 no cartão de crédito', melhor: true },
      { label: '05 x R$ 499,00 no boleto', melhor: false },
      { label: '10 x R$ 373,00 no boleto', melhor: false },
    ],
    description: 'Focado no Método Virtual. Seja o BIM Manager que coordena dados, interoperabilidade e simulações complexas de construção.',
    specificCycle: ['BIM Arquitetura I: Modelagem Estratégica e Documentação', 'BIM Arquitetura II: Parametrização, Lógica de Projeto e Geração de Dados', 'BIM Estrutural: Detalhamento de Fabricação e Industrialização (LOD 400)', 'BIM Instalações I: Modelagem de Sistemas e Normatização', 'BIM Instalações II: Coordenação 3D e Resolução de Interferências', 'Análise BIM 4D/5D: Simulação de Custos, Cronograma e Venda', 'CDE e Normatização: Implementação da ISO 19650 e Interoperabilidade', 'BIM 6D e 7D: Desempenho, Sustentabilidade e Gestão de Ativos (FM)', 'BIM Estratégico: Gêmeos Digitais, IA e Business Intelligence (BI)']
  },
  {
    id: 'legal', title: 'Engenharia Legal e Perícias: Avaliações', profile: 'O Perfil Legal/Finanças',
    status: 'Matrículas Abertas', statusType: 'abertas',
    color: 'emerald', duration: '10 meses', hours: '360h',
    format: 'Presencial, Remoto (ao vivo)',
    dias: 'Sáb', horario: '08:00 - 17:00',
    inscricoes: '15/12/25 até 28/03/26', inicioAulas: '28/03/26',
    pagamentos: [
      { label: '10 x R$ 249,00 no cartão de crédito', melhor: true },
      { label: '05 x R$ 499,00 no boleto', melhor: false },
      { label: '10 x R$ 373,00 no boleto', melhor: false },
    ],
    description: 'Focado em Valor e Prova. Torne-se a autoridade que o judiciário respeita. Domine regularização, auditoria e avaliação de ativos imobiliários.',
    specificCycle: ['Patologia das Construções, Investigação e Responsabilidade Civil', 'Auditoria Predial e NBR 16.747: Classificação de Risco e Laudos', 'Avaliação de Imóveis I: Método Comparativo (Foco Urbano e Inferência Estatística)', 'Avaliação de Imóveis II: Renda, Rurais e Laudos Complexos', 'Perícias Judiciais e Vistorias Cautelares de Vizinhança', 'Perícia em Desempenho: Verificação Judicial da NBR 15.575', 'Simulação Computacional (BIM 6D) e Análise de Ciclo de Vida (ACV) Legal', 'Certificações e Auditoria de Compliance Técnico-Legal', 'Engenharia Legal Aplicada: Responsabilidade Civil, Ética e Fiscalização']
  },
  {
    id: 'neuroarquitetura', title: 'Neuroarquitetura', profile: 'O Perfil Human-Centric',
    status: 'Matrículas Abertas', statusType: 'abertas',
    color: 'emerald', duration: '10 meses', hours: '360h',
    format: 'Presencial, Remoto (ao vivo)',
    dias: 'Sáb', horario: '08:00 - 17:00',
    inscricoes: '15/12/25 até 28/03/26', inicioAulas: '28/03/26',
    pagamentos: [
      { label: '10 x R$ 249,00 no cartão de crédito', melhor: true },
      { label: '05 x R$ 499,00 no boleto', melhor: false },
      { label: '10 x R$ 373,00 no boleto', melhor: false },
    ],
    description: 'Focado em Comportamento e Bem-estar. Use a neurociência para projetar espaços que otimizam a saúde mental e a produtividade.',
    specificCycle: ['Neurociência Aplicada à Arquitetura', 'Ritmo Biológico e Fatores Humanos', 'Neuroarquitetura e Design Cognitivo', 'Espaços Residenciais e Comerciais: Aplicações e Princípios da Neurarquitetura', 'Espaços Coorporativos: Aplicações e Princípios da Neurarquitetura', 'Estímulos e Percepções: Neuroarquitetura em Espaços Verdes', 'Neuroiluminação', 'Design Biofílico', 'Neurourbanismo']
  },
  {
    id: 'interiores', title: 'Design de Interiores Contemporâneo', profile: 'O Perfil Inovação/Estética',
    status: 'Matrículas Abertas', statusType: 'abertas',
    color: 'emerald', duration: '10 meses', hours: '360h',
    format: 'Presencial, Remoto (ao vivo)',
    dias: 'Sáb', horario: '08:00 - 17:00',
    inscricoes: '15/12/25 até 28/03/26', inicioAulas: '28/03/26',
    pagamentos: [
      { label: '10 x R$ 249,00 no cartão de crédito', melhor: true },
      { label: '05 x R$ 499,00 no boleto', melhor: false },
      { label: '10 x R$ 373,00 no boleto', melhor: false },
    ],
    description: 'Focado em Inovação e Funcionalidade. Crie ambientes modernos que representam novas tendências em materiais, tecnologia e estética.',
    specificCycle: ['Design de Surpefícies', 'Iluminação de Interiores: Comerciais e Residenciais', 'Automação, Internet das Coisas e Eficiência dos Ambientes de Interiores', 'Inclusão e Ergonomia', 'Antropologia do Espaço', 'Design do Mobiliário', 'Design Aplicado para Ambientes Residenciais', 'Design Aplicado para Ambientes Comerciais e Coorporativos', 'Design de Interores para o Mercado de Luxo']
  },
  {
    id: 'acustica', title: 'Acústica Arquitetônica e Iluminação', profile: 'O Perfil Comfort/Performance',
    status: 'Matrículas Abertas', statusType: 'abertas',
    color: 'emerald', duration: '10 meses', hours: '360h',
    format: 'Presencial, Remoto (ao vivo)',
    dias: 'Sáb', horario: '08:00 - 17:00',
    inscricoes: '15/12/25 até 28/03/26', inicioAulas: '28/03/26',
    pagamentos: [
      { label: '10 x R$ 249,00 no cartão de crédito', melhor: true },
      { label: '05 x R$ 499,00 no boleto', melhor: false },
      { label: '10 x R$ 373,00 no boleto', melhor: false },
    ],
    description: 'Focado em Conforto Ambiental e Alta Performance. Domine as variáveis físicas do ambiente para projetos de excelência.',
    specificCycle: ['Acústica Gráfica e Normas', 'Estudo das Tipologias Internas I: Ambientes Residenciais e Comerciais', 'Estudo das Tipologias Internas II: Estúdios, Teatros e Cinemas', 'Estudo das Tipologias Internas III: Grandes Ambientes', 'Acústica e Iluminação Urbana', 'Iluminação, Conceituação e Normas', 'Iluminação Residencial', 'Iluminação Comercial', 'Iluminação Externa: Jardins, Praças e Edificações Histórícas']
  },
];

function AccordionCycle({ title, subtitle, color, items, groupedItems, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const borderColor = color === 'indigo' ? 'border-indigo-200' : 'border-emerald-200';
  const dotColor = color === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-500';
  const titleColor = color === 'indigo' ? 'text-indigo-900' : 'text-emerald-900';
  
  const renderItemText = (text) => {
    if (text.includes('[EAD]')) {
      const parts = text.split('[EAD]');
      return (
        <span>
          {parts[0]} <span className="inline-block bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 tracking-wide">EAD</span> {parts[1]}
        </span>
      );
    }
    return text;
  };

  return (
    <div className={`mb-4 relative pl-6 border-l-2 ${borderColor}`}>
      <div className={`absolute w-4 h-4 ${dotColor} rounded-full -left-[9px] top-3`}></div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left py-2 group">
        <div>
          <h4 className={`font-bold text-lg ${titleColor}`}>{title}</h4>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{subtitle}</p>
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pt-3 pb-2 animate-in slide-in-from-top-2 duration-300">
          {groupedItems ? (
            <div className="space-y-5">
              {groupedItems.map((group, gIdx) => (
                <div key={gIdx}>
                  <h5 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${color === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'}`}>{group.group}</h5>
                  <ul className="space-y-3">
                    {group.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-700 text-justify flex items-start gap-2">
                        <CheckCircle2 size={14} className={`${color === 'indigo' ? 'text-indigo-500' : 'text-emerald-500'} mt-1 shrink-0`} />
                        <span>{renderItemText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-700 text-justify flex items-start gap-2">
                  <CheckCircle2 size={14} className={`${color === 'indigo' ? 'text-indigo-500' : 'text-emerald-500'} mt-1 shrink-0`} /> 
                  <span>{renderItemText(item)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// --- DADOS DA INCUBADORA ---
const PROJETO_ATUAL = {
  id: 1,
  label: 'Projeto nº 1 — 2025',
  title: 'Aceleração Profissional e Oportunidades',
  ano: '2025',
  inicio: '30/08/2025',
  fim: '29/05/2026',
  turma: 'Resultados Consolidados da Turma Atual',
  totalDias: 272,
  diasDecorridos: 197,
  investimento: 'R$ 67.166,40',
  investimentoDesc: 'Investimento total da turma na formação',
  ganho: 'R$ 224.999,99',
  ganhoDesc: 'Novos contratos e colocações gerados',
  roi: '235,0%',
  metricas: [
    { icon: Users, label: 'Contratações', valor: 4 },
    { icon: Cpu, label: 'Inovações', valor: 1 },
    { icon: FileText, label: 'Artigos', valor: 2 },
    { icon: Calendar, label: 'Eventos', valor: 3 },
    { icon: Award, label: 'Canteiros', valor: 1 },
    { icon: ClipboardList, label: 'Relatórios', valor: 1 },
  ],
  feed: [
    { type: 'Relatório Técnico', cat: 'Relatórios', icon: 'ClipboardList', title: 'Vistoria de Reservatórios de Armazenamento de Água. Uso de Drone e Termografia. Faculdade ESUDA', date: '28/02/2026' },
    { type: 'Artigo Científico', cat: 'Artigos', icon: 'FileText', title: 'Eficiência e Inovação na Construção Civil: O Impacto Dos Sistemas Informatizados na Gestão De Obras', date: 'Nov/2025', autores: ['Nathálya Aguiar Leal de Melo', 'Vinícius de Assis Souto Maior Arruda', 'Emanoel Amorim'], fotosAutores: ['https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/568498f4f_WhatsAppImage2025-12-10at172355.jpeg', 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/fa93d6795_WhatsAppImage2025-12-10at214138.jpeg', 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg'] },
    { type: 'Artigo Científico', cat: 'Artigos', icon: 'FileText', title: 'Aplicações do BIM: Uma Abordagem Sistêmica para Compatibilização de Projetos', date: 'Nov/2025', autores: ['Nathálya Aguiar Leal de Melo', 'Vinícius de Assis Souto Maior Arruda', 'Emanoel Amorim'], fotosAutores: ['https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/568498f4f_WhatsAppImage2025-12-10at172355.jpeg', 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/fa93d6795_WhatsAppImage2025-12-10at214138.jpeg', 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg'] },
    { type: 'Evento', cat: 'Eventos', icon: 'Calendar', title: 'Construção 4.0 – Engenharia e Tecnologia Integradas para o Ciclo de Vida do Edifício', date: 'Out/2025' },
    { type: 'Evento', cat: 'Eventos', icon: 'Calendar', title: 'Construindo Lideranças: A Visão do PMI para a Manutenção Predial – Parte 2', date: 'Set/2025' },
    { type: 'Canteiro Didático', cat: 'Canteiros', icon: 'Award', title: 'Visita Técnica a Obra do Palácio Joaquim Nabuco', date: 'Set/2025' },
    { type: 'Evento', cat: 'Eventos', icon: 'Calendar', title: 'Construindo Lideranças: A Visão do PMI para a Manutenção Predial – Parte 1', date: 'Set/2025' },
  ],
  centelha: [
    { nome: 'Nathálya Aguiar Leal de Melo', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/568498f4f_WhatsAppImage2025-12-10at172355.jpeg' },
    { nome: 'Adrianne Oliveira Menezes', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/410684c1c_WhatsAppImage2026-01-29at111340.jpeg' },
  ],
  colocacoes: [
    { type: 'Freelancer', typeColor: 'text-teal-300', typeBg: 'bg-teal-500/10 border-teal-500/30', badgeBg: 'bg-teal-500/20', nome: 'Paulo Ewerton Ribeiro da Silva', funcao: 'Projetista', data: '30/09/2025', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/1f83a6303_WhatsAppImage2025-12-10at222424.jpeg' },
    { type: 'Contratado', typeColor: 'text-amber-300', typeBg: 'bg-amber-500/10 border-amber-500/30', badgeBg: 'bg-amber-500/20', nome: 'Hugo Ewerton Pereira Silva', funcao: 'Engenheiro Fiscal de Campo', data: '01/09/2025', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/be3ce88a4_1000436217.jpg' },
    { type: 'Contratada', typeColor: 'text-amber-300', typeBg: 'bg-amber-500/10 border-amber-500/30', badgeBg: 'bg-amber-500/20', nome: 'Adriana Gonçalves Araujo', funcao: 'Fiscal de Obras', data: '31/08/2025', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/6defa5f03_1000436126.jpg' },
    { type: 'Contratado', typeColor: 'text-amber-300', typeBg: 'bg-amber-500/10 border-amber-500/30', badgeBg: 'bg-amber-500/20', nome: 'Vinícius de Assis Souto Maior Arruda', funcao: 'Gerente de Obras', data: '31/08/2025', foto: 'https://base44.app/api/apps/68e635f18ac82c0861df74bb/files/public/68e635f18ac82c0861df74bb/fa93d6795_WhatsAppImage2025-12-10at214138.jpeg' },
  ],
};

const ICON_MAP = { FileText, Calendar, Award, Lightbulb, Users, ClipboardList, Cpu };

// --- CRONÔMETRO DINÂMICO ---
function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    return {
      dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
      horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((difference / 1000 / 60) % 60),
      segundos: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Object.entries(timeLeft).map(([interval, value]) => (
        <div key={interval} className="flex flex-col items-center bg-white/70 border border-amber-300 rounded-lg p-2 min-w-[52px] shadow-sm">
          <span className="text-xl font-extrabold text-amber-700 leading-none tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase font-bold text-amber-800/70 mt-1">{interval}</span>
        </div>
      ))}
    </div>
  );
}

// --- ROI EXPLAINER ---
function RoiExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-800/50 border border-slate-600 rounded-xl overflow-hidden shadow-lg">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-700/50 transition-colors">
        <div className="flex items-center gap-3">
          <Info size={18} strokeWidth={2} className="text-emerald-400 shrink-0" />
          <span className="text-white text-sm font-bold tracking-wide">Como este ROI muda a sua carreira na prática?</span>
        </div>
        <ChevronDown size={18} strokeWidth={2} className={`text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-300 space-y-4 border-t border-slate-700 pt-4 leading-relaxed animate-in slide-in-from-top-2">
          <p>
            O <strong>ROI de 235%</strong> significa que a nossa rede gera muito mais dinheiro para os alunos do que o valor que investem na pós-graduação. Em média, <strong>o curso paga-se a si mesmo em poucos meses.</strong>
          </p>
          <div className="space-y-3 mt-2">
            <div className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <Network size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Network Direto (Recolocação e Contratos)</strong>
                <p className="text-xs text-slate-400">Alunos são contratados para obras, projetos e fiscalizações de alto valor através das conexões do Comunidade Business 4.0.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <Scale size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Novas Linhas de Receita (Laudos e Perícias)</strong>
                <p className="text-xs text-slate-400">Desenvolvem capacidade técnica para assinar laudos complexos e atuar em perícias, serviços de altíssimo valor acrescentado.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <Award size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Autoridade e Posicionamento (ROI Intangível)</strong>
                <p className="text-xs text-slate-400">Publicação de artigos e criação de tecnologia, posicionando o aluno como especialista isolado da concorrência na sua região.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IncubadoraSection() {
  const [showObjetivos, setShowObjetivos] = useState(false);
  const projeto = PROJETO_ATUAL;

  return (
    <section className="py-24 bg-slate-900 text-white border-t-[12px] border-emerald-500 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold tracking-wide mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <TrendingUp size={16} strokeWidth={2} /> Mais do que um curso. Uma Aceleradora de Carreiras.
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Incubadora Profissional</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Não basta ter o diploma se não tem a oportunidade. Nossos alunos são inseridos ativamente no mercado, fecham contratos reais e publicam artigos durante a formação. <strong>Veja os resultados de quem já está connosco:</strong>
          </p>
          <button
            onClick={() => setShowObjetivos(!showObjetivos)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm font-semibold transition-colors bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700"
          >
            <Info size={16} strokeWidth={1.5} /> {showObjetivos ? 'Ocultar detalhes do programa' : 'Entenda os bastidores do programa'}
            <ChevronDown size={16} strokeWidth={1.5} className={`transition-transform ${showObjetivos ? 'rotate-180' : ''}`} />
          </button>
          
          {showObjetivos && (
            <div className="mt-6 max-w-3xl mx-auto text-left bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4 text-sm text-slate-300 animate-in fade-in slide-in-from-top-4">
              <div>
                <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2"><Target size={15} strokeWidth={1.5} className="text-emerald-400" /> Objetivo Geral</h4>
                <p className="leading-relaxed text-justify">Capacitar os alunos a integrarem os conhecimentos teóricos com a prática do mercado de trabalho. Este projeto visa complementar a formação académica dos alunos, proporcionando a vivência profissional e o desenvolvimento de habilidades e competências altamente valorizadas pelas empresas.</p>
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2"><CheckCircle size={15} strokeWidth={1.5} className="text-indigo-400" /> Objetivos Específicos</h4>
                <ul className="space-y-1.5">
                  {[
                    'Aplicar os conhecimentos adquiridos nos módulos do curso',
                    'Desenvolver estudos de caso práticos em áreas específicas',
                    'Estabelecer elo entre ESUDA e instituições parceiras',
                    'Estimular pesquisa, extensão e inovação tecnológica',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard de Resultados */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Coluna Esquerda: ROI e Painel Financeiro */}
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-slate-800/80 border border-slate-700 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <BarChart3 size={150} />
              </div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-white mb-6 relative z-10">
                <Target strokeWidth={2} className="text-emerald-500" /> O Retorno Financeiro (ROI)
              </h3>

              <div className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center relative z-10 mb-6 border border-emerald-500/30">
                <p className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Retorno Médio Comprovado</p>
                <h4 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg tracking-tighter">{projeto.roi}</h4>
                <p className="text-emerald-200 mt-4 font-medium text-sm max-w-xs mx-auto">Cada R$ investido no curso volta multiplicado para o bolso dos alunos.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Investimento da Turma</p>
                  <p className="text-2xl font-bold text-white mb-1">{projeto.investimento}</p>
                </div>
                <div className="bg-emerald-900/30 rounded-xl p-5 border border-emerald-500/40">
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-1">Ganhos Gerados</p>
                  <p className="text-2xl font-bold text-white mb-1">{projeto.ganho}</p>
                </div>
              </div>

              <RoiExplainer />
            </div>

            {/* Métricas por Categoria */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-800"></div> Impacto Total <div className="h-px flex-1 bg-slate-800"></div>
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {projeto.metricas.map((m, i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:bg-slate-700/50 transition-colors">
                    <m.icon size={24} strokeWidth={1.5} className="text-emerald-400" />
                    <div>
                      <span className="block text-2xl font-extrabold text-white leading-none">{m.valor}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{m.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Feed de Sucesso */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white border-b border-slate-800 pb-4">
              <Award strokeWidth={2} className="text-indigo-400" /> Prova Social: O que está a acontecer agora
            </h3>

            <div className="bg-slate-800/30 rounded-3xl p-2 max-h-[700px] overflow-y-auto border border-slate-700">
              <div className="flex flex-col gap-4 p-2">

                {/* 1. Colocações Profissionais */}
                {projeto.colocacoes.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-3 px-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Briefcase size={16} className="text-amber-400" />
                      </div>
                      <h4 className="text-sm text-white font-bold tracking-wide">Network e Contratações</h4>
                      <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {projeto.colocacoes.map((aluno, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="border-l-4 border-amber-500/50 bg-slate-800/80 rounded-r-xl rounded-l-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-700/80 transition-colors shadow-sm"
                        >
                          <img src={aluno.foto} alt={aluno.nome} className="w-14 h-14 rounded-full object-cover border-2 border-slate-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-bold leading-tight truncate">{aluno.nome}</p>
                            <p className="text-emerald-400 text-xs font-semibold mt-1">{aluno.funcao}</p>
                            <p className="text-slate-500 text-[11px] font-mono mt-1">Colocado em: {aluno.data}</p>
                          </div>
                          <span className={`shrink-0 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-md ${aluno.badgeBg} ${aluno.typeColor}`}>{aluno.type}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Inovação e Tecnologia */}
                {projeto.centelha.length > 0 && (
                  <div className="mb-2 mt-4">
                    <div className="flex items-center gap-3 px-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Cpu size={16} className="text-indigo-400" />
                      </div>
                      <h4 className="text-sm text-white font-bold tracking-wide">Inovação e Tecnologia</h4>
                      <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-indigo-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
                      <div className="flex flex-col gap-1 mb-4 relative z-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">Edital Centelha 3 · Projeto Aprovado</span>
                        <p className="text-white text-sm font-bold leading-snug">"Amorim Tech — Ecossistema para Gestão Inteligente de Edifícios"</p>
                      </div>
                      
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Equipa Desenvolvedora:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative z-10">
                        {projeto.centelha.map((aluno, i) => (
                          <div key={i} className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-2 border border-slate-700/50">
                            <img src={aluno.foto} alt={aluno.nome} className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0" />
                            <span className="text-slate-200 text-[11px] font-semibold leading-tight">{aluno.nome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Publicações e Eventos */}
                <div className="mt-4">
                  <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-slate-400" />
                    </div>
                    <h4 className="text-sm text-white font-bold tracking-wide">Publicações e Eventos</h4>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {projeto.feed.map((item, idx) => {
                      const IconComp = ICON_MAP[item.icon] || FileText;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex items-start gap-4 bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl hover:bg-slate-700/60 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-700/50 text-slate-300">
                            <IconComp size={18} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{item.type} <span className="mx-1 opacity-50">•</span> {item.date}</p>
                            <p className="text-sm font-bold text-white leading-snug">{item.title}</p>
                            {item.autores && (
                              <div className="flex items-center gap-2 mt-3 flex-wrap bg-slate-900/30 p-2 rounded-lg border border-slate-700/30 w-fit">
                                <div className="flex -space-x-2">
                                  {item.fotosAutores?.map((foto, fi) => (
                                    <img key={fi} src={foto} alt={item.autores[fi]} title={item.autores[fi]} className="w-6 h-6 rounded-full object-cover border-2 border-slate-800 relative z-10 hover:z-20 hover:scale-110 transition-transform" />
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">{item.autores.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center italic">* Os alunos autorizam expressamente a vinculação da sua imagem e conquistas como prova social da Incubadora ESUDA.</p>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-20 pt-16 border-t border-slate-800 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Pronto para ser o próximo caso de sucesso?</h3>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Não fique apenas a assistir enquanto o mercado absorve os líderes 4.0. Fale com a nossa equipa de consultores e descubra como acelerar a sua carreira e multiplicar os seus ganhos hoje mesmo.
          </p>
          <a 
            href="https://wa.me/5581991298803" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold px-8 sm:px-12 py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-1 text-lg sm:text-xl w-full sm:w-auto"
          >
            Garantir a Minha Vaga no WhatsApp <ArrowRight size={24} />
          </a>
          <p className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" /> Vagas extremamente limitadas por turma.
          </p>
        </div>

      </div>
    </section>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function AcademiaEsuda() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const cursosRef = useRef(null);
  const courseRefs = useRef({});

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role === 'admin') setIsAdmin(true);
    }).catch(() => {});
  }, []);

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen pb-0 font-sans">
      {/* HERO */}
      <section className="bg-emerald-900 text-white pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1541888082470-fa415039f60f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/50 text-emerald-300 rounded-full text-sm font-bold tracking-wide mb-8 border border-emerald-500/30">
            <GraduationCap size={16} /> Faculdade ESUDA
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">Do Técnico ao Estrategista.</h1>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-10 leading-relaxed font-light max-w-3xl text-justify md:text-center px-2">
            O futuro da Arquitetura e Engenharia não é dos generalistas. É dos <strong>Líderes de Nicho</strong>. Domine a técnica profunda, mas saiba gerenciar, vender e liderar.
          </p>
          <button onClick={() => cursosRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 sm:px-10 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-base sm:text-lg w-full sm:w-auto">
            Ver Especializações <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 3 PILARES */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <TrendingUp size={14} /> A Rota Definitiva para o Topo
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5">Por que o modelo tradicional de Pós-Graduação está morto?</h2>
            <p className="text-slate-500 max-w-3xl mx-auto text-base leading-relaxed">
              O mercado não paga mais por "clínicos gerais". A Construção 4.0 exige um perfil raro e altamente bem pago: o <strong>Líder de Nicho</strong>. Aquele que domina a técnica profunda, sabe fechar contratos de alto valor e lidera equipas com maestria. Descubra os <strong>3 Pilares</strong> exclusivos do nosso ecossistema que vão transformá-lo na maior autoridade da sua área.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Pilar 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shrink-0"><Briefcase size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">1. A Base do Profissional Empreendedor</h3>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wide text-center mb-4">Ciclo Estratégias de Negócios, Liderança e Inteligência Competitiva</p>
              <p className="text-slate-600 text-sm leading-relaxed text-justify mb-4">
                Enquanto outras escolas ensinam apenas teoria básica, nós entregamos ferramentas para você <strong>monetizar seu conhecimento</strong>. No ciclo comum, você domina:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" /><span><strong>Bloco Presencial (Negócios):</strong> Branding, Precificação, Estruturação de CNPJ, Marketing Pessoal e IA Aplicada.</span></li>
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" /><span><strong>Bloco EAD (Soft/Power Skills):</strong> Liderança 4.0, Negociação, Laudos e Design Thinking.</span></li>
              </ul>
              <p className="text-xs text-blue-700 font-semibold bg-blue-50 rounded-lg px-3 py-2 mt-auto text-center">✅ Você deixa de ser apenas um executor de projetos e passa a pensar como dono do negócio.</p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shrink-0"><Target size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">2. Especialização Cirúrgica</h3>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide text-center mb-4">7 Perfis · 7 Caminhos de Sucesso — 180h</p>
              <p className="text-slate-600 text-sm leading-relaxed text-center mb-6">Não formamos "faz-tudo". Clique num perfil para conhecer a especialização:</p>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                {[
                  { id: 'gpo', icon: Building, sublabel: 'O Perfil Business', tooltip: 'Proteja a margem de lucro e domine a gestão de obras complexas e orçamentos.' },
                  { id: 'bim', icon: Laptop, sublabel: 'O Perfil Tech', tooltip: 'Lidere o método virtual: coordenação BIM 7D, interoperabilidade e simulações.' },
                  { id: 'manutencao', icon: Settings, sublabel: 'O Perfil Operations', tooltip: 'Valorize o património com IoT, Drones e Gestão de Facilities 4.0.' },
                  { id: 'legal', icon: Scale, sublabel: 'O Perfil Legal/Finance', tooltip: 'Seja a autoridade respeitada pelo judiciário em laudos, auditorias e avaliações.' },
                  { id: 'neuroarquitetura', icon: Brain, sublabel: 'O Perfil Human', tooltip: 'Otimize a saúde mental e produtividade através da Neurociência aplicada.' },
                  { id: 'interiores', icon: Palette, sublabel: 'O Perfil Estética', tooltip: 'Crie tendências e inove no mercado de alto padrão em interiores.' },
                  { id: 'acustica', icon: Volume2, sublabel: 'O Perfil Comfort', tooltip: 'Domine a alta performance ambiental, acústica e luminotécnica.' },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => courseRefs.current[item.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="relative flex flex-col items-center text-center bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-xl px-2 py-3 transition-all group"
                    >
                      <IconComp size={22} className="text-slate-600 group-hover:text-emerald-600 transition-colors mb-1.5" strokeWidth={1.5} />
                      <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700 leading-tight">{item.sublabel}</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-[10px] leading-snug rounded-lg p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl pointer-events-none">
                        {item.tooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shrink-0"><TrendingUp size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">3. Inteligência de Carreira</h3>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-wide text-center mb-4">Lifelong Learning</p>
              <p className="text-slate-600 text-sm leading-relaxed text-justify mb-6">
                Nosso modelo respeita seu tempo e investimento. Ao concluir uma especialização, você já eliminou todo o <strong>Ciclo Estratégias de Negócios, Liderança e Inteligência Competitiva (180h)</strong>. Isso significa que ao buscar uma segunda certificação, você começa com <strong>50% do caminho andado</strong>, incentivando sua formação contínua sem recomeçar do zero.
              </p>
              <div className="mt-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-3xl font-extrabold text-amber-600 mb-1">50%</p>
                <p className="text-[11px] text-amber-700 font-semibold uppercase tracking-wide">do caminho já percorrido na 2ª certificação</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURSOS */}
      <section ref={cursosRef} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-4">Escolha a sua Especialização</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {esudaCourses.map((curso) => {
              const statusStyles = {
                iniciada: 'bg-amber-100 text-amber-700',
                abertas: 'bg-emerald-100 text-emerald-700',
                proxima: 'bg-blue-100 text-blue-700',
              };
              return (
                <div key={curso.id} ref={el => courseRefs.current[curso.id] = el} onClick={() => setSelectedCourse(curso)} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-3 ${statusStyles[curso.statusType]}`}>{curso.status}</span>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors leading-snug">{curso.title}</h3>
                  <p className="text-xs font-bold text-indigo-600 mb-3">{curso.profile}</p>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-grow text-justify line-clamp-3">{curso.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                    Ver Ementa e Valores <ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INCUBADORA */}
      <IncubadoraSection />

      {/* MODAL CURSO */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-none sm:rounded-3xl w-full h-full sm:h-auto max-w-4xl sm:max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-100/80 backdrop-blur hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-full flex items-center justify-center transition-colors shadow-sm"><X size={20} /></button>
            <div className="bg-slate-50 p-5 sm:p-8 md:p-12 border-b border-slate-200 mt-12 sm:mt-0">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-${selectedCourse.color}-100 text-${selectedCourse.color}-700 mb-4`}>{selectedCourse.status}</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{selectedCourse.title}</h2>
              <p className="text-base sm:text-lg text-slate-600 text-justify">{selectedCourse.description}</p>
            </div>
            <div className="p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><CheckCircle className="text-emerald-500 shrink-0" /> Matriz Curricular</h3>
                  <AccordionCycle
                    title="Ciclo Estratégias de Negócios, Liderança e Inteligência Competitiva (180h)"
                    subtitle="Base Empreendedora & Estratégica"
                    color="indigo"
                    groupedItems={[
                      {
                        group: "Bloco Presencial (Foco em Negócios e Inovação)",
                        items: [
                          "Branding e Precificação: Estruturação de Negócios Altamente Lucrativos",
                          "Empreendedorismo na Prática: Blindagem Legal e Estruturação de CNPJ",
                          "Marketing Digital e Posicionamento de Autoridade (Personal Branding)",
                          "Inteligência Artificial Aplicada: Produtividade e Inovação"
                        ]
                      },
                      {
                        group: "Bloco Digital Flexível - EAD (Foco em Soft/Power Skills e Escalabilidade)",
                        items: [
                          "Novas Fontes de Receita: O Mercado de Laudos e Perícias [EAD]",
                          "Liderança 4.0 e Gestão de Alta Performance [EAD]",
                          "Negociação de Alto Nível e Resolução de Conflitos [EAD]",
                          "Design Thinking Aplicado: Solução Inovadora de Problemas Complexos [EAD]",
                          "Metodologia e Ensino: Como Transmitir Conhecimento Técnico [EAD]"
                        ]
                      }
                    ]}
                  />
                  <AccordionCycle
                    title="Ciclo Específico (180h)"
                    subtitle={selectedCourse.profile}
                    color="emerald"
                    items={selectedCourse.specificCycle}
                    defaultOpen
                  />
                </div>
                <div className="flex flex-col gap-5">
                  {/* Ficha técnica */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div className="flex items-start gap-2.5"><BookOpen size={16} className="text-slate-400 mt-0.5 shrink-0" /><div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Carga Horária</p><p className="font-bold text-slate-800">{selectedCourse.hours}</p></div></div>
                      <div className="flex items-start gap-2.5 col-span-1"><Monitor size={16} className="text-slate-400 mt-0.5 shrink-0" /><div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Formato</p><p className="font-bold text-slate-800 leading-tight">{selectedCourse.format}</p></div></div>
                      <div className="flex items-start gap-2.5"><Calendar size={16} className="text-slate-400 mt-0.5 shrink-0" /><div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Dia(s)</p><p className="font-bold text-slate-800">{selectedCourse.dias}</p></div></div>
                      <div className="flex items-start gap-2.5"><Clock size={16} className="text-slate-400 mt-0.5 shrink-0" /><div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Horário</p><p className="font-bold text-slate-800">{selectedCourse.horario}</p></div></div>
                      <div className="flex items-start gap-2.5"><Timer size={16} className="text-slate-400 mt-0.5 shrink-0" /><div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Duração</p><p className="font-bold text-slate-800">{selectedCourse.duration}</p></div></div>
                      <div className="flex items-start gap-2.5"><CalendarCheck size={16} className="text-slate-400 mt-0.5 shrink-0" /><div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Inscrições</p><p className="font-bold text-slate-800">{selectedCourse.inscricoes}</p></div></div>
                      <div className="flex items-start gap-2.5 col-span-2"><BookOpen size={16} className="text-slate-400 mt-0.5 shrink-0" /><div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Início das Aulas</p><p className="font-bold text-slate-800">{selectedCourse.inicioAulas}</p></div></div>
                    </div>
                  </div>

                  {/* Condições de Pagamento */}
                  <div>
                    <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">💲 Condições de Pagamento</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedCourse.pagamentos.map((p, i) => (
                        <div key={i} className={`flex flex-col justify-center rounded-xl border p-4 text-center transition-all min-h-[90px] ${p.melhor ? 'border-emerald-400 bg-emerald-50/50 shadow-sm' : 'border-slate-200 bg-white'}`}>
                          {p.melhor && (
                            <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-[10px] font-extrabold uppercase tracking-wide mb-1.5">
                              <Star size={12} fill="currentColor" className="mb-0.5" /> Melhor Condição
                            </div>
                          )}
                          <p className={`text-sm font-bold leading-snug ${p.melhor ? 'text-slate-800' : 'text-slate-600'}`}>{p.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bônus Acelerador com Cronômetro — visível apenas para admins */}
                  {isAdmin && <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl p-5 relative overflow-hidden mt-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <h4 className="text-amber-800 font-extrabold text-sm mb-2 flex items-center gap-1.5 relative z-10">
                      <Zap size={16} className="text-amber-600" fill="currentColor" /> Bônus Acelerador: Início Imediato
                    </h4>
                    <p className="text-xs text-amber-900/80 font-medium mb-3 relative z-10 leading-relaxed text-justify">
                      Fure a fila de espera. Ao garantir sua matrícula <strong>hoje</strong>, você assegura seu lugar para a próxima liberação deste bônus exclusivo. <strong>Bônus será ativado em breve:</strong>
                    </p>

                    <div className="mb-4 relative z-10">
                      <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-2">⏱ Tempo restante para ativação:</p>
                      <CountdownTimer targetDate={new Date('2026-08-17T00:00:00')} />
                    </div>

                    <ul className="space-y-2.5 relative z-10">
                      <li className="flex items-start gap-2 text-xs text-amber-900">
                        <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                        <span>Acesso integral antecipado ao <strong className="font-extrabold">Bloco Digital (EAD)</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-amber-900">
                        <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                        <span><strong className="font-extrabold">Masterplan de Carreira (Sessão 1-a-1 com Emanoel Amorim)</strong> para traçar seu plano de estudos e rota de sucesso no mercado.</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-amber-900">
                        <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                        <span><strong className="font-extrabold">Mentoria de Destravamento e Implementação (Bônus Exclusivo)</strong> 30 dias após a conclusão do ciclo EAD para acelerar seus resultados.</span>
                      </li>
                    </ul>
                  </div>

                  <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 sm:py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base mt-2">
                    Garantir Minha Vaga no Whatsapp <ArrowRight size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}