import React, { useState } from 'react';
import { Share2, Linkedin, MessageCircle, Twitter, Link2, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function BlogShareButtons({ post, compact = false }) {
  const [copied, setCopied] = useState(false);

  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(post.title);

  const handleShare = (platform) => {
    if (platform === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    base44.entities.BlogPost.update(post.id, { shares: (post.shares || 0) + 1 });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Compartilhar:</span>
        <button onClick={() => handleShare('linkedin')} className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center transition-colors" title="LinkedIn">
          <Linkedin size={14} />
        </button>
        <button onClick={() => handleShare('whatsapp')} className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center transition-colors" title="WhatsApp">
          <MessageCircle size={14} />
        </button>
        <button onClick={() => handleShare('twitter')} className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 flex items-center justify-center transition-colors" title="Twitter/X">
          <Twitter size={14} />
        </button>
        <button onClick={() => handleShare('copy')} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors" title="Copiar link">
          {copied ? <Check size={14} className="text-emerald-600" /> : <Link2 size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl font-bold text-sm transition-colors">
        <Linkedin size={16} /> LinkedIn
      </button>
      <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl font-bold text-sm transition-colors">
        <MessageCircle size={16} /> WhatsApp
      </button>
      <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 rounded-xl font-bold text-sm transition-colors">
        <Twitter size={16} /> Twitter/X
      </button>
      <button onClick={() => handleShare('copy')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">
        {copied ? <><Check size={16} className="text-emerald-600" /> Copiado!</> : <><Link2 size={16} /> Copiar Link</>}
      </button>
    </div>
  );
}