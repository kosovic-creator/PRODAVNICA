import ProizvodiSkeleton from './components/ProizvodiSkeleton';
import { Suspense } from 'react';
import { getProizvodi } from './../../lib/actions/proizvodi';
import Image from 'next/image';
import { Card, CardContent } from "@prodavnica/ui";
import { FaStar } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import ProductPrice from './components/product-price';
import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Proizvodi } from '@/types';
import AddToCartButton from './components/AddToCartButton';
import OmiljeniButton from './components/OmiljeniButton';
import PaginationControls from './components/PaginationControls';
import { Button } from "@prodavnica/ui";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artikli',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function ProizvodiPage({ searchParams }: { searchParams: Promise<{ page?: string; pageSize?: string; search?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = parseInt(params.pageSize || '10');
  const lang = await getLanguageFromCookies();
  const search = params.search || '';

  const t = getLocaleMessages(lang, 'proizvodi');
  const result = await getProizvodi(page, pageSize, search);
  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProizvodiSkeleton />
        </div>
      </div>
    );
  }
  const { proizvodi } = result.data;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center">
          {t['artikli'] || 'Artikli'}
        </h1>
        <Suspense fallback={<ProizvodiSkeleton />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {proizvodi.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                <p className="text-lg">{search ? t['nema_za_pretragu']?.replace('{search}', search) : t['nema_proizvoda'] || 'Nema proizvoda'}</p>
              </div>
            ) : (
              proizvodi.map((proizvod: Proizvodi) => {
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
                const glavnaSlika = Array.isArray(proizvod.slike)
                  ? (proizvod.slike[0] || '/placeholder.png')
                  : (proizvod.slike || '/placeholder.png');
                const ratingValue = typeof proizvod.avgRating === 'number' ? proizvod.avgRating : null;
                return (
                  <Card key={proizvod.id} className="relative flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-20">
                      <div className="mb-3 flex justify-center">
                        <Image
                          src={glavnaSlika}
                          alt={naziv || 'Slika proizvoda'}
                          width={400}
                          height={300}
                          className="object-contain rounded-lg shadow-lg"
                          unoptimized
                          priority
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{naziv}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{opis}</p>
                        <p className="text-gray-500 text-xs line-clamp-1">{karakteristike}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={star <= Math.round((ratingValue ?? 0)) ? 'text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-gray-600 text-xs">
                            {ratingValue != null ? ratingValue.toFixed(1) : '–'} ({proizvod.ratingCount ?? 0})
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{t['kategorija']}: {kategorija || t['nema_kategorije']}</span>
                        </div>
                        {detalji.length > 0 && (
                          <div className="text-xs text-gray-600 space-y-1">
                            {detalji.slice(0, 3).map((item) => (
                              <div key={item.label}>
                                <span className="font-medium text-gray-700">{item.label}:</span> {item.value}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <ProductPrice value={Number(proizvod.cena)} />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <OmiljeniButton proizvodId={proizvod.id} />
                      </div>
                    </CardContent>
                    {/* Button group at the bottom */}
                    <div className="flex flex-col sm:flex-row gap-0 p-4 pt-0 absolute left-0 right-0 bottom-0">
                      <Button asChild variant="secondary" className="flex-1 flex w-full items-center justify-center gap-2 text-sm font-medium rounded-none">
                        <a href={`/proizvodi/${proizvod.id}`}>
                          <FaInfoCircle className="w-4 h-4" />
                          {t['detalji']}
                        </a>
                      </Button>
                      <div className="flex-1">
                        <AddToCartButton proizvod={proizvod} t={t} />
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </Suspense>
        <PaginationControls page={page} total={result.data.total} pageSize={pageSize} search={search} />
      </div>
    </div>
  );
}