// Zod šeme za admin aplikaciju (bez i18n)
import { z } from 'zod';

export const varijanteSchema = z.object({
  boja: z.string().optional().or(z.literal('')),
  velicina: z.string().min(1, { message: 'Veličina je obavezna' }),
  kolicina: z.number().int().positive({ message: 'Količina mora biti pozitivna' }),
  prodavnica_br: z.number().int().min(1, { message: 'Prodavnica je obavezna' }).max(3, { message: 'Prodavnica mora biti između 1 i 3' }),
});

export const noviProizvodSchemaStatic = z.object({
    cena: z.number().positive({ message: 'Cena mora biti pozitivna' }),
  varijante: z.array(varijanteSchema).min(1, { message: 'Najmanje jedna varijanta je obavezna' }),
    slike: z.array(z.string().url({ message: 'Slika mora biti validna URL adresa' })).min(1, { message: 'Slika je obavezna i mora biti validna URL adresa' }),
    naziv_sr: z.string().min(1, { message: 'Naziv na srpskom je obavezan' }),
    kategorija_sr: z.string().min(1, { message: 'Kategorija na srpskom je obavezna' }),
    opis_sr: z.string().optional(),
    karakteristike_sr: z.string().optional(),
    naziv_en: z.string().min(1, { message: 'Naziv na engleskom je obavezan' }),
    kategorija_en: z.string().min(1, { message: 'Kategorija na engleskom je obavezna' }),
    opis_en: z.string().optional(),
  karakteristike_en: z.string().optional(),
  pol: z.enum(['', 'MUŠKI', 'ŽENSKI']).optional(),
  pol_en: z.enum(['', 'MALE', 'FEMALE']).optional(),
  uzrast: z.enum(['', 'ODRASLI', 'DJECA']).optional(),
  uzrast_en: z.enum(['', 'ADULTS', 'CHILDREN']).optional(),
  brend: z.string().optional(),
  boja: z.array(z.string()).optional(),
  materijal: z.string().optional(),
  materijal_en: z.string().optional(),
});

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


export const korisnikSchemaAdmin = z.object({
    ime: z.string().min(2, { message: 'Ime mora imati najmanje 2 karaktera' }),
    prezime: z.string().min(2, { message: 'Prezime mora imati najmanje 2 karaktera' }),
    email: z.string().email({ message: 'Nevalidan email' }),
    uloga: z.enum(['korisnik', 'admin'], { message: 'Uloga mora biti korisnik ili admin' }),
    lozinka: z.string().min(6, { message: 'Lozinka mora imati najmanje 6 karaktera' }),

});
