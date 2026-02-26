'use client';

import { APP_NAME } from '../../lib/constants';
import Link from 'next/link';
import { FaMapLocationDot, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { useI18n } from '@/i18n/I18nProvider';

/**
 * Client-side footer sa lokalizacijom preko useI18n()
 * Rendira se nakon hidratacije klijenta
 */
export default function FooterContent() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* O prodavnici */}
        <div className="flex flex-col">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-amber-400">✨</span> {APP_NAME}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4" suppressHydrationWarning>
            {t('footer', 'about_description')}
          </p>
          <div className="flex gap-3">
            <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Brzi linkovi */}
        <div className="flex flex-col">
          <h4 className="text-white font-semibold text-base mb-4 border-b-2 border-amber-400 pb-2" suppressHydrationWarning>
            {t('footer', 'navigation')}
          </h4>
          <nav className="flex flex-col gap-3">
            <Link href="/proizvodi" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm" suppressHydrationWarning>
              {t('footer', 'products')}
            </Link>
            <Link href="/mapa" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2" suppressHydrationWarning>
              <FaMapLocationDot size={16} /> {t('footer', 'map')}
            </Link>
            <Link href="/korpa" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm" suppressHydrationWarning>
              {t('footer', 'cart')}
            </Link>
            <Link href="/moje-porudzbine" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm" suppressHydrationWarning>
              {t('footer', 'my_orders')}
            </Link>
          </nav>
        </div>

        {/* Korisnički nalog */}
        <div className="flex flex-col">
          <h4 className="text-white font-semibold text-base mb-4 border-b-2 border-amber-400 pb-2" suppressHydrationWarning>
            {t('footer', 'user_account')}
          </h4>
          <nav className="flex flex-col gap-3">
            <Link href="/prijava" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm" suppressHydrationWarning>
              {t('footer', 'login')}
            </Link>
            <Link href="/registracija" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm" suppressHydrationWarning>
              {t('footer', 'register')}
            </Link>
            <Link href="/profil" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm" suppressHydrationWarning>
              {t('footer', 'profile')}
            </Link>
            <Link href="/omiljeni" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm" suppressHydrationWarning>
              {t('footer', 'favorite_products')}
            </Link>
          </nav>
        </div>

        {/* Kontakt */}
        <div className="flex flex-col">
          <h4 className="text-white font-semibold text-base mb-4 border-b-2 border-amber-400 pb-2" suppressHydrationWarning>
            {t('footer', 'contact')}
          </h4>
          <div className="flex flex-col gap-3">
            <a href="tel:+38267135355" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2" suppressHydrationWarning>
              <FaPhone size={16} /> {t('footer', 'phone')}
            </a>
            <a href="mailto:info@prodavnica.me" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2" suppressHydrationWarning>
              <FaEnvelope size={16} /> {t('footer', 'email')}
            </a>
            <p className="text-slate-400 text-sm" suppressHydrationWarning>
              <span className="font-semibold" suppressHydrationWarning>{t('footer', 'working_hours')}:</span><br />
              {t('footer', 'monday_friday')}<br />
              {t('footer', 'saturday')}
            </p>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-slate-700 my-8"></div>

      {/* Copyright i donje linkove */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-slate-400 text-sm" suppressHydrationWarning>
          &copy; {currentYear} <span className="font-semibold text-amber-400">{APP_NAME}</span>.
          <span className="ml-2" suppressHydrationWarning>{t('footer', 'all_rights_reserved')}.</span><br className="sm:hidden" />
          <span className="text-xs mt-2 sm:mt-0">Izrada: Draško Kosović</span>
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200" suppressHydrationWarning>
            {t('footer', 'terms_conditions')}
          </a>
          <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200" suppressHydrationWarning>
            {t('footer', 'privacy_policy')}
          </a>
          <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200" suppressHydrationWarning>
            Politika kolačića
          </a>
        </div>
      </div>
    </div>
  );
}
