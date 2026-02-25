/* eslint-disable @typescript-eslint/no-explicit-any */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Statički import prijevoda da izbgegnemo async probleme
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enNavbar from './locales/en/navbar.json';
import enSidebar from './locales/en/sidebar.json';
import enProizvodi from './locales/en/proizvodi.json';
import enKorpa from './locales/en/korpa.json';
import enPlacanje from './locales/en/placanje.json';
import enNotFound from './locales/en/notFound.json';
import enOmiljeni from './locales/en/omiljeni.json';
import enAddToCartButton from './locales/en/AddToCartButton.json';
import enHome from './locales/en/home.json';
import enFooter from './locales/en/footer.json';

import srCommon from './locales/sr/common.json';
import srAuth from './locales/sr/auth.json';
import srNavbar from './locales/sr/navbar.json';
import srSidebar from './locales/sr/sidebar.json';
import srProizvodi from './locales/sr/proizvodi.json';
import srKorpa from './locales/sr/korpa.json';
import srPlacanje from './locales/sr/placanje.json';
import srNotFound from './locales/sr/notFound.json';
import srOmiljeni from './locales/sr/omiljeni.json';
import srAddToCartButton from './locales/sr/AddToCartButton.json';
import srHome from './locales/sr/home.json';
import srFooter from './locales/sr/footer.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    navbar: enNavbar,
    sidebar: enSidebar,
    proizvodi: enProizvodi,
    korpa: enKorpa,
    placanje: enPlacanje,
    notFound: enNotFound,
    omiljeni: enOmiljeni,
    addToCartButton: enAddToCartButton,
    home: enHome,
    footer: enFooter,
  },
  sr: {
    common: srCommon,
    auth: srAuth,
    navbar: srNavbar,
    sidebar: srSidebar,
    proizvodi: srProizvodi,
    korpa: srKorpa,
    placanje: srPlacanje,
    notFound: srNotFound,
    omiljeni: srOmiljeni,
    addToCartButton: srAddToCartButton,
    home: srHome,
    footer: srFooter,
  },
};

const namespaces = ['common', 'auth', 'navbar', 'sidebar', 'proizvodi', 'korpa', 'placanje', 'notFound', 'omiljeni', 'addToCartButton', 'home', 'footer'];

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      lng: 'sr',
      fallbackLng: 'sr',
      supportedLngs: ['en', 'sr'],
      debug: false,
      ns: namespaces,
      defaultNS: 'common',
      resources,
      backend: false,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  // Postavi default jezik sa log-om
  if (typeof window !== 'undefined') {
    console.log('[i18n] Initialized on client with language:', i18n.language);
  }
}

export default i18n;
