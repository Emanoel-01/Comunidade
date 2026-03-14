import React, { useState } from 'react';
import { Eye, ThumbsUp, ChevronLeft, Linkedin, MessageCircle } from 'lucide-react';

const blogCategories = ['Todos', 'Gestão 4.0', 'Manutenção Predial', 'Tecnologia BIM', 'Engenharia Legal', 'Carreira'];

const initialPosts = [
  { id: 1, title: 'Como planejar um canteiro de obras verdadeiramente eficiente usando IA', excerpt: 'Descubra as práticas modernas e o uso de softwares BIM e Inteligência Artificial para otimizar os fluxos de trabalho e reduzir desperdícios desde o dia zero da obra.', content: 'A gestão de canteiros de obras passou por uma revolução silenciosa nos últimos 5 anos. O que antes era gerenciado com pranchetas e planilhas estáticas, hoje exige dinamismo e previsibilidade de dados.\n\nA integração de Inteligência Artificial no planejamento logístico permite prever gargalos de fornecimento antes mesmo que eles ocorram. Ferramentas como o GPO 4.0 analisam o histórico de produtividade das equipes e cruzam com o cronograma físico-financeiro, gerando alertas automáticos para os engenheiros de campo.\n\nAlém disso, a compatibilização em BIM 4D (tempo) permite simular o avanço físico da obra em ambiente virtual, evitando retrabalhos e garantindo que o canteiro físico reflita exatamente o planejamento estratégico. O futuro não aceita mais achismos; a margem de lucro da sua obra depende da tecnologia que você implementa hoje.', coverImage: 'https://images.unsplash.com/photo-1541888082470-fa415039f60f?auto=format&fit=crop&w=1200&q=80', category: 'Gestão 4.0', tags: ['BIM', 'Inteligência Artificial', 'Canteiro de Obras'], author: 'Emanoel Amorim', authorRole: 'CEO Amorim Tech', authorAvatar: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg', date: '12 de Março, 2026', readTime: '5 min de leitura', views: 1245, likes: 342, comments: [{ name: 'Carlos Eduardo', text: 'Excelente artigo! A parte sobre prever gargalos com IA é exatamente o que sofremos na construtora hoje.', date: 'Há 2 dias' }, { name: 'Mariana Silva', text: 'Gostaria de saber mais sobre a integração do GPO 4.0 com o MS Project.', date: 'Há 1 dia' }] },
  { id: 2, title: 'Gestão de manutenção em edifícios públicos: O Case do Palácio', excerpt: 'Aplicações práticas de CMMS, sensores IoT e Engenharia Diagnóstica para a preservação de bens tombados e edifícios de alto fluxo.', content: 'A manutenção de edifícios públicos traz desafios únicos: alta rotatividade de usuários, orçamentos engessados e, muitas vezes, a necessidade de preservar o patrimônio histórico. Neste cenário, a manutenção corretiva não é apenas cara; ela é irresponsável.\n\nImplementar um sistema CMMS (Computerized Maintenance Management System) é o primeiro passo para sair do caos. Ao digitalizar o inventário de ativos e programar rotinas preditivas baseadas na NBR 5674, o gestor público ganha controle total sobre as operações.', coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80', category: 'Manutenção Predial', tags: ['CMMS', 'Patrimônio', 'Gestão Pública', 'IoT'], author: 'Emanoel Amorim', authorRole: 'Especialista em Manutenção', authorAvatar: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg', date: '05 de Março, 2026', readTime: '7 min de leitura', views: 890, likes: 215, comments: [] },
  { id: 3, title: 'Erros comuns em laudos cautelares e como a tecnologia pode ajudar', excerpt: 'Um guia técnico para profissionais da engenharia legal evitarem falhas em vistorias de vizinhança, garantindo segurança jurídica.', content: 'O Laudo Cautelar de Vizinhança é o escudo da construtora. No entanto, vejo diariamente profissionais cometendo erros primários que invalidam o documento em disputas judiciais.\n\nFalta de rastreabilidade fotográfica, descrições genéricas de patologias e a não utilização da terminologia correta (segundo a norma do IBAPE) são os principais vilões. O uso de aplicativos específicos para vistoria, que carimbam data, hora e coordenadas GPS nas fotos automaticamente, reduziu em 90% as contestações legais nos projetos que gerenciamos.', coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80', category: 'Engenharia Legal', tags: ['Laudo Cautelar', 'Vistoria', 'Patologia'], author: 'Emanoel Amorim', authorRole: 'Engenheiro Diagnóstico', authorAvatar: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg', date: '28 de Fevereiro, 2026', readTime: '4 min de leitura', views: 1560, likes: 412, comments: [{ name: 'Roberto Lima', text: 'Sempre tive dificuldade em organizar as fotos do laudo. Esse app resolve a vida.', date: 'Há 1 semana' }] },
];

export default function Blog() {
  const [blogView, setBlogView] = useState('feed');
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [likesCount, setLikesCount] = useState({});
  const [hasLiked, setHasLiked] = useState({});

  const handleLikePost = (postId) => {
    setHasLiked(prev => ({ ...prev, [postId]: !prev[postId] }));
    setLikesCount(prev => {
      const currentLikes = prev[postId] || initialPosts.find(p => p.id === postId).likes;
      return { ...prev, [postId]: hasLiked[postId] ? currentLikes - 1 : currentLikes + 1 };
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen animate-in fade-in duration-500 pb-20">
      {blogView === 'feed' && (
        <>
          <div className="bg-white border-b border-slate-200 py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Blog Técnico</h1>
              <p className="text-lg text-slate-600">Conteúdo aprofundado sobre Construção 4.0, Gestão e Tecnologia.</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex overflow-x-auto pb-4 mb-8 gap-2" style={{ scrollbarWidth: 'none' }}>
              {blogCategories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialPosts.filter(p => activeCategory === 'Todos' || p.category === activeCategory).map(post => (
                <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl cursor-pointer flex flex-col" onClick={() => { setSelectedPost(post); setBlogView('post'); }}>
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={post.coverImage} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800">{post.category}</div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between text-xs text-slate-500 font-medium mb-3">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1"><Eye size={14}/>{post.views}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <img src={post.authorAvatar} className="w-8 h-8 rounded-full" alt=""/>
                        <span className="text-sm font-bold text-slate-800">{post.author}</span>
                      </div>
                      <div className="flex gap-3 text-slate-400">
                        <span className="flex items-center gap-1 text-xs"><ThumbsUp size={14}/>{post.likes}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}

      {blogView === 'post' && selectedPost && (
        <article className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in">
          <button onClick={() => setBlogView('feed')} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-8"><ChevronLeft size={20} /> Voltar para o Blog</button>
          <header className="mb-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">{selectedPost.category}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{selectedPost.title}</h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-y border-slate-200 py-6 mb-8">
              <div className="flex items-center gap-4">
                <img src={selectedPost.authorAvatar} className="w-14 h-14 rounded-full object-cover shadow-sm" alt="" />
                <div><p className="font-bold text-slate-900 text-lg">{selectedPost.author}</p><p className="text-sm text-slate-500">{selectedPost.authorRole} • {selectedPost.date}</p></div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-slate-100 text-blue-700 hover:bg-blue-100 flex items-center justify-center transition-colors"><Linkedin size={18}/></button>
                <button className="w-10 h-10 rounded-full bg-slate-100 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"><MessageCircle size={18}/></button>
              </div>
            </div>
          </header>
          <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full aspect-[21/9] rounded-2xl object-cover mb-12 shadow-lg" />
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed text-justify mb-16">
            {selectedPost.content.split('\n\n').map((p, i) => <p key={i} className="mb-6">{p}</p>)}
          </div>
          <div className="flex items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-12">
            <button onClick={() => handleLikePost(selectedPost.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${hasLiked[selectedPost.id] ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'}`}>
              <ThumbsUp size={20} fill={hasLiked[selectedPost.id] ? "currentColor" : "none"} />
              {hasLiked[selectedPost.id] ? 'Você curtiu' : 'Curtir Artigo'}
              <span className="ml-2 px-2 py-0.5 bg-black/10 rounded text-sm">{likesCount[selectedPost.id] || selectedPost.likes}</span>
            </button>
          </div>
          {selectedPost.comments.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Comentários ({selectedPost.comments.length})</h3>
              <div className="space-y-4">
                {selectedPost.comments.map((comment, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-slate-900">{comment.name}</p>
                      <p className="text-xs text-slate-500">{comment.date}</p>
                    </div>
                    <p className="text-slate-700 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      )}
    </div>
  );
}