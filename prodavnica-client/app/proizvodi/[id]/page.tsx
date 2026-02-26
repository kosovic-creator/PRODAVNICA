import { notFound } from 'next/navigation';
import { getProizvodById } from './../../../lib/actions/proizvodi';
import type { Proizvodi } from '../../../types';
import ClientLayout from '@/app/components/ClientLayout';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ProizvodDetailSkeleton from '../components/ProizvodDetailSkeleton';
import ProizvodDetailClient from '../components/ProizvodDetailClient';
import { getLanguageFromCookies } from '@/i18n/i18n';

export const metadata: Metadata = {
  title: 'Proizvod',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function ProizvodPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getProizvodById(resolvedParams.id);
  if (!result.success || !result.data) notFound();

  const initialLang = await getLanguageFromCookies();

  const proizvod: Proizvodi = {
    ...result.data,
    opis_sr: result.data.opis_sr ?? undefined,
    opis_en: result.data.opis_en ?? undefined,
    karakteristike_sr: result.data.karakteristike_sr ?? undefined,
    karakteristike_en: result.data.karakteristike_en ?? undefined,
    pol: result.data.pol ?? undefined,
    pol_en: result.data.pol_en ?? undefined,
    uzrast: result.data.uzrast ?? undefined,
    uzrast_en: result.data.uzrast_en ?? undefined,
    materijal: result.data.materijal ?? undefined,
    materijal_en: result.data.materijal_en ?? undefined,
    brend: result.data.brend ?? undefined,
    boja: Array.isArray(result.data.boja) ? result.data.boja : [],
    varijante: result.data.varijante ?? [],
    avgRating: typeof result.data.avgRating === 'number'
      ? result.data.avgRating
      : (typeof result.data.avgRating === 'string' && !isNaN(Number(result.data.avgRating)))
        ? Number(result.data.avgRating)
        : null,
    ratingCount: result.data.ratingCount ?? 0,
  };

  return (
    <ClientLayout>
      <Suspense fallback={<ProizvodDetailSkeleton />}>
        <ProizvodDetailClient proizvod={proizvod} initialLang={initialLang} />
      </Suspense>
    </ClientLayout>
  );
}




