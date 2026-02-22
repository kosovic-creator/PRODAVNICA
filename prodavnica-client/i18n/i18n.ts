import path from 'path';
import fs from 'fs';
import { cookies } from 'next/headers';

type Language = 'sr' | 'en';

/**
 * Učitaj prevode za dati jezik i namespace (npr. "proizvodi", "profil", ...)
 * @param lang Jezik (npr. "sr", "en")
 * @param namespace Naziv json fajla bez ekstenzije (npr. "proizvodi")
 */
export function getLocaleMessages(lang: Language | string, namespace: string) {
  const safeLang = (lang === 'en' ? 'en' : 'sr') as Language;
  const filePath = path.join(process.cwd(), 'i18n/locales', safeLang, `${namespace}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Get language from cookies (server-side)
 * Falls back to 'sr' if no language is set
 */
export async function getLanguageFromCookies(): Promise<Language> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get('lang')?.value;
    return (lang === 'en' ? 'en' : 'sr') as Language;
  } catch {
    return 'sr';
  }
}