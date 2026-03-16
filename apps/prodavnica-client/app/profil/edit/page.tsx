import { getServerSession } from 'next-auth';
import { getKorisnikById } from '@/lib/actions';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import EditProfilForm from './EditProfilForm';
import SuccessMessage from '@/app/components/SuccessMessage';
import ClientLayout from '@/app/components/ClientLayout';
import { getLanguageFromCookies, getLocaleMessages } from '@/i18n/i18n';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izmena profila',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};




export default async function EditProfilPage() {
  const langFromCookies = await getLanguageFromCookies();
  const lang = langFromCookies || 'sr';
  const tProfil = getLocaleMessages(lang, 'profil');
  const tKorisnici = getLocaleMessages(lang, 'korisnici');
  const t = (key: string) => (tKorisnici as Record<string, string>)[key] ?? (tProfil as Record<string, string>)[key] ?? key;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/prijava');
  }

  const result = await getKorisnikById(session.user.id);
  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {tProfil.error_fetch_korisnik || 'Greška pri učitavanju profila'}
      </div>
    );
  }

  const korisnik = result.data;
  const initialForm = {
    ime: korisnik.podaciPreuzimanja?.ime || '',
    prezime: korisnik.podaciPreuzimanja?.prezime || '',
    email: korisnik.email || '',
    telefon: korisnik.podaciPreuzimanja?.telefon || '',
    drzava: korisnik.podaciPreuzimanja?.drzava || '',
    grad: korisnik.podaciPreuzimanja?.grad || '',
    postanskiBroj: korisnik.podaciPreuzimanja?.postanskiBroj ? korisnik.podaciPreuzimanja.postanskiBroj.toString() : '',
    adresa: korisnik.podaciPreuzimanja?.adresa || '',
    uloga: korisnik.uloga || 'korisnik',
    podaciId: korisnik.podaciPreuzimanja?.id || '',
  };

  const translations = { ...tProfil, ...tKorisnici };

  return (
    <ClientLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-center justify-center">
            <FaUser className="text-gray-700" />
            {t('title')}
          </h1>
          <EditProfilForm
            initialForm={initialForm}
            translations={translations}
          />
        </div>
      </div>
    </ClientLayout>
  );
}