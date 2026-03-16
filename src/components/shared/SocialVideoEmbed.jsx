import React, { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';

/**
 * Detecta o tipo de link social e retorna o embed URL correspondente.
 * Suporta: YouTube, Instagram, LinkedIn
 */
function getEmbedInfo(url) {
  if (!url) return null;

  // YouTube - formatos: watch?v=ID, youtu.be/ID, shorts/ID, embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
      label: 'YouTube',
    };
  }

  // Instagram - formatos: /p/CODE/, /reel/CODE/, /tv/CODE/
  const igMatch = url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/);
  if (igMatch) {
    return {
      type: 'instagram',
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed/`,
      label: 'Instagram',
    };
  }

  // LinkedIn - posts e vídeos
  const liMatch = url.match(/linkedin\.com\/(posts|feed\/update)\/([\w%:_-]+)/);
  if (liMatch) {
    // LinkedIn não suporta embed nativo via iframe simples, abrimos em nova aba
    return {
      type: 'linkedin_link',
      embedUrl: url,
      label: 'LinkedIn',
    };
  }

  return null;
}

export default function SocialVideoEmbed({ url }) {
  const [playing, setPlaying] = useState(false);

  if (!url) return null;
  const info = getEmbedInfo(url);
  if (!info) return null;

  // LinkedIn: exibe card com botão "Ver no LinkedIn"
  if (info.type === 'linkedin_link') {
    return (
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-4 flex items-center gap-3 my-2">
        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-extrabold text-sm">in</span>
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">Post do LinkedIn</p>
          <p className="text-xs text-slate-500 truncate">{url}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          <ExternalLink size={12} /> Ver
        </a>
      </div>
    );
  }

  // YouTube e Instagram: embed via iframe com thumbnail de clique
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-black my-2 relative">
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="w-full aspect-video flex flex-col items-center justify-center bg-slate-900 relative group"
        >
          {/* Thumbnail YouTube */}
          {info.type === 'youtube' && (() => {
            const ytId = info.embedUrl.match(/embed\/([\w-]+)/)?.[1];
            return ytId ? (
              <img
                src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                alt="thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
              />
            ) : null;
          })()}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${info.type === 'youtube' ? 'bg-red-600' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'}`}>
              <Play size={28} className="text-white ml-1" fill="white" />
            </div>
            <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">
              Assistir no {info.label}
            </span>
          </div>
        </button>
      ) : (
        <div className="aspect-video">
          <iframe
            src={info.embedUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title={`Vídeo ${info.label}`}
            loading="lazy"
          />
        </div>
      )}

      {/* Badge da rede */}
      <div className="absolute top-2 right-2 z-20 pointer-events-none">
        {info.type === 'youtube' && (
          <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">YouTube</span>
        )}
        {info.type === 'instagram' && (
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">Instagram</span>
        )}
      </div>
    </div>
  );
}