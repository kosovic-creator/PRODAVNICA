import { getServerSession } from 'next-auth';
import { getKorisnikById } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { Metadata } from 'next';
import ProfilContent from './ProfilContent';

export const metadata: Metadata = {
  title: 'Profil',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/prijava');
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

  return <ProfilContent korisnik={korisnik} handleDeleteKorisnik={async () => { }} />;
}