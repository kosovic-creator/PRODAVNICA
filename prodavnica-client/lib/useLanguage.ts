'use client';

import { useI18n } from '@/i18n/I18nProvider';
import type { Language } from '@/i18n/constants';

/**
 * Legacy kompatibilna hook - koristi novu I18nProvider infrastrukturu
 * DEPRECATED: Koristi useI18n() direktno umjesto ovoga
 */
export function useLanguage(): {
  lang: Language;
  setLang: (lang: Language) => void;
  isLoading: boolean;
} {
  const { language, setLanguage } = useI18n();

  return {
    lang: language as Language,
    setLang: setLanguage,
    isLoading: false,
  };
}
