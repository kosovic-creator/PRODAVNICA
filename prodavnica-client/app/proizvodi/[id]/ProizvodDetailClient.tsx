'use client';

import { useI18n } from '@/i18n/I18nProvider';
import type { Proizvodi } from '@/types';
import type { Language } from '@/i18n/constants';
import Link from 'next/link';
import ProductPrice from '../../proizvodi/components/product-price';
import { FaStar } from 'react-icons/fa';
import ProductImagesSlider from '../../proizvodi/components/ProductImagesSlider';
import ProductVarijanteSection from '../../proizvodi/components/ProductVarijanteSection';
import Breadcrumbs from '../../proizvodi/components/Breadcrumbs';
import { useState, useEffect } from 'react';

// Static translations for SSR/hydration to prevent mismatch
const staticTranslations = {
  sr: {
    nazad: 'Nazad',
    opis: 'Opis',
    karakteristike: 'Karakteristike',
    kategorija: 'Kategorija',
    nema_kategorije: 'Nema kategorije',
    detalji_proizvoda: 'Detalji proizvoda',
    nema_dostupnih_proizvoda: 'Nema dostupnih proizvoda',
    dostupno: 'Dostupno',
    pol: 'Pol',
    uzrast: 'Uzrast',
    materijal: 'Materijal',
    brend: 'Brend',
    boja: 'Boja',
  },
  en: {
    nazad: 'Back',
    opis: 'Description',
    karakteristike: 'Features',
    kategorija: 'Category',
    nema_kategorije: 'No category',
    detalji_proizvoda: 'Product details',
    nema_dostupnih_proizvoda: 'No available products',
    dostupno: 'Available',
    pol: 'Gender',
    uzrast: 'Age',
    materijal: 'Material',
    brend: 'Brand',
    boja: 'Color',
  },
};

interface ProizvodDetailClientProps {
  proizvod: Proizvodi;
  initialLang: Language;
}

export default function ProizvodDetailClient({ proizvod, initialLang }: ProizvodDetailClientProps) {
  const [mounted, setMounted] = useState(false);
  const { language, t: i18nT } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use initialLang for SSR/hydration, then switch to reactive i18n after mount
  const lang = mounted ? language : initialLang;

  // Get translations - static during hydration, reactive after mount
  const t = (key: string) => {
    if (!mounted) {
      return staticTranslations[initialLang][key as keyof typeof staticTranslations.sr] || key;
    }
    return i18nT('proizvodi', key);
  };

  const naziv = lang === 'en' ? proizvod.naziv_en : proizvod.naziv_sr;
  const opis = lang === 'en' ? proizvod.opis_en : proizvod.opis_sr;
  const karakteristike = lang === 'en' ? proizvod.karakteristike_en : proizvod.karakteristike_sr;
  const kategorija = lang === 'en' ? proizvod.kategorija_en : proizvod.kategorija_sr;
  const pol = lang === 'en' ? proizvod.pol_en : proizvod.pol;
  const uzrast = lang === 'en' ? proizvod.uzrast_en : proizvod.uzrast;
  const materijal = lang === 'en' ? proizvod.materijal_en : proizvod.materijal;

  // Breadcrumbs items
  const breadcrumbItems = [
    ...(pol ? [{ label: pol.toUpperCase() }] : []),
    ...(kategorija ? [{ label: kategorija.toUpperCase() }] : []),
  ];

  const detalji = [
    { label: t('pol'), value: pol },
    { label: t('uzrast'), value: uzrast },
    { label: t('materijal'), value: materijal },
    { label: t('brend'), value: proizvod.brend },
    { label: t('boja'), value: Array.isArray(proizvod.boja) ? proizvod.boja.join(', ') : proizvod.boja },
  ].filter((item) => item.value && String(item.value).trim() !== '');

  const slike: string[] = Array.isArray(proizvod.slike) ? proizvod.slike : [];
  const ratingValue = typeof proizvod.avgRating === 'number' ? proizvod.avgRating : null;
  const hasStock = proizvod.varijante && proizvod.varijante.length > 0;

  // Build translations object for child components
  const translations: Record<string, string> = {
    nazad: t('nazad'),
    opis: t('opis'),
    karakteristike: t('karakteristike'),
    kategorija: t('kategorija'),
    nema_kategorije: t('nema_kategorije'),
    detalji_proizvoda: t('detalji_proizvoda'),
    nema_dostupnih_proizvoda: t('nema_dostupnih_proizvoda'),
    dostupno: t('dostupno'),
    pol: t('pol'),
    uzrast: t('uzrast'),
    materijal: t('materijal'),
    brend: t('brend'),
    boja: t('boja'),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} initialLang={initialLang} />

        <Link
          href="/proizvodi"
          className="flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-700 transition"
        >
          <span className="text-lg text-gray-500">←</span>
          {translations.nazad}
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
          <div className="md:flex">
            {/* Slike proizvoda kao slider sa modalom */}
            <ProductImagesSlider slike={slike} naziv={naziv} t={translations} />

            {/* Detalji proizvoda */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{naziv}</h1>
              <div className="mb-6">
                <ProductPrice value={Number(proizvod.cena)} />
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= Math.round((ratingValue ?? 0)) ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {ratingValue != null ? ratingValue.toFixed(1) : '–'} ({proizvod.ratingCount ?? 0})
                  </span>
                </div>
                <div className={`text-sm font-semibold ${!hasStock ? 'text-red-600' : 'text-green-600'}`}>
                  {!hasStock ? translations.nema_dostupnih_proizvoda : translations.dostupno}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{translations.opis}:</h3>
                  <p className="text-gray-600">{opis}</p>
                </div>
                {karakteristike && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{translations.karakteristike}:</h3>
                    <p className="text-gray-600">{karakteristike}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{translations.kategorija}:</h3>
                  <p className="text-gray-600">{kategorija || translations.nema_kategorije}</p>
                </div>
                {detalji.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{translations.detalji_proizvoda}:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {detalji.map((item) => (
                        <div key={item.label} className="text-gray-600 text-sm">
                          <span className="font-medium text-gray-800">{item.label}:</span> {item.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Varijante Section */}
              <ProductVarijanteSection proizvod={proizvod} t={translations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
