import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ThumbsUp, MessageCircle, ShieldCheck, Send, Image, X, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function PostCard({ post, currentUser, currentProfile, onViewProfile }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState((post.liked_by || []).includes(currentUser?.id));
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const loadComments = async () => {
    const data = await base44.entities.CommunityComment.filter({ post_id: post.id }, 'created_date');
    setComments(data);
  };

  const handleLike = async () => {
    const likedBy = post.liked_by || [];
    if (liked) {
      const newLikedBy = likedBy.filter(id => id !== currentUser.id);
      setLiked(false);
      setLikesCount(l => l - 1);
      await base44.entities.CommunityPost.update(post.id, { likes: likesCount - 1, liked_by: newLikedBy });
    } else {
      setLiked(true);
      setLikesCount(l => l + 1);
      await base44.entities.CommunityPost.update(post.id, { likes: likesCount + 1, liked_by: [...likedBy, currentUser.id] });
    }
  };

  const handleToggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await base44.entities.CommunityComment.create({
      post_id: post.id,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      content: newComment
    });
    await base44.entities.CommunityPost.update(post.id, { comments_count: (post.comments_count || 0) + 1 });
    setNewComment('');
    loadComments();
  };

  const timeAgo = post.created_date ? format(new Date(post.created_date), "dd 'de' MMM", { locale: ptBR }) : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 cursor-pointer group" onClick={() => onViewProfile(post.author_id)}>
          {post.author_avatar ? (
            <img src={post.author_avatar} alt="" className="w-12 h-12 rounded-full object-cover group-hover:opacity-80 transition-opacity" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">{post.author_name?.charAt(0)}</div>
          )}
          <div>
            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
              {post.author_name}
              {post.author_role?.includes('Docente') && <ShieldCheck size={14} className="text-indigo-500" title="Verificado" />}
            </h4>
            <p className="text-xs text-slate-500">{post.author_role} • {timeAgo}</p>
          </div>
        </div>
      </div>

      <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>

      {post.image_url && (
        <div className="w-full rounded-xl overflow-hidden mb-4 border border-slate-100">
          <img src={post.image_url} className="w-full object-cover max-h-[320px]" alt="" />
        </div>
      )}

      <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-sm text-slate-500 font-medium">
        <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-indigo-600' : 'hover:text-indigo-600'}`}>
          <ThumbsUp size={18} fill={liked ? 'currentColor' : 'none'} /> {likesCount}
        </button>
        <button onClick={handleToggleComments} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
          <MessageCircle size={18} /> {post.comments_count || 0}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {comments.map(c => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">{c.author_name?.charAt(0)}</div>
                <div className="bg-slate-50 rounded-xl px-3 py-2 flex-grow">
                  <p className="text-xs font-bold text-slate-800">{c.author_name}</p>
                  <p className="text-sm text-slate-700">{c.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-xs text-slate-400 text-center py-2">Nenhum comentário ainda.</p>}
          </div>
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Comentar..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-grow border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CommunityFeed({ user, profile, onViewProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadPosts();
    const unsub = base44.entities.CommunityPost.subscribe(event => {
      if (event.type === 'create') setPosts(prev => [event.data, ...prev]);
      else if (event.type === 'update') setPosts(prev => prev.map(p => p.id === event.id ? event.data : p));
      else if (event.type === 'delete') setPosts(prev => prev.filter(p => p.id !== event.id));
    });
    return unsub;
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await base44.entities.CommunityPost.filter({ status: 'active' }, '-created_date', 30);
    setPosts(data);
    setLoading(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setPosting(true);
    await base44.entities.CommunityPost.create({
      author_id: user.id,
      author_name: user.full_name,
      author_avatar: profile?.avatar_url || '',
      author_role: profile?.role_label || user.role,
      content: newPostContent,
      likes: 0,
      liked_by: [],
      comments_count: 0,
      status: 'active'
    });
    setNewPostContent('');
    setPosting(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Caixa de criação */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" /> : user?.full_name?.charAt(0)}
          </div>
          <form onSubmit={handlePost} className="flex-grow flex gap-2">
            <textarea
              placeholder="Compartilhe um aprendizado, dúvida ou conquista..."
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              rows={2}
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <button type="submit" disabled={posting || !newPostContent.trim()} className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-40">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-200 h-40 animate-pulse"></div>)}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <p className="text-lg font-bold text-slate-600 mb-2">O feed ainda está vazio!</p>
          <p className="text-sm">Seja o primeiro a postar algo interessante.</p>
        </div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} currentUser={user} currentProfile={profile} onViewProfile={onViewProfile} />
        ))
      )}
    </div>
  );
}