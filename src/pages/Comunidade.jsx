import React, { useState } from 'react';
import {
  LockKeyhole, CheckCircle2, LayoutDashboard, Briefcase, Download, Calendar,
  UserCircle, Users, ShieldCheck, ThumbsUp, MessageCircle, Plus, Building2,
  ChevronLeft, UserPlus, Edit3, Award, Quote, Target, Bell, X
} from 'lucide-react';

const communityUsers = [
  { id: 'u1', name: 'Emanoel Amorim', role: 'admin', roleLabel: 'Docente & Mentor', avatar: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg', banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070', about: 'Arquiteto, Mestre em Engenharia e Fundador da Amorim Tech. Especialista em inovação e gestão 4.0.', followers: 1542, following: 45, badges: ['Admin', 'Autoridade', 'Mestre'], testimonials: [{author: 'Roberto Lima', text: 'Melhor professor de gestão de obras que já tive. Abriu minha mente para a tecnologia no canteiro.'}] },
  { id: 'u2', name: 'Mariana Silva', role: 'aluno', roleLabel: 'Aluna ESUDA (Turma 2025)', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', banner: 'https://images.unsplash.com/photo-1541888082470-fa415039f60f?w=800', about: 'Engenheira Civil focada em Manutenção Predial e BIM. Buscando aplicar soluções de IoT em edifícios de alto fluxo em Recife.', followers: 120, following: 85, badges: ['Pioneira', 'Resolvedora'], testimonials: [{author: 'Emanoel Amorim', text: 'Aluna dedicada, com excelente visão analítica sobre anomalias estruturais.'}] },
  { id: 'u3', name: 'Construtora Alpha', role: 'parceiro', roleLabel: 'Parceiro Comercial', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150', banner: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', about: 'Buscamos os melhores talentos formados na ESUDA para integrar nossos canteiros de obras pelo Nordeste.', followers: 530, following: 10, badges: ['Parceiro Ouro', 'Contratante'], testimonials: [] },
];

const communityFeed = [
  { id: 1, authorId: 'u2', authorName: 'Mariana Silva', authorRole: 'Aluna ESUDA', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', time: 'Há 2 horas', content: 'Hoje apliquei os conceitos de NBR 16.747 na minha primeira Vistoria Cautelar autônoma! O app Vistoria Pro da Amorim Tech salvou minha vida na hora de gerar o relatório no local. 🚀🏗️', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', likes: 45, comments: 12 },
  { id: 2, authorId: 'u1', authorName: 'Emanoel Amorim', authorRole: 'Docente & Mentor', avatar: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg', time: 'Há 5 horas', content: 'Atenção alunos da Turma GPO: A planilha atualizada de precificação baseada em valor (Value-Based Pricing) já está disponível na aba de materiais. Façam o download e ajustem suas propostas dessa semana.', likes: 112, comments: 8 },
  { id: 3, authorId: 'u3', authorName: 'Construtora Alpha', authorRole: 'Parceiro Comercial', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150', time: 'Ontem', content: 'Temos uma vaga aberta para Fiscal de Obras Jr. Exigimos conhecimento em ferramentas digitais de gestão. Alunos ESUDA têm prioridade na triagem. Confiram os detalhes na aba Vagas!', likes: 89, comments: 25 },
];

const communityJobs = [
  { id: 1, title: 'Engenheiro Fiscal de Campo', company: 'Construtora Alpha', type: 'Empregado (CLT)', location: 'Recife/PE', date: 'Publicado hoje' },
  { id: 2, title: 'Laudo de Vizinhança (Freelance)', company: 'Condomínio Residencial Parque', type: 'Contrato PJ', location: 'Olinda/PE', date: 'Há 2 dias' },
  { id: 3, title: 'Analista BIM 4D', company: 'TechBuild Engenharia', type: 'Remoto', location: 'Brasil', date: 'Há 1 semana' },
];

export default function Comunidade() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [comunidadeTab, setComunidadeTab] = useState('feed');
  const [viewingProfile, setViewingProfile] = useState(null);

  const currentUserObj = userRole === 'admin' ? communityUsers[0] : communityUsers[1];

  if (!isLoggedIn) {
    return (
      <div className="bg-slate-100 min-h-screen animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full border border-slate-200">
            <div className="md:w-1/2 bg-slate-900 text-white p-10 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000')] bg-cover bg-center"></div>
              <div className="relative z-10">
                <LockKeyhole className="text-emerald-400 w-12 h-12 mb-6" />
                <h2 className="text-3xl font-extrabold mb-4">Comunidade Exclusiva</h2>
                <p className="text-slate-300 mb-8 text-sm">O maior ecossistema de profissionais de Engenharia Diagnóstica e Gestão de Obras.</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400"/> Fórum Técnico Especializado</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400"/> Vagas de Emprego Ocultas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400"/> Materiais Exclusivos</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Acessar Plataforma</h3>
              <div className="space-y-4 mb-8">
                <div><label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label><input type="email" placeholder="seu@email.com" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">Senha</label><input type="password" placeholder="••••••••" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
              <button onClick={() => { setIsLoggedIn(true); setUserRole('aluno'); setComunidadeTab('feed'); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-md mb-3">Entrar como Aluno</button>
              <button onClick={() => { setIsLoggedIn(true); setUserRole('admin'); setComunidadeTab('feed'); }} className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl transition-all shadow-md">Entrar como Admin</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Esquerda */}
        <aside className="lg:col-span-3 space-y-6 hidden md:block">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-16 bg-slate-900 bg-cover bg-center" style={{ backgroundImage: `url(${currentUserObj.banner})`}}></div>
            <div className="px-4 pb-4 relative text-center">
              <img src={currentUserObj.avatar} alt="User" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm mx-auto -mt-8 mb-2 bg-white" />
              <h3 className="font-bold text-slate-900 leading-tight">{currentUserObj.name}</h3>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">{currentUserObj.roleLabel}</p>
              <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
                <div className="text-center"><p className="font-bold text-slate-800">{currentUserObj.followers}</p><p className="text-xs text-slate-500">Seguidores</p></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
            {[
              { tab: 'feed', icon: LayoutDashboard, label: 'Fórum e Feed' },
              { tab: 'vagas', icon: Briefcase, label: 'Vagas e Contratos' },
              { tab: 'materiais', icon: Download, label: 'Materiais Exclusivos' },
              { tab: 'eventos', icon: Calendar, label: 'Calendário de Eventos' },
              { tab: 'perfil', icon: UserCircle, label: 'Meu Perfil' },
            ].map(({ tab, icon: Icon, label }) => (
              <button key={tab} onClick={() => { setComunidadeTab(tab); setViewingProfile(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${comunidadeTab === tab && !viewingProfile ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}><Icon size={18}/> {label}</button>
            ))}
          </div>
          <button onClick={() => { setIsLoggedIn(false); setUserRole(null); }} className="w-full text-sm text-red-600 hover:underline font-bold text-center py-2">Sair da Comunidade</button>
        </aside>

        {/* Área Central */}
        <div className="lg:col-span-6 space-y-6">
          {/* FEED */}
          {comunidadeTab === 'feed' && !viewingProfile && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
                <div className="flex gap-3">
                  <img src={currentUserObj.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
                  <button className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full px-4 text-left font-medium transition-colors text-sm">Compartilhe um aprendizado, dúvida ou conquista...</button>
                </div>
              </div>
              <div className="space-y-6">
                {communityFeed.map(post => (
                  <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 cursor-pointer group" onClick={() => setViewingProfile(communityUsers.find(u => u.id === post.authorId))}>
                        <img src={post.avatar} alt="" className="w-12 h-12 rounded-full object-cover group-hover:opacity-80 transition-opacity" />
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                            {post.authorName} {post.authorRole.includes('Docente') && <ShieldCheck size={14} className="text-indigo-500" title="Verificado"/>}
                          </h4>
                          <p className="text-xs text-slate-500">{post.authorRole} • {post.time}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>
                    {post.image && <div className="w-full rounded-xl overflow-hidden mb-4 border border-slate-100"><img src={post.image} className="w-full object-cover max-h-[300px]" alt=""/></div>}
                    <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-sm text-slate-500 font-medium">
                      <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"><ThumbsUp size={18}/> {post.likes}</button>
                      <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"><MessageCircle size={18}/> {post.comments}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VAGAS */}
          {comunidadeTab === 'vagas' && !viewingProfile && (
            <div className="animate-in fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-slate-900">Mural de Vagas</h2><p className="text-sm text-slate-500">Oportunidades exclusivas para membros.</p></div>
                {userRole === 'admin' && <button className="bg-indigo-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Postar Vaga</button>}
              </div>
              <div className="space-y-4">
                {communityJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer border-l-4 border-l-emerald-500">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1 font-medium">
                        <span className="flex items-center gap-1"><Building2 size={14}/> {job.company}</span>
                        <span>{job.type}</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap">Candidatar-se</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERFIL */}
          {(comunidadeTab === 'perfil' || viewingProfile) && (
            <div className="animate-in fade-in slide-in-from-right-4">
              {(() => {
                const profile = viewingProfile || currentUserObj;
                return (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
                    {viewingProfile && (
                      <button onClick={() => setViewingProfile(null)} className="m-4 flex items-center gap-1 text-sm font-bold text-indigo-600 hover:underline absolute z-10 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                        <ChevronLeft size={16}/> Voltar ao Feed
                      </button>
                    )}
                    <div className="h-40 bg-slate-900 bg-cover bg-center" style={{ backgroundImage: `url(${profile.banner})`}}></div>
                    <div className="px-6 pb-6 relative">
                      <div className="flex justify-between items-end mb-4">
                        <img src={profile.avatar} alt={profile.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md -mt-14 bg-white relative z-10" />
                        {profile.id !== currentUserObj.id
                          ? <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm"><UserPlus size={16}/> Seguir</button>
                          : <button className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Edit3 size={16}/> Editar Perfil</button>
                        }
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">{profile.name} {profile.role === 'admin' && <ShieldCheck size={20} className="text-indigo-500" title="Verificado"/>}</h2>
                      <p className="text-sm font-bold text-indigo-600 mb-2">{profile.roleLabel}</p>
                      <p className="text-slate-600 text-sm max-w-2xl leading-relaxed mb-4">{profile.about}</p>
                    </div>
                    <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/50">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Award className="text-amber-500"/> Mural de Conquistas</h4>
                      <div className="flex flex-wrap gap-3">
                        {profile.badges.map((badge, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Award size={16}/></div>
                            <span className="text-sm font-bold text-slate-800">{badge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {profile.testimonials.length > 0 && (
                      <div className="px-6 py-6 border-t border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Quote className="text-indigo-400"/> Recomendações Profissionais</h4>
                        <div className="space-y-4">
                          {profile.testimonials.map((test, idx) => (
                            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <p className="text-sm text-slate-700 italic mb-2">"{test.text}"</p>
                              <p className="text-xs font-bold text-slate-900">— {test.author}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {comunidadeTab === 'materiais' && !viewingProfile && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 py-20 shadow-sm animate-in fade-in">
              <Download size={48} className="mx-auto mb-4 text-indigo-200"/>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Biblioteca do Ecossistema</h3>
              <p>Planilhas, e-books e PDFs de normas disponíveis em breve.</p>
            </div>
          )}
          {comunidadeTab === 'eventos' && !viewingProfile && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 py-20 shadow-sm animate-in fade-in">
              <Calendar size={48} className="mx-auto mb-4 text-emerald-200"/>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Próximos Eventos</h3>
              <p>Acompanhe visitas técnicas e webinars ao vivo com mentores.</p>
            </div>
          )}
        </div>

        {/* Sidebar Direita */}
        <aside className="lg:col-span-3 space-y-6 hidden xl:block">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2"><Users size={16} className="text-indigo-500"/> Sugestões para Seguir</h4>
            <div className="space-y-4">
              {communityUsers.filter(u => u.id !== currentUserObj.id).map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <img src={user.avatar} className="w-10 h-10 rounded-full object-cover cursor-pointer" alt="" onClick={() => setViewingProfile(user)}/>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate cursor-pointer hover:text-indigo-600" onClick={() => setViewingProfile(user)}>{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.roleLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl border border-emerald-700 shadow-sm p-5 text-white">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-sm"><Target size={16}/> Evento em Destaque</h4>
            <p className="text-xs font-bold text-emerald-300 mb-1">Amanhã, 19:00</p>
            <p className="text-sm font-medium mb-4 leading-tight">Masterclass: Precificação de Serviços de Engenharia Diagnóstica</p>
            <button className="w-full bg-white text-emerald-900 font-bold text-xs py-2 rounded-lg hover:bg-emerald-50 transition-colors">Confirmar Presença</button>
          </div>
        </aside>
      </div>
    </div>
  );
}