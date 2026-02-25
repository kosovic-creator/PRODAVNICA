'use client';

/**
 * DEPRECATED: Koristi I18nProvider.tsx umjesto ovoga
 * Ova datoteka se čuva samo za kompatibilnost
 */

import { useI18n } from './I18nProvider';
import type { Language } from '@/i18n/constants';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isLoading: boolean;
}

export type { Language };

/**
 * DEPRECATED: Koristi useLanguage iz useLanguageCompat.ts umjesto ovoga
 */
export function useLanguage() {
  const { language, setLanguage } = useI18n();

  const context: LanguageContextType = {
    lang: language as Language,
    setLang: setLanguage,
    isLoading: false,
  };

  return context;
}
