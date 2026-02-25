/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Language } from '@/i18n/constants';
import srNavbar from '@/i18n/locales/sr/navbar.json';
import enNavbar from '@/i18n/locales/en/navbar.json';
import srCommon from '@/i18n/locales/sr/common.json';
import enCommon from '@/i18n/locales/en/common.json';
import srAuth from '@/i18n/locales/sr/auth.json';
import enAuth from '@/i18n/locales/en/auth.json';
import srSidebar from '@/i18n/locales/sr/sidebar.json';
import enSidebar from '@/i18n/locales/en/sidebar.json';
import srAddToCartButton from '@/i18n/locales/sr/AddToCartButton.json';
import enAddToCartButton from '@/i18n/locales/en/AddToCartButton.json';
import srProizvodi from '@/i18n/locales/sr/proizvodi.json';
import enProizvodi from '@/i18n/locales/en/proizvodi.json';
import srKorpa from '@/i18n/locales/sr/korpa.json';
import enKorpa from '@/i18n/locales/en/korpa.json';
import srPlacanje from '@/i18n/locales/sr/placanje.json';
import enPlacanje from '@/i18n/locales/en/placanje.json';
import srNotFound from '@/i18n/locales/sr/notFound.json';
import enNotFound from '@/i18n/locales/en/notFound.json';
import srOmiljeni from '@/i18n/locales/sr/omiljeni.json';
import enOmiljeni from '@/i18n/locales/en/omiljeni.json';

type Namespace = 'navbar' | 'common' | 'auth' | 'sidebar' | 'addToCartButton' | 'proizvodi' | 'korpa' | 'placanje' | 'notFound' | 'omiljeni';

const translations: Record<Language, Record<Namespace, any>> = {
  sr: {
    navbar: srNavbar,
    common: srCommon,
    auth: srAuth,
    sidebar: srSidebar,
    addToCartButton: srAddToCartButton,
    proizvodi: srProizvodi,
    korpa: srKorpa,
    placanje: srPlacanje,
    notFound: srNotFound,
    omiljeni: srOmiljeni,
  },
  en: {
    navbar: enNavbar,
    common: enCommon,
    auth: enAuth,
    sidebar: enSidebar,
    addToCartButton: enAddToCartButton,
    proizvodi: enProizvodi,
    korpa: enKorpa,
    placanje: enPlacanje,
    notFound: enNotFound,
    omiljeni: enOmiljeni,
  },
};

/**
 * Get translation key from namespace
 * @param lang - Language code
 * @param namespace - Translation namespace
 * @param key - Translation key (supports dot notation for nested keys)
 * @param fallback - Fallback value if key not found
 */
export function t(
  lang: Language,
  namespace: Namespace,
  key: string,
  fallback?: string
): string {
  const ns = translations[lang]?.[namespace];
  if (!ns) return fallback || key;

  // Support nested keys like 'user.profile'
  const keys = key.split('.');
  let value = ns;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return fallback || key;
  }

  return value || fallback || key;
}

/**
 * Get all translations for a namespace
 */
export function getNamespace(lang: Language, namespace: Namespace) {
  return translations[lang]?.[namespace] || {};
}
