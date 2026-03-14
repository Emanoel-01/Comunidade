import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ThumbsUp, ChevronLeft, Linkedin, MessageCircle, Eye, Send, Share2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BlogPostCard from './BlogPostCard';

export default function BlogPostView({ post, onBack, onSelectPost, relatedPosts }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [submitting, setSubmitting] = useState(false);
  const [shareMenu, setShareMenu] = useState(false);

  useEffect(() => {
    loadComments();
    const savedLike = localStorage.getItem(`liked_post_${post.id}`);
    if (savedLike) { setLiked(true); }
  }, [post.id]);

  const loadComments = async () => {
    const data = await base44.entities.Comment.filter({ blog_post_id: post.id }, 'created_date');
    setComments(data);
  };

  const handleLike = async () => {
    if (liked) return;
    const newCount = likesCount + 1;
    setLikesCount(newCount);
    setLiked(true);
    localStorage.setItem(`liked_post_${post.id}`, '1');
    await base44.entities.BlogPost.update(post.id, { likes: newCount });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim()) return;
    setSubmitting(true);
    await base44.entities.Comment.create({
      blog_post_id: post.id,
      author_name: commentName,
      content: newComment,
    });
    setNewComment('');
    setCommentName('');
    await loadComments();
    setSubmitting(false);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    if (platform === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${text}%20${url}`);
    if (platform === 'copy') { navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); }
    setShareMenu(false);
    base44.entities.BlogPost.update(post.id, { shares: (post.shares || 0) + 1 });
  };

  const formattedDate = post.created_date
    ? format(new Date(post.created_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : '';

  return (
    <article className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-8">
          <ChevronLeft size={20} /> Voltar para o Blog
        </button>

        <header className="mb-10">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">{post.category}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{post.title}</h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-y border-slate-200 py-6 mb-8">
            <div className="flex items-center gap-4">
              {post.author_avatar ? (
                <img src={post.author_avatar} className="w-14 h-14 rounded-full object-cover shadow-sm" alt="" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl">{post.author_name?.charAt(0)}</div>
              )}
              <div>
                <p className="font-bold text-slate-900 text-lg">{post.author_name}</p>
                <p className="text-sm text-slate-500">{post.author_role} • {formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Eye size={14} />{post.views || 0} views</span>
              {post.read_time && <span className="flex items-center gap-1"><Clock size={14} />{post.read_time}</span>}
              <div className="relative">
                <button onClick={() => setShareMenu(!shareMenu)} className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 transition-colors">
                  <Share2 size={16} /> Compartilhar
                </button>
                {shareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-30 w-48 overflow-hidden">
                    <button onClick={() => handleShare('linkedin')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-blue-700 font-medium"><Linkedin size={16} /> LinkedIn</button>
                    <button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-emerald-600 font-medium"><MessageCircle size={16} /> WhatsApp</button>
                    <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-600 font-medium">🔗 Copiar Link</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {post.cover_image && (
          <img src={post.cover_image} alt={post.title} className="w-full aspect-[21/9] rounded-2xl object-cover mb-12 shadow-lg" />
        )}

        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed text-justify mb-16">
          {(post.content || '').split('\n\n').map((p, i) => (
            <p key={i} className="mb-6">{p}</p>
          ))}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">#{tag}</span>
            ))}
          </div>
        )}

        {/* Like & Share */}
        <div className="flex items-center justify-between bg-slate-100 p-6 rounded-2xl border border-slate-200 mb-12">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${liked ? 'bg-indigo-600 text-white cursor-default' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'}`}
          >
            <ThumbsUp size={20} fill={liked ? "currentColor" : "none"} />
            {liked ? 'Você curtiu!' : 'Curtir Artigo'}
            <span className="ml-2 px-2 py-0.5 bg-black/10 rounded text-sm">{likesCount}</span>
          </button>
          <button onClick={() => setShareMenu(!shareMenu)} className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <Share2 size={18} /> Compartilhar
          </button>
        </div>

        {/* Comentários */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Comentários ({comments.length})</h3>
          <form onSubmit={handleComment} className="bg-white p-6 rounded-2xl border border-slate-200 mb-8 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Deixe seu comentário</h4>
            <input
              type="text"
              placeholder="Seu nome *"
              value={commentName}
              onChange={e => setCommentName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Seu comentário..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              required
              rows={3}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
              <Send size={16} /> {submitting ? 'Enviando...' : 'Publicar Comentário'}
            </button>
          </form>

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{comment.author_name?.charAt(0)}</div>
                    <p className="font-bold text-slate-900">{comment.author_name}</p>
                  </div>
                  <p className="text-xs text-slate-400">{comment.created_date ? format(new Date(comment.created_date), "dd/MM/yyyy 'às' HH:mm") : ''}</p>
                </div>
                <p className="text-slate-700 text-sm pl-12">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Relacionados */}
        {relatedPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Artigos Relacionados</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(p => (
                <BlogPostCard key={p.id} post={p} onClick={() => onSelectPost(p)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}