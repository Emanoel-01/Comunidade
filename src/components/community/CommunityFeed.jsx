import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ThumbsUp, MessageCircle, ShieldCheck, Send, Briefcase, Download, Calendar, ExternalLink, FileText, Image, Smile, Trophy, Clock } from 'lucide-react';
import MediaUploader from '@/components/shared/MediaUploader';
import MediaGallery from '@/components/shared/MediaGallery';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Avatar({ src, name, size = 10 }) {
  const s = `w-${size} h-${size}`;
  if (src) return <img src={src} alt="" className={`${s} rounded-full object-cover`} />;
  return <div className={`${s} rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0`}>{name?.charAt(0)}</div>;
}

function PostCard({ post, currentUser, currentProfile, onViewProfile }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState((post.liked_by || []).includes(currentUser?.id));
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [loadingComments, setLoadingComments] = useState(false);

  const loadComments = async () => {
    setLoadingComments(true);
    const data = await base44.entities.CommunityComment.filter({ post_id: post.id }, 'created_date');
    setComments(data);
    setLoadingComments(false);
  };

  const handleLike = async () => {
    const likedBy = post.liked_by || [];
    if (liked) {
      setLiked(false); setLikesCount(l => l - 1);
      await base44.entities.CommunityPost.update(post.id, { likes: likesCount - 1, liked_by: likedBy.filter(id => id !== currentUser.id) });
    } else {
      setLiked(true); setLikesCount(l => l + 1);
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
      post_id: post.id, author_id: currentUser.id,
      author_name: currentUser.full_name,
      author_avatar: currentProfile?.avatar_url || '',
      content: newComment
    });
    await base44.entities.CommunityPost.update(post.id, { comments_count: (post.comments_count || 0) + 1 });
    setNewComment('');
    loadComments();
  };

  const timeAgo = post.created_date
    ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: ptBR })
    : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 cursor-pointer group" onClick={() => onViewProfile(post.author_id)}>
            <div className="relative">
              <Avatar src={post.author_avatar} name={post.author_name} size={12} />
              {post.author_role?.includes('Docente') && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                  <ShieldCheck size={9} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm leading-tight">{post.author_name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{post.author_role} • {timeAgo}</p>
            </div>
          </div>
        </div>

        <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

        {post.image_url && !post.media_urls?.length && (
          <div className="w-full rounded-xl overflow-hidden mb-4 border border-slate-100">
            <img src={post.image_url} className="w-full object-cover max-h-[400px]" alt="" />
          </div>
        )}
        {post.media_urls?.length > 0 && (
          <div className="mb-4">
            <MediaGallery mediaUrls={post.media_urls} />
          </div>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-sm text-slate-400">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 font-medium transition-all hover:scale-110 ${liked ? 'text-indigo-600' : 'hover:text-indigo-500'}`}
          >
            <ThumbsUp size={17} fill={liked ? 'currentColor' : 'none'} />
            <span className={liked ? 'text-indigo-600 font-bold' : ''}>{likesCount}</span>
          </button>
          <button onClick={handleToggleComments} className="flex items-center gap-1.5 font-medium hover:text-indigo-500 transition-colors">
            <MessageCircle size={17} /> {post.comments_count || 0}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="px-5 pb-5 pt-0 bg-slate-50 border-t border-slate-100">
          <div className="space-y-3 my-4 max-h-64 overflow-y-auto">
            {loadingComments && <div className="text-xs text-center text-slate-400 py-2">Carregando...</div>}
            {comments.map(c => (
              <div key={c.id} className="flex gap-2.5">
                <Avatar src={c.author_avatar} name={c.author_name} size={8} />
                <div className="bg-white rounded-xl px-3 py-2 flex-grow border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-800">{c.author_name}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
            {!loadingComments && comments.length === 0 && <p className="text-xs text-slate-400 text-center py-2">Seja o primeiro a comentar!</p>}
          </div>
          <form onSubmit={handleComment} className="flex gap-2">
            <Avatar src={currentProfile?.avatar_url} name={currentUser?.full_name} size={8} />
            <div className="flex-grow flex gap-2">
              <input type="text" placeholder="Escreva um comentário..." value={newComment} onChange={e => setNewComment(e.target.value)}
                className="flex-grow border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
              <button type="submit" disabled={!newComment.trim()} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40">
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function EventFeedCard({ event, user }) {
  const [registering, setRegistering] = useState(false);
  const [isReg, setIsReg] = useState((event.registrations || []).includes(user?.id));
  const isPast = event.event_date && new Date(event.event_date) < new Date();

  const handleRegister = async () => {
    if (isPast || !user) return;
    setRegistering(true);
    const regs = event.registrations || [];
    const willReg = !isReg;
    const newRegs = willReg ? [...regs, user.id] : regs.filter(r => r !== user.id);
    await base44.entities.CommunityEvent.update(event.id, { registrations: newRegs });
    if (willReg) {
      const allUsers = await base44.entities.User.list();
      await Promise.all(allUsers.filter(u => u.role === 'admin').map(a =>
        base44.entities.Notification.create({ user_id: a.id, type: 'event', title: `Nova inscrição: ${event.title}`, message: `${user.full_name} se inscreveu.`, link: '/Comunidade', read: false })
      ));
    }
    setIsReg(willReg);
    setRegistering(false);
  };

  const timeUntil = !isPast && event.event_date
    ? formatDistanceToNow(new Date(event.event_date), { addSuffix: true, locale: ptBR })
    : null;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isPast ? 'opacity-70 border-slate-200' : 'border-indigo-200 border-l-4 border-l-indigo-500'}`}>
      <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-bold text-indigo-600"><Calendar size={12} /> Novo Evento</span>
        {timeUntil && <span className="text-xs text-indigo-500 flex items-center gap-1"><Clock size={10} /> {timeUntil}</span>}
      </div>
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900">{event.title}</h3>
          {event.description && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{event.description}</p>}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
            {event.event_date && <span className="flex items-center gap-1"><Calendar size={11} />{format(new Date(event.event_date), "dd/MM 'às' HH:mm", { locale: ptBR })}</span>}
            <span>👥 {(event.registrations || []).length} inscritos</span>
          </div>
        </div>
        {!isPast && (
          <button onClick={handleRegister} disabled={registering}
            className={`shrink-0 flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-60 ${isReg ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            {isReg ? '✓ Inscrito' : 'Inscrever-me'}
          </button>
        )}
      </div>
    </div>
  );
}

function JobFeedCard({ job, user }) {
  const [showApply, setShowApply] = useState(false);
  const [msg, setMsg] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setApplying(true);
    const allUsers = await base44.entities.User.list();
    await Promise.all(allUsers.filter(u => u.role === 'admin').map(a =>
      base44.entities.Notification.create({ user_id: a.id, type: 'job', title: `Candidatura: ${job.title}`, message: `${user.full_name}: "${msg}"`, link: '/Comunidade', read: false })
    ));
    setApplied(true);
    setApplying(false);
    setShowApply(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-200 border-l-4 border-l-emerald-500 shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
        <Briefcase size={12} /> Nova Vaga
      </div>
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900">{job.title}</h3>
            <div className="flex flex-wrap gap-2 mt-1 text-sm text-slate-500">
              <span className="font-medium">{job.company}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{job.type}</span>
              <span>📍 {job.location}</span>
            </div>
          </div>
          {applied ? (
            <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 font-bold text-sm px-4 py-2 rounded-xl whitespace-nowrap">✓ Enviado</span>
          ) : (
            <button onClick={() => setShowApply(!showApply)} className="shrink-0 bg-slate-900 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
              Candidatar-se →
            </button>
          )}
        </div>
        {showApply && !applied && (
          <form onSubmit={handleApply} className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={2} placeholder="Breve apresentação e motivação..." required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowApply(false)} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 font-medium">Cancelar</button>
              <button type="submit" disabled={applying || !msg.trim()} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2 rounded-xl disabled:opacity-50">
                <Send size={13} /> {applying ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function MaterialFeedCard({ material, user }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await base44.entities.Material.update(material.id, { downloads: (material.downloads || 0) + 1 });
    if (user) {
      await base44.entities.Notification.create({
        user_id: user.id, type: 'material',
        title: `Download: +5 pontos 🏆`, message: `Você baixou "${material.title}". Continue aprendendo!`,
        link: '/Comunidade', read: false
      });
    }
    setDownloading(false);
    setDownloaded(true);
    window.open(material.file_url, '_blank');
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200 border-l-4 border-l-amber-500 shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-xs font-bold text-amber-600">
        <FileText size={12} /> Novo Material Disponível
      </div>
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl shrink-0">📄</div>
        <div className="flex-grow min-w-0">
          <h3 className="font-extrabold text-slate-900 text-sm truncate">{material.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{material.category} • {material.downloads || 0} downloads</p>
        </div>
        <button onClick={handleDownload} disabled={downloading}
          className={`shrink-0 flex items-center gap-1.5 font-bold text-xs px-4 py-2.5 rounded-xl transition-all ${downloaded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-500 hover:bg-amber-600 text-white'} disabled:opacity-60`}>
          {downloading ? '...' : downloaded ? '✓ Baixado' : <><Download size={13} /> Baixar</>}
        </button>
      </div>
    </div>
  );
}

export default function CommunityFeed({ user, profile, onViewProfile }) {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState([]);
  const [posting, setPosting] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    loadFeed();
    const unsub = base44.entities.CommunityPost.subscribe(event => {
      if (event.type === 'create' && !event.data?.is_forum && event.data?.status === 'active') {
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
      base44.entities.CommunityEvent.list('-created_date', 8),
      base44.entities.JobListing.filter({ status: 'active' }, '-created_date', 8),
      base44.entities.Material.list('-created_date', 8),
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
      author_id: user.id, author_name: user.full_name,
      author_avatar: profile?.avatar_url || '',
      author_role: profile?.role_label || user.role,
      content: newPostContent, is_forum: false,
      media_urls: newPostMedia,
      likes: 0, liked_by: [], comments_count: 0, status: 'active'
    });
    setNewPostContent('');
    setNewPostMedia([]);
    setFocused(false);
    setPosting(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Caixa de criação melhorada */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex gap-3">
            <div className="shrink-0">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} className="w-10 h-10 rounded-full object-cover" alt="" />
                : <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{user?.full_name?.charAt(0)}</div>
              }
            </div>
            <div className="flex-grow">
              <textarea
                placeholder={`O que você está aprendendo, ${user?.full_name?.split(' ')[0]}?`}
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                onFocus={() => setFocused(true)}
                rows={focused ? 3 : 1}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-all"
              />
              {focused && (
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2 text-slate-400">
                    <span className="text-xs text-slate-400 italic">Compartilhe experiências, dúvidas e conquistas!</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setFocused(false); setNewPostContent(''); }} className="px-4 py-1.5 text-slate-500 hover:bg-slate-100 font-bold rounded-lg text-sm transition-colors">Cancelar</button>
                    <button onClick={handlePost} disabled={posting || !newPostContent.trim()} className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-40">
                      {posting ? 'Publicando...' : 'Publicar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {!focused && (
          <div className="px-4 pb-3 flex gap-1 border-t border-slate-100 pt-3">
            <button onClick={() => setFocused(true)} className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
              <Image size={14} /> Foto
            </button>
            <button onClick={() => setFocused(true)} className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">
              <Trophy size={14} /> Conquista
            </button>
            <button onClick={() => setFocused(true)} className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
              <Smile size={14} /> Dica técnica
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-200 h-44 animate-pulse"></div>)}
        </div>
      ) : feedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-lg font-bold text-slate-600 mb-2">O feed ainda está vazio!</p>
          <p className="text-sm">Seja o primeiro a compartilhar algo.</p>
        </div>
      ) : (
        feedItems.map((item) => {
          if (item.type === 'post') return <PostCard key={`post-${item.data.id}`} post={item.data} currentUser={user} currentProfile={profile} onViewProfile={onViewProfile} />;
          if (item.type === 'event') return <EventFeedCard key={`event-${item.data.id}`} event={item.data} user={user} />;
          if (item.type === 'job') return <JobFeedCard key={`job-${item.data.id}`} job={item.data} user={user} />;
          if (item.type === 'material') return <MaterialFeedCard key={`material-${item.data.id}`} material={item.data} user={user} />;
          return null;
        })
      )}
    </div>
  );
}