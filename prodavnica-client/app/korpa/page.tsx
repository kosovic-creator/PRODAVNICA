/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getKorpa } from '@/lib/actions/korpa';
import Link from 'next/link';
import StripeWrapper from '../components/StripeWrapper';
import { Metadata } from 'next';
import KorpaContent from './KorpaContent';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function KorpaPage() {
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
            Morate biti prijavljeni
          </h2>
          <Link
            href="/prijava"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Prijava
          </Link>
        </div>
      </StripeWrapper>
    );
  }

  return (
    <KorpaContent stavke={stavke} userId={userId} />
  );
}