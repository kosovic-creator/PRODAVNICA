'use server';

import { getServerSession } from 'next-auth';
import { updatePodaciPreuzimanja, createPodaciPreuzimanja, updateKorisnik } from '@/lib/actions';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


export async function handleEditProfilAction(
  formData: FormData
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/prijava');
  }

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


  const userId = session.user.id;
  const korisnikResult = await updateKorisnik({
    id: userId,
    email: form.email,
    lozinka: formData.get('lozinka') as string || '', // Pass the password from the form or an empty string if not provided
  });

  if (!korisnikResult.success) {
    const params = new URLSearchParams();
    params.append('err_global', korisnikResult.error || 'Greška pri izmjeni korisnika');
    Object.entries(form).forEach(([k, v]) => params.append(`val_${k}`, v ?? ''));
    redirect(`/profil/edit`);
  }

  let podaciResult;
  if (form.podaciId) {
    podaciResult = await updatePodaciPreuzimanja(userId, {
      ime: form.ime,
      prezime: form.prezime,
      adresa: form.adresa,
      drzava: form.drzava,
      grad: form.grad,
      postanskiBroj: Number(form.postanskiBroj),
      telefon: form.telefon,
    });
  } else {
    podaciResult = await createPodaciPreuzimanja(userId, {
      ime: form.ime,
      prezime: form.prezime,
      adresa: form.adresa,
      drzava: form.drzava,
      grad: form.grad,
      postanskiBroj: Number(form.postanskiBroj),
      telefon: form.telefon,
    });
  }

  if (!podaciResult.success) {
    const params = new URLSearchParams();
    params.append('err_global', podaciResult.error || 'Greška pri čuvanju podataka za preuzimanje');
    Object.entries(form).forEach(([k, v]) => params.append(`val_${k}`, v ?? ''));
    redirect(`/profil/edit`);
  }

  revalidatePath('/profil');
  const params = new URLSearchParams();
  params.append('success', 'true');
  redirect(`/profil/edit?${params.toString()}`);
}
