'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/i18n/config';

export type Language = 'sr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLang = 'sr' }: { children: React.ReactNode; initialLang?: Language }) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const [isLoading, setIsLoading] = useState(false);

  // Update i18n when language changes
  useEffect(() => {
    try {
      if (i18n?.changeLanguage) {
        i18n.changeLanguage(lang);
      }
    } catch (e) {
      // i18n not available on server
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    // Set cookie for server-side recognition
    document.cookie = `lang=${newLang}; path=/; max-age=${365 * 24 * 60 * 60}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
