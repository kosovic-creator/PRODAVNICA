"use server";
import { createKorisnik } from '@/lib/actions/korisnici';

export async function handleSubmit(formData: FormData) {
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
