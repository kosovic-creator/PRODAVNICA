import { getProizvodi } from './../../lib/actions/proizvodi';
import ProizvodiSkeleton from './components/ProizvodiSkeleton';
import { Metadata } from 'next';
import ProizvodiContent from './ProizvodiContent';

export const metadata: Metadata = {
  title: 'Artikli',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function ProizvodiPage({ searchParams }: { searchParams: Promise<{ page?: string; pageSize?: string; search?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = parseInt(params.pageSize || '10');
  const search = params.search || '';

  const result = await getProizvodi(page, pageSize, search);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProizvodiSkeleton />
        </div>
      </div>
    );
  }

  const { proizvodi, total } = result.data;

  return (
    <ProizvodiContent
      proizvodi={proizvodi}
      total={total}
      page={page}
      pageSize={pageSize}
      search={search}
    />
  );
}