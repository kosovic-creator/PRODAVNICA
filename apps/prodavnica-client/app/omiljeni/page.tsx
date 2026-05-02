/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getOmiljeni } from '@/lib/actions/omiljeni';
import { Suspense } from 'react';
import { getKorpa } from '@/lib/actions/korpa';
import OmiljeniContent from './OmiljeniContent';
import { Metadata } from 'next';
import OmiljeniSkeleton from './components/OmiljeniSkeleton';

export const metadata: Metadata = {
  title: 'Omiljeni',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};
export default async function OmiljeniPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  let omiljeni: any[] = [];

  if (userId) {
    const result = await getOmiljeni(userId);
    if (result.success && result.data) {
      omiljeni = Array.isArray(result.data) ? result.data : result.data.omiljeni || [];
    }
  }

  return (
    <Suspense fallback={<OmiljeniSkeleton />}>
      <OmiljeniContent omiljeni={omiljeni} isLoggedIn={!!userId} />
    </Suspense>
  );
}


