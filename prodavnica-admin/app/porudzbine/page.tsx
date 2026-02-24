import { getPorudzbine, deletePorudzbinu } from '@/lib/actions/porudzbine';
import PorudzbineSkeleton from './PorudzbineSkeleton';
import { redirect } from 'next/navigation';
import PorudzbineSuccess from './PorudzbineSuccess';
import { Button } from "@prodavnica/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@prodavnica/ui";
import { StatusSelect } from '../components/StatusSelect';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Porudžbine",
};

// Server action za brisanje porudžbine
export async function handleDeleteAction(formData: FormData) {
  'use server';
  const id = formData.get('id');
  if (typeof id === 'string' && id) {
    await deletePorudzbinu(id);
    // SSR redirect with success message
    return redirect('/porudzbine?success=' + encodeURIComponent('Porudžbina je uspješno obrisana'));
  }
}

const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatCurrency = (amount: string | number | bigint) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(typeof amount === 'string' ? Number(amount) : amount);


export default async function PorudzbinePage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const result = await getPorudzbine();
  if (!result.success || !result.data) {
    return <PorudzbineSkeleton />;
  }
  const porudzbine = result.success && result.data ? result.data.porudzbine : [];
  const totalRevenue = porudzbine.reduce(
    (sum, porudzbina) => sum + porudzbina.ukupno,
    0
  );
  const params = await searchParams;
  const successMsg = params?.success;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success message */}
        <PorudzbineSuccess message={successMsg} />
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upravljanje porudžbinama</h1>
              <p className="text-gray-600 mt-1">Pregled i upravljanje svim porudžbinama</p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Ukupno: {porudzbine.length}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Prihod: {formatCurrency(totalRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Ukupno porudžbina */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ukupno porudžbina</p>
                <p className="text-2xl font-semibold text-gray-900">{porudzbine.length}</p>
              </div>
            </div>
          </div>
          {/* Ukupan prihod */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ukupan prihod</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>
          {/* Prosečna vrednost */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Prosečna vrednost</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {porudzbine.length > 0 ? formatCurrency(totalRevenue / porudzbine.length) : formatCurrency(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID Porudžbine</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kupac</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ukupna vrednost</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Datum kreiranja</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {porudzbine.map((porudzbina) => {
                const kupacIme = porudzbina.korisnik?.ime || porudzbina.korisnik?.podaciPreuzimanja?.ime || 'N/A';
                const kupacPrezime = porudzbina.korisnik?.podaciPreuzimanja?.prezime || '';

                return (
                  <TableRow key={porudzbina.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-mono text-gray-900">#{porudzbina.id.slice(0, 8)}...</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-linear-to-r from-blue-400 to-purple-600 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{kupacIme ? kupacIme.charAt(0).toUpperCase() : 'N'}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{kupacIme} {kupacPrezime}</div>
                        <div className="text-sm text-gray-500">{porudzbina.korisnik?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(porudzbina.ukupno)}</div>
                  </TableCell>
                 <TableCell>
                    <StatusSelect
                      porudzbinaId={porudzbina.id}
                      trenutniStatus={porudzbina.status}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500">{formatDate(porudzbina.kreiran)}</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    <form action={handleDeleteAction}>
                      <input type="hidden" name="id" value={porudzbina.id} />
                      <Button type="submit" variant="destructive" >
                        Obriši
                      </Button>
                    </form>
                  </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {porudzbine.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Nema porudžbina</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}