/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getKorpa } from '@/lib/actions/korpa';
import Link from 'next/link';
import { Metadata } from 'next';
import KorpaContent from './KorpaContent';
import { getServerLanguage, getLocaleMessages } from '@/i18n/i18n.server';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function KorpaPage() {
  const lang = await getServerLanguage();
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
    const mustLoginText = t.must_login || t.morate_biti_prijavljeni || 'Morate biti prijavljeni da vidite korpu.';
    const loginButtonText = t.prijava || 'Prijava';

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          {mustLoginText}
        </h2>
        <Link
          href="/prijava"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loginButtonText}
        </Link>
      </div>
    );
  }

  return (
    <KorpaContent stavke={stavke} userId={userId} />
  );
}