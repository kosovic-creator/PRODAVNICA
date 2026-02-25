'use client';

import { FaEdit } from 'react-icons/fa';
import DeleteProfilButton from './components/DeleteProfilButton';
import ClientLayout from '../components/ClientLayout';
import { Button } from "@prodavnica/ui";
import { useI18n } from '@/app/components/I18nProvider';

interface ProfilContentProps {
  korisnik: any;
  errorParam?: string;
  handleDeleteKorisnik: () => Promise<void>;
}

export default function ProfilContent({
  korisnik,
  errorParam,
  handleDeleteKorisnik,
}: ProfilContentProps) {
  const { t } = useI18n();
  const tr = (key: string) => t('profil', key);

  return (
    <ClientLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-center justify-center">
            <span className="inline-block text-gray-700">
              <svg width="24" height="24" fill="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
              </svg>
            </span>
            {tr('title')}
          </h1>
          {errorParam && (
            <div className="mb-4 text-red-600 text-center font-medium">{errorParam}</div>
          )}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('email')}</span>
                    <p className="text-base text-gray-800">{korisnik.email}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('name')}</span>
                    <p className="text-base text-gray-800">{korisnik.podaciPreuzimanja?.ime || ''}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('surname')}</span>
                    <p className="text-base text-gray-800">{korisnik.podaciPreuzimanja?.prezime || ''}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('phone')}</span>
                    <p className="text-base text-gray-800">{korisnik.telefon}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('role')}</span>
                    <p className="text-base text-gray-800">{korisnik.uloga}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('address')}</span>
                    <p className="text-base text-gray-800">{korisnik.adresa}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('city')}</span>
                    <p className="text-base text-gray-800">{korisnik.grad}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('country')}</span>
                    <p className="text-base text-gray-800">{korisnik.podaciPreuzimanja?.drzava || ''}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">{tr('postal_code')}</span>
                    <p className="text-base text-gray-800">{korisnik.postanskiBroj}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
                <a href="/profil/edit" className="flex-1">
                  <Button
                    variant="default"
                    className="w-full px-4 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-base font-medium"
                  >
                    <FaEdit />
                    {tr('edit_profile')}
                  </Button>
                </a>
                <div className="flex-1">
                  <DeleteProfilButton handleDeleteKorisnik={handleDeleteKorisnik} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
