import React, { useState, useRef } from 'react';
import { GraduationCap, ArrowRight, Briefcase, Target, TrendingUp, CheckCircle, CheckCircle2, X, ChevronDown } from 'lucide-react';
import IncubadoraSection from '@/components/academia/IncubadoraSection';

const esudaCourses = [
  { id: 'gpo', title: 'Gestão de Projetos e Obras', profile: 'O Perfil Business', status: 'Turma Iniciada', color: 'amber', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Dinheiro e Prazo. Seja o gestor que protege a margem de lucro, domina os pleitos (claims) e garante o equilíbrio financeiro da obra.', specificCycle: ['Técnicas de Orçamentos, Cobranças e Custos de Projetos', 'Técnicas de Orçamentos, Cobranças e Custos de Obras (Integração BIM 5D)', 'Técnicas de Coordenação e Compatibilização de Projetos', 'Técnicas de Planejamento e Coordenação de Obras (PERT/CPM e LOB)', 'Gestão de Riscos, Eficiência Energética e Sustentabilidade', 'Lean Construction, Last Planner System e Logística de Canteiro', 'Engenharia de Segurança e Normas de Desempenho (NBR 15.575)', 'Administração Contratual, Medições e Gestão de Pleitos (Claims)', 'Sistemas Informatizados de Gestão Integrada e BI (ERP, CDE e Power BI)'] },
  { id: 'manutencao', title: 'Engenharia e Gestão da Manutenção Predial 4.0', profile: 'O Perfil Operações', status: 'Turma Iniciada', color: 'amber', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Vida Útil e Gestão de Ativos. Lidere a era da Gestão de Facilities utilizando IoT, Drones e BIM FM para valorizar o patrimônio.', specificCycle: ['Engenharia Diagnóstica e Intervenção para Manutenção (NBR 16.747)', 'Patologias Construtivas em Estruturas e Sistemas de Envoltória', 'Manutenção Avançada em Instalações Prediais e PMOC', 'CMMS/GMAO: Implementação de Sistemas de Gestão da Manutenção', 'Manutenção Preditiva: IoT, Sensores Inteligentes e Automação Predial', 'Termografia Infravermelha e Drones na Inspeção de Ativos', 'Gestão de Ativos com BIM 7D (FM) e Orçamentação Preditiva', 'Gestão de Contratos e Fornecedores de Facilities (SLA/KPIs)', 'Gestão da Manutenção: Planejamento, KPIs e Conformidade Operacional'] },
  { id: 'bim', title: 'Tecnologia BIM na Construção Civil', profile: 'O Perfil Tech', status: 'Turma Iniciada', color: 'amber', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado no Método Virtual. Seja o BIM Manager que coordena dados, interoperabilidade e simulações complexas de construção.', specificCycle: ['BIM Arquitetura I: Modelagem Estratégica e Documentação', 'BIM Arquitetura II: Parametrização, Lógica de Projeto e Dados', 'BIM Estrutural: Detalhamento de Fabricação (LOD 400)', 'BIM Instalações I: Modelagem de Sistemas e Normatização', 'BIM Instalações II: Coordenação 3D e Clash Detection', 'Análise BIM 4D/5D: Simulação de Custos e Cronograma', 'CDE e Normatização: Implementação da ISO 19650 e BEP', 'BIM 6D e 7D: Desempenho, Sustentabilidade e Gestão de Ativos', 'BIM Estratégico: Gêmeos Digitais, IA e Business Intelligence'] },
  { id: 'legal', title: 'Engenharia Legal e Perícias: Avaliações', profile: 'O Perfil Legal/Finanças', status: 'Matrículas Abertas', color: 'emerald', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Valor e Prova. Torne-se a autoridade que o judiciário respeita. Domine regularização, auditoria e avaliação de ativos imobiliários.', specificCycle: ['Patologia das Construções, Investigação e Responsabilidade', 'Auditoria Predial e NBR 16.747: Classificação de Risco', 'Avaliação de Imóveis I: Método Comparativo (Foco Urbano)', 'Avaliação de Imóveis II: Renda, Rurais e Laudos Complexos', 'Perícias Judiciais e Vistorias Cautelares de Vizinhança', 'Perícia em Desempenho: Verificação Judicial da NBR 15.575', 'Simulação Computacional (BIM 6D) e Análise de Ciclo de Vida', 'Certificações e Auditoria de Compliance Técnico-Legal', 'Engenharia Legal Aplicada: Responsabilidade Civil e Ética'] },
  { id: 'neuroarquitetura', title: 'Neuroarquitetura', profile: 'O Perfil Human-Centric', status: 'Matrículas Abertas', color: 'emerald', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Comportamento e Bem-estar. Use a neurociência para projetar espaços que otimizam a saúde mental e a produtividade.', specificCycle: ['Neurociência Aplicada à Arquitetura', 'Ritmo Biológico e Fatores Humanos', 'Neuroarquitetura e Design Cognitivo', 'Espaços Residenciais e Comerciais: Aplicações da Neuroarquitetura', 'Espaços Corporativos: Aplicações e Princípios', 'Estímulos e Percepções: Neuroarquitetura em Espaços Verdes', 'Neuroiluminação', 'Design Biofílico', 'Neurourbanismo'] },
  { id: 'interiores', title: 'Design de Interiores Contemporâneo', profile: 'O Perfil Inovação/Estética', status: 'Matrículas Abertas', color: 'emerald', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Inovação e Funcionalidade. Crie ambientes modernos que representam novas tendências em materiais, tecnologia e estética.', specificCycle: ['Design de Superfícies', 'Iluminação de Interiores: Comerciais e Residenciais', 'Automação, Internet das Coisas e Eficiência dos Ambientes', 'Inclusão e Ergonomia', 'Antropologia do Espaço', 'Design do Mobiliário', 'Design Aplicado para Ambientes Residenciais', 'Design Aplicado para Ambientes Comerciais e Corporativos', 'Design de Interiores para o Mercado de Luxo'] },
  { id: 'acustica', title: 'Acústica Arquitetônica e Iluminação', profile: 'O Perfil Comfort/Performance', status: 'Matrículas Abertas', color: 'emerald', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Conforto Ambiental e Alta Performance. Domine as variáveis físicas do ambiente para projetos de excelência.', specificCycle: ['Acústica Gráfica e Normas', 'Estudo das Tipologias Internas I: Ambientes Residenciais e Comerciais', 'Estudo das Tipologias Internas II: Estúdios, Teatros e Cinemas', 'Estudo das Tipologias Internas III: Grandes Ambientes', 'Acústica e Iluminação Urbana', 'Iluminação, Conceituação e Normas', 'Iluminação Residencial', 'Iluminação Comercial', 'Iluminação Externa: Jardins, Praças e Edificações Históricas'] },
];



function AccordionCycle({ title, subtitle, color, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const borderColor = color === 'indigo' ? 'border-indigo-200' : 'border-emerald-200';
  const dotColor = color === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-500';
  const titleColor = color === 'indigo' ? 'text-indigo-900' : 'text-emerald-900';
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
        <ul className="space-y-3 pt-3 pb-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-slate-700 text-justify flex items-start gap-2">
              <CheckCircle2 size={14} className={`${color === 'indigo' ? 'text-indigo-500' : 'text-emerald-500'} mt-1 shrink-0`} /> {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AcademiaEsuda() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const cursosRef = useRef(null);
  const courseRefs = useRef({});

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen pb-20">
      {/* HERO */}
      <section className="bg-emerald-900 text-white pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1541888082470-fa415039f60f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/50 text-emerald-300 rounded-full text-sm font-bold tracking-wide mb-8 border border-emerald-500/30"><GraduationCap size={16} /> Faculdade ESUDA</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">Do Técnico ao Estrategista.</h1>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-10 leading-relaxed font-light max-w-3xl text-justify md:text-center px-2">O futuro da Arquitetura e Engenharia não é dos generalistas. É dos <strong>Líderes de Nicho</strong>. Domine a técnica profunda, mas saiba gerenciar, vender e liderar.</p>
          <button onClick={() => cursosRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 sm:px-10 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-base sm:text-lg w-full sm:w-auto">Ver Especializações <ArrowRight size={18} /></button>
        </div>
      </section>

      {/* 3 PILARES */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-3">O Mercado Mudou</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5">3 Pilares que Tornam Esta Formação Imbatível</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
              Saber "um pouco de tudo" não garante mais os melhores contratos nem os maiores salários. A <strong>Construção 4.0</strong> exige um novo perfil: o especialista que domina a técnica profunda, mas que também sabe gerir, vender e liderar. Nossa metodologia de <strong>Sinergia Curricular</strong> integra desenvolvimento humano, visão estratégica e tecnologia de ponta.
            </p>
          </div>

          {/* Cards dos 3 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

            {/* Pilar 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Briefcase size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">1. A Base do Profissional Empreendedor</h3>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wide text-center mb-4">Ciclo Comum — 180h</p>
              <p className="text-slate-600 text-sm leading-relaxed text-justify mb-4">
                Enquanto outras escolas ensinam apenas teoria básica, nós entregamos ferramentas para você <strong>monetizar seu conhecimento</strong>. Antes de entrar no nicho técnico, você domina:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" /><span><strong>Gestão de Negócios:</strong> Branding, Precificação e Estrutura Legal para blindar seu CPF e CNPJ.</span></li>
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" /><span><strong>Liderança 4.0:</strong> IA Aplicada, Negociação Harvard e Marketing Pessoal.</span></li>
              </ul>
              <p className="text-xs text-blue-700 font-semibold bg-blue-50 rounded-lg px-3 py-2 mt-auto">✅ Você deixa de ser apenas um executor de projetos e passa a pensar como dono do negócio.</p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Target size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">2. Especialização Cirúrgica</h3>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide text-center mb-4">7 Perfis · 7 Caminhos de Sucesso — 180h</p>
              <p className="text-slate-600 text-sm leading-relaxed text-justify mb-4">Não formamos "faz-tudo". Nossos cursos têm foco total no resultado final esperado pelo mercado. Clique em cada perfil para conhecer a especialização:</p>
              <ul className="space-y-2">
                {[
                  { id: 'gpo', emoji: '🏗️', label: 'Gestão de Projetos e Obras', sublabel: 'O Perfil Business' },
                  { id: 'bim', emoji: '💻', label: 'Tecnologia BIM', sublabel: 'O Perfil Tech' },
                  { id: 'manutencao', emoji: '⚙️', label: 'Manutenção Predial', sublabel: 'O Perfil Operations' },
                  { id: 'legal', emoji: '⚖️', label: 'Engenharia Legal', sublabel: 'O Perfil Legal/Finance' },
                  { id: 'neuroarquitetura', emoji: '🧠', label: 'Neuroarquitetura', sublabel: 'O Perfil Human-Centric' },
                  { id: 'interiores', emoji: '🎨', label: 'Design de Interiores', sublabel: 'O Perfil Inovação/Estética' },
                  { id: 'acustica', emoji: '💡', label: 'Acústica e Iluminação', sublabel: 'O Perfil Comfort/Performance' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => courseRefs.current[item.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="w-full flex items-center gap-2 text-left text-sm bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-lg px-3 py-2 transition-all group"
                    >
                      <span>{item.emoji}</span>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800 group-hover:text-emerald-700">{item.label}</span>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wide">{item.sublabel}</span>
                      </div>
                      <ArrowRight size={12} className="text-emerald-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pilar 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><TrendingUp size={32} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">3. Inteligência de Carreira</h3>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-wide text-center mb-4">Lifelong Learning</p>
              <p className="text-slate-600 text-sm leading-relaxed text-justify mb-4">
                Nosso modelo respeita seu tempo e investimento. Ao concluir uma especialização, você já eliminou todo o <strong>Ciclo Comum (360h)</strong>. Isso significa que ao buscar uma segunda certificação, você começa com <strong>50% do caminho andado</strong>, incentivando sua formação contínua sem recomeçar do zero.
              </p>
              <div className="mt-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-3xl font-extrabold text-amber-600 mb-1">50%</p>
                <p className="text-xs text-amber-700 font-semibold">do caminho já percorrido na 2ª certificação</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INCUBADORA */}
      <IncubadoraSection />

      {/* CURSOS */}
      <section ref={cursosRef} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-4">Escolha a sua Especialização</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {esudaCourses.map((curso) => (
              <div key={curso.id} ref={el => courseRefs.current[curso.id] = el} onClick={() => setSelectedCourse(curso)} className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col h-full hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer group">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${curso.color}-100 text-${curso.color}-700 w-fit mb-4`}>{curso.status}</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{curso.title}</h3>
                <p className="text-sm font-bold text-indigo-600 mb-4">{curso.profile}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow text-justify">{curso.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">Ver Ementa <ArrowRight size={18} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                    title="Ciclo Comum (180h)"
                    subtitle="Base Empreendedora & Estratégica"
                    color="indigo"
                    items={['Gestão de Escritórios, Branding e Precificação', 'Novas Fontes de Receita: Laudos e Perícias', 'Inteligência Artificial Aplicada e Design Thinking']}
                  />
                  <AccordionCycle
                    title="Ciclo Específico (180h)"
                    subtitle={selectedCourse.profile}
                    color="emerald"
                    items={selectedCourse.specificCycle}
                    defaultOpen
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
                    <h3 className="text-xl font-bold mb-2">Investimento</h3>
                    <div className="bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-700 mb-6 mt-4">
                      <span className="bg-emerald-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">Condição Especial</span>
                      <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{selectedCourse.price}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                      <div className="bg-slate-800 p-3 rounded-lg"><p className="text-xs text-slate-400 mb-1">Duração</p><p className="text-sm font-bold">{selectedCourse.duration}</p></div>
                      <div className="bg-slate-800 p-3 rounded-lg"><p className="text-xs text-slate-400 mb-1">Carga</p><p className="text-sm font-bold">{selectedCourse.hours}</p></div>
                      <div className="bg-slate-800 p-3 rounded-lg col-span-1"><p className="text-xs text-slate-400 mb-1">Formato</p><p className="text-xs font-bold leading-tight">{selectedCourse.format}</p></div>
                    </div>
                    <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 sm:py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">Garantir Minha Vaga <ArrowRight size={20} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}