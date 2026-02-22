
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getKorpa } from '@/lib/actions/korpa';
import Link from 'next/link';
import KorpaItem from './components/KorpaItem';
import KorpaActions from './components/KorpaActions';
import StripeWrapper from '../components/StripeWrapper';
import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import KorpaSkeleton from './components/KorpaSkeleton';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};
export default async function KorpaPage() {
  const lang = await getLanguageFromCookies();
  const t = getLocaleMessages(lang, 'korpa');
  // Dohvati sesiju korisnika server side
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  let stavke: any[] = [];
  if (userId) {
    const result = await getKorpa(userId);
    if (result.success && result.data) {
      stavke = result.data.stavke || [];
    }
  }
  if (!userId) {
    return (
      <StripeWrapper>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            {t.morate_biti_prijavljeni}
          </h2>
          <Link
            href="/prijava"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.prijava}
          </Link>
        </div>
      </StripeWrapper>
    );
  }

  return (
    <StripeWrapper>
      <Suspense fallback={<KorpaSkeleton />}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl text-amber-50 md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center">
            {t.naslov}
          </h1>
          {stavke.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <h2 className="text-xl font-semibold text-shadow-gray-300 mb-2">
                {t.prazna_korpa}
              </h2>
              <p className="text-gray-500 mb-4">
                {t.nema_proizvoda}
              </p>
              <Button variant='default' asChild>
                <Link href="/proizvodi">
                  {t.nastavi_kupovinu}
                </Link>
              </Button>

            </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lijeva kolona - Lista proizvoda */}
                <div className="lg:col-span-2 space-y-4">
                {stavke.map((stavka) => (
                  <KorpaItem key={stavka.id} stavka={stavka} />
                ))}
              </div>

                {/* Desna kolona - Checkout opcije */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20">
                    <KorpaActions userId={userId} stavke={stavke} />
                  </div>
              </div>
              </div>
          )}
        </div>
      </Suspense>
    </StripeWrapper>
  );
}