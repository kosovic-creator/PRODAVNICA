
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { getPodaciPreuzimanja } from '@/lib/actions/podaci-preuzimanja';
import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Metadata } from 'next';
import PodaciPreuzimanjaContent from './PodaciPreuzimanjaContent';

export const metadata: Metadata = {
  title: 'Podaci za preuzimanje',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function PodaciPreuzimanjaPage() {
  const lang = await getLanguageFromCookies();
  const t = getLocaleMessages(lang, 'podaci-preuzimanja');
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/prijava');
  }
  const userId = session.user.id;
  const result = await getPodaciPreuzimanja(userId);
  const podaci = result.success && result.data ? result.data : null;

  return (
    <PodaciPreuzimanjaContent
      t={t}
      podaci={podaci}
      userId={userId}
      lang={lang}
    />
  );
}
