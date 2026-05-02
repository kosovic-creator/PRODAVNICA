"use server";
import { z } from "zod";
import { prijavaSchema } from "@/lib/validators";
import { getLanguageFromCookies, getLocaleMessages } from '@/i18n/i18n';

// Server action za validaciju forme
export async function loginAction(
  prevState: { error: string | null; success: boolean; email?: string; lozinka?: string },
  formData: FormData
) {
  const email = formData.get("email") as string;
  const lozinka = formData.get("lozinka") as string;


    // Detekcija jezika korisnika
    const lang = await getLanguageFromCookies();
    const authMessages = getLocaleMessages(lang, 'auth');
    // t funkcija za prevod ključeva iz auth.json
    const t = (key: string) => authMessages.login?.[key] || key;


  try {
    prijavaSchema(t).parse({ email, lozinka });
  } catch (error) {
    if (error instanceof z.ZodError) {
        return { error: error.issues[0]?.message || t('errorOccurred'), success: false };
    }
      return { error: t('errorOccurred'), success: false };
  }

  // Ako je validacija prošla, šaljemo podatke za klijentski signIn
  return { error: null, success: true, email, lozinka };
}
