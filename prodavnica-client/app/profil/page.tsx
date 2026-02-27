import { getServerSession } from 'next-auth';
import { getKorisnikById } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { deleteKorisnik } from '@/lib/actions/korisnici';
import { revalidatePath } from 'next/cache';
import { Metadata } from 'next';
import ProfilContent from './ProfilContent';

export const metadata: Metadata = {
  title: 'Profil',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function ProfilPage({ searchParams }: { searchParams?: { err?: string } | Promise<{ err?: string }> }) {
  let params: { err?: string } = {};
  if (searchParams) {
    if (typeof (searchParams as Promise<{ err?: string }>).then === 'function') {
      params = await (searchParams as Promise<{ err?: string }>);
    } else {
      params = searchParams as { err?: string };
    }
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/prijava');
  }

  async function handleDeleteKorisnik() {
    'use server';
    if (!session?.user?.id) {
      redirect('/prijava');
    }
    const userId = session.user.id;
    const result = await deleteKorisnik(userId);
    if (!result.success) {
      const params = new URLSearchParams();
      params.append('err', result.error || 'Greška pri brisanju korisnika');
      redirect(`/profil?${params.toString()}`);
    }
    revalidatePath('/');
    redirect('/odjava');
  }

  const result = await getKorisnikById(session.user.id);
  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Greška pri učitavanju profila</div>
          <p className="text-gray-600">{result.error}</p>
        </div>
      </div>
    );
  }

  const korisnik = {
    ...result.data,
    telefon: result.data.podaciPreuzimanja?.telefon ?? '',
    grad: result.data.podaciPreuzimanja?.grad ?? '',
    postanskiBroj: Number(result.data.podaciPreuzimanja?.postanskiBroj) || 0,
    adresa: result.data.podaciPreuzimanja?.adresa ?? '',
  };

  return (
    <ProfilContent
      korisnik={korisnik}
      errorParam={params.err}
      handleDeleteKorisnik={handleDeleteKorisnik}
    />
  );
}