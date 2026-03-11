import { getServerSession } from 'next-auth';
import { getKorisnikById } from '@/lib/actions';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import EditProfilForm from './EditProfilForm';
import SuccessMessage from '@/app/components/SuccessMessage';
import ClientLayout from '@/app/components/ClientLayout';
import { getLanguageFromCookies, getLocaleMessages } from '@/i18n/i18n';
import { handleEditProfilAction } from '@/lib/actions/profil';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izmena profila',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};



export default async function EditProfilPage({ searchParams }: { searchParams?: { [key: string]: string } | Promise<{ [key: string]: string }> }) {
  let params: { [key: string]: string } = {};
  if (searchParams) {
    if (typeof (searchParams as Promise<unknown>).then === 'function') {
      params = await (searchParams as Promise<{ [key: string]: string }>);
    } else {
      params = searchParams as { [key: string]: string };
    }
  }
  const langFromCookies = await getLanguageFromCookies();
  const lang = langFromCookies || 'sr';
  const successParam = params?.success as string | undefined;
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

  const errorMap: Record<string, string> = {};
  const valueMap: Record<string, string> = {};
  if (typeof params === 'object' && params) {
    Object.entries(params).forEach(([k, v]) => {
      if (k.startsWith('err_')) errorMap[k.replace('err_', '')] = v as string;
      if (k.startsWith('val_')) valueMap[k.replace('val_', '')] = v as string;
    });
  }

  const translations = { ...tProfil, ...tKorisnici };

  return (
    <ClientLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-center justify-center">
            <FaUser className="text-gray-700" />
            {t('title')}
          </h1>
          {errorMap.global && (
            <div className="mb-4 text-red-600 text-center font-medium">{errorMap.global}</div>
          )}
          {successParam === 'true' && (
            <SuccessMessage
              message={t('profil_azuriran') || 'Profil uspješno ažuriran'}
              redirectTo="/profil"
              redirectDelay={3000}
            />
          )}
          <EditProfilForm
            handleEditProfil={handleEditProfilAction}
            initialForm={initialForm}
            errorMap={errorMap}
            valueMap={valueMap}
            translations={translations}


          />
        </div>
      </div>
    </ClientLayout>
  );
}