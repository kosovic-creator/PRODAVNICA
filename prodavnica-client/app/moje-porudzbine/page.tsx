import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { getPorudzbineKorisnika } from '@/lib/actions';
import { FaClipboardList, FaBox, FaCalendarAlt, FaEuroSign, FaImage, FaStar } from 'react-icons/fa';
import { Badge } from "@prodavnica/ui";
import { Card, CardHeader, CardContent } from "@prodavnica/ui";
import Image from 'next/image';
import Link from 'next/link';
import type { Porudzbina } from '@/types';
import { getLanguageFromCookies, getLocaleMessages } from '@/i18n/i18n';
import RateStavka from './RateStavka';
import { Button } from "@prodavnica/ui";
import { Metadata } from 'next';
import { Suspense } from 'react';
import MojePorudzbineSkeleton from './components/MojePorudzbineSkeleton';

export const metadata: Metadata = {
  title: 'Narudžbe',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};
export default async function MojePorudzbinePage({ searchParams }: { searchParams: Promise<{ page?: string; pageSize?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/prijava');
  }
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = parseInt(params.pageSize || '10');
  const langFromCookies = await getLanguageFromCookies();
  const lang = langFromCookies || 'sr';
  const t = getLocaleMessages(lang, 'moje_porudzbine');
  const result = await getPorudzbineKorisnika(session.user.id, page, pageSize);
  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Greška pri učitavanju porudžbina</div>
          <p className="text-gray-600">{result.error}</p>
        </div>
      </div>
    );
  }
  const porudzbine = result.data?.porudzbine || [];
  const total = result.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (!porudzbine.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-center justify-center">
            <FaClipboardList className="text-gray-600" />
            {t.moje_porudzbine || 'Moje porudžbine'}
          </h1>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FaBox className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              {t.nemate_porudzbina || 'Nemate porudžbina'}
            </h2>
            <p className="text-gray-500 mb-6">
              {t.kada_napravite_porudzbinu || 'Kada napravite porudžbinu, pojaviće se ovde.'}
            </p>
            <Button asChild size="lg">
              <Link href="/proizvodi">
                {t.pocni_kupovinu || 'Počni kupovinu'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<MojePorudzbineSkeleton />}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-center justify-center">
            <FaClipboardList className="text-gray-600" />
            {t.moje_porudzbine || 'Moje porudžbine'}
          </h1>

          <div className="space-y-6">
            {porudzbine.map((porudzbina: Porudzbina) => (
              <div key={porudzbina.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FaClipboardList className="text-gray-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t.porudzbina} #{porudzbina.id.slice(-8)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-600" />
                            {new Date(porudzbina.kreiran).toLocaleDateString(lang === 'en' ? 'en-US' : 'sr-RS')}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaEuroSign className="text-gray-600" />
                            {porudzbina.ukupno.toFixed(2)} €
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={porudzbina.status === 'Završeno' ? 'default' : porudzbina.status === 'Na čekanju' ? 'secondary' : porudzbina.status === 'Otkazano' ? 'destructive' : 'outline'}
                        className="text-sm font-medium"
                      >
                        {porudzbina.status === 'Završeno'
                          ? t.status_zavrseno || 'Završeno'
                          : porudzbina.status === 'Na čekanju'
                            ? t.status_na_cekanju || 'Na čekanju'
                            : porudzbina.status === 'Otkazano'
                              ? t.status_otkazano || 'Otkazano'
                              : porudzbina.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Stavke porudžbine */}
                  {porudzbina.stavkePorudzbine && porudzbina.stavkePorudzbine.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">{t.stavke}:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {porudzbina.stavkePorudzbine.map((stavka) => (
                          <Card key={stavka.id}>
                            <CardHeader className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                  {stavka.slika ? (
                                    <Image
                                      src={stavka.slika}
                                      alt={stavka.proizvod ? (lang === 'en' ? stavka.proizvod.naziv_en : stavka.proizvod.naziv_sr) : 'Proizvod'}
                                      width={48}
                                      height={48}
                                      className="w-12 h-12 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <FaImage className="text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {stavka.proizvod ? (lang === 'en' ? stavka.proizvod.naziv_en : stavka.proizvod.naziv_sr) : t.nepoznat_proizvod}
                                  </p>
                                  <div className="mt-2 bg-gray-100 rounded px-2 py-1">
                                    <p className="text-xs text-gray-700 font-semibold">
                                      {stavka.kolicina}x • <span className="text-blue-600">{stavka.cena.toFixed(2)} €</span>
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-2">
                                    {stavka.boja && <span>{stavka.boja}</span>}
                                    {stavka.boja && stavka.velicina && <span> • </span>}
                                    {stavka.velicina && <span>{stavka.velicina}</span>}
                                  </p>
                                </div>
                              </div>
                            </CardHeader>
                            <div className="border-t border-border" />
                            <CardContent className="p-3 pt-0">
                              {porudzbina.status === 'Završeno' ? (
                                <RateStavka
                                  stavkaId={stavka.id}
                                  userId={session.user.id}
                                  initialRating={stavka.rating ?? null}
                                  t={t}
                                />
                              ) : (
                                <div
                                  className="group flex items-center gap-2 cursor-not-allowed select-none"
                                  title={t.ocena_samo_zavrsene || 'Ocena je dostupna samo za završene porudžbine'}
                                  aria-disabled={true}
                                >
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                      <FaStar
                                        key={value}
                                        className="text-gray-300 transition-colors group-hover:text-gray-400"
                                        aria-hidden="true"
                                      />
                                    ))}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {t.ocena_samo_zavrsene || 'Ocena je dostupna samo za završene porudžbine'}
                                  </Badge>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Paginacija */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/moje-porudzbine?page=${page - 1}&pageSize=${pageSize}`}>
                    {t.prethodna}
                  </Link>
                </Button>
              )}

              <span className="px-3 py-2 text-sm text-gray-700">
                {t.stranica} {page} {t.od} {totalPages}
              </span>

              {page < totalPages && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/moje-porudzbine?page=${page + 1}&pageSize=${pageSize}`}>
                    {t.sledeca}
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* Info o ukupnom broju */}
          <div className="mt-4 text-center text-sm text-gray-600">
            {t.ukupno_porudzbina}: {total}
          </div>
        </div>
      </div>
    </Suspense>
  );
}