import React from 'react';

export default function LinksBio() {
  return (
    <div
      className="min-h-screen flex justify-center py-10 px-4 relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2070&auto=format&fit=crop')" }}
    >
      {/* Overlay fosco */}
      <div className="absolute inset-0 bg-[#f7f5f2]/85 backdrop-blur-sm z-0"></div>

      {/* Container Principal */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center relative z-10">

        {/* Foto de Perfil */}
        <div className="relative w-32 h-32 mb-4">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b4f78756902b494e56bda9/82107f70e_EmanoelAmorim.jpg"
            alt="Emanoel Amorim"
            className="rounded-full w-full h-full object-cover shadow-lg border-4 border-white"
            onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=Emanoel+Amorim&background=8c6b5d&color=fff&size=128'; }}
          />
        </div>

        {/* Cabeçalho */}
        <h1 className="text-2xl font-bold text-center mb-1 text-[#2d2d2d]">Emanoel Amorim</h1>
        <h2 className="text-sm font-semibold text-[#8c6b5d] text-center mb-4 px-2">
          Arquiteto, Founder da AmorimTech e Coordenador Acadêmico.
        </h2>

        {/* Apresentação */}
        <p className="text-center text-sm text-gray-700 mb-6 leading-relaxed px-2 font-bold italic">
          Transformando o setor da construção civil através de três pilares: desenvolvimento de ecossistemas tecnológicos, formação de novos especialistas e consultoria técnica especializada.
        </p>

        {/* Estatísticas */}
        <div className="w-full grid grid-cols-2 gap-y-6 gap-x-4 bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <span className="text-xl font-bold text-[#8c6b5d] mb-1">+15 anos</span>
            <span className="text-[11px] text-gray-500 leading-tight">de experiência e atuação na construção civil</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-xl font-bold text-[#8c6b5d] mb-1">+100</span>
            <span className="text-[11px] text-gray-500 leading-tight">projetos e laudos executados</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-xl font-bold text-[#8c6b5d] mb-1">+200.000m²</span>
            <span className="text-[11px] text-gray-500 leading-tight">de empreendimentos gerenciados</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-xl font-bold text-[#8c6b5d] mb-1">+70</span>
            <span className="text-[11px] text-gray-500 leading-tight">produções científicas</span>
          </div>
        </div>

        <p className="text-center text-sm font-semibold text-gray-600 mb-4 px-2">
          Escolha abaixo como posso te ajudar hoje:
        </p>

        {/* Botões */}
        <div className="w-full flex flex-col gap-3">

          {/* Amorim Arquitetura */}
          <a href="https://emanoelamorim.base44.app/AmorimArquitetura" target="_blank" rel="noopener noreferrer"
             className="link-bio-btn w-full bg-white border-l-4 border-[#3b4b6b] p-3 rounded-xl flex items-center text-left shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-24 flex-shrink-0 mr-4 flex items-center justify-start">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b4f78756902b494e56bda9/de9772ab4_AmorimArquitetura.JPG" alt="Logo Amorim Arquitetura" className="w-full object-contain" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#3b4b6b] leading-tight mb-0.5">Amorim Arquitetura</h3>
              <p className="text-[11px] text-gray-500 leading-tight">Consultoria e gestão estratégica para proteger o seu patrimônio</p>
            </div>
          </a>

          {/* Amorim Tech */}
          <a href="https://emanoelamorim.base44.app/AmorimTech" target="_blank" rel="noopener noreferrer"
             className="link-bio-btn w-full bg-white border-l-4 border-[#e87722] p-3 rounded-xl flex items-center text-left shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-24 flex-shrink-0 mr-4 flex items-center justify-start">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b4f78756902b494e56bda9/8e18562d8_AmorimTech.PNG" alt="Logo Amorim Tech" className="w-full object-contain" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#e87722] leading-tight mb-0.5">Amorim Tech</h3>
              <p className="text-[11px] text-gray-500 leading-tight">Predial 4.0 — copiloto técnico para vistorias e laudos</p>
            </div>
          </a>

          {/* Academia ESUDA */}
          <a href="https://emanoelamorim.base44.app/AmorimAcademy" target="_blank" rel="noopener noreferrer"
             className="link-bio-btn w-full bg-white border-l-4 border-[#4a8251] p-3 rounded-xl flex items-center text-left shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-24 h-16 flex-shrink-0 mr-4 flex items-center justify-start">
              <span className="text-lg font-extrabold text-[#4a8251]">Amorim Academy</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#4a8251] leading-tight mb-0.5">Amorim Academy</h3>
              <p className="text-[11px] text-gray-500 leading-tight">Curso, incubadora e mentoria técnica.</p>
            </div>
          </a>

          <div className="w-full h-px bg-gray-300 my-2"></div>

          {/* Comunidade */}
          <a href="https://emanoelamorim.base44.app/Comunidade" target="_blank" rel="noopener noreferrer"
             className="link-bio-btn w-full bg-white p-4 rounded-xl flex items-center text-left shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-full bg-[#3b4b6b] flex-shrink-0 flex items-center justify-center mr-4 text-white shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#3b4b6b] leading-tight mb-0.5">Comunidade Business 4.0</h3>
              <p className="text-[11px] text-gray-500 leading-tight">O ponto de encontro entre quem resolve e quem contrata na Construção Civil.</p>
            </div>
          </a>

          {/* Blog */}
          <a href="https://emanoelamorim.base44.app/Blog" target="_blank" rel="noopener noreferrer"
             className="link-bio-btn w-full bg-white p-4 rounded-xl flex items-center text-left shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-full bg-[#e87722] flex-shrink-0 flex items-center justify-center mr-4 text-white shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#e87722] leading-tight mb-0.5">Blog Mundo 4.0</h3>
              <p className="text-[11px] text-gray-500 leading-tight">Conteúdo aprofundado e prático sobre Construção 4.0, Gestão e Tecnologia.</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer"
             className="link-bio-btn w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-4 px-6 rounded-xl flex items-center justify-center text-sm font-bold shadow-md hover:shadow-lg mt-2 transition-all duration-300 hover:-translate-y-0.5">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar direto no WhatsApp
          </a>

          {/* Site Completo */}
          <a href="https://emanoelamorim.base44.app/" target="_blank" rel="noopener noreferrer"
             className="link-bio-btn w-full bg-[#2d2d2d] text-white py-4 px-6 rounded-xl flex items-center justify-center text-sm font-bold hover:bg-black shadow-lg transition-all duration-300 mt-2 hover:-translate-y-0.5">
            <div className="w-8 h-8 rounded-full bg-[#8c6b5d] flex items-center justify-center mr-3 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            Acessar meu Site Completo
          </a>

        </div>

        {/* Rodapé */}
        <footer className="mt-10 mb-6 text-center">
          <p className="text-[10px] text-gray-600 font-bold backdrop-blur-md bg-white/40 inline-block px-3 py-1 rounded-full">
            © 2026 Emanoel Amorim. Todos os direitos reservados.
          </p>
        </footer>

      </main>
    </div>
  );
}