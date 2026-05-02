"use server";
import { regKorisnikSchema } from '@/lib/validators';
import prisma from '@/lib/prisma';
import { createKorisnik } from '@/lib/actions/korisnici';
import { getLanguageFromCookies, getLocaleMessages } from '@/i18n/i18n';

export async function handleRegistracijaAction(formData: FormData) {
  const lang = await getLanguageFromCookies();
  const tAuth = getLocaleMessages(lang, 'auth');
  const t = (key: string) => tAuth.register?.[key] || key;

  const email = formData.get('email') as string;
  const lozinka = formData.get('lozinka') as string;
  const potvrdaLozinke = formData.get('potvrdaLozinke') as string;
  const uloga = formData.get('uloga') as string;

  const values = { email, lozinka, potvrdaLozinke, uloga };
  const errors: Record<string, string> = {};

  // Zod validacija
  const schema = regKorisnikSchema(t).pick({ email: true, lozinka: true });
  const result = schema.safeParse(values);
  if (!result.success) {
    for (const err of result.error.issues) {
      if (err.path[0]) errors[String(err.path[0])] = err.message;
    }
    return { success: false, errors };
  }

  if (lozinka !== potvrdaLozinke) {
    errors.potvrdaLozinke = t('passwords_do_not_match') || 'Lozinke se ne poklapaju';
    return { success: false, errors };
  }

  // Provera da li email već postoji
  const existing = await prisma.korisnik.findUnique({ where: { email } });
  if (existing) {
    errors.email = t('email_exists') || 'Email je već registrovan.';
    return { success: false, errors };
  }

  // Kreiraj korisnika
  const createResult = await createKorisnik({ email, lozinka });
  if (!createResult.success) {
    errors.global = createResult.error || 'Greška pri kreiranju korisnika';
    return { success: false, errors };
  }

  return { success: true, errors: {} };
}
