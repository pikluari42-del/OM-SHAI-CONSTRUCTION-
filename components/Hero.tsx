import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { heroImages } = useSite();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="relative bg-gradient-to-br from-brand-blue via-slate-900 to-black text-white overflow-hidden min-h-[600px] flex items-center">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-orange/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue/30 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center gap-12 pt-10 pb-10">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-brand-yellow/50 text-brand-yellow rounded-full text-sm font-semibold mb-8 animate-fade-in shadow-lg shadow-brand-yellow/10">
            <span className="w-2 h-2 bg-brand-yellow rounded-full mr-2 animate-pulse"></span>
            #1 Construction & Labor Agency
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {t.heroTitle.split('—')[0]}
            </span>
            <br />
            <span className="text-brand-orange relative">
              OM SHAI
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-orange/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
            {t.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in delay-100">
            <a href="tel:+919876543210" className="w-full sm:w-auto px-8 py-4 bg-brand-yellow text-brand-blue font-bold rounded-xl shadow-xl shadow-brand-yellow/20 hover:bg-yellow-400 transition hover:-translate-y-1 flex items-center justify-center group">
              <Phone className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
              {t.callNow}
            </a>
            <a href="https://wa.me/919876543210" className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-xl shadow-green-600/20 hover:bg-green-700 transition hover:-translate-y-1 flex items-center justify-center">
              <MessageCircle className="mr-2" size={20} />
              {t.whatsapp}
            </a>
          </div>
        </div>

        {/* Hero Image Slider */}
        <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px]">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
             {heroImages.length > 0 ? (
               heroImages.map((img, index) => (
                 <div 
                  key={img.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                 >
                   <img 
                     src={img.url} 
                     alt="OM SHAI CONSTRUCTION" 
                     className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[10s]"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 </div>
               ))
             ) : (
               <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                 <p className="text-white">No images uploaded</p>
               </div>
             )}
             
             {/* Slider Controls */}
             <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
               <ChevronLeft size={24} />
             </button>
             <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
               <ChevronRight size={24} />
             </button>

             {/* Slide Indicators */}
             <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {heroImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-brand-yellow w-6' : 'bg-white/50'}`}
                  />
                ))}
             </div>
             
             {/* Info Badge */}
             <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                <div>
                   <p className="text-white/60 text-sm uppercase tracking-wider font-semibold mb-1">Our Workforce</p>
                   <p className="text-white font-bold text-xl">Skilled & Verified Laborers</p>
                </div>
             </div>
          </div>
          
          {/* Floating Element 1 */}
          <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl flex items-center space-x-3 animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-brand-blue">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Daily Jobs</p>
              <p className="text-xl font-bold text-gray-900">500+ Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;