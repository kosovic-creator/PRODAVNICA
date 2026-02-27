/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import OmiljeniList from './OmiljeniList';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from "@prodavnica/ui";

interface OmiljeniContentProps {
  omiljeni: any[];
  isLoggedIn: boolean;
}

export default function OmiljeniContent({
  omiljeni,
  isLoggedIn,
}: OmiljeniContentProps) {
  const { t } = useI18n();
  const tr = (key: string) => t('omiljeni', key);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center">
        <FaHeart className="text-gray-300 text-6xl mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2" suppressHydrationWarning>
          {tr('morate_biti_prijavljeni_za_omiljene')}
        </h2>
        <Button asChild suppressHydrationWarning>
          <Link href="/prijava">
            {tr('prijavi_se')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center" suppressHydrationWarning>
          <FaHeart className="text-red-600" />
          {tr('omiljeni_proizvodi')}
        </h1>
        {omiljeni.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-75 text-center">
            <FaHeart className="text-gray-300 text-6xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2" suppressHydrationWarning>
              {tr('nema_omiljenih_proizvoda')}
            </h2>
            <p className="text-gray-500 mb-4" suppressHydrationWarning>
              {tr('dodajte_u_omiljene_opis')}
            </p>
            <Button asChild suppressHydrationWarning>
              <Link href="/proizvodi">
                {tr('pregled_proizvoda')}
              </Link>
            </Button>
          </div>
        ) : (
          <OmiljeniList omiljeni={omiljeni} />
        )}
      </div>
    </div>
  );
}
