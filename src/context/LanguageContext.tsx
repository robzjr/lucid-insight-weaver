import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ar';

const translations: Record<Language, Record<string, string>> = {
  en: {
    shareYourDream: 'Share Your Dream',
    describeYourDream: 'Describe your dream in detail for the most accurate interpretation',
    dreamDescription: 'Dream Description',
    analyzing: 'Analyzing your dream...',
    interpretDream: 'Interpret My Dream',
    darkMode: 'Dark Mode',
    language: 'Language',
    chooseLanguage: 'Choose your preferred language',
    estimatedWaitTime: 'Estimated wait time'
  },
  ar: {
    shareYourDream: 'شارك حلمك',
    describeYourDream: 'وصف حلمك بالتفصيل للحصول على تفسير أدق',
    dreamDescription: 'وصف الحلم',
    analyzing: 'يتم تحليل حلمك...',
    interpretDream: 'فسر حلمي',
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
    chooseLanguage: 'اختر لغتك المفضلة',
    estimatedWaitTime: 'الوقت المتوقع'
  }
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children, initialLanguage = 'en' }: { children: ReactNode; initialLanguage?: Language }) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = (key: string) => translations[language][key] || key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
