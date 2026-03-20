"use client";
import React from "react";
import { deleteProizvod } from "@/lib/actions/proizvodi";
import Link from "next/link";
import SuccessMessage from "@/app/components/SuccessMessage";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { Button } from "@prodavnica/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@prodavnica/ui";

type Proizvod = {
  id: string;
  naziv_sr: string;
  naziv_en: string;
  cena: number;
  popust?: number;
  pol?: string | null;
  pol_en?: string | null;
  uzrast?: string | null;
  uzrast_en?: string | null;
  brend?: string | null;
  boja?: string[] | null;
  materijal?: string | null;
  materijal_en?: string | null;
  varijante?: Array<{
    id: string;
    boja: string;
    velicina: string;
    kolicina: number;
    prodavnica_br: number;
  }>;
  // Add other fields as needed
};

const PRODAVNICE_LABELS: Record<number, string> = {
  1: 'Delta',
  2: 'Centar',
  3: 'Outlet'
};

interface Props {
  proizvodi: Proizvod[];
  total: number;
  totalPages: number;
  page: number;
}

const ClientProizvodiTable: React.FC<Props> = ({ proizvodi, total, totalPages, page }) => {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Calculate total value
  const totalValue = proizvodi.reduce((sum, proizvod) => sum + proizvod.cena, 0);
  const totalQuantity = proizvodi.length;

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  async function confirmDelete() {
    if (!selectedId) return;
    setIsModalOpen(false);
    setLoadingId(selectedId);
    const res = await deleteProizvod(selectedId);
    setLoadingId(null);
    setSelectedId(null);
    if (res?.success) {
      setSuccess(res.message || "Proizvod je uspešno obrisan");
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } else {
      setError(res?.error || "Greška pri brisanju proizvoda");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }

  return (
    <div className="w-full p-6 text-gray-900 dark:text-gray-900">
      {success && <SuccessMessage message={success} />}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-4">{error}</div>
      )}
      {/* Header section with stats */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900">Upravljanje proizvodima</h1>
        <p className="text-gray-600 dark:text-gray-700 mt-2">Dodaj, izmijeni ili ukloni proizvode iz prodavnice</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-4">
            <div>
              <p className="text-sm text-gray-600">Broj Artikala</p>
              <p className="text-2xl font-semibold text-gray-900">{totalQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ukupna vrijednost</p>
              <p className="text-2xl font-semibold text-green-600">{totalValue.toLocaleString()} €</p>
            </div>
          </div>
          <Link
            href="/proizvodi/dodaj"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            + Dodaj proizvod
          </Link>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <Table className="min-w-full text-gray-900 dark:text-gray-900">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv </TableHead>
              {/* <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv (EN)</TableHead> */}
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Popust</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Varijante</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pol </TableHead>
              {/* <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pol (EN)</TableHead> */}
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Uzrast </TableHead>
              {/* <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Uzrast (EN)</TableHead> */}
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Brend</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Boje</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Materijal </TableHead>
              {/* <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Materijal (EN)</TableHead> */}
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proizvodi.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="px-6 py-4 text-center text-gray-400 dark:text-gray-500">Nema proizvoda.</TableCell>
              </TableRow>
            ) : (
              proizvodi.map((proizvod) => (
                <TableRow key={proizvod.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap font-medium">{proizvod.naziv_sr}</TableCell>
                  {/* <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.naziv_en}</TableCell> */}
                  <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.cena} €</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.popust ? `${proizvod.popust} %` : '-'}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm max-w-xs">
                      {proizvod.varijante && proizvod.varijante.length > 0 ? (
                        <div className="space-y-1">
                          {proizvod.varijante.map((v, idx) => (
                            <div key={idx} className="text-gray-700">
                              {v.boja} / {v.velicina} ({v.kolicina}) - {PRODAVNICE_LABELS[v.prodavnica_br] || `Prodavnica ${v.prodavnica_br}`}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.pol || '-'}</TableCell>
                  {/* <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.pol_en || '-'}</TableCell> */}
                  <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.uzrast || '-'}</TableCell>
                  {/* <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.uzrast_en || '-'}</TableCell> */}
                  <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.brend || '-'}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {proizvod.boja && proizvod.boja.length > 0 ? proizvod.boja.join(', ') : '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.materijal || '-'}</TableCell>
                  {/* <TableCell className="px-6 py-4 whitespace-nowrap">{proizvod.materijal_en || '-'}</TableCell> */}
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        asChild
                      // className="bg-gray-300 hover:bg-gray-600 hover:text-amber-50"
                        variant="secondary"
                      >
                        <Link href={`/proizvodi/izmeni/${proizvod.id}`}>
                          Izmeni
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => openDeleteModal(proizvod.id)}
                        disabled={loadingId === proizvod.id}
                        className={loadingId === proizvod.id ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        {loadingId === proizvod.id ? 'Brišem...' : 'Obriši'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Paginate and info */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-600 dark:text-gray-700">Ukupno proizvoda: {total} | Stranica {page} od {totalPages}</span>
        <div className="flex gap-2">
          <Link
            href={`/proizvodi?page=${page - 1}`}
            className={`px-3 py-1 rounded border ${page <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50'}`}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : 0}
          >
            Prethodna
          </Link>
          <Link
            href={`/proizvodi?page=${page + 1}`}
            className={`px-3 py-1 rounded border ${page >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50'}`}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : 0}
          >
            Sledeća
          </Link>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Potvrda brisanja"
        message="Da li ste sigurni da želite da obrišete ovaj proizvod? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        cancelText="Otkaži"
        isDestructive={true}
      />
    </div>
  );
};

export default ClientProizvodiTable;