import { getKorisnici, getKorisniciAdmin } from '@/lib/actions/korisnici';
import { Suspense } from 'react';
import SuccessMessage from '../components/SuccessMessage';
import KorisniciSkeleton from './KorisniciSkeleton';
import ClientKorisniciTable from './ClientKorisniciTable';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Korisnici",
};

export default async function AdminKorisniciPage({ searchParams }: { searchParams: Promise<{ success?: string; tab?: string }> }) {

  const page = 1;
  const pageSize = 10;

  const params = await searchParams;
  const successMsg = params?.success;
  const activeTab = params?.tab === 'admin' ? 'admin' : 'korisnici';

  const result = activeTab === 'admin'
    ? await getKorisniciAdmin(page, pageSize)
    : await getKorisnici(page, pageSize);

  if (!result.success || !result.data) {
    return <div className="text-center py-8 text-red-600">{result.error || 'Greška pri učitavanju korisnika'}</div>;
  }

  const { korisnici, total } = result.data;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      {successMsg && <SuccessMessage message={successMsg} type="success" />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Upravljanje korisnicima</h1>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <Link
            href="/korisnici?tab=korisnici"
            className={`pb-2 border-b-2 text-sm font-medium transition-colors ${activeTab === 'korisnici'
                ? 'border-blue-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Korisnici
          </Link>
          <Link
            href="/korisnici?tab=admin"
            className={`pb-2 border-b-2 text-sm font-medium transition-colors ${activeTab === 'admin'
                ? 'border-blue-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Admin korisnici
          </Link>
        </nav>
      </div>
      <Suspense fallback={<KorisniciSkeleton />}>
        <ClientKorisniciTable
          korisnici={korisnici}
          total={total}
          page={page}
          totalPages={totalPages}
          tab={activeTab}
        />
      </Suspense>
    </div>
  );
}