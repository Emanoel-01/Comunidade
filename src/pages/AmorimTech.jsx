import React, { useState } from 'react';
import { Cpu, CheckCircle2, PlayCircle, MonitorSmartphone, X } from 'lucide-react';

const techApps = [
  { id: 'gestor-predial', name: 'Gestor Predial 4.0', desc: 'CMMS completo para Órgãos Públicos e Privados.', longDesc: 'Plataforma definitiva de Gestão da Manutenção (CMMS). Tenha o controle absoluto das ordens de serviço, cronogramas preditivos baseados na NBR 5674 e dashboards interativos para tomada de decisão em tempo real.', features: ['Ordens de Serviço Digitais via App', 'Dashboard Gerencial e KPIs', 'Gestão de Estoque e Compras', 'Conformidade Automática com a NBR 5674'], tag: 'Gestão Pública', color: 'cyan', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { id: 'gpo-40', name: 'GPO 4.0', desc: 'Gestão de Projetos e Obras otimizada por Inteligência Artificial.', longDesc: 'Transforme o canteiro de obras com o GPO 4.0. Integre orçamentos, cronogramas físicos e financeiros com o poder da IA para prever atrasos, sugerir correções de rotas e manter sua margem de lucro intacta.', features: ['Integração com plataformas BIM', 'Previsão de Riscos com IA', 'Diário de Obra Digital Integrado', 'Gestão de Empreiteiros e Terceirizados'], tag: 'Gestão', color: 'blue', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 'predial-40', name: 'Predial 4.0', desc: 'O seu Plano Interativo de Manutenção automatizado.', longDesc: 'Diga adeus às planilhas esquecidas. O Predial 4.0 gera alertas automáticos para os síndicos e gestores sobre as rotinas de manutenção preventiva, elevando a vida útil dos sistemas e reduzindo o custo condominial.', features: ['Alertas automáticos via WhatsApp/Email', 'Cadastro do Inventário de Equipamentos', 'Histórico Documental na Nuvem', 'App focado na usabilidade do Síndico'], tag: 'Manutenção', color: 'fuchsia', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { id: 'engenhariapro', name: 'EngenhariaPro AI', desc: 'Assistente Virtual Técnico com 500+ prompts avançados.', longDesc: 'Seu copiloto de engenharia 24/7. Desenvolvido para tirar dúvidas técnicas baseadas no acervo de normas da ABNT, calcular estimativas rápidas e auxiliar na elaboração de textos para laudos e pareceres técnicos.', features: ['Banco com mais de 500 prompts validados', 'Respostas pautadas em normas técnicas', 'Assistente de escrita para Laudos', 'Interface estilo Chat interativo'], tag: 'Assistente', color: 'emerald', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 'vistoria-cautelar', name: 'Vistoria Cautelar Pro', desc: 'Aplicativo mobile para Laudos de Vizinhança otimizados.', longDesc: 'Esqueça a prancheta e a câmara digital separada. Fotografe, anote as patologias diretamente na imagem e gere o Laudo Cautelar de Vizinhança (PDF) ainda no local da vistoria, pronto para assinatura.', features: ['Captura de fotos com marcação na tela', 'Templates de laudos pré-configurados', 'Geração de PDF offline', 'Assinatura digital integrada'], tag: 'Vistoria', color: 'teal', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 'smartvisto', name: 'SmartVisto', desc: 'Checklist Inteligente para Recebimento de Imóveis.', longDesc: 'O SmartVisto revoluciona o momento da entrega das chaves. Um checklist inteligente que cruza as especificações do memorial descritivo com o que foi executado, gerando transparência para construtoras e compradores.', features: ['Checklists dinâmicos por tipologia', 'Integração com o Memorial Descritivo', 'Relatório de Não-Conformidades Automático', 'Auditoria de qualidade com fotos'], tag: 'Vistoria', color: 'rose', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { id: 'inspecao-ia', name: 'InspeçãoIA', desc: 'Inspeção Predial Inteligente com IA.', longDesc: 'Acelere o processo de inspeção predial utilizando visão computacional e inteligência artificial para identificar anomalias, categorizar prioridades de manutenção e gerar relatórios fotográficos estruturados automaticamente.', features: ['Identificação de patologias por imagem', 'Categorização de risco e urgência', 'Relatórios fotográficos automáticos', 'Sincronização e backup na nuvem'], tag: 'Inspeção', color: 'amber', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { id: 'laudoacess-pro', name: 'LaudoAcess Pro', desc: 'Software focado em Laudos de Acessibilidade.', longDesc: 'Ferramenta dedicada à elaboração de Laudos de Acessibilidade em total conformidade com a NBR 9050. Realize checklists interativos e o cálculo automático de inclinações de rampas, escadas e dimensões de forma rápida e segura.', features: ['Checklist interativo da NBR 9050', 'Calculadora de rampas e vãos integrada', 'Geração de Laudo em PDF', 'Biblioteca de soluções de acessibilidade'], tag: 'Laudos', color: 'violet', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4' },
];

export default function AmorimTech() {
  const [selectedTechApp, setSelectedTechApp] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
      {/* HEADER */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold tracking-wide mb-6"><Cpu size={16} /> Ecossistema SaaS & Inteligência Artificial</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">A Tecnologia da Construção 4.0</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto text-justify md:text-center">Desenvolvemos plataformas e aplicativos que digitalizam o canteiro de obras, automatizam a gestão predial e trazem previsibilidade financeira através de dados e IA.</p>
      </div>

      {/* APP DESTAQUE */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden mb-16 shadow-2xl text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-5 sm:p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg">G</div>
              <div><span className="text-cyan-400 font-bold text-sm tracking-wider uppercase">{techApps[0].tag}</span><h3 className="text-3xl font-bold">{techApps[0].name}</h3></div>
            </div>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed text-justify">{techApps[0].longDesc}</p>
            <ul className="space-y-4 mb-10">
              {techApps[0].features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-slate-200"><CheckCircle2 className="text-cyan-400 shrink-0" size={20} /> {feature}</li>
              ))}
            </ul>
            <button onClick={() => setSelectedTechApp(techApps[0])} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg w-full"><PlayCircle size={20} /> Ver Demonstração em Vídeo</button>
          </div>
          <div className="bg-slate-800 relative min-h-[300px] lg:min-h-full">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full aspect-video bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden relative group cursor-pointer" onClick={() => setSelectedTechApp(techApps[0])}>
                <video src={techApps[0].videoUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" preload="auto" playsInline muted loop autoPlay />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 bg-cyan-500/90 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform"><PlayCircle size={40} className="ml-1" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIS APPS */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2"><MonitorSmartphone className="text-indigo-600" /> Mais Soluções do Ecossistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techApps.slice(1).map((app, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-extrabold text-2xl shadow-sm group-hover:scale-110 transition-transform">{app.name.charAt(0)}</div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border border-slate-100">{app.tag}</span>
              </div>
              <h4 className="font-bold text-xl text-slate-900 mb-2">{app.name}</h4>
              <p className="text-slate-600 mb-8 flex-grow text-justify leading-relaxed">{app.desc}</p>
              <button onClick={() => setSelectedTechApp(app)} className="w-full bg-slate-50 hover:bg-indigo-600 text-slate-800 hover:text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-200 hover:border-indigo-600"><PlayCircle size={18} /> Ver Detalhes e Vídeo</button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center mt-12">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Precisa de uma solução customizada para sua empresa?</h3>
        <p className="text-slate-600 mb-6">Síndicos, construtoras e administradoras — agende uma demonstração de 15 minutos e veja o sistema funcionando na prática, aplicado ao seu cenário real.</p>
        <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">Agendar Demonstração de 15 Minutos</a>
      </div>

      {/* MODAL APP */}
      {selectedTechApp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <button onClick={() => setSelectedTechApp(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow-md backdrop-blur-md"><X size={20} /></button>
            <div className="w-full aspect-video bg-black relative">
              <video src={selectedTechApp.videoUrl} className="w-full h-full object-contain" controls autoPlay playsInline />
            </div>
            <div className="p-6 sm:p-10">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider rounded-full mb-3">{selectedTechApp.tag}</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{selectedTechApp.name}</h2>
              <p className="text-lg text-slate-600 text-justify leading-relaxed mb-6">{selectedTechApp.longDesc}</p>
              <ul className="space-y-3 mb-8">
                {selectedTechApp.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> {f}</li>
                ))}
              </ul>
              <div className="mt-4 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setSelectedTechApp(null)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Fechar</button>
                <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md">Solicitar Acesso</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}