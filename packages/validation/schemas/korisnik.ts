import { z } from 'zod';

export const korisnikSchemaStatic = z.object({
  ime: z.string().min(2, { message: 'Ime mora imati najmanje 2 karaktera' }),
  prezime: z.string().min(2, { message: 'Prezime mora imati najmanje 2 karaktera' }),
  email: z.string().email({ message: 'Nevalidan email' }),
  telefon: z.string().min(5, { message: 'Telefon mora imati najmanje 5 cifara' }).max(15, { message: 'Telefon može imati najviše 15 cifara' }).regex(/^\+?[0-9\s]*$/, { message: 'Nevalidan format telefona' }).optional().or(z.literal('')),
  drzava: z.string().min(2, { message: 'Država je obavezna' }),
  grad: z.string().min(2, { message: 'Grad mora imati najmanje 2 karaktera' }).optional(),
  postanskiBroj: z.string().min(2, { message: 'Poštanski broj mora imati najmanje 2 karaktera' }).optional(),
  adresa: z.string().min(2, { message: 'Adresa mora imati najmanje 2 karaktera' }).optional(),
  uloga: z.enum(['korisnik', 'admin'], { message: 'Uloga mora biti korisnik ili admin' }),
  lozinka: z.string().min(6, { message: 'Lozinka mora imati najmanje 6 karaktera' }),
  slika: z.string().url({ message: 'Slika mora biti validna URL adresa' }).optional(),
});

export const korisnikSchemaAdmin = z.object({
  ime: z.string().min(2, { message: 'Ime mora imati najmanje 2 karaktera' }),
  prezime: z.string().min(2, { message: 'Prezime mora imati najmanje 2 karaktera' }),
  email: z.string().email({ message: 'Nevalidan email' }),
  uloga: z.enum(['korisnik', 'admin'], { message: 'Uloga mora biti korisnik ili admin' }),
  lozinka: z.string().min(6, { message: 'Lozinka mora imati najmanje 6 karaktera' }),
});

export const registracijaSchema = z.object({
  email: z.string().email({ message: 'Neispravan email.' }),
  lozinka: z.string().min(6, { message: 'Lozinka mora imati najmanje 6 karaktera.' }),
  ime: z.string().min(2, { message: 'Ime mora imati najmanje 2 karaktera.' }),
  prezime: z.string().min(2, { message: 'Prezime mora imati najmanje 2 karaktera.' }),
  uloga: z.string().optional(),
});

export const prijavaSchema = z.object({
  email: z.string().email({ message: 'Neispravan email.' }),
  lozinka: z.string().min(6, { message: 'Lozinka mora imati najmanje 6 karaktera.' }),
});
