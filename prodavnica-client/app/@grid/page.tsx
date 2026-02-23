import { getProizvodNajnoviji } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import OmiljeniButton from '../proizvodi/components/OmiljeniButton';
import AddToCartButton from '../proizvodi/components/AddToCartButton';
import ProductPrice from '../proizvodi/components/product-price';
import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Suspense } from 'react';
import GridSkeleton from './components/GridSkeleton';

function getCloudinaryOptimizedUrl(url: string) {
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_400,h_400/');
}

export default async function GridPage() {
  return (
    <Suspense fallback={<GridSkeleton />}>
      <GridContent />
    </Suspense>
  );
}

async function GridContent() {
  const lang = await getLanguageFromCookies();
  const result = await getProizvodNajnoviji();
  // Ensure proizvodi is always an array of product objects
  const proizvodi = (result.success && result.data
    ? Array.isArray(result.data)
      ? result.data
      : [result.data]
    : []
  ).map((proizvod: any) => ({
    ...proizvod,
    opis_sr: proizvod.opis_sr ?? undefined,
    opis_en: proizvod.opis_en ?? undefined,
    karakteristike_sr: proizvod.karakteristike_sr ?? undefined,
    karakteristike_en: proizvod.karakteristike_en ?? undefined,
    boja: Array.isArray(proizvod.boja) && proizvod.boja?.length ? proizvod.boja : [],
    varijante: Array.isArray(proizvod.varijante) ? proizvod.varijante : [],
    // Add more fields here if needed
  }));
  const t = getLocaleMessages(lang, 'proizvodi');
  if (proizvodi.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {t.nema_proizvoda_prikaz}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-amber-50 mb-6 text-center">
        {t.our_products}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proizvodi.map((proizvod) => {
          // Access 'slike' on each 'proizvod' object, not on the array
          const imageUrl = Array.isArray(proizvod.slike) && proizvod.slike.length > 0
            ? getCloudinaryOptimizedUrl(proizvod.slike[0])
            : null;
          const naziv = lang === 'en' ? proizvod.naziv_en : proizvod.naziv_sr;
          const opis = lang === 'en' ? proizvod.opis_en : proizvod.opis_sr;
          const karakteristike = lang === 'en' ? proizvod.karakteristike_en : proizvod.karakteristike_sr;
          const kategorija = lang === 'en' ? proizvod.kategorija_en : proizvod.kategorija_sr;

          return (
            <div
              key={proizvod.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative group"
            >
              {/* Omiljeni button */}
              <div className="absolute top-3 right-3 z-10">
                <OmiljeniButton proizvodId={proizvod.id} />
              </div>

              {/* Slika */}
              <Link href={`/proizvodi/${proizvod.id}`}>
                <div className="flex justify-center mb-4 cursor-pointer">
                  {imageUrl ? (
                    <div className="relative w-32 h-32 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={imageUrl}
                        alt={naziv || 'Proizvod'}
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 768px) 100vw, 128px"
                        quality={90}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-linear-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-5xl">
                        {lang === 'en'
                          ? (proizvod.kategorija_en === 'bike' ? '🚴' : proizvod.kategorija_en === 'shoes' ? '👟' : '📦')
                          : (proizvod.kategorija_sr === 'bicikla' ? '🚴' : proizvod.kategorija_sr === 'patike' ? '👟' : '📦')}
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Naziv */}
              <Link href={`/proizvodi/${proizvod.id}`}>
                <h3 className="text-xl font-bold text-center mb-2 text-gray-800 line-clamp-2 min-h-14 hover:text-gray-600 transition-colors cursor-pointer">
                  {naziv}
                </h3>
              </Link>

              {/* Opis */}
              {opis && (
                <p className="text-gray-600 text-center mb-3 text-sm line-clamp-2">
                  {opis}
                </p>
              )}

              {/* Karakteristike */}
              {karakteristike && (
                <p className="text-gray-500 text-center mb-3 text-xs line-clamp-1">
                  {karakteristike}
                </p>
              )}

              {/* Kategorija */}
              {kategorija && (
                <div className="flex justify-center mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {t.kategorija}: {kategorija}
                  </span>
                </div>
              )}

              {/* Cena */}
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  <ProductPrice value={Number(proizvod.cena)} />
                </span>
              </div>

              {/* Akcije */}
              <div className="p-0">
                <AddToCartButton proizvod={proizvod} t={t} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}