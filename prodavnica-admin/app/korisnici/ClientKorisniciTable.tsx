'use client';
import React from 'react';
import { deleteKorisnik, deleteKorisnikAdmin } from '@/lib/actions/korisnici';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from "@prodavnica/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@prodavnica/ui";

interface Korisnik {
  id: string;
  ime?: string | null;
  email: string;
  uloga: string;
  kreiran: Date;
  podaciPreuzimanja?: {
    id: string;
    korisnikId: string;
    kreiran: Date;
    azuriran: Date;
    adresa: string;
    grad: string;
    drzava: string;
    telefon: string;
    postanskiBroj: number;
    ime: string;
    prezime: string;
  } | null;
}

interface Props {
  korisnici: Korisnik[];
  total: number;
  page: number;
  totalPages: number;
  tab?: 'admin' | 'korisnici';
}

const ClientKorisniciTable: React.FC<Props> = ({ korisnici, total, page, totalPages, tab = 'korisnici' }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  async function confirmDelete() {
    if (!selectedId) return;
    setIsModalOpen(false);
    setLoadingId(selectedId);

    try {
      if (tab === 'admin') {
        await deleteKorisnikAdmin(selectedId);
      } else {
        await deleteKorisnik(selectedId);
      }
      const successMessage = tab === 'admin'
        ? 'Admin korisnik je uspješno obrisan'
        : 'Korisnik je uspješno obrisan';
      window.location.href = `/korisnici?tab=${tab}&success=${encodeURIComponent(successMessage)}`;
    } catch (error) {
      console.error('Error deleting korisnik:', error);
      alert('Greška pri brisanju korisnika');
    } finally {
      setLoadingId(null);
      setSelectedId(null);
    }
  }

  return (
    <>
      {/* Korisnici tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ime i Prezime
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uloga
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresa
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefon
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum registracije
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {korisnici.map((korisnik: Korisnik) => (
              <TableRow key={korisnik.id} className="hover:bg-gray-50">
                <TableCell className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {korisnik.ime || korisnik.podaciPreuzimanja?.ime || 'N/A'} {korisnik.podaciPreuzimanja?.prezime || ''}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-sm text-gray-900">{korisnik.email}</div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${korisnik.uloga === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                    }`}>
                    {korisnik.uloga}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900">
                  {korisnik.podaciPreuzimanja ? (
                    <div>
                      <div>{korisnik.podaciPreuzimanja.adresa}</div>
                      <div className="text-xs text-gray-500">
                        {korisnik.podaciPreuzimanja.grad}, {korisnik.podaciPreuzimanja.drzava}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Nema podataka</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900">
                  {korisnik.podaciPreuzimanja?.telefon || '-'}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500">
                  {new Date(korisnik.kreiran).toLocaleDateString('sr-RS')}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium">
                  <Button
                    onClick={() => openDeleteModal(korisnik.id)}
                    disabled={loadingId === korisnik.id}

                    variant="destructive"
                  >
                    {loadingId === korisnik.id ? 'Brišem...' : 'Obriši'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginacija info */}
      <div className="mt-4 text-sm text-gray-600">
        Ukupno korisnika: {total} | Stranica {page} od {totalPages}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Potvrda brisanja"
        message="Da li ste sigurni da želite da obrišete ovog korisnika? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        cancelText="Otkaži"
        isDestructive={true}
      />
    </>
  );
};

export default ClientKorisniciTable;
