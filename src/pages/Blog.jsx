import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Eye, ThumbsUp, ChevronLeft, Linkedin, MessageCircle, Search, Tag, Clock, Share2, Send, X, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useParams, useNavigate } from 'react-router-dom';
import BlogPostCard from '../components/blog/BlogPostCard';
import BlogPostView from '../components/blog/BlogPostView';
import HallOfFame from '../components/gamification/HallOfFame';

const blogCategories = ['Todos', 'Gestão 4.0', 'Manutenção Predial', 'Tecnologia BIM', 'Engenharia Legal', 'Carreira'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await base44.entities.BlogPost.filter({ status: 'published' }, '-created_date');
    setPosts(data);
    setLoading(false);
  };

  const filteredPosts = posts.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchSearch = !searchTerm || p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSelectPost = async (post) => {
    await base44.entities.BlogPost.update(post.id, { views: (post.views || 0) + 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/Blog/${post.id}`);
  };

  const selectedPost = postId ? posts.find(p => p.id === postId) : null;

  if (postId && loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }

  if (selectedPost) {
    return (
      <BlogPostView
        post={selectedPost}
        onBack={() => { navigate('/Blog'); loadPosts(); }}
        onSelectPost={handleSelectPost}
        relatedPosts={posts.filter(p => p.id !== selectedPost.id && p.category === selectedPost.category).slice(0, 3)}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Blog Mundo 4.0</h1>
          <p className="text-lg text-slate-600 mb-6">Conteúdo aprofundado sobre Construção 4.0, Gestão e Tecnologia.</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts */}
          <div className="flex-grow">
            {/* Categorias */}
            <div className="flex overflow-x-auto pb-4 mb-8 gap-2" style={{ scrollbarWidth: 'none' }}>
              {blogCategories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 animate-pulse">
                    <div className="aspect-[16/10] bg-slate-200"></div>
                    <div className="p-6 space-y-3"><div className="h-4 bg-slate-200 rounded w-3/4"></div><div className="h-3 bg-slate-200 rounded w-full"></div><div className="h-3 bg-slate-200 rounded w-2/3"></div></div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-xl font-bold text-slate-600">Nenhum artigo encontrado.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} onClick={() => handleSelectPost(post)} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Hall da Fama */}
          <div className="lg:w-80 shrink-0">
            <HallOfFame compact />
          </div>
        </div>
      </div>
    </div>
  );
}