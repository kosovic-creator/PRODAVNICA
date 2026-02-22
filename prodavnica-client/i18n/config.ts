/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Lazy load all namespaces
const loadLocale = async (lang: string, namespace: string) => {
  try {
    return await import(`./locales/${lang}/${namespace}.json`);
  } catch (e) {
    console.warn(`Failed to load ${lang}/${namespace}.json`);
    return {};
  }
};

// Namespaces to load
const namespaces = [
  'common',
  'auth',
  'navbar',
  'sidebar',
  'home',
  'proizvodi',
  'profil',
  'korpa',
  'moje_porudzbine',
  'omiljeni',
  'placanje',
  'AddToCartButton',
];

const buildResources = () => {
  const resources: Record<string, Record<string, any>> = {
    en: {},
    sr: {},
  };

  namespaces.forEach(namespace => {
    resources.en[namespace] = loadLocale('en', namespace);
    resources.sr[namespace] = loadLocale('sr', namespace);
  });

  return resources;
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      fallbackLng: 'sr',
      supportedLngs: ['en', 'sr'],
      debug: false,
      ns: namespaces,
      defaultNS: 'common',
      resources: buildResources(),
      backend: false,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      missingInterpolationHandler: (text) => {
        console.warn(`Missing i18n key: ${text}`);
        return text;
      },
    });
}

export default i18n;
