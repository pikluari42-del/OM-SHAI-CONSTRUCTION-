import React, { useEffect, useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Popup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in">
        <div className="bg-brand-blue p-6 text-center relative">
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>
          <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-3">
             <UserPlus size={32} className="text-brand-blue" />
          </div>
          <h3 className="text-xl font-bold text-white leading-tight">
            {t.communityPopupTitle}
          </h3>
        </div>

        <form className="p-6 space-y-4">
          <input type="text" placeholder={t.name} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
          <input type="tel" placeholder={t.phone} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
          <input type="text" placeholder={t.skills} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
          <input type="text" placeholder={t.city} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
          
          <button type="submit" className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition">
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;