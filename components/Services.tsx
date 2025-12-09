import React from 'react';
import { Zap, Wrench, Hammer, PaintBucket, Truck, ChefHat, HeartHandshake, ShieldCheck, Briefcase, HardHat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const { serviceCategories } = useSite();

  // Helper to map string icon names to components
  const getIconComponent = (iconName: string) => {
    const icons: any = { Zap, Wrench, Hammer, PaintBucket, Truck, ChefHat, HeartHandshake, ShieldCheck, Briefcase, HardHat };
    return icons[iconName] || Briefcase;
  };

  // Define unique hover styles based on the user's request
  const effects = [
    // Pointer
    {
      style: 'border-2 border-transparent hover:border-indigo-500 cursor-pointer hover:scale-105 hover:rotate-2 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]',
      iconColor: 'text-indigo-500',
      bg: 'bg-indigo-50'
    },
    // Help
    {
      style: 'border-2 border-transparent hover:border-cyan-500 cursor-help hover:scale-105 hover:-translate-y-2 hover:shadow-[0_5px_15px_rgba(6,182,212,0.5)]',
      iconColor: 'text-cyan-500',
      bg: 'bg-cyan-50'
    },
    // Wait
    {
      style: 'border-2 border-transparent hover:border-pink-500 cursor-wait hover:animate-pulse',
      iconColor: 'text-pink-500',
      bg: 'bg-pink-50'
    },
    // Crosshair
    {
      style: 'border-2 border-transparent hover:border-green-500 cursor-crosshair hover:scale-105 hover:ring-4 hover:ring-green-500/30',
      iconColor: 'text-green-500',
      bg: 'bg-green-50'
    },
    // Text
    {
      style: 'border-2 border-transparent hover:border-amber-400 cursor-text hover:scale-105 hover:tracking-widest',
      iconColor: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    // Not Allowed
    {
      style: 'border-2 border-transparent hover:border-red-500 cursor-not-allowed hover:scale-105 hover:animate-shake',
      iconColor: 'text-red-500',
      bg: 'bg-red-50'
    },
    // Grab
    {
      style: 'border-2 border-transparent hover:border-purple-500 cursor-grab hover:scale-105 hover:translate-x-2',
      iconColor: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    // Zoom In
    {
      style: 'border-2 border-transparent hover:border-indigo-700 cursor-zoom-in hover:scale-110',
      iconColor: 'text-indigo-700',
      bg: 'bg-indigo-50'
    },
    // Cell
    {
      style: 'border-2 border-transparent hover:border-teal-600 cursor-cell hover:scale-105 hover:[clip-path:polygon(10%_0%,90%_0%,100%_10%,100%_90%,90%_100%,10%_100%,0%_90%,0%_10%)]',
      iconColor: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    // Copy
    {
      style: 'border-2 border-transparent hover:border-lime-400 cursor-copy hover:scale-105 hover:shadow-[5px_5px_0px_rgba(205,220,57,0.5)]',
      iconColor: 'text-lime-500',
      bg: 'bg-lime-50'
    },
    // Move
    {
      style: 'border-2 border-transparent hover:border-orange-500 cursor-move hover:animate-moveAround',
      iconColor: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    // Alias
    {
      style: 'border-2 border-transparent hover:border-pink-600 cursor-alias hover:scale-105 hover:-skew-x-6',
      iconColor: 'text-pink-600',
      bg: 'bg-pink-50'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-blue mb-4">{t.ourServices}</h2>
          <div className="w-20 h-1.5 bg-brand-yellow mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500 text-lg">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {serviceCategories.map((service, index) => {
            const Icon = getIconComponent(service.icon);
            
            // Cycle through the effects based on index
            const effect = effects[index % effects.length];
            
            // Get translated fields if available
            let displayName = service.name;
            let displaySubtitle = service.subtitle;
            
            if (language === 'hi' && service.translations?.hi) {
                displayName = service.translations.hi.name || service.name;
                displaySubtitle = service.translations.hi.subtitle || service.subtitle;
            } else if (language === 'bn' && service.translations?.bn) {
                displayName = service.translations.bn.name || service.name;
                displaySubtitle = service.translations.bn.subtitle || service.subtitle;
            }

            return (
                <div 
                  key={service.id} 
                  className={`relative group bg-white rounded-2xl p-8 shadow-sm transition-all duration-300 flex flex-col items-center text-center overflow-hidden
                    ${effect.style}
                    before:content-[''] before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent before:-top-full before:-left-full before:transition-all before:duration-500 hover:before:top-full hover:before:left-full
                  `}
                >
                  <div className={`w-16 h-16 ${effect.bg} rounded-full flex items-center justify-center mb-6 relative z-10`}>
                      <Icon size={32} className={effect.iconColor} strokeWidth={2} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-brand-blue relative z-10">
                      {displayName}
                  </h3>
                  
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wide relative z-10">
                      {displaySubtitle}
                  </p>
                </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;