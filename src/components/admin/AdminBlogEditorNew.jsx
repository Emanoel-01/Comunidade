import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, UploadCloud, FileText, FileType2, CheckCircle2, Loader2,
  Image as ImageIcon, Check, Eye, PlusSquare, Sparkles, Video,
  Edit3, Save, Star, UserPlus, LayoutDashboard, X, Upload
} from 'lucide-react';
import MediaUploader from '../shared/MediaUploader';

const CATEGORIES = ['Gestão 4.0', 'Manutenção Predial', 'Tecnologia BIM', 'Engenharia Legal', 'Carreira'];

export default function AdminBlogEditorNew({ onBack }) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Gestão 4.0');
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [readTime, setReadTime] = useState('');
  const [seoKeyword, setSeoKeyword] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [authorName, setAuthorName] = useState('Emanoel Amorim');
  const [authorRole, setAuthorRole] = useState('CEO Amorim Tech');
  const [videoLink, setVideoLink] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [uploadingCover, setUploadingCover] = useState(false);

  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditingPreview, setIsEditingPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [extractedContent, setExtractedContent] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' });
      setFileData(file);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setCoverImage(file_url);
    setUploadingCover(false);
  };

  const handleGeneratePreview = async () => {
    if (!fileData && !extractedContent) return;
    setIsProcessing(true);
    try {
      // Extração real via backend (mammoth.js)
      const formData = new FormData();
      formData.append('file', fileData);

      let htmlContent = extractedContent;

      if (fileData) {
        const formData = new FormData();
        formData.append('file', fileData);
        const baseUrl = appParams.appBaseUrl || '';
        const response = await fetch(`${baseUrl}/api/functions/extractDocx`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const result = await response.json();
        if (result?.html) {
          htmlContent = result.html;
        } else {
          htmlContent = '<p>Cole ou edite o conteúdo do artigo aqui...</p>';
        }
      }

      setExtractedContent(htmlContent);

      // Cálculo do tempo de leitura
      const text = htmlContent.replace(/<[^>]+>/g, '');
      const words = text.trim().split(/\s+/).length;
      const mins = Math.max(1, Math.ceil(words / 200));
      setReadTime(`${mins} min`);

      setIsPreviewMode(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async (status = 'published') => {
    setIsPublishing(true);
    await base44.entities.BlogPost.create({
      title,
      summary,
      content: extractedContent,
      category,
      read_time: readTime || '5 min',
      seo_keyword: seoKeyword,
      seo_description: seoDesc,
      author_name: authorName,
      author_role: authorRole,
      author_avatar: 'https://i.ibb.co/TDC35Hqf/Emanoel-Silva-de-Amorim.jpg',
      cover_image: coverImage,
      video_link: videoLink,
      media_urls: mediaUrls,
      status,
    });
    setIsPublished(true);
    setIsPublishing(false);
    setTimeout(() => {
      if (onBack) onBack();
    }, 2000);
  };

  const handleSaveDraft = () => handlePublish('draft');

  return (
    <div className="animate-in fade-in">
      {/* Aviso de Sucesso */}
      {isPublished && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 font-medium">
          <Check size={18} /> Artigo salvo com sucesso!
        </div>
      )}

      {/* CABEÇALHO */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between mb-6 -mx-5 md:-mx-8 -mt-5 md:-mt-8 rounded-t-none sticky top-0 z-30 shadow-sm">
        <button
          onClick={() => {
            if (isPreviewMode) { setIsPreviewMode(false); setIsEditingPreview(false); }
            else if (onBack) onBack();
          }}
          className="flex items-center gap-2 font-bold text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={16} />
          {isPreviewMode ? 'Voltar à Edição' : 'Voltar aos Posts'}
        </button>

        <div className="flex items-center gap-3">
          {!isPreviewMode ? (
            <>
              <button
                onClick={handleSaveDraft}
                disabled={!title || isPublishing}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 hidden sm:block"
              >
                Salvar Rascunho
              </button>
              <button
                onClick={handleGeneratePreview}
                disabled={(!uploadedFile && !extractedContent) || isProcessing || !title}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                {isProcessing ? 'A Extrair...' : 'Gerar Pré-visualização'}
              </button>
            </>
          ) : (
            <button
              onClick={() => handlePublish('published')}
              disabled={isPublishing || isEditingPreview}
              className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-70 shadow-md"
            >
              {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {isPublishing ? 'A Publicar...' : 'Confirmar e Publicar'}
            </button>
          )}
        </div>
      </div>

      {!isPreviewMode ? (
        /* === MODO EDIÇÃO === */
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* COLUNA PRINCIPAL */}
          <div className="lg:col-span-8 space-y-6">

            {/* Título e Resumo */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Título da Postagem *</label>
                <input
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Como a tecnologia mudou a engenharia..."
                  className="w-full text-2xl md:text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-none bg-transparent focus:outline-none px-0"
                />
              </div>
              <div className="h-px w-full bg-slate-100"></div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Resumo (Para os Cards) *</label>
                <textarea
                  rows={2} value={summary} onChange={(e) => setSummary(e.target.value)}
                  placeholder="Um breve resumo para atrair os leitores no blog..."
                  className="w-full text-slate-600 border-none bg-transparent focus:outline-none resize-none px-0 text-base"
                />
              </div>
            </div>

            {/* UPLOAD DE DOCUMENTO */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <FileType2 className="text-indigo-600" size={22} /> Ingestão Inteligente de Texto
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Faça o upload do seu documento Word (.docx) ou PDF. O sistema extrairá o texto automaticamente.
                  Ou escreva diretamente na pré-visualização.
                </p>
              </div>

              <input type="file" ref={docInputRef} onChange={handleFileChange} accept=".doc,.docx,.pdf" className="hidden" />

              {!uploadedFile ? (
                <div
                  onClick={() => docInputRef.current.click()}
                  className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl p-10 text-center cursor-pointer transition-all duration-200 group"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={28} className="text-indigo-500" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1 text-lg">Clique para anexar o documento Word/PDF</h4>
                  <p className="text-sm text-slate-500">Apenas o texto. As mídias são adicionadas abaixo.</p>
                </div>
              ) : (
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-emerald-600 shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{uploadedFile.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{uploadedFile.size} • Pronto para extração</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-emerald-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16} /> Anexado</span>
                    <button onClick={() => { setUploadedFile(null); setFileData(null); }} className="text-slate-400 hover:text-rose-500 text-xs font-bold underline">Remover</button>
                  </div>
                </div>
              )}

              {/* Opção de escrever manualmente sem arquivo */}
              {!uploadedFile && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-slate-400">ou</span>
                  <button
                    onClick={() => { setExtractedContent('<p>Escreva o conteúdo do artigo aqui...</p>'); setIsPreviewMode(true); }}
                    disabled={!title}
                    className="ml-2 text-sm font-bold text-indigo-600 hover:underline disabled:opacity-40"
                  >
                    escrever o conteúdo diretamente →
                  </button>
                </div>
              )}
            </div>

            {/* IMAGEM DE CAPA */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <ImageIcon size={18} className="text-slate-400" /> Imagem de Capa e Mídias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Capa */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase">Capa do Post (1200x630px)</label>
                  {!coverImage ? (
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-6 cursor-pointer hover:bg-slate-100 transition-colors ${uploadingCover ? 'opacity-60' : ''}`}>
                      <ImageIcon size={28} className="text-indigo-400 mb-2" />
                      <p className="text-sm font-bold text-slate-700">{uploadingCover ? 'Enviando...' : 'Escolher imagem de capa'}</p>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
                    </label>
                  ) : (
                    <div className="relative group">
                      <img src={coverImage} className="w-full h-32 rounded-xl object-cover border border-slate-200" alt="capa" />
                      <button onClick={() => setCoverImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                    </div>
                  )}
                </div>
                {/* Link de Vídeo */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase">Link de Vídeo (YouTube, etc.)</label>
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-4 h-full flex flex-col justify-center">
                    <Video size={24} className="text-rose-400 mb-2" />
                    <input
                      type="url" value={videoLink} onChange={e => setVideoLink(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Galeria de mídias */}
              <MediaUploader
                mediaUrls={mediaUrls}
                onChange={setMediaUrls}
                label="Galeria de Mídias (fotos, vídeos, áudios)"
              />
            </div>
          </div>

          {/* COLUNA LATERAL */}
          <div className="lg:col-span-4 space-y-6">

            {/* Classificação */}
            <SettingsCard title="Classificação" icon={<LayoutDashboard size={14} className="text-slate-400" />}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Categoria Principal</label>
                  {!isCreatingCategory ? (
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === 'new') setIsCreatingCategory(true);
                        else setCategory(e.target.value);
                      }}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white font-medium"
                    >
                      {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="new">➕ Criar Nova Categoria...</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Nome da categoria"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          if (newCategoryName.trim()) { setCategoriesList([...categoriesList, newCategoryName.trim()]); setCategory(newCategoryName.trim()); }
                          setIsCreatingCategory(false); setNewCategoryName('');
                        }}
                        className="px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      ><Check size={16} /></button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Tempo de Leitura</label>
                  <input
                    type="text" value={readTime} onChange={e => setReadTime(e.target.value)}
                    placeholder="Ex: 5 min (calculado automaticamente)"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white font-medium"
                  />
                </div>
              </div>
            </SettingsCard>

            {/* SEO */}
            <SettingsCard title="Otimização e SEO" icon={<Star size={14} className="text-amber-500" />}>
              <div className="mb-4 bg-indigo-50 p-3.5 rounded-lg border border-indigo-100 flex gap-3 items-start">
                <Sparkles className="text-indigo-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 mb-1">SEO para IAs (Gemini/GPT)</h4>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">Responda diretamente a perguntas no seu texto para otimizar respostas nas IAs.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Palavra-chave Foco</label>
                  <input
                    type="text" value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white font-medium"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Meta Description</label>
                    <span className={`text-[10px] font-bold ${seoDesc.length > 160 ? 'text-rose-500' : 'text-indigo-600'}`}>{seoDesc.length}/160</span>
                  </div>
                  <textarea
                    rows={3} value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white resize-none font-medium"
                  ></textarea>
                </div>
              </div>
            </SettingsCard>

            {/* Autor */}
            <SettingsCard title="Autor(a)" icon={<UserPlus size={14} className="text-slate-400" />}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Nome do Autor</label>
                  <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white font-medium" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Cargo / Especialidade</label>
                  <input type="text" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white font-medium" />
                </div>
              </div>
            </SettingsCard>
          </div>
        </div>

      ) : (
        /* === MODO PRÉ-VISUALIZAÇÃO === */
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

          <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
              <Eye size={18} /> Pré-visualização do Artigo
            </div>
            <button
              onClick={() => setIsEditingPreview(!isEditingPreview)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${isEditingPreview ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              {isEditingPreview ? <Save size={14} /> : <Edit3 size={14} />}
              {isEditingPreview ? 'Guardar Edição' : 'Editar Conteúdo Inline'}
            </button>
          </div>

          <div className="p-8 md:p-12 lg:p-16">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">{category}</span>
                {readTime && <span className="text-slate-400 text-sm font-medium">{readTime} de leitura</span>}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-5 tracking-tight">
                {title || 'Título do Artigo'}
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed mb-8 font-medium">
                {summary || 'Resumo do artigo.'}
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{authorName}</p>
                  <p className="text-sm text-slate-500">{authorRole}</p>
                </div>
              </div>
            </div>

            {coverImage ? (
              <img src={coverImage} className="w-full aspect-[21/9] rounded-2xl mb-12 object-cover border border-slate-200" alt="capa" />
            ) : (
              <div className="w-full aspect-[21/9] bg-slate-100 rounded-2xl mb-12 flex flex-col items-center justify-center border border-slate-200">
                <ImageIcon size={48} className="text-slate-300 mb-2" />
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">[Imagem de Capa]</span>
              </div>
            )}

            {isEditingPreview && (
              <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <Edit3 size={16} /> Clique diretamente no texto abaixo para editar!
              </div>
            )}

            <div
              className={`text-slate-700 text-lg leading-relaxed transition-all duration-300
                [&>p]:mb-6
                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:border-b [&>h2]:border-slate-100 [&>h2]:pb-3
                [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-8 [&>h3]:mb-4
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
                [&>blockquote]:border-l-4 [&>blockquote]:border-indigo-500 [&>blockquote]:bg-indigo-50/50 [&>blockquote]:p-6 [&>blockquote]:rounded-r-xl [&>blockquote]:text-indigo-900 [&>blockquote]:italic [&>blockquote]:font-medium [&>blockquote]:my-8
                ${isEditingPreview ? 'outline-none ring-4 ring-indigo-500/30 bg-white p-6 rounded-xl shadow-inner min-h-[200px]' : ''}
              `}
              contentEditable={isEditingPreview}
              suppressContentEditableWarning={true}
              onBlur={(e) => setExtractedContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: extractedContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsCard({ title, icon, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-slate-50/80 border-b border-slate-100 px-5 py-3.5 flex items-center gap-2">
        {icon}<h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}