/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getOmiljeni } from '@/lib/actions/omiljeni';
import Link from 'next/link';
import { FaHeart, FaEye } from 'react-icons/fa';
import { Suspense } from 'react';
import { getKorpa } from '@/lib/actions/korpa';
import OmiljeniList from './OmiljeniList';
import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Metadata } from 'next';
import OmiljeniSkeleton from './components/OmiljeniSkeleton';

export const metadata: Metadata = {
  title: 'Omiljeni',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};
export default async function OmiljeniPage() {
  const lang = await getLanguageFromCookies();
  const t = getLocaleMessages(lang, 'omiljeni');
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  let omiljeni: any[] = [];
  let brojUKorpi = 0;
  if (userId) {
    const result = await getOmiljeni(userId);
    if (result.success && result.data) {
      omiljeni = Array.isArray(result.data) ? result.data : result.data.omiljeni || [];
    }
    const korpa = await getKorpa(userId);
    if (korpa.success && korpa.data?.stavke) {
      brojUKorpi = korpa.data.stavke.reduce((sum, s) => sum + (s.kolicina || 1), 0);
    }
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FaHeart className="text-gray-300 text-6xl mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          {t.morate_biti_prijavljeni_za_omiljene}
        </h2>
        <Link
          href="/prijava"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t.prijavi_se}
        </Link>
      </div>
    );
  }

  // Dodaj handler za brisanje (stub, treba povezati sa backendom)
  async function obrisiOmiljeni(id: string) {
    // TODO: Pozvati API za brisanje omiljenog proizvoda
    // npr. await deleteOmiljeni(id);
    // location.reload(); // ili bolje: optimistički update stanja
  }

  return (
    <Suspense fallback={<OmiljeniSkeleton />}>
      <>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center">
          <FaHeart className="text-red-600" />
          {t.omiljeni_proizvodi}
        </h1>
        {omiljeni.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <FaHeart className="text-gray-300 text-6xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {t.nema_omiljenih_proizvoda}
            </h2>
            <p className="text-gray-500 mb-4">
              {t.dodajte_u_omiljene_opis}
            </p>
            <Link
              href="/proizvodi"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.pregled_proizvoda}
            </Link>
          </div>
        ) : (
            <OmiljeniList omiljeni={omiljeni} />
        )}
      </>
    </Suspense>
  );
}


