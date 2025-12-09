

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HeroImage, ServiceCategory, CategoryTranslation } from '../types';

interface NotificationText {
  en: string;
  hi: string;
  bn: string;
}

interface SiteContextType {
  heroImages: HeroImage[];
  addHeroImage: (url: string) => void;
  removeHeroImage: (id: string) => void;
  
  serviceCategories: ServiceCategory[];
  addServiceCategory: (data: { en: CategoryTranslation, hi?: CategoryTranslation, bn?: CategoryTranslation }) => void;
  updateServiceCategory: (id: string, data: { en: CategoryTranslation, hi?: CategoryTranslation, bn?: CategoryTranslation }) => void;
  deleteServiceCategory: (id: string) => void;

  notificationText: NotificationText;
  updateNotificationText: (text: NotificationText) => void;
}

const INITIAL_IMAGES: HeroImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { id: '2', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { id: '3', url: 'https://images.unsplash.com/photo-1621905251189-fc415343e6ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { id: '4', url: 'https://images.unsplash.com/photo-1535732820275-9ffd998cac22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
];

const INITIAL_SERVICES: ServiceCategory[] = [
  { 
    id: '1', name: 'Electrician', icon: 'Zap', subtitle: 'Skilled Labor',
    translations: {
      hi: { name: 'इलेक्ट्रीशियन', subtitle: 'कुशल श्रमिक' },
      bn: { name: 'ইলেকট্রিশিয়ান', subtitle: 'দক্ষ শ্রমিক' }
    }
  },
  { 
    id: '2', name: 'Plumber', icon: 'Wrench', subtitle: 'Skilled Labor',
    translations: {
      hi: { name: 'प्लंबर', subtitle: 'कुशल श्रमिक' },
      bn: { name: 'প্লাম্বার', subtitle: 'দক্ষ শ্রমিক' }
    }
  },
  { 
    id: '3', name: 'Carpenter', icon: 'Hammer', subtitle: 'Skilled Labor',
    translations: {
      hi: { name: 'बढ़ई', subtitle: 'कुशल श्रमिक' },
      bn: { name: 'কাঠমিস্ত্রি', subtitle: 'দক্ষ শ্রমিক' }
    }
  },
  { 
    id: '4', name: 'Painter', icon: 'PaintBucket', subtitle: 'Skilled Labor',
    translations: {
      hi: { name: 'पेंटर', subtitle: 'कुशल श्रमिक' },
      bn: { name: 'পেইন্টার', subtitle: 'দক্ষ শ্রমিক' }
    }
  },
  { 
    id: '5', name: 'Driver / Helper', icon: 'Truck', subtitle: 'Special Services',
    translations: {
      hi: { name: 'ड्राइवर / हेल्पर', subtitle: 'विशेष सेवाएँ' },
      bn: { name: 'ড্রাইভার / হেল্পার', subtitle: 'বিশেষ পরিষেবা' }
    }
  },
  { 
    id: '6', name: 'Cook / Maid', icon: 'ChefHat', subtitle: 'Domestic Services',
    translations: {
      hi: { name: 'रसोइया / नौकरानी', subtitle: 'घरेलू सेवाएँ' },
      bn: { name: 'রাঁধুনি / কাজের মেয়ে', subtitle: 'ঘরোয়া পরিষেবা' }
    }
  },
  { 
    id: '7', name: 'Elder Care', icon: 'HeartHandshake', subtitle: 'Domestic Services',
    translations: {
      hi: { name: 'बुजुर्गों की देखभाल', subtitle: 'घरेलू सेवाएँ' },
      bn: { name: 'বৃদ্ধদের যত্ন', subtitle: 'ঘরোয়া পরিষেবা' }
    }
  },
  { 
    id: '8', name: 'Security', icon: 'ShieldCheck', subtitle: 'Special Services',
    translations: {
      hi: { name: 'सुरक्षा गार्ड', subtitle: 'विशेष सेवाएँ' },
      bn: { name: 'নিরাপত্তা রক্ষী', subtitle: 'বিশেষ পরিষেবা' }
    }
  },
];

const DEFAULT_NOTIFICATION: NotificationText = {
  en: "🔔 Workers Needed! Apply Today • 👷 New Construction jobs available in Andheri • ⚡ Electricians needed urgently • 📞 Call us now: +91 98765 43210",
  hi: "🔔 कामगारों की आवश्यकता है! आज ही आवेदन करें • 👷 अंधेरी में नए निर्माण कार्य उपलब्ध हैं • ⚡ इलेक्ट्रीशियन की तत्काल आवश्यकता है • 📞 हमें अभी कॉल करें: +91 98765 43210",
  bn: "🔔 শ্রমিক প্রয়োজন! আজই আবেদন করুন • 👷 আন্ধেরিতে নতুন নির্মাণ কাজ উপলব্ধ • ⚡ ইলেকট্রিশিয়ান জরুরিভাবে প্রয়োজন • 📞 এখনই আমাদের কল করুন: +91 98765 43210"
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>(INITIAL_IMAGES);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(INITIAL_SERVICES);
  const [notificationText, setNotificationText] = useState<NotificationText>(DEFAULT_NOTIFICATION);

  useEffect(() => {
    // Load from local storage
    const savedServices = localStorage.getItem('laborLinkServices');
    if (savedServices) setServiceCategories(JSON.parse(savedServices));

    const savedNotif = localStorage.getItem('laborLinkNotifObj');
    if (savedNotif) {
      setNotificationText(JSON.parse(savedNotif));
    } else {
      // Fallback for older string version if exists, though we prefer the object default
      const oldStr = localStorage.getItem('laborLinkNotif');
      if (oldStr) {
         setNotificationText({ en: oldStr, hi: oldStr, bn: oldStr });
      }
    }
  }, []);

  const addHeroImage = (url: string) => {
    const newImage: HeroImage = {
      id: Date.now().toString(),
      url
    };
    setHeroImages(prev => [...prev, newImage]);
  };

  const removeHeroImage = (id: string) => {
    setHeroImages(prev => prev.filter(img => img.id !== id));
  };

  const addServiceCategory = (data: { en: CategoryTranslation, hi?: CategoryTranslation, bn?: CategoryTranslation }) => {
    const icons = ['Briefcase', 'Wrench', 'Hammer', 'Zap', 'Truck', 'HardHat']; 
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    const newCat: ServiceCategory = {
      id: Date.now().toString(),
      name: data.en.name,
      subtitle: data.en.subtitle,
      icon: randomIcon,
      translations: {
        hi: data.hi,
        bn: data.bn
      }
    };
    
    const updated = [...serviceCategories, newCat];
    setServiceCategories(updated);
    localStorage.setItem('laborLinkServices', JSON.stringify(updated));
  };

  const updateServiceCategory = (id: string, data: { en: CategoryTranslation, hi?: CategoryTranslation, bn?: CategoryTranslation }) => {
    const updated = serviceCategories.map(cat => 
        cat.id === id ? { 
          ...cat, 
          name: data.en.name, 
          subtitle: data.en.subtitle,
          translations: {
            hi: data.hi,
            bn: data.bn
          }
        } : cat
    );
    setServiceCategories(updated);
    localStorage.setItem('laborLinkServices', JSON.stringify(updated));
  };

  const deleteServiceCategory = (id: string) => {
    const updated = serviceCategories.filter(s => s.id !== id);
    setServiceCategories(updated);
    localStorage.setItem('laborLinkServices', JSON.stringify(updated));
  };

  const updateNotificationText = (text: NotificationText) => {
    setNotificationText(text);
    localStorage.setItem('laborLinkNotifObj', JSON.stringify(text));
  };

  return (
    <SiteContext.Provider value={{ 
      heroImages, addHeroImage, removeHeroImage,
      serviceCategories, addServiceCategory, updateServiceCategory, deleteServiceCategory,
      notificationText, updateNotificationText
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};