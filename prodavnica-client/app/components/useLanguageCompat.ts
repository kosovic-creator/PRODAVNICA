'use client';

import { useI18n } from './I18nProvider';
import type { Language } from '@/i18n/constants';

/**
 * Kompatibilna hook za migraciju iz stare lokalizacije
 * Koristi novu I18nProvider infrastrukturu
 */
export function useLanguage() {
  const { language, setLanguage, isHydrated } = useI18n();

  return {
    lang: language as Language,
    setLang: setLanguage,
    isLoading: !isHydrated,
  };
}
