import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { getPorudzbineKorisnika } from '@/lib/actions';
import { Metadata } from 'next';
import MojePorudzbineContent from './MojePorudzbineContent';

export const metadata: Metadata = {
  title: 'Narudžbe',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

interface SearchParams {
  page?: string;
  pageSize?: string;
}

type Props = {
  searchParams?: SearchParams;
};

export default async function MojePorudzbinePage({ searchParams }: Props) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/prijava');
  }

  const result = await getPorudzbineKorisnika(session.user.id, page, pageSize);

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Greška pri učitavanju porudžbina</div>
          <p className="text-gray-600">{result.error}</p>
        </div>
      </div>
    );
  }

  const porudzbine = result.data?.porudzbine || [];
  const total = result.data?.total || 0;

  return (
    <MojePorudzbineContent
      porudzbine={porudzbine}
      total={total}
      page={page}
      pageSize={pageSize}
      userId={session.user.id}
    />
  );
}