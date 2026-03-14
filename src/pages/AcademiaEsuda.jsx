import React, { useState, useRef } from 'react';
import { GraduationCap, ArrowRight, Briefcase, Target, TrendingUp, BarChart3, Info, Calendar, FileText, CheckCircle, CheckCircle2, Users, Award, X } from 'lucide-react';

const esudaCourses = [
  { id: 'gpo', title: 'Gestão de Projetos e Obras', profile: 'O Perfil Business', status: 'Turma Iniciada', color: 'amber', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Dinheiro e Prazo. Seja o gestor que protege a margem de lucro, domina os pleitos (claims) e garante o equilíbrio financeiro da obra.', specificCycle: ['Técnicas de Orçamentos, Cobranças e Custos de Projetos', 'Técnicas de Orçamentos, Cobranças e Custos de Obras (Integração BIM 5D)', 'Técnicas de Coordenação e Compatibilização de Projetos', 'Técnicas de Planejamento e Coordenação de Obras (PERT/CPM e LOB)', 'Gestão de Riscos, Eficiência Energética e Sustentabilidade', 'Lean Construction, Last Planner System e Logística de Canteiro', 'Engenharia de Segurança e Normas de Desempenho (NBR 15.575)', 'Administração Contratual, Medições e Gestão de Pleitos (Claims)', 'Sistemas Informatizados de Gestão Integrada e BI (ERP, CDE e Power BI)'] },
  { id: 'manutencao', title: 'Engenharia e Gestão da Manutenção Predial 4.0', profile: 'O Perfil Operações', status: 'Turma Iniciada', color: 'amber', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Vida Útil e Gestão de Ativos. Lidere a era da Gestão de Facilities utilizando IoT, Drones e BIM FM para valorizar o patrimônio.', specificCycle: ['Engenharia Diagnóstica e Intervenção para Manutenção (NBR 16.747)', 'Patologias Construtivas em Estruturas e Sistemas de Envoltória', 'Manutenção Avançada em Instalações Prediais e PMOC', 'CMMS/GMAO: Implementação de Sistemas de Gestão da Manutenção', 'Manutenção Preditiva: IoT, Sensores Inteligentes e Automação Predial', 'Termografia Infravermelha e Drones na Inspeção de Ativos', 'Gestão de Ativos com BIM 7D (FM) e Orçamentação Preditiva', 'Gestão de Contratos e Fornecedores de Facilities (SLA/KPIs)', 'Gestão da Manutenção: Planejamento, KPIs e Conformidade Operacional'] },
  { id: 'bim', title: 'Tecnologia BIM na Construção Civil', profile: 'O Perfil Tech', status: 'Turma Iniciada', color: 'amber', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado no Método Virtual. Seja o BIM Manager que coordena dados, interoperabilidade e simulações complexas de construção.', specificCycle: ['BIM Arquitetura I: Modelagem Estratégica e Documentação', 'BIM Arquitetura II: Parametrização, Lógica de Projeto e Dados', 'BIM Estrutural: Detalhamento de Fabricação (LOD 400)', 'BIM Instalações I: Modelagem de Sistemas e Normatização', 'BIM Instalações II: Coordenação 3D e Clash Detection', 'Análise BIM 4D/5D: Simulação de Custos e Cronograma', 'CDE e Normatização: Implementação da ISO 19650 e BEP', 'BIM 6D e 7D: Desempenho, Sustentabilidade e Gestão de Ativos', 'BIM Estratégico: Gêmeos Digitais, IA e Business Intelligence'] },
  { id: 'legal', title: 'Engenharia Legal e Perícias: Avaliações', profile: 'O Perfil Legal/Finanças', status: 'Matrículas Abertas', color: 'emerald', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Valor e Prova. Torne-se a autoridade que o judiciário respeita. Domine regularização, auditoria e avaliação de ativos imobiliários.', specificCycle: ['Patologia das Construções, Investigação e Responsabilidade', 'Auditoria Predial e NBR 16.747: Classificação de Risco', 'Avaliação de Imóveis I: Método Comparativo (Foco Urbano)', 'Avaliação de Imóveis II: Renda, Rurais e Laudos Complexos', 'Perícias Judiciais e Vistorias Cautelares de Vizinhança', 'Perícia em Desempenho: Verificação Judicial da NBR 15.575', 'Simulação Computacional (BIM 6D) e Análise de Ciclo de Vida', 'Certificações e Auditoria de Compliance Técnico-Legal', 'Engenharia Legal Aplicada: Responsabilidade Civil e Ética'] },
  { id: 'neuroarquitetura', title: 'Neuroarquitetura', profile: 'O Perfil Human-Centric', status: 'Matrículas Abertas', color: 'emerald', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Comportamento e Bem-estar. Use a neurociência para projetar espaços que otimizam a saúde mental e a produtividade.', specificCycle: ['Neurociência Aplicada à Arquitetura', 'Ritmo Biológico e Fatores Humanos', 'Neuroarquitetura e Design Cognitivo', 'Espaços Residenciais e Comerciais: Aplicações da Neuroarquitetura', 'Espaços Corporativos: Aplicações e Princípios', 'Estímulos e Percepções: Neuroarquitetura em Espaços Verdes', 'Neuroiluminação', 'Design Biofílico', 'Neurourbanismo'] },
  { id: 'interiores', title: 'Design de Interiores Contemporâneo', profile: 'O Perfil Inovação/Estética', status: 'Matrículas Abertas', color: 'emerald', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Inovação e Funcionalidade. Crie ambientes modernos que representam novas tendências em materiais, tecnologia e estética.', specificCycle: ['Design de Superfícies', 'Iluminação de Interiores: Comerciais e Residenciais', 'Automação, Internet das Coisas e Eficiência dos Ambientes', 'Inclusão e Ergonomia', 'Antropologia do Espaço', 'Design do Mobiliário', 'Design Aplicado para Ambientes Residenciais', 'Design Aplicado para Ambientes Comerciais e Corporativos', 'Design de Interiores para o Mercado de Luxo'] },
  { id: 'acustica', title: 'Acústica Arquitetônica e Iluminação', profile: 'O Perfil Comfort/Performance', status: 'Matrículas Abertas', color: 'emerald', duration: '10 meses', hours: '360 h', format: 'Presencial, Gravadas, Remoto', price: '10 x R$ 249,00', description: 'Focado em Conforto Ambiental e Alta Performance. Domine as variáveis físicas do ambiente para projetos de excelência.', specificCycle: ['Acústica Gráfica e Normas', 'Estudo das Tipologias Internas I: Ambientes Residenciais e Comerciais', 'Estudo das Tipologias Internas II: Estúdios, Teatros e Cinemas', 'Estudo das Tipologias Internas III: Grandes Ambientes', 'Acústica e Iluminação Urbana', 'Iluminação, Conceituação e Normas', 'Iluminação Residencial', 'Iluminação Comercial', 'Iluminação Externa: Jardins, Praças e Edificações Históricas'] },
];

export default function AcademiaEsuda() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const cursosRef = useRef(null);

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

      {/* ARQUITETURA CURRICULAR */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">A Arquitetura Curricular Inteligente</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-16 text-lg text-justify md:text-center">Projetada para resolver o abismo entre a técnica e o negócio.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Briefcase, color: 'blue', num: '1.', title: 'Base Empreendedora', desc: 'O Ciclo Comum (180h) foca em Gestão de Negócios, Branding, Precificação, Liderança 4.0, IA Aplicada e Negociação Harvard.' },
              { icon: Target, color: 'emerald', num: '2.', title: 'Especialização Cirúrgica', desc: 'O Ciclo Técnico (180h) tem foco total no resultado final esperado pelo mercado. Escolha entre 7 caminhos de sucesso para dominar seu nicho.' },
              { icon: TrendingUp, color: 'amber', num: '3.', title: 'Inteligência de Carreira', desc: 'Ao concluir uma especialização, você já eliminou todo o Ciclo Comum. Isso permite obter uma segunda certificação com 50% do caminho andado.' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 bg-${item.color}-100 text-${item.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6`}><item.icon size={32} /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.num} {item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCUBADORA */}
      <section className="py-20 bg-slate-900 text-white border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-bold tracking-wide mb-4"><TrendingUp size={16} /> Aceleradora de Carreiras</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Incubadora Profissional</h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed text-justify md:text-center">Não vendemos apenas diplomas, monitoramos o seu sucesso real.</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl max-w-3xl mx-auto mb-12 shadow-lg">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h4 className="font-bold text-lg text-white">Projeto de Incubadora nº 1</h4>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12}/> Início: 30/08/2025</span>
                  <span className="flex items-center gap-1"><Calendar size={12}/> Fim: 29/05/2026</span>
                </div>
              </div>
              <div className="text-right"><span className="text-emerald-400 font-extrabold text-2xl">72%</span><p className="text-xs text-slate-400 hidden sm:block">Em andamento (196 de 272 dias)</p></div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3"><div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-3 rounded-full" style={{ width: '72%' }}></div></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white border-b border-slate-700 pb-3"><BarChart3 className="text-emerald-500" /> Transparência do ROI Financeiro</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm font-medium mb-1">Investimento da Turma</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white mb-2">R$ 67.166,40</p>
                  <p className="text-xs text-slate-500">28 alunos × R$ 1.999 + 20%</p>
                </div>
                <div className="bg-emerald-900/20 rounded-xl p-5 sm:p-6 border border-emerald-500/30">
                  <p className="text-emerald-400 text-sm font-medium mb-1">Ganho Total Agregado</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white mb-2">R$ 224.999,99</p>
                  <p className="text-xs text-emerald-500/70 font-medium">Através de 4 atividades reais</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <p className="text-emerald-100 text-sm font-bold uppercase tracking-wide mb-1">Retorno Médio sobre o Investimento</p>
                  <h4 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-md">235.0%</h4>
                  <p className="text-emerald-200 mt-2 font-medium">Retorno Positivo Comprovado</p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0"><TrendingUp className="text-white w-8 h-8 sm:w-10 sm:h-10" /></div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-white border-b border-slate-700 pb-3 mb-6"><Award className="text-blue-500" /> Autoridade e Networking</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/20 flex flex-col items-center text-center"><Calendar size={28} className="text-blue-400 mb-2" /><span className="text-2xl font-bold text-white">3</span><span className="text-xs text-slate-400">Eventos</span></div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20 flex flex-col items-center text-center"><FileText size={28} className="text-purple-400 mb-2" /><span className="text-2xl font-bold text-white">2</span><span className="text-xs text-slate-400">Artigos Científicos</span></div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-emerald-500/20 flex flex-col items-center text-center"><CheckCircle size={28} className="text-emerald-400 mb-2" /><span className="text-2xl font-bold text-white">1</span><span className="text-xs text-slate-400">Certificado Antecipado</span></div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-amber-500/20 flex flex-col items-center text-center"><Users size={28} className="text-amber-400 mb-2" /><span className="text-2xl font-bold text-white">4</span><span className="text-xs text-slate-400">Ações de Network</span></div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Feed de Publicações e Conquistas</h4>
                <div className="bg-slate-800 rounded-xl p-2 h-72 overflow-y-auto border border-slate-700">
                  <div className="flex flex-col gap-2 p-2">
                    {[
                      { type: 'artigo', icon: <FileText size={16}/>, color: 'text-purple-400', bg: 'bg-purple-500/20', title: 'Eficiência e Inovação na Construção Civil...', date: 'Out/2025' },
                      { type: 'artigo', icon: <FileText size={16}/>, color: 'text-purple-400', bg: 'bg-purple-500/20', title: 'Aplicações do BIM: Uma Abordagem...', date: 'Set/2025' },
                      { type: 'cargo', icon: <Briefcase size={16}/>, color: 'text-amber-400', bg: 'bg-amber-500/20', title: 'Projetista (Freelancer)', date: 'Set/2025' },
                      { type: 'evento', icon: <Calendar size={16}/>, color: 'text-blue-400', bg: 'bg-blue-500/20', title: 'Visita Técnica à Obra no Palácio J. Nabuco', date: 'Ago/2025' },
                      { type: 'cargo', icon: <Briefcase size={16}/>, color: 'text-amber-400', bg: 'bg-amber-500/20', title: 'Engenheiro Fiscal de Campo', date: 'Ago/2025' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg hover:bg-slate-600 transition-colors">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>{item.icon}</div>
                        <div className="flex-grow overflow-hidden"><p className="text-sm font-bold text-white truncate">{item.title}</p><p className="text-[10px] text-slate-400 uppercase tracking-wide">{item.type}</p></div>
                        <div className="shrink-0 text-xs font-mono text-slate-500">{item.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
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
            {esudaCourses.map((curso) => (
              <div key={curso.id} onClick={() => setSelectedCourse(curso)} className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col h-full hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer group">
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
                  <div className="mb-8 relative pl-6 border-l-2 border-indigo-200">
                    <div className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-[9px] top-1"></div>
                    <h4 className="font-bold text-lg text-indigo-900 mb-2">Ciclo Comum (180h)</h4>
                    <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wide">Base Empreendedora & Estratégica</p>
                    <ul className="space-y-3">
                      <li className="text-sm text-slate-700 text-justify">Gestão de Escritórios, Branding e Precificação</li>
                      <li className="text-sm text-slate-700 text-justify">Novas Fontes de Receita: Laudos e Perícias</li>
                      <li className="text-sm text-slate-700 text-justify">Inteligência Artificial Aplicada e Design Thinking</li>
                    </ul>
                  </div>
                  <div className="relative pl-6 border-l-2 border-emerald-200">
                    <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-1"></div>
                    <h4 className="font-bold text-lg text-emerald-900 mb-2">Ciclo Específico (180h)</h4>
                    <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wide">{selectedCourse.profile}</p>
                    <ul className="space-y-3">
                      {selectedCourse.specificCycle.map((disciplina, idx) => (
                        <li key={idx} className="text-sm text-slate-700 text-justify flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-1 shrink-0" /> {disciplina}
                        </li>
                      ))}
                    </ul>
                  </div>
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