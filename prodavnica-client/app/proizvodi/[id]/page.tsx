
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProizvodById } from './../../../lib/actions/proizvodi';
import type { Proizvodi } from '../../../types';
import ClientLayout from '@/app/components/ClientLayout';
import { getLanguageFromCookies, getLocaleMessages } from '@/i18n/i18n';
import ProductPrice from '../components/product-price';
import { FaStar } from 'react-icons/fa';
import ProductImagesSlider from '../components/ProductImagesSlider';
import { Metadata } from 'next';
import ProductVarijanteSection from '../components/ProductVarijanteSection';
import { Suspense } from 'react';
import ProizvodDetailSkeleton from '../components/ProizvodDetailSkeleton';

export const metadata: Metadata = {
  title: 'Proizvod',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};


export default async function ProizvodPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const langFromCookies = await getLanguageFromCookies();
  const lang = langFromCookies || 'sr';
  const t = getLocaleMessages(lang, 'proizvodi');
  const result = await getProizvodById(resolvedParams.id);
  if (!result.success || !result.data) notFound();
  const proizvod: Proizvodi = {
    ...result.data,
    opis_sr: result.data.opis_sr ?? undefined,
    opis_en: result.data.opis_en ?? undefined,
    karakteristike_sr: result.data.karakteristike_sr ?? undefined,
    karakteristike_en: result.data.karakteristike_en ?? undefined,
    pol: result.data.pol ?? undefined,
    pol_en: result.data.pol_en ?? undefined,
    uzrast: result.data.uzrast ?? undefined,
    uzrast_en: result.data.uzrast_en ?? undefined,
    materijal: result.data.materijal ?? undefined,
    materijal_en: result.data.materijal_en ?? undefined,
    brend: result.data.brend ?? undefined,
    boja: Array.isArray(result.data.boja) ? result.data.boja : [],
    varijante: result.data.varijante ?? [],
    avgRating: typeof result.data.avgRating === 'number'
      ? result.data.avgRating
      : (typeof result.data.avgRating === 'string' && !isNaN(Number(result.data.avgRating)))
        ? Number(result.data.avgRating)
        : null,
    ratingCount: result.data.ratingCount ?? 0,
  };

  const naziv = lang === 'en' ? proizvod.naziv_en : proizvod.naziv_sr;

  return (
    <ClientLayout>
      <Suspense fallback={<ProizvodDetailSkeleton />}>
        <ProizvodDetailContent proizvod={proizvod} lang={lang} t={t} />
      </Suspense>
    </ClientLayout>
  );
}

async function ProizvodDetailContent({ proizvod, lang, t }: { proizvod: Proizvodi; lang: string; t: any }) {
  const naziv = lang === 'en' ? proizvod.naziv_en : proizvod.naziv_sr;
  const opis = lang === 'en' ? proizvod.opis_en : proizvod.opis_sr;
  const karakteristike = lang === 'en' ? proizvod.karakteristike_en : proizvod.karakteristike_sr;
  const kategorija = lang === 'en' ? proizvod.kategorija_en : proizvod.kategorija_sr;
  const pol = lang === 'en' ? proizvod.pol_en : proizvod.pol;
  const uzrast = lang === 'en' ? proizvod.uzrast_en : proizvod.uzrast;
  const materijal = lang === 'en' ? proizvod.materijal_en : proizvod.materijal;
  const detalji = [
    { label: t['pol'] || 'Pol', value: pol },
    { label: t['uzrast'] || 'Uzrast', value: uzrast },
    { label: t['materijal'] || 'Materijal', value: materijal },
    { label: t['brend'] || 'Brend', value: proizvod.brend },
    { label: t['boja'] || 'Boja', value: Array.isArray(proizvod.boja) ? proizvod.boja.join(', ') : proizvod.boja },
  ].filter((item) => item.value && String(item.value).trim() !== '');
  const slike: string[] = Array.isArray(proizvod.slike) ? proizvod.slike : [];
  const ratingValue = typeof proizvod.avgRating === 'number' ? proizvod.avgRating : null;
  const hasStock = proizvod.varijante && proizvod.varijante.length > 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto p-4">
          <Link
            href="/proizvodi"
            className="flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-700 transition"
          >
            {/* Strelica nazad */}
            <span className="text-lg text-gray-500">←</span>
            {t['nazad'] || 'Nazad na proizvode'}
          </Link>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
            <div className="md:flex">
              {/* Slike proizvoda kao slider sa modalom */}
              <ProductImagesSlider slike={slike} naziv={naziv} t={t} />
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
                    {!hasStock ? t['nema_dostupnih_proizvoda'] || 'Nema na zalihama' : t['dostupno'] || 'Dostupno'}
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t['opis'] || 'Opis'}:</h3>
                    <p className="text-gray-600">{opis}</p>
                  </div>
                  {karakteristike && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t['karakteristike'] || 'Karakteristike'}:</h3>
                      <p className="text-gray-600">{karakteristike}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t['kategorija'] || 'Kategorija'}:</h3>
                    <p className="text-gray-600">{kategorija || t['nema_kategorije'] || 'Nema kategorije'}</p>
                  </div>
                  {detalji.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t['detalji_proizvoda'] || 'Detalji proizvoda'}:</h3>
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
                <ProductVarijanteSection proizvod={proizvod} t={t} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


