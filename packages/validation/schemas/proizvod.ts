import { z } from 'zod';

export const varijanteSchema = z.object({
  boja: z.string().optional().or(z.literal('')),
  boja_en: z.string().optional().or(z.literal('')),
  velicina: z.string().min(1, { message: 'Veličina je obavezna' }),
  kolicina: z.number().int().positive({ message: 'Količina mora biti pozitivna' }),
  prodavnica_br: z.number().int().min(1, { message: 'Prodavnica je obavezna' }).max(3, { message: 'Prodavnica mora biti između 1 i 3' }),
});

export const noviProizvodSchemaStatic = z.object({
  cena: z.number().positive({ message: 'Cena mora biti pozitivna' }),
  varijante: z.array(varijanteSchema).min(1, { message: 'Najmanje jedna varijanta je obavezna' }).optional(),
  kolicina: z.number().min(0, { message: 'Količina ne može biti negativna' }).optional(),
  slike: z.array(z.string().url({ message: 'Slika mora biti validna URL adresa' })).min(1, { message: 'Slika je obavezna i mora biti validna URL adresa' }),
  naziv_sr: z.string().min(1, { message: 'Naziv na srpskom je obavezan' }),
  kategorija_sr: z.string().min(1, { message: 'Kategorija na srpskom je obavezna' }),
  opis_sr: z.string().optional(),
  karakteristike_sr: z.string().optional(),
  naziv_en: z.string().min(1, { message: 'Naziv na engleskom je obavezan' }),
  kategorija_en: z.string().min(1, { message: 'Kategorija na engleskom je obavezna' }),
  opis_en: z.string().optional(),
  karakteristike_en: z.string().optional(),
  pol: z.string().optional(),
  pol_en: z.string().optional(),
  uzrast: z.string().optional(),
  uzrast_en: z.string().optional(),
  materijal: z.string().optional(),
  materijal_en: z.string().optional(),
  brend: z.string().optional(),
  boja: z.array(z.string()).optional(),
  boja_en: z.array(z.string()).optional(),
  velicina: z.string().optional(),
});
