import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Building2, Cpu, GraduationCap, BookOpen, Mail, Lock, Menu, X,
  Instagram, Linkedin, Youtube, MessageCircle, Phone, MapPin, Settings, UserCircle
} from 'lucide-react';

const navLinks = [
  { label: 'Amorim Arquitetura', page: 'AmorimArquitetura', color: 'blue' },
  { label: 'Amorim Tech', page: 'AmorimTech', color: 'indigo' },
  { label: 'Academia ESUDA', page: 'AcademiaEsuda', color: 'emerald' },
  { label: 'Blog', page: 'Blog', color: 'slate' },
  { label: 'Contato', page: 'Contato', color: 'amber' },
];

export default function Layout({ children, currentPageName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = currentPageName === 'AdminPanel';
  const isComunidadeLogada = currentPageName === 'Comunidade';
  const showFooter = !isAdmin;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col relative">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to={createPageUrl('Home')} className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3 shadow-md">EA</div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">Emanoel Amorim</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Ecossistema Digital</p>
              </div>
            </Link>

            {/* Nav Desktop */}
            <nav className="hidden lg:flex space-x-1 text-sm font-medium">
              {navLinks.map(({ label, page, color }) => (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  className={`px-4 py-2 rounded-md transition-colors ${currentPageName === page ? `bg-${color}-50 text-${color}-700` : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('AdminPanel')} className="hidden md:flex items-center gap-2 bg-indigo-900 text-white font-bold px-4 py-2 hover:bg-indigo-800 rounded-md shadow-sm transition-colors text-sm">
                <Settings className="w-4 h-4" /> Admin
              </Link>
              <Link to={createPageUrl('Comunidade')} className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm text-sm">
                <Lock className="w-4 h-4" /> Comunidade
              </Link>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-t border-slate-100 px-4 py-4 z-50 flex flex-col gap-2">
            {navLinks.map(({ label, page, color }) => (
              <Link
                key={page}
                to={createPageUrl(page)}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-3 text-left rounded-lg font-bold transition-colors ${currentPageName === page ? `bg-${color}-50 text-${color}-700` : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {label}
              </Link>
            ))}
            <div className="h-px bg-slate-200 my-2"></div>
            <Link to={createPageUrl('Comunidade')} onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-2">
              <Lock size={18} /> Acessar Comunidade
            </Link>
            <Link to={createPageUrl('AdminPanel')} onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-indigo-900 text-white rounded-lg font-bold flex items-center justify-center gap-2">
              <Settings size={18} /> Admin Painel
            </Link>
          </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      {showFooter && (
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="md:col-span-1">
                <h4 className="text-white text-lg font-bold mb-3">Emanoel Amorim</h4>
                <p className="text-sm mb-2">Amorim - Serviços de Engenharia LTDA</p>
                <p className="text-xs font-mono text-slate-500">CNPJ: 35.673.731/0001-82</p>
              </div>
              <div className="md:col-span-1">
                <h4 className="text-white font-bold mb-3">Pilares</h4>
                <ul className="space-y-1.5 text-sm">
                  <li><Link to={createPageUrl('AmorimArquitetura')} className="hover:text-white transition-colors">Amorim Arquitetura</Link></li>
                  <li><Link to={createPageUrl('AmorimTech')} className="hover:text-white transition-colors">Amorim Tech</Link></li>
                  <li><Link to={createPageUrl('AcademiaEsuda')} className="hover:text-white transition-colors">Academia ESUDA</Link></li>
                  <li><Link to={createPageUrl('Blog')} className="hover:text-white transition-colors">Blog Técnico</Link></li>
                </ul>
              </div>
              <div className="md:col-span-1">
                <h4 className="text-white font-bold mb-3">Contato Oficial</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="https://wa.me/5581991298803" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"><MessageCircle size={14} className="text-emerald-400" /> <span className="font-medium">(81) 99129-8803</span></a></li>
                  <li className="flex items-start gap-2 pt-1"><Mail size={14} className="text-indigo-400 mt-0.5 shrink-0" /> <a href="mailto:emanoel@amorimarquitetura.com.br" className="break-all hover:text-indigo-300 transition-colors text-xs">emanoel@amorimarquitetura.com.br</a></li>
                </ul>
              </div>
              <div className="md:col-span-1">
                <h4 className="text-white font-bold mb-3">Redes</h4>
                <div className="flex flex-wrap gap-2">
                  <a href="https://www.instagram.com/oemanoelamorim/" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"><Instagram size={12} /></a>
                  <a href="http://linkedin.com/in/emanoel-amorim-43025b65" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"><Linkedin size={12} /></a>
                  <a href="https://www.youtube.com/@mestre-amorim" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"><Youtube size={12} /></a>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 text-center text-xs flex flex-col md:flex-row justify-between items-center gap-2 text-slate-500">
              <p className="flex items-center gap-1"><MapPin size={12}/> Rua Leonardo Bezerra Cavalcante, 672 - Recife/PE</p>
              <p>© 2026 Emanoel Amorim. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}