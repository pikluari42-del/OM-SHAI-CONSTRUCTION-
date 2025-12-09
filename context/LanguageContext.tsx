import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, Translation } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const translations: Record<Language, Translation> = {
  en: {
    heroTitle: "Find Daily Work Easily — Join Our Labor Community",
    heroSubtitle: "We connect laborers with real job opportunities every day.",
    callNow: "Call Now",
    whatsapp: "WhatsApp",
    viewJobs: "View Latest Jobs",
    latestJobs: "Latest Job Openings",
    workersNeeded: "Workers Needed! Apply Today",
    applyNow: "Contact / Apply",
    jobType: "Job Type",
    location: "Location",
    salary: "Salary",
    posted: "Posted",
    adminPanel: "Admin Dashboard",
    postJob: "Post a New Job",
    contactUs: "Contact Us",
    name: "Your Name",
    phone: "Phone Number",
    city: "City / Location",
    skills: "Skills / Job Category",
    submit: "Join Now",
    joinCommunity: "Join Community",
    communityPopupTitle: "Join our Labor Community – Get Daily Job Updates",
    testimonials: "What Workers Say",
    howItWorks: "How It Works",
    step1: "Browse Jobs",
    step2: "Contact Employer",
    step3: "Start Working",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    welcome: "Welcome",
    ourServices: "Our Services",
    servicesSubtitle: "Find the perfect professional for every job type."
  },
  hi: {
    heroTitle: "आसानी से काम पाएं - हमारे लेबर कम्युनिटी से जुड़ें",
    heroSubtitle: "हम मजदूरों को हर दिन नौकरी के वास्तविक अवसरों से जोड़ते हैं।",
    callNow: "अभी कॉल करें",
    whatsapp: "व्हाट्सएप",
    viewJobs: "नवीनतम नौकरियां देखें",
    latestJobs: "नवीनतम नौकरी रिक्तियां",
    workersNeeded: "कर्मचारियों की आवश्यकता है! आज ही आवेदन करें",
    applyNow: "संपर्क / आवेदन करें",
    jobType: "नौकरी का प्रकार",
    location: "स्थान",
    salary: "वेतन",
    posted: "पोस्ट किया गया",
    adminPanel: "एडमिन डैशबोर्ड",
    postJob: "नई नौकरी पोस्ट करें",
    contactUs: "संपर्क करें",
    name: "आपका नाम",
    phone: "फ़ोन नंबर",
    city: "शहर / स्थान",
    skills: "कौशल / नौकरी श्रेणी",
    submit: "अभी शामिल हों",
    joinCommunity: "समुदाय में शामिल हों",
    communityPopupTitle: "हमारी लेबर कम्युनिटी में शामिल हों - दैनिक जॉब अपडेट प्राप्त करें",
    testimonials: "कार्यकर्ताओं का क्या कहना है",
    howItWorks: "यह कैसे काम करता है",
    step1: "नौकरियां ब्राउज़ करें",
    step2: "नियोक्ता से संपर्क करें",
    step3: "काम करना शुरू करें",
    login: "लॉग इन करें",
    signup: "साइन अप करें",
    logout: "लॉग आउट",
    welcome: "स्वागत है",
    ourServices: "हमारी सेवाएँ",
    servicesSubtitle: "हर प्रकार के काम के लिए सही पेशेवर खोजें।"
  },
  bn: {
    heroTitle: "সহজেই দৈনিক কাজ খুঁজুন — আমাদের লেবার কমিউনিটিতে যোগ দিন",
    heroSubtitle: "আমরা শ্রমিকদের প্রতিদিন প্রকৃত কাজের সুযোগের সাথে সংযুক্ত করি।",
    callNow: "এখনই কল করুন",
    whatsapp: "হোয়াটসঅ্যাপ",
    viewJobs: "সর্বশেষ কাজ দেখুন",
    latestJobs: "সর্বশেষ কাজের বিজ্ঞপ্তি",
    workersNeeded: "কর্মী প্রয়োজন! আজই আবেদন করুন",
    applyNow: "যোগাযোগ / আবেদন",
    jobType: "কাজের ধরন",
    location: "অবস্থান",
    salary: "বেতন",
    posted: "পোস্ট করা হয়েছে",
    adminPanel: "অ্যাডমিন ড্যাশবোর্ড",
    postJob: "নতুন কাজ পোস্ট করুন",
    contactUs: "যোগাযোগ করুন",
    name: "আপনার নাম",
    phone: "ফোন নম্বর",
    city: "শহর / অবস্থান",
    skills: "দক্ষতা / কাজের বিভাগ",
    submit: "এখনই যোগ দিন",
    joinCommunity: "কমিউনিটিতে যোগ দিন",
    communityPopupTitle: "আমাদের লেবার কমিউনিটিতে যোগ দিন – প্রতিদিনের কাজের আপডেট পান",
    testimonials: "শ্রমিকরা যা বলছেন",
    howItWorks: "কিভাবে কাজ করে",
    step1: "কাজ খুঁজুন",
    step2: "নিয়োগকর্তার সাথে যোগাযোগ করুন",
    step3: "কাজ শুরু করুন",
    login: "লগইন করুন",
    signup: "সাইন আপ করুন",
    logout: "লগ আউট",
    welcome: "স্বাগতম",
    ourServices: "আমাদের সেবাসমূহ",
    servicesSubtitle: "প্রতিটি কাজের জন্য সঠিক পেশাদার খুঁজুন।"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};