import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, X, Loader2, Image, Film, Music } from 'lucide-react';

function getMediaType(url) {
  if (!url) return 'unknown';
  const lower = url.toLowerCase().split('?')[0];
  if (lower.match(/\.(mp4|webm|mov|avi)$/)) return 'video';
  if (lower.match(/\.(mp3|wav|ogg|aac|m4a)$/)) return 'audio';
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
  return 'unknown';
}

function MediaThumb({ url, onRemove }) {
  const type = getMediaType(url);
  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center" style={{ width: 80, height: 80 }}>
      {type === 'image' && (
        <img src={url} alt="" className="w-full h-full object-cover" />
      )}
      {type === 'video' && (
        <div className="flex flex-col items-center justify-center w-full h-full bg-slate-800 text-white gap-1">
          <Film size={22} />
          <span className="text-[10px] font-bold">Vídeo</span>
        </div>
      )}
      {type === 'audio' && (
        <div className="flex flex-col items-center justify-center w-full h-full bg-indigo-800 text-white gap-1">
          <Music size={22} />
          <span className="text-[10px] font-bold">Áudio</span>
        </div>
      )}
      {type === 'unknown' && (
        <div className="flex flex-col items-center justify-center w-full h-full bg-slate-200 text-slate-600 gap-1">
          <Upload size={18} />
          <span className="text-[10px] font-bold">Arquivo</span>
        </div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}

export default function MediaUploader({ mediaUrls = [], onChange, label = "Adicionar mídia", accept = "image/*,video/mp4,audio/mp3,audio/mpeg,audio/*" }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        return file_url;
      })
    );
    onChange([...mediaUrls, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (idx) => {
    onChange(mediaUrls.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {label && <p className="text-xs font-bold text-slate-600 mb-2">{label}</p>}
      <div className="flex flex-wrap gap-2 items-center">
        {mediaUrls.map((url, idx) => (
          <MediaThumb key={idx} url={url} onRemove={() => handleRemove(idx)} />
        ))}
        <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? (
            <Loader2 size={20} className="text-indigo-500 animate-spin" />
          ) : (
            <>
              <Upload size={18} className="text-slate-400" />
              <span className="text-[10px] text-slate-400 mt-1 font-bold text-center">Foto/Vídeo/MP3</span>
            </>
          )}
          <input ref={inputRef} type="file" multiple accept={accept} onChange={handleFiles} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
}