import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, FileText, Plus, X, Upload, BookOpen, CheckCircle2, Search, Link, Eye } from 'lucide-react';
import MediaUploader from '@/components/shared/MediaUploader';
import MediaGallery from '@/components/shared/MediaGallery';
import SocialVideoEmbed from '@/components/shared/SocialVideoEmbed';
import PdfViewer from '@/components/shared/PdfViewer';

const categoryColors = {
  'Planilhas': 'bg-emerald-100 text-emerald-700',
  'Normas ABNT': 'bg-blue-100 text-blue-700',
  'E-books': 'bg-purple-100 text-purple-700',
  'Apresentações': 'bg-amber-100 text-amber-700',
  'Modelos de Laudo': 'bg-rose-100 text-rose-700',
  'Outros': 'bg-slate-100 text-slate-700',
};

const categoryIcons = {
  'Planilhas': '📊',
  'Normas ABNT': '📋',
  'E-books': '📖',
  'Apresentações': '🖥️',
  'Modelos de Laudo': '📄',
  'Outros': '📎',
};

function MaterialCard({ m, user, onDownloaded }) {
  const [downloading, setDownloading] = useState(false);
  const [pdfToView, setPdfToView] = useState(null);

  const files = m.files?.length > 0
    ? m.files
    : (m.file_url ? [{ name: 'Arquivo Principal', url: m.file_url }] : []);

  const isPdf = (url) => url?.toLowerCase().split('?')[0].endsWith('.pdf');

  const handleAction = async (file, actionType) => {
    if (actionType === 'view' && isPdf(file.url)) {
      setPdfToView(file);
      return;
    }
    if (actionType === 'download') {
      setDownloading(true);
      const newCount = (m.downloads || 0) + 1;
      await base44.entities.Material.update(m.id, { downloads: newCount });
      if (user) {
        base44.functions.invoke('awardPoints', {
          activity_type: 'material_downloaded',
          related_entity_id: m.id,
          related_entity_title: m.title,
        }).catch(() => {});
      }
      onDownloaded(m.id, newCount);
      setDownloading(false);
    }
    window.open(file.url, '_blank');
  };

  return (
    <>
    {pdfToView && (
      <PdfViewer url={pdfToView.url} title={pdfToView.name || m.title} onClose={() => setPdfToView(null)} />
    )}
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden group">
      <div className={`h-2 ${m.category === 'Planilhas' ? 'bg-emerald-400' : m.category === 'Normas ABNT' ? 'bg-blue-400' : m.category === 'E-books' ? 'bg-purple-400' : m.category === 'Apresentações' ? 'bg-amber-400' : m.category === 'Modelos de Laudo' ? 'bg-rose-400' : 'bg-slate-400'}`}></div>
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${m.category === 'Planilhas' ? 'bg-emerald-50' : m.category === 'Normas ABNT' ? 'bg-blue-50' : m.category === 'E-books' ? 'bg-purple-50' : m.category === 'Apresentações' ? 'bg-amber-50' : m.category === 'Modelos de Laudo' ? 'bg-rose-50' : 'bg-slate-50'}`}>
            {categoryIcons[m.category] || '📎'}
          </div>
          <div className="flex-grow overflow-hidden">
            <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{m.title}</h4>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${categoryColors[m.category] || 'bg-slate-100 text-slate-700'}`}>{m.category}</span>
          </div>
        </div>
        {m.description && <p className="text-xs text-slate-600 mb-3 leading-relaxed">{m.description}</p>}
        {m.social_video_url && (
          <div className="mb-3"><SocialVideoEmbed url={m.social_video_url} /></div>
        )}
        {m.media_urls?.length > 0 && (
          <div className="mb-3">
            <MediaGallery mediaUrls={m.media_urls} />
          </div>
        )}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-2"><Download size={11} /> {m.downloads || 0} downloads</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Arquivos</p>
          <div className="space-y-1.5">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded-lg">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate" title={file.name}>{file.name}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button onClick={() => handleAction(file, 'view')} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Ver no navegador" disabled={downloading}>
                    <Eye size={14} />
                  </button>
                  <button onClick={() => handleAction(file, 'download')} className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Baixar arquivo" disabled={downloading}>
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityMaterials({ user }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Planilhas', file_url: '', media_urls: [], social_video_url: '' });
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [notifyAll, setNotifyAll] = useState(true);

  useEffect(() => {
    base44.entities.Material.list('-created_date').then(d => { setMaterials(d); setLoading(false); });
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const finalCategory = form.category === 'Outros' && form.customCategory?.trim()
      ? form.customCategory.trim()
      : form.category;
    await base44.entities.Material.create({ ...form, category: finalCategory, downloads: 0 });
    if (notifyAll) {
      base44.functions.invoke('broadcastNotification', {
        type: 'material',
        title: `📚 Novo Material Disponível!`,
        message: `O material "${form.title}" foi adicionado à Biblioteca. Acesse e baixe agora!`,
        link: '/Comunidade',
      }).catch(() => {});
    }
    setForm({ title: '', description: '', category: 'Planilhas', file_url: '', media_urls: [], social_video_url: '' });
    setNotifyAll(true);
    setShowForm(false);
    const d = await base44.entities.Material.list('-created_date');
    setMaterials(d);
    setSaving(false);
  };

  const handleDownloaded = (id, newCount) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, downloads: newCount } : m));
  };

  const categories = ['Todos', ...new Set(materials.map(m => m.category).filter(Boolean))];
  const filtered = materials
    .filter(m => activeFilter === 'Todos' || m.category === activeFilter)
    .filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.description?.toLowerCase().includes(search.toLowerCase()));

  const totalDownloads = materials.reduce((a, m) => a + (m.downloads || 0), 0);

  return (
    <div className="animate-in fade-in space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2"><BookOpen size={20} /> Biblioteca de Materiais</h2>
            <p className="text-amber-100 text-sm mt-1">Planilhas, normas e recursos técnicos exclusivos.</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow transition-colors">
              <Plus size={16} /> Adicionar
            </button>
          )}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center"><p className="font-extrabold text-lg">{materials.length}</p><p className="text-amber-200 text-xs">Materiais</p></div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center"><p className="font-extrabold text-lg">{totalDownloads}</p><p className="text-amber-200 text-xs">Downloads totais</p></div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4 text-lg">Novo Material</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Título *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Categoria</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                {['Planilhas', 'Normas ABNT', 'E-books', 'Apresentações', 'Modelos de Laudo', 'Outros'].map(c => <option key={c}>{c}</option>)}
              </select>
              {form.category === 'Outros' && (
                <input
                  type="text"
                  required
                  placeholder="Digite o nome da nova categoria..."
                  value={form.customCategory || ''}
                  onChange={e => setForm({ ...form, customCategory: e.target.value })}
                  className="mt-2 w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Arquivo *</label>
              <div className="flex gap-3 items-center">
                <label className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-amber-300 text-amber-600 rounded-lg text-sm font-bold cursor-pointer hover:bg-amber-50 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                  <Upload size={15} /> {uploading ? 'Enviando...' : 'Upload de Arquivo'}
                  <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>
                {form.file_url && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={13} /> Arquivo enviado!</span>}
              </div>
              <p className="text-xs text-slate-400 mt-1">Ou insira uma URL: <input value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} placeholder="https://..." className="ml-1 border-b border-slate-300 text-sm focus:outline-none focus:border-amber-400 px-1" /></p>
            </div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" /></div>
            <MediaUploader
              mediaUrls={form.media_urls || []}
              onChange={urls => setForm({ ...form, media_urls: urls })}
              label="Mídias de pré-visualização (foto, vídeo ou áudio)"
            />
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><Link size={12} /> Link de vídeo social (YouTube, Instagram, LinkedIn)</label>
              <input
                type="url"
                value={form.social_video_url}
                onChange={e => setForm({ ...form, social_video_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... ou instagram.com/reel/..."
                className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {form.social_video_url && <div className="mt-2"><SocialVideoEmbed url={form.social_video_url} /></div>}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input type="checkbox" checked={notifyAll} onChange={e => setNotifyAll(e.target.checked)} className="w-4 h-4 rounded accent-amber-600" />
                Notificar todos os membros ao publicar
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
                <button type="submit" disabled={saving || !form.file_url} className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-sm disabled:opacity-50">{saving ? 'Publicando...' : 'Publicar'}</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Busca + Filtros */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar materiais..."
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${activeFilter === cat ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-200 h-36 animate-pulse"></div>)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-slate-600">Nenhum material encontrado.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(m => <MaterialCard key={m.id} m={m} user={user} onDownloaded={handleDownloaded} />)}
        </div>
      )}
    </div>
  );
}