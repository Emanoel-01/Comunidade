import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ThumbsUp, MessageCircle, ShieldCheck, Send, Briefcase, Download, Calendar, ExternalLink, FileText } from 'lucide-react';
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

// Card de Evento para o feed
function EventCard({ event }) {
  const isPast = event.event_date && new Date(event.event_date) < new Date();
  const typeColors = {
    'Webinar': 'bg-blue-100 text-blue-700',
    'Visita Técnica': 'bg-emerald-100 text-emerald-700',
    'Masterclass': 'bg-purple-100 text-purple-700',
    'Workshop': 'bg-amber-100 text-amber-700',
    'Evento Presencial': 'bg-rose-100 text-rose-700',
  };
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${isPast ? 'opacity-70' : 'border-l-4 border-l-indigo-500'}`}>
      <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2 text-xs font-bold text-indigo-600">
        <Calendar size={13} /> Novo Evento na Comunidade
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeColors[event.type] || 'bg-slate-100 text-slate-700'}`}>{event.type}</span>
              {isPast && <span className="text-xs text-slate-400">Encerrado</span>}
            </div>
            <h3 className="font-bold text-slate-900 text-base">{event.title}</h3>
            {event.description && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</p>}
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
              {event.event_date && <span className="flex items-center gap-1"><Calendar size={12} />{format(new Date(event.event_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>}
              {event.location && <span>📍 {event.location}</span>}
              <span>👥 {(event.registrations || []).length} inscritos</span>
            </div>
          </div>
        </div>
        {!isPast && event.link && (
          <a href={event.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
            <ExternalLink size={13} /> Acessar Evento
          </a>
        )}
      </div>
    </div>
  );
}

// Card de Vaga para o feed
function JobCard({ job }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
        <Briefcase size={13} /> Nova Vaga Disponível
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-1">
              <span className="font-medium">{job.company}</span>
              <span>•</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{job.type}</span>
              <span>📍 {job.location}</span>
            </div>
            {job.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{job.description}</p>}
          </div>
          {job.contact_link && (
            <a href={job.contact_link} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Candidatar <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Card de Material para o feed
function MaterialCard({ material }) {
  const handleDownload = async () => {
    await base44.entities.Material.update(material.id, { downloads: (material.downloads || 0) + 1 });
    window.open(material.file_url, '_blank');
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-amber-500 shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-xs font-bold text-amber-600">
        <FileText size={13} /> Novo Material Disponível
      </div>
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <Download size={22} className="text-amber-600" />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-bold text-slate-900 text-sm">{material.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{material.category} • {material.downloads || 0} downloads</p>
          {material.description && <p className="text-xs text-slate-600 mt-1 line-clamp-1">{material.description}</p>}
        </div>
        <button onClick={handleDownload} className="shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
          <Download size={13} /> Baixar
        </button>
      </div>
    </div>
  );
}

export default function CommunityFeed({ user, profile, onViewProfile }) {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadFeed();
    const unsub = base44.entities.CommunityPost.subscribe(event => {
      if (event.type === 'create' && !event.data?.is_forum) {
        setFeedItems(prev => [{ type: 'post', data: event.data, date: event.data.created_date }, ...prev]);
      } else if (event.type === 'update') {
        setFeedItems(prev => prev.map(item => item.type === 'post' && item.data.id === event.id ? { ...item, data: event.data } : item));
      } else if (event.type === 'delete') {
        setFeedItems(prev => prev.filter(item => !(item.type === 'post' && item.data.id === event.id)));
      }
    });
    return unsub;
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    const [posts, events, jobs, materials] = await Promise.all([
      base44.entities.CommunityPost.filter({ status: 'active' }, '-created_date', 30),
      base44.entities.CommunityEvent.list('-created_date', 10),
      base44.entities.JobListing.filter({ status: 'active' }, '-created_date', 10),
      base44.entities.Material.list('-created_date', 10),
    ]);

    const allItems = [
      ...posts.filter(p => !p.is_forum).map(p => ({ type: 'post', data: p, date: p.created_date })),
      ...events.map(e => ({ type: 'event', data: e, date: e.created_date })),
      ...jobs.map(j => ({ type: 'job', data: j, date: j.created_date })),
      ...materials.map(m => ({ type: 'material', data: m, date: m.created_date })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    setFeedItems(allItems);
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
      is_forum: false,
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
      ) : feedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <p className="text-lg font-bold text-slate-600 mb-2">O feed ainda está vazio!</p>
          <p className="text-sm">Seja o primeiro a postar algo interessante.</p>
        </div>
      ) : (
        feedItems.map((item, idx) => {
          if (item.type === 'post') return <PostCard key={`post-${item.data.id}`} post={item.data} currentUser={user} currentProfile={profile} onViewProfile={onViewProfile} />;
          if (item.type === 'event') return <EventCard key={`event-${item.data.id}`} event={item.data} />;
          if (item.type === 'job') return <JobCard key={`job-${item.data.id}`} job={item.data} />;
          if (item.type === 'material') return <MaterialCard key={`material-${item.data.id}`} material={item.data} />;
          return null;
        })
      )}
    </div>
  );
}