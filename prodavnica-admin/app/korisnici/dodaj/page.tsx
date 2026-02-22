import ClientKorisnici from './ClientNotifications';
import { createKorisnik } from '@/lib/actions/korisnici';

async function handleSubmit(formData: FormData) {
  'use server';

  const data = {
    email: formData.get('email') as string,
    lozinka: formData.get('lozinka') as string,
    ime: formData.get('ime') as string,
    prezime: formData.get('prezime') as string,
    uloga: formData.get('uloga') as string,
    adresa: formData.get('adresa') as string,
    drzava: formData.get('drzava') as string,
    grad: formData.get('grad') as string,
    telefon: formData.get('telefon') as string,
    postanskiBroj: parseInt(formData.get('postanskiBroj') as string) || 0
  };

  return await createKorisnik(data);
}

export default function DodajKorisnikaPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Dodaj novog korisnika</h2>
        <p className="text-gray-600 mt-1">Unesite podatke za novi korisnički nalog</p>
      </div>

      <ClientKorisnici serverAction={handleSubmit} />
    </div>
  );
}