/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AcademiaEsuda from './pages/AcademiaEsuda';
import AdminPanel from './pages/AdminPanel';
import AmorimArquitetura from './pages/AmorimArquitetura';
import AmorimTech from './pages/AmorimTech';
import Blog from './pages/Blog';
import Comunidade from './pages/Comunidade';
import Contato from './pages/Contato';
import Home from './pages/Home';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AcademiaEsuda": AcademiaEsuda,
    "AdminPanel": AdminPanel,
    "AmorimArquitetura": AmorimArquitetura,
    "AmorimTech": AmorimTech,
    "Blog": Blog,
    "Comunidade": Comunidade,
    "Contato": Contato,
    "Home": Home,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};