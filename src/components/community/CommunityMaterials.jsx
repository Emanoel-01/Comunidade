import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, FileText, Plus, X, Upload } from 'lucide-react';

const categoryColors = {
  'Planilhas': 'bg-emerald-100 text-emerald-700',
  'Normas ABNT': 'bg-blue-100 text-blue-700',
  'E-books': 'bg-purple-100 text-purple-700',
  'Apresentações': 'bg-amber-100 text-amber-700',
  'Modelos de Laudo': 'bg-rose-100 text-rose-700',
  'Outros': 'bg-slate-100 text-slate-700',
};

export default function CommunityMaterials({ user }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Planilhas', file_url: '' });
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    const data = await base44.entities.Material.list('-created_date');
    setMaterials(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Material.create({ ...form, downloads: 0 });
    setForm({ title: '', description: '', category: 'Planilhas', file_url: '' });
    setShowForm(false);
    await loadMaterials();
    setSaving(false);
  };

  const handleDownload = async (material) => {
    await base44.entities.Material.update(material.id, { downloads: (material.downloads || 0) + 1 });
    window.open(material.file_url, '_blank');
  };

  const categories = ['Todos', 'Planilhas', 'Normas ABNT', 'E-books', 'Apresentações', 'Modelos de Laudo', 'Outros'];
  const filtered = activeFilter === 'Todos' ? materials : materials.filter(m => m.category === activeFilter);

  return (
    <div className="animate-in fade-in space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Biblioteca de Materiais</h2>
          <p className="text-sm text-slate-500">Planilhas, normas e materiais exclusivos para membros.</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-colors">
            <Plus size={16} /> Adicionar
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
          <h3 className="font-bold text-slate-900 mb-4">Novo Material</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Título *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Categoria</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {['Planilhas', 'Normas ABNT', 'E-books', 'Apresentações', 'Modelos de Laudo', 'Outros'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">URL do Arquivo *</label><input required value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} placeholder="https://..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
            <div><label className="block text-xs font-bold text-slate-600 mb-1">Descrição</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" /></div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm disabled:opacity-50">{saving ? 'Salvando...' : 'Publicar'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex overflow-x-auto gap-2 pb-2" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl border border-slate-200 h-28 animate-pulse"></div>)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400"><FileText size={40} className="mx-auto mb-3 opacity-30" /><p className="font-bold text-slate-600">Nenhum material disponível.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0"><FileText size={20} /></div>
                <div className="flex-grow overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{m.title}</h4>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${categoryColors[m.category] || 'bg-slate-100 text-slate-700'}`}>{m.category}</span>
                </div>
              </div>
              {m.description && <p className="text-xs text-slate-600 mb-4 line-clamp-2">{m.description}</p>}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">{m.downloads || 0} downloads</span>
                <button onClick={() => handleDownload(m)} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                  <Download size={14} /> Baixar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}