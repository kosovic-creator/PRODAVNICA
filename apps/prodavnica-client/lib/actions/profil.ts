/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';


import { getServerSession } from 'next-auth';
import { updatePodaciPreuzimanja, createPodaciPreuzimanja, updateKorisnik } from '@/lib/actions';
import { authOptions } from '@/lib/authOptions';
import { revalidatePath } from 'next/cache';
import { korisnikSchema } from '@/lib/validators';
import { getLocaleMessages } from '@/i18n/i18n';


export async function handleEditProfilAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, errors: { global: 'Niste prijavljeni.' }, values: {} };
  }

  // Detekcija jezika iz formData
  const lang = (formData.get('lang') as string) || 'sr';
  const korisniciMessages = getLocaleMessages(lang, 'korisnici');
  const profilMessages = getLocaleMessages(lang, 'profil');
  const translate = (key: string) => korisniciMessages[key] ?? profilMessages[key] ?? key;

  const form = {
    ime: formData.get('ime') as string,
    prezime: formData.get('prezime') as string,
    email: formData.get('email') as string,
    telefon: formData.get('telefon') as string,
    drzava: formData.get('drzava') as string,
    grad: formData.get('grad') as string,
    postanskiBroj: formData.get('postanskiBroj') as string,
    adresa: formData.get('adresa') as string,
    uloga: formData.get('uloga') as string,
    podaciId: formData.get('podaciId') as string,
  };

  // Zod validacija na serveru
  const validationSchema = korisnikSchema(translate).omit({ lozinka: true, slika: true, uloga: true });
  try {
    validationSchema.parse(form);
  } catch (error: any) {
    const errors: Record<string, string> = {};
    if (error.issues) {
      for (const issue of error.issues) {
        errors[issue.path[0]] = issue.message;
      }
    }
    return { success: false, errors, values: form };
  }

  const userId = session.user.id;
  const korisnikResult = await updateKorisnik({
    id: userId,
    email: form.email,
    lozinka: formData.get('lozinka') as string || '',
  });
  if (!korisnikResult.success) {
    return { success: false, errors: { global: korisnikResult.error || 'Greška pri izmjeni korisnika' }, values: form };
  }

  // Sanitize and validate postanskiBroj
  let postanskiBrojInt: number | null = null;
  if (form.postanskiBroj && /^\d+$/.test(form.postanskiBroj)) {
    postanskiBrojInt = parseInt(form.postanskiBroj, 10);
  }

  let podaciResult;
  const podaciData = {
    ime: form.ime,
    prezime: form.prezime,
    adresa: form.adresa,
    drzava: form.drzava,
    grad: form.grad,
    postanskiBroj: postanskiBrojInt ?? 0, // fallback to 0 if invalid
    telefon: form.telefon,
  };
  if (form.podaciId) {
    podaciResult = await updatePodaciPreuzimanja(userId, podaciData);
  } else {
    podaciResult = await createPodaciPreuzimanja(userId, podaciData);
  }
  if (!podaciResult.success) {
    return { success: false, errors: { global: podaciResult.error || 'Greška pri čuvanju podataka za preuzimanje' }, values: form };
  }

  revalidatePath('/profil');
  return { success: true, errors: {}, values: {} };
}
