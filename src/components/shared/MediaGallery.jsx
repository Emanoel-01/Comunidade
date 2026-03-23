import React, { useState } from 'react';
import { X, ZoomIn, FileText } from 'lucide-react';
import PdfViewer from './PdfViewer';

function getMediaType(url) {
  if (!url) return 'unknown';
  const lower = url.toLowerCase().split('?')[0];
  if (lower.match(/\.(mp4|webm|mov|avi)$/)) return 'video';
  if (lower.match(/\.(mp3|wav|ogg|aac|m4a)$/)) return 'audio';
  if (lower.match(/\.pdf$/)) return 'pdf';
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
  return 'image'; // fallback tenta como imagem
}

function LightboxModal({ url, type, onClose }) {
  return (
    <div className="fixed inset-0 z-[400] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"><X size={20} /></button>
      <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
        {type === 'image' && <img src={url} alt="" className="max-h-[85vh] max-w-full object-contain rounded-xl" />}
        {type === 'video' && <video src={url} controls autoPlay className="max-h-[85vh] max-w-full rounded-xl" />}
        {type === 'audio' && <audio src={url} controls autoPlay className="w-full max-w-md" />}
      </div>
    </div>
  );
}

export default function MediaGallery({ mediaUrls = [] }) {
  const [lightbox, setLightbox] = useState(null);
  const [pdfViewer, setPdfViewer] = useState(null);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  const singles = mediaUrls.length === 1;

  return (
    <>
      <div className={`grid gap-2 mt-3 ${singles ? '' : mediaUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
        {mediaUrls.map((url, idx) => {
          const type = getMediaType(url);
          const isLast = idx === 3 && mediaUrls.length > 4;
          const show = idx < 4;
          if (!show) return null;

          return (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden bg-slate-100 cursor-pointer group ${singles ? 'col-span-2' : ''} ${idx === 0 && mediaUrls.length === 3 ? 'row-span-2' : ''}`}
              style={{ aspectRatio: singles ? '16/9' : '1/1', maxHeight: singles ? 400 : 180 }}
              onClick={() => setLightbox({ url, type })}
            >
              {type === 'image' && (
                <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              )}
              {type === 'video' && (
                <video src={url} className="w-full h-full object-cover" muted />
              )}
              {type === 'audio' && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-900 text-white gap-2 p-4">
                  <span className="text-3xl">🎵</span>
                  <span className="text-xs font-bold text-indigo-200 text-center truncate w-full">{url.split('/').pop()?.split('?')[0]}</span>
                </div>
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                {type !== 'audio' && <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>

              {/* "+N mais" overlay */}
              {isLast && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-extrabold">+{mediaUrls.length - 4}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Player de áudio inline para áudios */}
      {mediaUrls.filter(u => getMediaType(u) === 'audio').map((url, idx) => (
        <audio key={idx} src={url} controls className="w-full mt-2 rounded-xl" />
      ))}

      {lightbox && (
        <LightboxModal url={lightbox.url} type={lightbox.type} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}