import React from 'react';
import { Eye, ThumbsUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BlogPostCard({ post, onClick }) {
  const formattedDate = post.created_date
    ? format(new Date(post.created_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : '';

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl cursor-pointer flex flex-col transition-all group"
      onClick={onClick}
    >
      <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
        {post.cover_image ? (
          <img src={post.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl font-bold">📝</div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800">{post.category}</div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between text-xs text-slate-500 font-medium mb-3">
          <span>{formattedDate}</span>
          {post.read_time && (
            <span className="flex items-center gap-1"><Clock size={12} />{post.read_time}</span>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-700 transition-colors">{post.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">{post.summary}</p>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {post.author_avatar ? (
              <img src={post.author_avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">{post.author_name?.charAt(0)}</div>
            )}
            <span className="text-sm font-bold text-slate-800">{post.author_name}</span>
          </div>
          <div className="flex gap-3 text-slate-400">
            <span className="flex items-center gap-1 text-xs"><Eye size={14} />{post.views || 0}</span>
            <span className="flex items-center gap-1 text-xs"><ThumbsUp size={14} />{post.likes || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}