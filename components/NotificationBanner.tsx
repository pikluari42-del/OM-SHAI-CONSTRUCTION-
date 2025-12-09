

import React from 'react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

const NotificationBanner: React.FC = () => {
  const { notificationText } = useSite();
  const { language } = useLanguage();
  
  const textToDisplay = notificationText[language] || notificationText.en;

  return (
    <div className="bg-brand-orange text-white py-2 overflow-hidden relative z-40">
      <div className="animate-scroll-text whitespace-nowrap flex space-x-10 font-bold tracking-wide">
        {/* Duplicate text to ensure smooth loop for CSS animation */}
        <span>{textToDisplay}</span>
        <span>•</span>
        <span>{textToDisplay}</span>
      </div>
    </div>
  );
};

export default NotificationBanner;