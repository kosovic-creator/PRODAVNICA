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
import enProfil from './locales/en/profil.json';
import enMojePorudzbine from './locales/en/moje_porudzbine.json';
import enKontakt from './locales/en/kontakt.json';
import enKorisnici from './locales/en/korisnici.json';
import enONama from './locales/en/o_nama.json';
import enPodaciPreuzimanja from './locales/en/podaci-preuzimanja.json';
import enPorudzbine from './locales/en/porudzbine.json';
import enUspjesnoPlacanje from './locales/en/uspjesno_placanje.json';

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
import srProfil from './locales/sr/profil.json';
import srMojePorudzbine from './locales/sr/moje_porudzbine.json';
import srKontakt from './locales/sr/kontakt.json';
import srKorisnici from './locales/sr/korisnici.json';
import srONama from './locales/sr/o_nama.json';
import srPodaciPreuzimanja from './locales/sr/podaci-preuzimanja.json';
import srPorudzbine from './locales/sr/porudzbine.json';
import srUspjesnoPlacanje from './locales/sr/uspjesno_placanje.json';

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
    profil: enProfil,
    moje_porudzbine: enMojePorudzbine,
    kontakt: enKontakt,
    korisnici: enKorisnici,
    o_nama: enONama,
    podaci_preuzimanja: enPodaciPreuzimanja,
    porudzbine: enPorudzbine,
    uspjesno_placanje: enUspjesnoPlacanje,
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
    profil: srProfil,
    moje_porudzbine: srMojePorudzbine,
    kontakt: srKontakt,
    korisnici: srKorisnici,
    o_nama: srONama,
    podaci_preuzimanja: srPodaciPreuzimanja,
    porudzbine: srPorudzbine,
    uspjesno_placanje: srUspjesnoPlacanje,
  },
};

const namespaces = ['common', 'auth', 'navbar', 'sidebar', 'proizvodi', 'korpa', 'placanje', 'notFound', 'omiljeni', 'addToCartButton', 'home', 'footer', 'profil', 'moje_porudzbine', 'kontakt', 'korisnici', 'o_nama', 'podaci_preuzimanja', 'porudzbine', 'uspjesno_placanje'];

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
