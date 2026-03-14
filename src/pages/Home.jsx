import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, ArrowRight, LockKeyhole, CheckCircle2, Building2, Cpu, GraduationCap,
  MessageSquare, Star, Search, X, Upload, Send, ThumbsUp, Eye, ChevronLeft,
  Award, Wifi, Briefcase, MessageCircle
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const timeline = [
  { year: '2026', title: 'CEO, CTO & Arquiteto de Soluções da Amorim TECH', description: 'Atuação como Product Manager da Marca e Técnico Responsável pela migração da arquitetura de protótipos e unificação para uma infraestrutura de escala industrial.', icon: 'tech', imageUrl: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg' },
  { year: '2025', title: 'Analista de Processos e Arquiteto de Soluções Digitais', description: 'Desenvolvimento (por Vibe Coding) de 09 Protótipos de apps de gestão inteligente das edificações.', icon: 'tech', imageUrl: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg' },
  { year: '2024', title: 'Mestrado em Engenharia Civil', description: 'Gestão da Manutenção de Edificações em Instituições Públicas. UPE - Universidade de Pernambuco.', icon: 'academic' },
  { year: '2024', title: 'Coordenador e Docente de Cursos de Especialização', description: 'Atuação na Faculdade Esuda.', icon: 'work', imageUrl: 'https://esuda.edu.br/wp-content/uploads/2024/01/cropped-cor-1000-x-474.png' },
  { year: '2024', title: 'Residencial Parque de Exposições', description: 'Projeto Arquitetônico. Módulos I a IV. Sertenge Engenharia S/A | Local: Recife/PE', icon: 'project', imageUrl: 'https://static.wixstatic.com/media/152459_b214383a73d14514ad8901a5cb287041~mv2.png/v1/crop/x_359,y_0,w_583,h_731/fill/w_300,h_375,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cor.png' },
  { year: '2023', title: 'Usina Solar CRC/PE', description: 'Fiscalização da Execução da Usina Solar na Nova Sede. CRC/PE | Local: Recife/PE', icon: 'project', imageUrl: 'https://static.wixstatic.com/media/152459_15e60566f08a4fcf828b0c37630ce2ed~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/sol.jpg' },
  { year: '2021', title: 'Nova Sede do CRC/PE', description: 'Gerenciamento da Construção da Nova Sede. CRC/PE | Local: Recife/PE', icon: 'project', imageUrl: 'https://static.wixstatic.com/media/152459_6339ba323283427daa071eb7d16349ab~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/2014.jpg' },
  { year: '2019', title: 'Sede da Receita Federal em Natal/RN', description: 'Projeto da Nova Sede da Delegacia da Receita Federal. RFRN | Local: Natal/RN', icon: 'project', imageUrl: 'https://static.wixstatic.com/media/152459_84fd38ffd69849378852a469c196cf20~mv2.jpg/v1/fill/w_480,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/RFRN.jpg' },
  { year: '2017', title: 'MBA em Gerenciamento de Projetos', description: 'Metodologia gerenciamento de projeto de conservação e restauro em bens tombados. Faculdade Esuda.', icon: 'academic' },
  { year: '2010-2014', title: 'Graduação em Arquitetura e Urbanismo', description: 'Faculdade Ciências Humanas Esuda.', icon: 'academic' },
];

const clientes = [
  { name: 'Olinda', img: 'https://static.wixstatic.com/media/152459_4061729626104e168084e4d0754e8127~mv2.png', url: 'https://www.olinda.pe.gov.br/' },
  { name: 'Fundarpe', img: 'https://static.wixstatic.com/media/152459_a405b7697049405c918dd6e770cd5f49~mv2.png', url: 'https://www.cultura.pe.gov.br/fundarpe/' },
  { name: 'Exército Brasileiro', img: 'https://static.wixstatic.com/media/152459_92c0f8c115684e90af78f9d83aefed33~mv2.png', url: 'https://www.eb.mil.br/' },
  { name: 'Receita Federal', img: 'https://static.wixstatic.com/media/152459_d4dcbb772d374989bbeb724904f6201e~mv2.png', url: 'https://www.gov.br/receitafederal/pt-br' },
  { name: 'CAERN', img: 'https://static.wixstatic.com/media/152459_d3a662e89e814d529a66057477fd210c~mv2.png', url: 'https://www.caern.com.br/' },
  { name: 'CRC PE', img: 'https://static.wixstatic.com/media/152459_dbf4eb8100a94256a307b8a02927e73a~mv2.png', url: 'https://crcpe.org.br/' },
  { name: 'IPHAN', img: 'https://static.wixstatic.com/media/152459_4873a14f769f47f8b08211fd0f81960c~mv2.png', url: 'http://portal.iphan.gov.br/' },
  { name: 'SETUR PE', img: 'https://static.wixstatic.com/media/152459_35f88d1bc05b4399804cd635c2f82b31~mv2.png', url: 'http://www.setur.pe.gov.br/' },
  { name: 'ESUDA', img: 'https://static.wixstatic.com/media/152459_65dbdb6da2344dfabafd66cdc9b0218b~mv2.jpg', url: 'https://esuda.edu.br/' },
  { name: 'Sertenge', img: 'https://static.wixstatic.com/media/152459_6f8de0148c96485796e37b8513ad3aa0~mv2.png', url: 'https://www.sertenge.com.br/' },
  { name: 'JFPE', img: 'https://static.wixstatic.com/media/152459_3a9f8d3bb4ee46439988cf98c425e31a~mv2.png', url: 'https://www.jfpe.jus.br/' },
  { name: 'TRT 6', img: 'https://static.wixstatic.com/media/152459_dbb16ca85da747fa859b21f286a841a2~mv2.jpg', url: 'https://www.trt6.jus.br/' },
  { name: 'URB Recife', img: 'https://static.wixstatic.com/media/152459_b99ea89715c744c19f29d704cbebe484~mv2.jpg', url: 'https://www2.recife.pe.gov.br/' },
];

export default function Home() {
  const ecosystemRef = useRef(null);
  const instituicoesRef = useRef(null);

  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [testimonialsModalView, setTestimonialsModalView] = useState(null);
  const [testimonialFormSubmitted, setTestimonialFormSubmitted] = useState(false);
  const [zoomedMedia, setZoomedMedia] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', email: '', phone: '', text: '', photo: null });
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    base44.entities.Testimonial.filter({ approved: true }).then(setTestimonials);
  }, []);

  const timelineRef = useRef(null);
  const autoScrollInterval = useRef(null);

  const scrollToEcosystem = () => { if (ecosystemRef.current) ecosystemRef.current.scrollIntoView({ behavior: 'smooth' }); };

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const toggleAutoScroll = () => {
    if (isAutoScroll) { clearInterval(autoScrollInterval.current); setIsAutoScroll(false); }
    else {
      setIsAutoScroll(true);
      autoScrollInterval.current = setInterval(() => {
        if (timelineRef.current) {
          const maxScroll = timelineRef.current.scrollWidth - timelineRef.current.clientWidth;
          if (timelineRef.current.scrollLeft >= maxScroll) { timelineRef.current.scrollTo({ left: 0, behavior: 'smooth' }); }
          else { timelineRef.current.scrollBy({ left: 2, behavior: 'auto' }); }
        }
      }, 30);
    }
  };

  useEffect(() => {
    if (!isPortfolioModalOpen && autoScrollInterval.current) { clearInterval(autoScrollInterval.current); setIsAutoScroll(false); }
    return () => { if (autoScrollInterval.current) clearInterval(autoScrollInterval.current); };
  }, [isPortfolioModalOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setTestimonialForm({ ...testimonialForm, photo: reader.result }); };
      reader.readAsDataURL(file);
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialForm.photo) { alert("Por favor, anexe uma foto para o depoimento."); return; }
    let photoUrl = testimonialForm.photo;
    // Upload da foto para storage
    const blob = await fetch(testimonialForm.photo).then(r => r.blob());
    const file = new File([blob], 'testimonial.jpg', { type: blob.type });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    photoUrl = file_url;
    await base44.entities.Testimonial.create({
      author_name: testimonialForm.name,
      author_email: testimonialForm.email,
      author_phone: testimonialForm.phone,
      text: testimonialForm.text,
      author_photo: photoUrl,
      approved: false,
    });
    setTestimonialFormSubmitted(true);
    setTestimonialForm({ name: '', email: '', phone: '', text: '', photo: null });
  };

  const getIconComponent = (iconType) => {
    switch(iconType) {
      case 'tech': return <Wifi className="w-6 h-6 text-indigo-600" />;
      case 'academic': return <Award className="w-6 h-6 text-blue-600" />;
      case 'work': return <Briefcase className="w-6 h-6 text-green-600" />;
      case 'project': return <Award className="w-6 h-6 text-orange-600" />;
      default: return <Briefcase className="w-6 h-6 text-slate-600" />;
    }
  };

  const getIconBg = (iconType) => {
    switch(iconType) {
      case 'tech': return 'bg-indigo-100 border-indigo-300';
      case 'academic': return 'bg-slate-100 border-slate-300';
      case 'work': return 'bg-green-100 border-green-300';
      case 'project': return 'bg-orange-100 border-orange-300';
      default: return 'bg-slate-100 border-slate-300';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* HERO */}
      <section className="bg-indigo-900 text-white pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-xl md:text-2xl text-indigo-200 font-medium tracking-widest uppercase mb-4">Emanoel Amorim</h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">Transformando a Construção <br className="hidden md:block" />com Tecnologia.</h2>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">Arquiteto, Mestre em Engenharia, Founder da AmorimTech e Coordenador Acadêmico.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={createPageUrl('Comunidade')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-3.5 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
              <LockKeyhole size={18} /> Entrar na Comunidade
            </Link>
            <button onClick={scrollToEcosystem} className="bg-indigo-800 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-lg border border-indigo-700 transition-all flex items-center justify-center gap-2">
              Conhecer o Ecossistema <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* INSTITUIÇÕES - logo após o Hero */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6">Instituições que Confiam no Nosso Trabalho</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6 items-center justify-items-center opacity-70">
            {clientes.map((cliente, idx) => (
              <a key={idx} href={cliente.url} target="_blank" rel="noreferrer" className="w-full max-w-[120px] aspect-[3/2] flex items-center justify-center p-2 rounded-xl hover:bg-slate-50 hover:shadow-sm hover:opacity-100 transition-all grayscale hover:grayscale-0">
                <img src={cliente.img} alt={cliente.name} className="max-w-full max-h-full object-contain" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <div className="md:w-1/3">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img src="https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg" alt="Emanoel Amorim" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Trajetória e Propósito</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed text-justify">Com profundo conhecimento em engenharia diagnóstica, gestão condominial e preservação de patrimônios históricos, percebi que a <strong>tecnologia e a educação</strong> são os caminhos definitivos para transformar a construção civil no Brasil.</p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed text-justify">Atuo na linha de frente liderando a <strong>Amorim Arquitetura</strong> (consultoria técnica) e a <strong>Amorim Tech</strong> (ferramentas 4.0). Na academia, dedico-me como <strong>Coordenador de Pós-Graduação na ESUDA</strong>, formando os líderes preparados para os desafios do mercado real.</p>
              <button onClick={() => setIsPortfolioModalOpen(true)} className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2">
                Ver Linha do Tempo Profissional <ChevronRight size={18}/>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100">
            <div className="text-center px-2 sm:px-4 border-b lg:border-b-0 lg:border-r border-slate-200 pb-4 lg:pb-0"><p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1">+15 anos</p><p className="text-slate-600 font-medium text-xs sm:text-sm">de experiência e atuação na construção civil</p></div>
            <div className="text-center px-2 sm:px-4 border-b lg:border-b-0 lg:border-r border-slate-200 pb-4 lg:pb-0"><p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1">+100</p><p className="text-slate-600 font-medium text-xs sm:text-sm">projetos e laudos executados</p></div>
            <div className="text-center px-2 sm:px-4 border-b lg:border-b-0 lg:border-r border-slate-200 pb-4 lg:pb-0"><p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1">+200.000m²</p><p className="text-slate-600 font-medium text-xs sm:text-sm">de empreendimentos gerenciados</p></div>
            <div className="text-center px-2 sm:px-4"><p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1">+70</p><p className="text-slate-600 font-medium text-xs sm:text-sm">produções científicas</p></div>
          </div>
        </div>
      </section>

      {/* ECOSSISTEMA */}
      <section ref={ecosystemRef} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Conheça nosso Ecossistema</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Soluções integradas que vão da formação acadêmica à aplicação de inteligência artificial no canteiro de obras.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: 'Amorim Arquitetura', desc: 'Consultoria estratégica, laudos e engenharia diagnóstica com foco em eficiência, segurança e preservação.', link: 'AmorimArquitetura', color: 'blue' },
              { icon: Cpu, title: 'Amorim Tech', desc: 'Desenvolvendo o ecossistema digital inteligente (SaaS e IA) para a gestão da manutenção e processos construtivos.', link: 'AmorimTech', color: 'indigo' },
              { icon: GraduationCap, title: 'Academia ESUDA', desc: 'Formando os líderes do futuro na Manutenção Predial e Engenharia Condominial através de especializações de elite.', link: 'AcademiaEsuda', color: 'emerald' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-xl transition-all group flex flex-col">
                <div className={`w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-6 group-hover:bg-${item.color}-50 group-hover:text-${item.color}-600 transition-colors`}><item.icon className="w-8 h-8" /></div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 mb-8 flex-grow text-justify">{item.desc}</p>
                <Link to={createPageUrl(item.link)} className={`text-${item.color}-600 font-semibold flex items-center w-full justify-between pt-4 border-t border-slate-100`}>
                  Saiba Mais <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMUNIDADE BANNER */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-block mb-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-bold tracking-wide">Acesso Restrito</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Comunidade Profissional de Engenharia</h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed text-justify">Um espaço exclusivo dedicado ao networking de alto nível, onde nossos alunos, professores e parceiros comerciais trocam conhecimentos reais do mercado.</p>
              <ul className="space-y-4 mb-10">
                {['Fórum Técnico e debates de casos práticos', 'Oportunidades de trabalho e vagas no setor', 'Materiais, normas e planilhas exclusivas', 'Networking com grandes empresas e síndicos'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200 font-medium"><CheckCircle2 className="text-emerald-400" size={20} /> {item}</li>
                ))}
              </ul>
              <Link to={createPageUrl('Comunidade')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-4 rounded-lg transition-all shadow-lg inline-flex items-center justify-center gap-2 text-lg">Entrar na Comunidade</Link>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center"><LockKeyhole size={48} className="text-white/70 mb-4" /><p className="text-white font-bold text-lg mb-2">Conteúdo Exclusivo</p><p className="text-slate-300 text-sm">Faça login para visualizar este conteúdo.</p></div>
                <div className="opacity-40 blur-[3px] select-none pointer-events-none">
                  <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 bg-blue-500 rounded-lg"></div><div><div className="h-4 w-48 bg-slate-300 rounded mb-2"></div><div className="h-3 w-32 bg-slate-400 rounded"></div></div></div>
                  <div className="space-y-3 mb-6"><div className="h-3 w-full bg-slate-300 rounded"></div><div className="h-3 w-5/6 bg-slate-300 rounded"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUIÇÕES - seção removida daqui, movida para logo após o Hero */}

      {/* DEPOIMENTOS */}
      <section className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900">O que dizem nossos clientes</h2>
              <p className="text-slate-600">Resultados reais através de excelência técnica.</p>
            </div>
            <div className="flex flex-col gap-3 items-center md:items-start">
              <button onClick={() => setTestimonialsModalView('form')} className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shadow-md"><MessageSquare size={18} /> Deixe seu Depoimento</button>
              <button onClick={() => setTestimonialsModalView('gallery')} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 group">Ver Galeria Completa <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card de vídeo fixo */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className="aspect-square overflow-hidden relative">
                <iframe
                  src="https://drive.google.com/file/d/1XKNc4PTfsifmd_B4pS2GoDt3xct60Y8b/preview"
                  className="w-full h-full"
                  allow="autoplay"
                  title="Depoimento em vídeo"
                ></iframe>
              </div>
              <div className="p-4 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">Annah Paula Freire</p>
                <p className="text-slate-500 text-xs mt-1">Arquiteta Paisagista • Especialista em Transformação de Pessoas</p>
                <p className="text-slate-600 text-xs mt-1 italic line-clamp-3">"Com diplomacia e competência, Emanoel conseguiu adequar os perfis profissionais, com prazo e a melhor forma de atender o cliente."</p>
              </div>
            </div>
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden relative group cursor-pointer" onClick={() => setZoomedMedia({ src: t.author_photo, text: t.text, name: t.author_name })}>
                <div className="aspect-square overflow-hidden">
                  <img src={t.author_photo} alt={t.author_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 pointer-events-none">
                  <p className="text-white font-bold text-sm">{t.author_name}</p>
                  <p className="text-slate-300 text-xs mt-1 line-clamp-3">{t.text}</p>
                </div>
                <div className="p-4 border-t border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{t.author_name}</p>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL: PORTFOLIO / TIMELINE */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-50 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <button onClick={() => setIsPortfolioModalOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur border border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center transition-colors shadow-sm"><X size={20} /></button>
            <div className="p-6 sm:p-10">
              <div className="text-center mb-8">
                <img src="https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg" alt="Emanoel Amorim" className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-indigo-600 shadow-lg mx-auto mb-4" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Meu Perfil: Gestão Estratégica e Tecnologia</h1>
                <p className="text-lg text-slate-600 mt-2 font-medium">Emanoel Amorim - Arquiteto e Urbanista</p>
              </div>
              <div className="bg-indigo-900 p-6 sm:p-8 rounded-2xl shadow-inner text-white mb-10 border border-indigo-800">
                <h4 className="font-bold text-xl mb-3">Apresentação em Áudio</h4>
                <div className="bg-slate-900/50 p-2 rounded-xl border border-indigo-500/30">
                  <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/episode/1NXYnNIrKCwm3sVtjQRGlD?utm_source=generator&t=431&theme=0" width="100%" height="152" frameBorder="0" allowFullScreen="" loading="lazy" title="Podcast" />
                </div>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 mb-10 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2"><Award className="w-6 h-6 text-indigo-600" /> Trajetória & Portfólio</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => scrollTimeline('left')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={toggleAutoScroll} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors hidden sm:block ${isAutoScroll ? "bg-indigo-600 text-white" : "border border-slate-200 hover:bg-slate-50"}`}>{isAutoScroll ? 'Pausar Scroll' : 'Auto-Scroll'}</button>
                    <button onClick={() => scrollTimeline('right')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
                <div ref={timelineRef} className="overflow-x-auto scroll-smooth flex gap-6 pb-6 pt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {timeline.map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-72 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 relative group">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2"><div className="inline-block bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 shadow-sm"><span className="text-xs font-bold text-indigo-700">{item.year}</span></div></div>
                      <div className="flex justify-center mt-6 mb-4"><div className={`w-16 h-16 rounded-full border-2 ${getIconBg(item.icon)} flex items-center justify-center overflow-hidden bg-slate-50`}>{item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : getIconComponent(item.icon)}</div></div>
                      <h4 className="font-bold text-sm text-slate-900 mb-2 text-center">{item.title}</h4>
                      <p className="text-xs text-slate-600 text-justify leading-relaxed line-clamp-4">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DEPOIMENTOS */}
      {testimonialsModalView && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`bg-slate-50 rounded-2xl w-full ${testimonialsModalView === 'gallery' ? 'max-w-6xl' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto shadow-2xl relative`}>
            <button onClick={() => { setTestimonialsModalView(null); setTestimonialFormSubmitted(false); }} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur border border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center transition-colors shadow-md"><X size={20} /></button>
            {testimonialsModalView === 'gallery' && (
              <div className="p-6 sm:p-10">
                <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2"><Star className="text-amber-500" fill="currentColor" /> Galeria de Depoimentos</h2>
                  <button onClick={() => setTestimonialsModalView('form')} className="hidden md:flex bg-indigo-900 hover:bg-indigo-800 text-white font-bold px-4 py-2 rounded-lg items-center gap-2"><MessageSquare size={16} /> Enviar o meu</button>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {testimonials.map((t, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative group cursor-pointer" onClick={() => setZoomedMedia({ src: t.author_photo, text: t.text, name: t.author_name })}>
                      <div className="aspect-square overflow-hidden">
                        <img src={t.author_photo} alt={t.author_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3 border-t border-slate-100">
                        <p className="font-bold text-slate-900 text-sm">{t.author_name}</p>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-3">{t.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {testimonialsModalView === 'form' && (
              <div className="p-6 sm:p-10 bg-white rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Deixe seu depoimento</h3>
                  <button onClick={() => setTestimonialsModalView('gallery')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><ChevronLeft size={16} /> Voltar à Galeria</button>
                </div>
                {testimonialFormSubmitted ? (
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={40} /></div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Depoimento Enviado!</h4>
                    <p className="text-slate-500 text-sm">Seu depoimento será analisado e publicado em breve.</p>
                    <button onClick={() => { setTestimonialsModalView('gallery'); setTestimonialFormSubmitted(false); }} className="text-white bg-indigo-900 hover:bg-indigo-800 px-6 py-2 rounded-lg font-bold mt-4">Voltar à Galeria</button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleTestimonialSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo ou Empresa *</label>
                      <input type="text" required placeholder="Como deseja ser identificado?" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
                        <input type="email" required placeholder="seu@email.com" value={testimonialForm.email} onChange={e => setTestimonialForm({...testimonialForm, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Telefone *</label>
                        <input type="tel" required placeholder="(81) 90000-0000" value={testimonialForm.phone} onChange={e => setTestimonialForm({...testimonialForm, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Seu Relato *</label>
                      <textarea rows="4" required placeholder="Conte-nos como foi sua experiência com nossos serviços ou ferramentas..." value={testimonialForm.text} onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder-slate-400"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sua Foto (Obrigatória) *</label>
                      <div className="w-full border-2 border-dashed border-slate-300 rounded-lg px-4 py-6 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer relative gap-2">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
                        {testimonialForm.photo ? (
                          <div className="text-emerald-600 font-bold flex items-center gap-2"><CheckCircle2 size={18} /> Foto Anexada! (Clique para Trocar)</div>
                        ) : (
                          <>
                            <Upload size={24} className="text-slate-400" />
                            <span className="text-slate-500 text-sm">Clique para anexar imagem</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-bold flex justify-center gap-2 mt-2 text-base">Enviar Avaliação <Send size={18} /></button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ZOOM FOTO */}
      {zoomedMedia && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8 bg-slate-900/95 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200" onClick={() => setZoomedMedia(null)}>
          <button onClick={() => setZoomedMedia(null)} className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"><X size={28} /></button>
          <div className="flex flex-col md:flex-row items-center gap-6 max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={zoomedMedia.src} alt="Ampliado" className="max-h-[70vh] max-w-full md:max-w-sm object-contain rounded-xl shadow-2xl" />
            {zoomedMedia.text && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md">
                <p className="text-white text-base leading-relaxed mb-4">"{zoomedMedia.text}"</p>
                <p className="text-emerald-400 font-bold">— {zoomedMedia.name}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}