import { getServerSession } from 'next-auth';
import { getKorisnikById } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import ClientLayout from '../components/ClientLayout';
import { FaEdit } from 'react-icons/fa';
import { deleteKorisnik } from '@/lib/actions/korisnici';
import { revalidatePath } from 'next/cache';
import DeleteProfilButton from './components/DeleteProfilButton';
import ProfilSkeleton from './components/ProfilSkeleton';
import { getLanguageFromCookies, getLocaleMessages } from '@/i18n/i18n';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

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
  const langFromCookies = await getLanguageFromCookies();
  const lang = langFromCookies || 'sr';

  const t = getLocaleMessages(lang, 'profil');

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
      params.append('err', result.error || t.error_izmjena_korisnika || 'Greška pri brisanju korisnika');
      redirect(`/profil?${params.toString()}`);
    }
    revalidatePath('/');
    redirect('/odjava');
  }

  const result = await getKorisnikById(session.user.id);
  if (!result.success || !result.data) {
    return (
      <ClientLayout>
        <div className="min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">{t.error_fetch_korisnik || 'Greška pri učitavanju profila'}</div>
            <p className="text-gray-600">{result.error}</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const korisnik = {
    ...result.data,
    telefon: result.data.podaciPreuzimanja?.telefon ?? '',
    grad: result.data.podaciPreuzimanja?.grad ?? '',
    postanskiBroj: Number(result.data.podaciPreuzimanja?.postanskiBroj) || 0,
    adresa: result.data.podaciPreuzimanja?.adresa ?? '',
  };

  const isPending = false; // ili true za test

  if (isPending) {
    return (
      <ClientLayout>
        <ProfilSkeleton />
      </ClientLayout>
    );
  }
  return (
    <ClientLayout>
      <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-center justify-center">
          <span className="inline-block text-gray-700"><svg width="24" height="24" fill="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" /></svg></span>
          {t.title || 'Profil'}
        </h1>
        {params.err && (
          <div className="mb-4 text-red-600 text-center font-medium">{params.err}</div>
        )}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.email || 'Email'}</span>
                  <p className="text-base text-gray-800">{korisnik.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.name || 'Ime'}</span>
                    <p className="text-base text-gray-800">{korisnik.podaciPreuzimanja?.ime || ''}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.surname || 'Prezime'}</span>
                    <p className="text-base text-gray-800">{korisnik.podaciPreuzimanja?.prezime || ''}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.phone || 'Telefon'}</span>
                  <p className="text-base text-gray-800">{korisnik.telefon}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.role || 'Uloga'}</span>
                  <p className="text-base text-gray-800">{korisnik.uloga}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.address || 'Adresa'}</span>
                  <p className="text-base text-gray-800">{korisnik.adresa}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.city || 'Grad'}</span>
                  <p className="text-base text-gray-800">{korisnik.grad}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.country || 'Država'}</span>
                    <p className="text-base text-gray-800">{korisnik.podaciPreuzimanja?.drzava || ''}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{t.postal_code || 'Poštanski broj'}</span>
                  <p className="text-base text-gray-800">{korisnik.postanskiBroj}</p>
                </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
                <a
                  href="/profil/edit"
                  className="flex-1"
                >
                  <Button
                    variant="default"
                    className="w-full px-4 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-base font-medium
                    "
                  >
                    <FaEdit />
                    {t['edit_profile'] || 'Izmeni profil'}
                  </Button>
                </a>
                <div className="flex-1">
                  <DeleteProfilButton
                    handleDeleteKorisnik={handleDeleteKorisnik}
                    translations={t}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ClientLayout>
  );
}