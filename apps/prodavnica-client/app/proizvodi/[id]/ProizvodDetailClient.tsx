'use client';

import { useI18n } from '@/i18n/I18nProvider';
import type { Proizvodi } from '@/types';
import Link from 'next/link';
import ProductPrice from '../../proizvodi/components/product-price';
import { FaStar } from 'react-icons/fa';
import ProductImagesSlider from '../../proizvodi/components/ProductImagesSlider';
import ProductVarijanteSection from '../../proizvodi/components/ProductVarijanteSection';
import Breadcrumbs from '../../proizvodi/components/Breadcrumbs';
interface ProizvodDetailClientProps {
  proizvod: Proizvodi;
}

export default function ProizvodDetailClient({ proizvod }: ProizvodDetailClientProps) {
  const { language, t } = useI18n();

  const lang = language;

  // Translate function sa namespace 'proizvodi'
  const getTranslation = (key: string) => t('proizvodi', key);

  const naziv = lang === 'en' ? proizvod.naziv_en : proizvod.naziv_sr;
  const opis = lang === 'en' ? proizvod.opis_en : proizvod.opis_sr;
  const karakteristike = lang === 'en' ? proizvod.karakteristike_en : proizvod.karakteristike_sr;
  const kategorija = lang === 'en' ? proizvod.kategorija_en : proizvod.kategorija_sr;
  const pol = lang === 'en' ? proizvod.pol_en : proizvod.pol;
  const uzrast = lang === 'en' ? proizvod.uzrast_en : proizvod.uzrast;
  const materijal = lang === 'en' ? proizvod.materijal_en : proizvod.materijal;
  const bojeDetalji = lang === 'en'
    ? (Array.isArray(proizvod.boja_en) && proizvod.boja_en.length > 0 ? proizvod.boja_en : proizvod.boja)
    : proizvod.boja;

  // Breadcrumbs items
  const breadcrumbItems = [
    ...(pol ? [{ label: pol.toUpperCase() }] : []),
    ...(kategorija ? [{ label: kategorija.toUpperCase() }] : []),
  ];

  const detalji = [
    { label: getTranslation('pol'), value: pol },
    { label: getTranslation('uzrast'), value: uzrast },
    { label: getTranslation('materijal'), value: materijal },
    { label: getTranslation('brend'), value: proizvod.brend },
    { label: getTranslation('boja'), value: Array.isArray(bojeDetalji) ? bojeDetalji.join(', ') : bojeDetalji },
  ].filter((item) => item.value && String(item.value).trim() !== '');

  const slike: string[] = Array.isArray(proizvod.slike) ? proizvod.slike : [];
  const ratingValue = typeof proizvod.avgRating === 'number' ? proizvod.avgRating : null;
  const hasStock = proizvod.varijante && proizvod.varijante.length > 0;

  // Build translations object for child components
  const translations: Record<string, string> = {
    nazad: getTranslation('nazad'),
    opis: getTranslation('opis'),
    karakteristike: getTranslation('karakteristike'),
    kategorija: getTranslation('kategorija'),
    nema_kategorije: getTranslation('nema_kategorije'),
    detalji_proizvoda: getTranslation('detalji_proizvoda'),
    nema_dostupnih_proizvoda: getTranslation('nema_dostupnih_proizvoda'),
    dostupno: getTranslation('dostupno'),
    pol: getTranslation('pol'),
    uzrast: getTranslation('uzrast'),
    materijal: getTranslation('materijal'),
    brend: getTranslation('brend'),
    boja: getTranslation('boja'),
    velicina: getTranslation('velicina'),
    dostupnost_u_radnjama: getTranslation('dostupnost_u_radnjama'),
    sakrij_dostupnost_u_radnjama: getTranslation('sakrij_dostupnost_u_radnjama'),
    dostupno_po_prodavnicama: getTranslation('dostupno_po_prodavnicama'),
    nema_zalihama: getTranslation('nema_na_zalihama'),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

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
