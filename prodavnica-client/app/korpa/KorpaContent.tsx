'use client';

import Link from 'next/link';
import KorpaItem from './components/KorpaItem';
import KorpaActions from './components/KorpaActions';
import StripeWrapper from '../components/StripeWrapper';
import { Button } from "@prodavnica/ui";
import { useI18n } from '@/app/components/I18nProvider';

interface KorpaContentProps {
  stavke: any[];
  userId: string;
}

export default function KorpaContent({ stavke, userId }: KorpaContentProps) {
  const { t } = useI18n();
  const tr = (key: string) => t('korpa', key);

  if (stavke.length === 0) {
    return (
      <StripeWrapper>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <h2 className="text-xl font-semibold text-shadow-gray-300 mb-2">
            {tr('prazna_korpa')}
          </h2>
          <p className="text-gray-500 mb-4">
            {tr('nema_proizvoda')}
          </p>
          <Button variant='default' asChild>
            <Link href="/proizvodi">
              {tr('nastavi_kupovinu')}
            </Link>
          </Button>
        </div>
      </StripeWrapper>
    );
  }

  return (
    <StripeWrapper>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl text-amber-50 md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center">
          {tr('naslov')}
        </h1>
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
      </div>
    </StripeWrapper>
  );
}
