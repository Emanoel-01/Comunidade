import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

export default function PdfViewer({ url, title, onClose }) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ height: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={18} className="text-rose-500 shrink-0" />
            <span className="font-bold text-slate-800 text-sm truncate">{title || 'Visualizar PDF'}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <a
              href={url}
              download
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              title="Baixar PDF"
            >
              <Download size={14} /> Baixar
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              title="Abrir em nova aba"
            >
              <ExternalLink size={14} /> Nova aba
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Iframe do PDF */}
        <div className="flex-grow relative bg-slate-100">
          <iframe
            src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
            title={title || 'PDF'}
            className="w-full h-full border-0"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}