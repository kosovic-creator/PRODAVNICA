'use client';

import { useState, useCallback, useEffect } from 'react';
import i18n from '@/i18n/config';

export type Language = 'sr' | 'en';
const COOKIE_NAME = 'lang';

export function useLanguage(): {
  lang: Language;
  setLang: (lang: Language) => void;
  isLoading: boolean;
} {
  const [lang, setLangState] = useState<Language>('sr');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from cookie on client side
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(COOKIE_NAME + '='))
      ?.split('=')[1];

    if (cookieValue === 'en') {
      setLangState('en');
    } else {
      setLangState('sr');
    }
    setIsLoading(false);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    // Set cookie for server-side recognition
    document.cookie = `${COOKIE_NAME}=${newLang}; path=/; max-age=${365 * 24 * 60 * 60}`;

    // Update i18n language
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(newLang);
    }
  }, []);

  return { lang, setLang, isLoading };
}
