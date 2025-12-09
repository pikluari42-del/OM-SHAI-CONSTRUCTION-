import React from 'react';
import { Search, PhoneCall, HardHat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Steps: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Search, title: t.step1, desc: "Browse daily updated job lists." },
    { icon: PhoneCall, title: t.step2, desc: "Call or WhatsApp employers directly." },
    { icon: HardHat, title: t.step3, desc: "Get hired and get paid daily." },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">{t.howItWorks}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg transition">
               <div className="w-16 h-16 mx-auto bg-brand-blue rounded-full flex items-center justify-center text-brand-yellow mb-4 shadow-lg">
                 <step.icon size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
               <p className="text-gray-500">{step.desc}</p>
               
               {index < 2 && (
                 <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300">
                    →
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;