import React, { useState, useEffect, useRef } from 'react';
import { Building2, Search, Lightbulb, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const services = {
  diagnostica: [
    { title: 'Laudos Técnicos e Vistorias', desc: 'Evite riscos e assegure seus direitos com laudos certificados.', items: ['Laudos de Vistoria Predial e Garantia', 'Reforma (NBR 16280) e Acessibilidade (NBR 9050)', 'Laudo SPDA e Vizinhança'] },
    { title: 'Consultoria em Engenharia Diagnóstica', desc: 'Diagnóstico preciso de falhas construtivas com metodologia técnica.', items: ['Identificação de patologias prediais', 'Relatórios completos com fotos e recomendações', 'Normas IBAPE e ABNT rigorosamente aplicadas'] },
    { title: 'Avaliação de Imóveis', desc: 'Estipule o valor real do seu imóvel com precisão e respaldo técnico.', items: ['Laudos elaborados conforme NBR 14653', 'Ideal para venda, compra ou disputas judiciais', 'Avaliadores técnicos certificados'] },
    { title: 'Regularização e Legalização', desc: 'Seu imóvel 100% legal com apoio técnico e documental constante.', items: ['Alvarás, Habite-se e reformas legalizadas', 'Conformidade com a legislação municipal e federal', 'Evite multas e paralisações pela prefeitura'] },
  ],
  condominial: [
    { title: 'Consultoria em Engenharia Condominial', desc: 'Planejamento, manutenção e operação inteligente para condomínios.', items: ['Conformidade legal em todas as esferas', 'Aumento significativo da vida útil do prédio', 'Apoio técnico completo à gestão do síndico'] },
    { title: 'Gestão da Manutenção de Empreendimentos', desc: 'Elaboração de Plano de Manutenção para atuação preventiva.', items: ['Previsão de serviços corretivos, preventivos e preditivos', 'Preservação e valorização patrimonial da edificação', 'Redução drástica de falhas e custos emergenciais'] },
    { title: 'Gestão do Funcionamento e Operação', desc: 'Treinamento e operação técnica especializada para edifícios.', items: ['Instruções de uso adequado de sistemas e equipamentos', 'Treinamento e capacitação contínua da equipe local', 'Plano de operação personalizado conforme NBR 14037'] },
    { title: 'Gerenciamento e Fiscalização de Obras', desc: 'Controle total sobre sua obra, do início à entrega das chaves.', items: ['Redução inteligente de custos e cumprimento de prazos', 'Padrão de qualidade garantido na execução', 'Acompanhamento técnico rigoroso e diário'] },
  ],
  inovacao: [
    { title: 'Inovação e Digitalização (Construção 4.0)', desc: 'Automatize, otimize e digitalize seus processos construtivos.', items: ['Construção 4.0 aplicada de forma prática no canteiro', 'Formulários, aprovações e fluxos totalmente automatizados', 'Aumento de produtividade e redução da burocracia'] },
    { title: 'Gestão Informatizada da Manutenção', desc: 'Digitalize sua gestão predial com eficiência e controle total.', items: ['Implementação de ferramentas digitais e apps customizados', 'Controle de rotinas e manutenção com base na NBR 5674', 'Geração de indicadores, relatórios e planejamento automático'] },
    { title: 'Coordenação de Projetos', desc: 'Transforme sua ideia em um projeto viável, seguro e executável.', items: ['Estudos rigorosos de viabilidade técnica e financeira', 'Planejamento em BIM e gestão técnica de excelência', 'Coordenação sincronizada de equipes e cronograma físico'] },
    { title: 'Arquitetura Sensorial e Energética', desc: 'Melhore o fluxo de ambientes com arquitetura terapêutica.', items: ['Diagnóstico energético completo dos espaços e fluxos', 'Recomendações estratégicas de layout, luz e decoração', 'Foco na valorização do bem-estar, produtividade e harmonia'] },
  ],
};

function ServiceGrid({ items, ctaLabel }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {items.map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col">
            <h4 className="text-xl font-bold text-slate-800 mb-3">{s.title}</h4>
            <p className="text-slate-600 text-sm mb-6">{s.desc}</p>
            <ul className="space-y-3 flex-grow">
              {s.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-justify">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center">
        <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-base transition-colors shadow-md">
          {ctaLabel} <ArrowRight size={18} />
        </a>
      </div>
    </>
  );
}

export default function AmorimArquitetura() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
      {/* HERO */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden mb-16 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-bold tracking-wide mb-6 border border-blue-500/30">
              <Building2 size={16} /> Especialistas em Engenharia Consultiva
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Excelência técnica para proteger o seu patrimônio.</h2>
            <p className="text-lg text-slate-300 leading-relaxed text-justify">A Amorim Arquitetura é pioneira em Engenharia Condominial e Diagnóstica em Pernambuco. Unimos o rigor técnico das normas da ABNT com a inovação da Construção 4.0 para garantir a conformidade legal e otimizar os custos do seu empreendimento.</p>
          </div>
        </div>
      </div>

      {/* GALERIA PORTFÓLIO */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Portfólio de Projetos</h3>
        <p className="text-slate-600 mb-8">Mais de 15 anos de projetos executados para órgãos públicos, instituições e empreendimentos privados em Pernambuco e no Brasil.</p>

        {/* Projetos em destaque */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="group relative overflow-hidden rounded-2xl shadow-md border border-slate-200 cursor-pointer" style={{height: 320}}>
            <img src="https://static.wixstatic.com/media/152459_6339ba323283427daa071eb7d16349ab~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/2014.jpg" alt="Nova Sede CRC/PE" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-6">
              <div>
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">2021 · CRC/PE</span>
                <p className="text-white text-lg font-bold leading-tight mt-1">Gerenciamento da Nova Sede do CRC/PE</p>
                <p className="text-slate-300 text-sm mt-1">Recife/PE</p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl shadow-md border border-slate-200 cursor-pointer" style={{height: 320}}>
            <img src="https://static.wixstatic.com/media/152459_84fd38ffd69849378852a469c196cf20~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/RFRN.jpg" alt="Receita Federal RN" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-6">
              <div>
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">2019 · Receita Federal</span>
                <p className="text-white text-lg font-bold leading-tight mt-1">Nova Sede da Delegacia da Receita Federal</p>
                <p className="text-slate-300 text-sm mt-1">Natal/RN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de projetos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { img: 'https://static.wixstatic.com/media/152459_15e60566f08a4fcf828b0c37630ce2ed~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/sol.jpg', label: 'Usina Solar CRC/PE', year: '2023' },
            { img: 'https://static.wixstatic.com/media/152459_b214383a73d14514ad8901a5cb287041~mv2.png/v1/crop/x_359,y_0,w_583,h_731/fill/w_300,h_375,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cor.png', label: 'Residencial Parque de Exposições', year: '2024' },
            { img: 'https://static.wixstatic.com/media/152459_0dedafe2eeda4698981281984bcf0c99~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Basilica%20do%20Carmo%20_JPG.jpg', label: 'Restauração Basílica do Carmo', year: '2019' },
            { img: 'https://static.wixstatic.com/media/152459_306189bdcd0d41e583a79b549afcba9c~mv2.jpg/v1/fill/w_300,h_375,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/CRC-PE%20-%20VISTA%2001.jpg', label: 'Projeto Nova Sede CRC/PE', year: '2017' },
            { img: 'https://static.wixstatic.com/media/152459_bcf3588cf83b4d30afb4dd255a9c3e07~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/DSC00299_JPG.jpg', label: 'Capela São João Batista do Brum', year: '2017' },
            { img: 'https://static.wixstatic.com/media/152459_04c2c92f8ef843218671d733881c4b64~mv2.png/v1/crop/x_530,y_0,w_861,h_1080/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Largo%20do%20Monte.png', label: 'Requalificação Largo do Monte', year: '2017' },
            { img: 'https://static.wixstatic.com/media/152459_0a72b01d9aa9414cae7ab49644a3dcd2~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/parquedasesculturas-1.jpg', label: 'Atrativos Turísticos do Recife', year: '2015' },
            { img: 'https://static.wixstatic.com/media/152459_f4a82f2ec8e84ae19863af18f9c440e8~mv2.jpg/v1/crop/x_290,y_0,w_861,h_1080/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/teleferico%20recife06.jpg', label: 'Teleférico Parque Dois Irmãos', year: '2015' },
            { img: 'https://static.wixstatic.com/media/152459_19c8ac599d664aeab9bfc55afa4a5639~mv2.jpg/v1/crop/x_665,y_0,w_1977,h_2480/fill/w_300,h_375,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/FORUM%20justi%C3%A7a%20federal.jpg', label: 'Fórum Des. Neves Filho', year: '2015' },
            { img: 'https://static.wixstatic.com/media/152459_eba2191949b14057a6b1fc5693f2ab8c~mv2.jpg/v1/crop/x_322,y_0,w_957,h_1200/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/taatro11.jpg', label: 'Cine Teatro Quartel do Derby', year: '2014' },
            { img: 'https://static.wixstatic.com/media/152459_e7a542e59257490a8661700ab41915fa~mv2.jpg/v1/crop/x_77,y_0,w_265,h_332/fill/w_300,h_375,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/blog-engenho_edited.jpg', label: 'Restauração Engenho São João', year: '2012' },
            { img: 'https://static.wixstatic.com/media/152459_1920e747843046e8b52ca5306d85e91d~mv2.jpg/v1/fill/w_300,h_375,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/P1010034_JPG.jpg', label: 'Restauração Engenho Monjope', year: '2011' },
          ].map((item, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl aspect-square shadow-sm border border-slate-200 cursor-pointer">
              <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div>
                  <p className="text-blue-300 text-xs font-bold">{item.year}</p>
                  <p className="text-white text-xs font-semibold leading-tight">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIAGNÓSTICA */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Search className="text-blue-600" /> Engenharia Diagnóstica e Legal</h3>
        <p className="text-slate-600 mb-8">Diagnósticos precisos e laudos técnicos para garantir segurança jurídica e estrutural.</p>
        <ServiceGrid items={services.diagnostica} ctaLabel="Solicitar Proposta" />
      </div>

      {/* CONDOMINIAL */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Building2 className="text-blue-600" /> Gestão Condominial e Operação</h3>
        <p className="text-slate-600 mb-8">Ferramentas e processos para aumentar a vida útil e reduzir custos emergenciais do seu prédio.</p>
        <ServiceGrid items={services.condominial} ctaLabel="Agendar Consultoria" />
      </div>

      {/* INOVAÇÃO */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Lightbulb className="text-blue-600" /> Projetos e Inovação 4.0</h3>
        <p className="text-slate-600 mb-8">A união da arquitetura moderna com as soluções tecnológicas do amanhã.</p>
        <ServiceGrid items={services.inovacao} ctaLabel="Falar com um Especialista" />
      </div>

      {/* CTA */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center mt-10 sm:mt-16">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Mais de 100 projetos executados com sucesso</h3>
        <p className="text-slate-600 mb-8 max-w-2xl text-justify md:text-center">A Amorim Arquitetura é a escolha de grandes instituições públicas, privadas e condomínios que não abrem mão de segurança, rigor normativo e tecnologia de ponta.</p>
        <Link to={createPageUrl('Home')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 py-3.5 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 text-sm sm:text-base text-center">Ver Órgãos que Confiam na Nossa Engenharia <ArrowRight size={18} className="shrink-0" /></Link>
      </div>
    </div>
  );
}