import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageSquare, Trash2, Eye, EyeOff, Search, Pencil, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminForum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await base44.entities.CommunityPost.list('-created_date', 100);
    setPosts(data);
    setLoading(false);
  };

  const toggleStatus = async (post) => {
    const newStatus = post.status === 'active' ? 'hidden' : 'active';
    await base44.entities.CommunityPost.update(post.id, { status: newStatus });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
  };

  const deletePost = async (id) => {
    if (!confirm('Excluir este post do fórum?')) return;
    await base44.entities.CommunityPost.delete(id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = posts.filter(p =>
    !search || p.content?.toLowerCase().includes(search.toLowerCase()) || p.author_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Moderação do Fórum</h2>
          <p className="text-sm text-slate-500">{posts.length} posts no fórum da comunidade</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2 w-full sm:w-72">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por autor ou conteúdo..."
            className="text-sm focus:outline-none w-full bg-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-extrabold text-slate-900">{posts.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total de Posts</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{posts.filter(p => p.status === 'active').length}</p>
          <p className="text-xs text-slate-500 mt-1">Publicados</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-extrabold text-red-500">{posts.filter(p => p.status === 'hidden').length}</p>
          <p className="text-xs text-slate-500 mt-1">Ocultados</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl border border-slate-200 h-20 animate-pulse"></div>)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-slate-600">Nenhum post encontrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map(post => (
              <div key={post.id} className={`p-5 hover:bg-slate-50 transition-colors ${post.status === 'hidden' ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                    {post.author_avatar
                      ? <img src={post.author_avatar} className="w-full h-full object-cover" alt="" />
                      : post.author_name?.charAt(0)?.toUpperCase()
                    }
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{post.author_name}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{post.author_role}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">
                        {post.created_date ? format(new Date(post.created_date), "dd/MM/yy 'às' HH:mm", { locale: ptBR }) : ''}
                      </span>
                      <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold ${post.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {post.status === 'active' ? 'Publicado' : 'Oculto'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>👍 {post.likes || 0} curtidas</span>
                      <span>💬 {post.comments_count || 0} comentários</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleStatus(post)}
                      title={post.status === 'active' ? 'Ocultar post' : 'Reativar post'}
                      className={`p-2 rounded-lg transition-colors ${post.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    >
                      {post.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}