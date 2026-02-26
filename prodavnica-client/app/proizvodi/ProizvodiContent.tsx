'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@prodavnica/ui";
import { FaStar } from 'react-icons/fa';
import ProductPrice from './components/product-price';
import { Proizvodi } from '@/types';
import AddToCartButton from './components/AddToCartButton';
import OmiljeniButton from './components/OmiljeniButton';
import PaginationControls from './components/PaginationControls';
import { useI18n } from '@/i18n/I18nProvider';


interface ProizvodiContentProps {
  proizvodi: Proizvodi[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
}

export default function ProizvodiContent({
  proizvodi,
  total,
  page,
  pageSize,
  search
}: ProizvodiContentProps) {
  const { t, language } = useI18n();
  const tr = (key: string) => t('proizvodi', key);

  if (proizvodi.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center" suppressHydrationWarning>
            {tr('artikli')}
          </h1>
          <div className="col-span-full text-center text-gray-500 py-12">
                    <p className="text-lg" suppressHydrationWarning>
              {search
                ? tr('nema_za_pretragu')?.replace('{search}', search)
                : tr('nema_proizvoda')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center" suppressHydrationWarning>
          {tr('artikli')}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {proizvodi.map((proizvod: Proizvodi) => {
            const naziv = language === 'en' ? proizvod.naziv_en : proizvod.naziv_sr;
            const opis = language === 'en' ? proizvod.opis_en : proizvod.opis_sr;
            const karakteristike = language === 'en' ? proizvod.karakteristike_en : proizvod.karakteristike_sr;
            const kategorija = language === 'en' ? proizvod.kategorija_en : proizvod.kategorija_sr;
            const pol = language === 'en' ? proizvod.pol_en : proizvod.pol;
            const uzrast = language === 'en' ? proizvod.uzrast_en : proizvod.uzrast;
            const materijal = language === 'en' ? proizvod.materijal_en : proizvod.materijal;
            const detalji = [
              { label: tr('pol'), value: pol },
              { label: tr('uzrast'), value: uzrast },
              { label: tr('materijal'), value: materijal },
              { label: tr('brend'), value: proizvod.brend },
              { label: tr('boja'), value: Array.isArray(proizvod.boja) ? proizvod.boja.join(', ') : proizvod.boja },
            ].filter((item) => item.value && String(item.value).trim() !== '');
            const glavnaSlika = Array.isArray(proizvod.slike)
              ? (proizvod.slike[0] || '/placeholder.png')
              : (proizvod.slike || '/placeholder.png');
            const ratingValue = typeof proizvod.avgRating === 'number' ? proizvod.avgRating : null;
            return (
              <Card key={proizvod.id} className="relative flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 pb-20">
                  <Link href={`/proizvodi/${proizvod.id}`} className="block mb-3">
                    <div className="flex justify-center cursor-pointer hover:opacity-90 transition-opacity">
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
                  </Link>
                  <div className="flex-1 space-y-2">
                    <Link href={`/proizvodi/${proizvod.id}`}>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors cursor-pointer">{naziv}</h3>
                    </Link>
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
                                <span className="text-gray-500" suppressHydrationWarning>{tr('kategorija')}: {kategorija || tr('nema_kategorije')}</span>
                    </div>
                    {detalji.length > 0 && (
                      <div className="text-xs text-gray-600 space-y-1">
                        {detalji.slice(0, 3).map((item) => (
                          <div key={item.label}>
                                <span className="font-medium text-gray-700" suppressHydrationWarning>{item.label}:</span> {item.value}
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
                {/* Button at the bottom */}
                <div className="p-4 pt-0 absolute left-0 right-0 bottom-0">
                  <AddToCartButton proizvod={proizvod} />
                </div>
              </Card>
            );
          })}
        </div>
        <PaginationControls page={page} total={total} pageSize={pageSize} search={search} />
      </div>
    </div>
  );
}
