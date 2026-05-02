import path from 'path';
import fs from 'fs';
import { cookies } from 'next/headers';
import type { Language } from './constants';
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isSupportedLanguage } from './constants';

/**
 * Učitaj prevode za dati jezik i namespace (npr. "proizvodi", "profil", ...)
 * @param lang Jezik (npr. "sr", "en")
 * @param namespace Naziv json fajla bez ekstenzije (npr. "proizvodi")
 */
export function getLocaleMessages(lang: Language | string, namespace: string): Record<string, any> {
  const safeLang = isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
  const filePath = path.join(process.cwd(), 'i18n/locales', safeLang, `${namespace}.json`);

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to load ${safeLang}/${namespace}.json`, error);
    return {};
  }
}

/**
 * Get language from cookies (server-side)
 * Falls back to 'sr' if no language is set
 */
export async function getServerLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get(LANGUAGE_COOKIE)?.value;
    return isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Kompatibilna verzija sa getRequestLocale imenom
 */
export async function getRequestLanguage(): Promise<Language> {
  return getServerLanguage();
}
