import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MessagesSquare, Send, ThumbsUp, MessageCircle, ChevronDown, ChevronUp, Tag, Plus, X } from 'lucide-react';
import MediaUploader from '@/components/shared/MediaUploader';
import MediaGallery from '@/components/shared/MediaGallery';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CATEGORIES = ['Geral', 'Engenharia Diagnóstica', 'Gestão de Obras', 'BIM', 'Manutenção Predial', 'Engenharia Legal', 'Carreira', 'Dúvidas'];

const categoryColors = {
  'Geral': 'bg-slate-100 text-slate-700',
  'Engenharia Diagnóstica': 'bg-blue-100 text-blue-700',
  'Gestão de Obras': 'bg-amber-100 text-amber-700',
  'BIM': 'bg-purple-100 text-purple-700',
  'Manutenção Predial': 'bg-emerald-100 text-emerald-700',
  'Engenharia Legal': 'bg-rose-100 text-rose-700',
  'Carreira': 'bg-indigo-100 text-indigo-700',
  'Dúvidas': 'bg-orange-100 text-orange-700',
};

function ForumPostCard({ post, currentUser, currentProfile }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState((post.liked_by || []).includes(currentUser?.id));
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);

  const loadComments = async () => {
    const data = await base44.entities.CommunityComment.filter({ post_id: post.id }, 'created_date');
    setComments(data);
  };

  const handleLike = async () => {
    const likedBy = post.liked_by || [];
    if (liked) {
      setLiked(false);
      setLikesCount(l => l - 1);
      await base44.entities.CommunityPost.update(post.id, { likes: likesCount - 1, liked_by: likedBy.filter(id => id !== currentUser.id) });
    } else {
      setLiked(true);
      setLikesCount(l => l + 1);
      await base44.entities.CommunityPost.update(post.id, { likes: likesCount + 1, liked_by: [...likedBy, currentUser.id] });
    }
  };

  const handleToggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(s => !s);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await base44.entities.CommunityComment.create({
      post_id: post.id,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      author_avatar: currentProfile?.avatar_url || '',
      content: newComment,
    });
    const newCount = commentsCount + 1;
    setCommentsCount(newCount);
    await base44.entities.CommunityPost.update(post.id, { comments_count: newCount });
    setNewComment('');
    loadComments();
  };

  const category = post.forum_category || 'Geral';
  const timeAgo = post.created_date ? format(new Date(post.created_date), "dd 'de' MMM 'às' HH:mm", { locale: ptBR }) : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header do post */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
            {post.author_avatar
              ? <img src={post.author_avatar} className="w-full h-full object-cover" alt="" />
              : post.author_name?.charAt(0)
            }
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-bold text-slate-900 text-sm">{post.author_name}</span>
              <span className="text-xs text-slate-400">{post.author_role}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${categoryColors[category] || 'bg-slate-100 text-slate-700'}`}>
                {category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{timeAgo}</p>
          </div>
        </div>

        {post.forum_title && (
          <h3 className="font-bold text-slate-900 text-base mb-2">{post.forum_title}</h3>
        )}
        <p className="text-slate-700 text-sm leading-relaxed">{post.content}</p>

        {post.image_url && !post.media_urls?.length && (
          <div className="mt-3 rounded-xl overflow-hidden border border-slate-100">
            <img src={post.image_url} className="w-full object-cover max-h-72" alt="" />
          </div>
        )}
        {post.media_urls?.length > 0 && (
          <MediaGallery mediaUrls={post.media_urls} />
        )}
      </div>

      {/* Footer com ações */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-5 text-sm text-slate-500">
        <button onClick={handleLike} className={`flex items-center gap-1.5 font-medium transition-colors ${liked ? 'text-indigo-600' : 'hover:text-indigo-600'}`}>
          <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'} /> {likesCount}
        </button>
        <button onClick={handleToggleComments} className="flex items-center gap-1.5 font-medium hover:text-indigo-600 transition-colors">
          <MessageCircle size={16} /> {commentsCount} respostas
          {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Seção de comentários */}
      {showComments && (
        <div className="px-5 py-4 border-t border-slate-100 bg-white space-y-4">
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                  {c.author_avatar ? <img src={c.author_avatar} className="w-full h-full object-cover" alt="" /> : c.author_name?.charAt(0)}
                </div>
                <div className="bg-slate-50 rounded-xl px-3 py-2 flex-grow">
                  <p className="text-xs font-bold text-slate-800">{c.author_name}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-xs text-slate-400 text-center py-2">Seja o primeiro a responder!</p>}
          </div>
          <form onSubmit={handleComment} className="flex gap-2 pt-2 border-t border-slate-100">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              {currentProfile?.avatar_url ? <img src={currentProfile.avatar_url} className="w-full h-full object-cover" alt="" /> : currentUser?.full_name?.charAt(0)}
            </div>
            <input
              type="text"
              placeholder="Adicionar resposta..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-grow border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CommunityForum({ user, profile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', forum_category: 'Geral' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadPosts();
    const unsub = base44.entities.CommunityPost.subscribe(event => {
      if (event.type === 'create' && event.data?.is_forum) setPosts(prev => [event.data, ...prev]);
      else if (event.type === 'update') setPosts(prev => prev.map(p => p.id === event.id ? event.data : p));
      else if (event.type === 'delete') setPosts(prev => prev.filter(p => p.id !== event.id));
    });
    return unsub;
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await base44.entities.CommunityPost.filter({ status: 'active', is_forum: true }, '-created_date', 50);
    setPosts(data);
    setLoading(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    setPosting(true);
    await base44.entities.CommunityPost.create({
      author_id: user.id,
      author_name: user.full_name,
      author_avatar: profile?.avatar_url || '',
      author_role: profile?.role_label || user.role,
      forum_title: form.title,
      content: form.content,
      forum_category: form.forum_category,
      is_forum: true,
      likes: 0,
      liked_by: [],
      comments_count: 0,
      status: 'active',
    });
    setForm({ title: '', content: '', forum_category: 'Geral' });
    setShowForm(false);
    setPosting(false);
    await loadPosts();
  };

  const filtered = activeCategory === 'Todos'
    ? posts
    : posts.filter(p => p.forum_category === activeCategory);

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessagesSquare size={22} className="text-indigo-600" /> Fórum Técnico
            </h2>
            <p className="text-sm text-slate-500 mt-1">Tire dúvidas, compartilhe conhecimento e debata com a comunidade.</p>
          </div>
          <button
            onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm transition-colors"
          >
            {showForm ? <><X size={15} /> Cancelar</> : <><Plus size={15} /> Nova Pergunta</>}
          </button>
        </div>

        {/* Filtros de categoria */}
        <div className="flex overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
          {['Todos', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Formulário nova pergunta */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessagesSquare size={18} className="text-indigo-600" /> Nova Pergunta / Discussão
          </h3>
          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Título / Assunto *</label>
              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Como calcular a resistência de compressão em laudos de vistoria?"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, forum_category: cat })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${form.forum_category === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Descrição / Pergunta *</label>
              <textarea
                required
                rows={4}
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Descreva sua dúvida ou ponto de discussão com detalhes..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button
                type="submit"
                disabled={posting}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={14} /> {posting ? 'Publicando...' : 'Publicar no Fórum'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de posts */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-200 h-36 animate-pulse"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
          <MessagesSquare size={44} className="mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-bold text-slate-600 mb-2">
            {activeCategory === 'Todos' ? 'O fórum está vazio!' : `Sem posts em "${activeCategory}" ainda.`}
          </p>
          <p className="text-sm text-slate-400 mb-5">Seja o primeiro a iniciar uma discussão técnica.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            <Plus size={15} /> Criar Primeira Discussão
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <ForumPostCard
              key={post.id}
              post={post}
              currentUser={user}
              currentProfile={profile}
            />
          ))}
        </div>
      )}
    </div>
  );
}