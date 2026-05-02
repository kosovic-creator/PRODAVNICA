'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import type { Language } from '@/i18n/constants';
import { isSupportedLanguage, DEFAULT_LANGUAGE, LANGUAGE_COOKIE } from '@/i18n/constants';
import i18n from '@/i18n/config';

interface I18nContextType {
  language: Language;
  lang?: Language; // Alias za kompatibilnost
  setLanguage: (lang: Language) => void;
  setLang?: (lang: Language) => void; // Alias za kompatibilnost
  t: (namespace: string, key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Funkcija za čitanje jezika iz cookie-ja na klijentskoj strani
 */
function getCookieLanguage(): Language {
  if (typeof document === 'undefined') return DEFAULT_LANGUAGE;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${LANGUAGE_COOKIE}=`);
  const lang = parts.length === 2 ? parts.pop()?.split(';')[0] : undefined;
  return isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}

export function I18nProvider({
  children,
  initialLang = DEFAULT_LANGUAGE,
}: {
  children: ReactNode;
  initialLang?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLang);

  /**
   * Postavi novi jezik - spremi u cookie i sinkronizuj sa i18n
   * Bez router.refresh() - ažurira se putem state-a
   */
  const setLanguage = useCallback((lang: Language) => {
    if (!isSupportedLanguage(lang)) {
      console.warn(`Invalid language: ${lang}, using default`);
      return;
    }

    // Postavi cookie
    document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;

    // Ažuriraj state
    setLanguageState(lang);

    // Sinkronizuj sa i18n bibliotekom
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(lang);
    }
  }, []);

  /**
   * Inicijalizacija - odmah sinkronizuj i18n sa initialLang
   * Koristi useEffect sa praznom dependency arrayu da se pokrene samo jednom
   */
  useEffect(() => {
    // Sinkronizuj i18n sa initialLang koji dolazi od servera
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(initialLang).catch(() => {
        // Silent catch - ovo je OK ako se desavi greška pri loadanju
      });
    }
  }, [initialLang]);

  /**
   * Hidratacija - čitaj iz cookie-ja i sinkronizuj
   * Koristi odvojen effect da sinkronizuje sa cookie-j nakon inicijalizacije
   */
  useEffect(() => {
    // Čitaj jeziku iz cookie-ja
    const cookieLang = getCookieLanguage();

    // Ažuriraj state samo ako se razlikuje od initialLang
    if (cookieLang !== initialLang) {
      setLanguageState(cookieLang);
      if (i18n && i18n.language !== cookieLang) {
        i18n.changeLanguage(cookieLang);
      }
    }
  }, [initialLang]);

  /**
   * Translate funkcija - obavijena verzija sa namespace sigurnošću
   */
  const t = (namespace: string, key: string): string => {
    try {
      const translation = i18n.t(key, { ns: namespace, lng: language });
      // Ako je t() vratio ključ (što znači da nema prevoda) budi oprezan
      if (translation === key || !translation) {
        console.warn(`[i18n] Translation missing: ${namespace}.${key} (current lang: ${language})`);
        return key;
      }
      return translation;
    } catch (error) {
      console.warn(`[i18n] Error translating ${namespace}.${key}:`, error);
      return key;
    }
  };

  const value: I18nContextType = useMemo(() => {
    return {
      language,
      lang: language, // Alias
      setLanguage,
      setLang: setLanguage, // Alias
      t,
    };
  }, [language, setLanguage]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
