import React, { useState } from 'react';
import { Menu, X, Globe, Phone, User as UserIcon, LogOut, LayoutDashboard, Briefcase, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';

interface NavbarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  openAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, openAuth }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = (view: string) => 
    `cursor-pointer font-medium transition ${currentView === view ? 'text-brand-orange font-bold' : 'text-gray-600 hover:text-brand-blue'}`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onChangeView('home')}>
            <div className="w-10 h-10 bg-brand-yellow rounded-lg flex items-center justify-center mr-2">
              <span className="text-brand-blue font-bold text-xl">O</span>
            </div>
            <div className="flex flex-col leading-tight">
                <span className="font-bold text-lg text-brand-blue tracking-tight">OM SHAI</span>
                <span className="font-bold text-xs text-brand-orange tracking-widest">CONSTRUCTION</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <span onClick={() => onChangeView('home')} className={navLinkClass('home')}>Home</span>
            <span onClick={() => onChangeView('jobs')} className={navLinkClass('jobs')}>Find Jobs</span>
            <span onClick={() => onChangeView('contact')} className={navLinkClass('contact')}>Contact</span>
            
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition">
                <Globe size={16} />
                <span className="uppercase font-semibold text-sm">{language}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right border border-gray-100 z-50">
                <div className="py-1">
                  {(['en', 'hi', 'bn'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`block w-full text-left px-4 py-2 text-sm ${language === lang ? 'bg-brand-light text-brand-blue font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Bengali'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* User / Login Section */}
            {isAuthenticated && user ? (
              <div className="relative group">
                 <button className="flex items-center space-x-2 text-brand-blue font-bold hover:text-brand-orange transition">
                    <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center border border-gray-200">
                      <UserIcon size={16} />
                    </div>
                    <span>{user.name}</span>
                 </button>
                 
                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 transform origin-top-right z-50">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 mb-1">
                      Signed in as: <span className="uppercase font-bold">{user.role}</span>
                    </div>
                    
                    <button 
                      onClick={() => onChangeView('dashboard')} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <LayoutDashboard size={16} className="mr-2"/>
                      Dashboard
                    </button>

                    <button 
                      onClick={() => { logout(); onChangeView('home'); }} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut size={16} className="mr-2"/>
                      {t.logout}
                    </button>
                 </div>
              </div>
            ) : (
              <button 
                onClick={openAuth}
                className="text-brand-blue font-bold hover:text-brand-orange transition flex items-center"
              >
                <UserIcon size={18} className="mr-1" />
                {t.login}
              </button>
            )}

            {(!user || user.role !== 'admin') && (
              <a href="tel:+919876543210" className="bg-brand-blue text-white px-5 py-2 rounded-full font-bold flex items-center shadow-lg hover:bg-gray-800 transition transform hover:scale-105">
                <Phone size={16} className="mr-2" />
                {t.callNow}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-brand-blue focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full z-50 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
             {isAuthenticated && user && (
               <div className="px-3 py-3 bg-gray-50 rounded-lg mb-4 flex items-center space-x-3">
                 <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                 </div>
                 <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                 </div>
               </div>
             )}

            <button onClick={() => { onChangeView('home'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</button>
            <button onClick={() => { onChangeView('jobs'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Find Jobs</button>
            
            {isAuthenticated && (
               <button onClick={() => { onChangeView('dashboard'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-brand-orange bg-orange-50">Dashboard</button>
            )}

            <div className="border-t border-gray-100 my-2 pt-2">
              <p className="px-3 text-xs text-gray-400 mb-2">Select Language</p>
              <div className="flex space-x-2 px-3">
                 {(['en', 'hi', 'bn'] as Language[]).map((lang) => (
                    <button key={lang} onClick={() => handleLanguageChange(lang)} className={`px-3 py-1 rounded border text-sm ${language === lang ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-gray-200'}`}>
                      {lang.toUpperCase()}
                    </button>
                 ))}
              </div>
            </div>

            {isAuthenticated ? (
               <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); onChangeView('home'); }}
                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 mt-2"
              >
                {t.logout}
              </button>
            ) : (
              <button 
                onClick={() => { openAuth(); setIsMobileMenuOpen(false); }}
                className="block w-full text-center px-3 py-3 rounded-md text-base font-bold text-white bg-brand-orange mt-4"
              >
                {t.login} / {t.signup}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;