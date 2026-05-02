import { z } from 'zod';

// Re-export basic validators from shared library with different names to avoid conflicts
export {
    noviProizvodSchemaStatic,
    korisnikSchemaStatic,
    registracijaSchema,
    prijavaSchema as prijavaSchemaStatic,
} from '@prodavnica/validators';

export type TranslateFn = (key: string) => string;

// i18n versions with translation support (client-specific)
export const korisnikSchema = (t: TranslateFn) => z.object({
    ime: z.string().min(4, { message: t('ime_error') }),
    prezime: z.string().min(2, { message: t('prezime_error') }),
    email: z.string().email({ message: t('email_error') }),
    telefon: z.string().min(5, { message: t('telefon_error') }).max(20).regex(/^\+?[0-9\s]*$/, { message: t('telefon_error') }).optional(),
    drzava: z.string().min(2, { message: t('drzava_error') }),
    grad: z.string().min(2, { message: t('grad_error') }).optional(),
    postanskiBroj: z.string().min(2, { message: t('postanskiBroj_error') }).optional(),
    adresa: z.string().min(2, { message: t('adresa_error') }).optional(),
    uloga: z.enum(['korisnik', 'admin'], { message: t('uloga_error') }),
    lozinka: z.string().min(6, { message: t('lozinka_error') }),
    slika: z.string().optional(),
});

export const regKorisnikSchema = (t: TranslateFn) => z.object({
    email: z.string().email({ message: t('email_error') }),
    lozinka: z.string().min(6, { message: t('lozinka_error') }),
});

// Named 'prijavaSchema' for i18n usage in client-specific components
export const prijavaSchema = (t: TranslateFn) => z.object({
    email: z.string().email({ message: t('invalid_email') }),
    lozinka: z.string().min(6, { message: t('passwordTooShort') }),
});

export const porudzbineSchema = (t: TranslateFn) => z.object({
    korisnikId: z.string().min(1, { message: t('required') }),
    ukupno: z.string().min(1, { message: t('required') }),
    status: z.string().min(1, { message: t('required') }),
    email: z.string().email({ message: t('invalid_email') }).optional().or(z.literal('')),
});

// Admin verzija bez i18n (re-export from shared)
export const adminPorudzbineSchema = z.object({
    korisnikId: z.string().min(1, { message: 'Korisnik je obavezan' }),
    ukupno: z.string().min(1, { message: 'Ukupan iznos je obavezan' }),
    status: z.string().min(1, { message: 'Status je obavezan' }),
    email: z.string().email({ message: 'Neispravna email adresa' }).optional().or(z.literal('')),
});





