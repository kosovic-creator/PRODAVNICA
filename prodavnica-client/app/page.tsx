/* eslint-disable @typescript-eslint/no-explicit-any */

import BannerPage from './@banner/page';
import GridPage from './@grid/page';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getKorpa } from '@/lib/actions/korpa';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Naslovna',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  let brojUKorpi = 0;
  if (session?.user?.id) {
    const korpa = await getKorpa(session.user.id);
    if (korpa.success && korpa.data?.stavke) {
      brojUKorpi = korpa.data.stavke.reduce((sum, s) => sum + (s.kolicina || 1), 0);
    }
  }
  return (
    <main className="flex flex-col gap-8">
      {/* Banner gore */}
      <BannerPage />
      {/* Grid proizvoda dolje */}
      <GridPage />
    </main>
  );
}

