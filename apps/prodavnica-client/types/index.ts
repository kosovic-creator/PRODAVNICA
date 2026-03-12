import { korisnikSchema, prijavaSchema, regKorisnikSchema } from '@/lib/validators';
import { z } from 'zod';

// Ako koristiš funkciju (i18n), moraš proslijediti t, npr. za srpski:
export type Korisnik = z.infer<typeof korisnikSchema>;
export type UpdateKorisnikData = z.infer<ReturnType<typeof regKorisnikSchema>> & { id: string };

export type varijante = {
  id: string;
  boja: string;
  boja_en: string;
  velicina: string;
  kolicina: number;
  prodavnica_br?: number;
  kreiran: Date;
  azuriran: Date;
};

export type Proizvodi = {
  id: string;
  naziv_sr: string;
  naziv_en: string;
  opis_sr?: string | null;
  opis_en?: string | null;
  karakteristike_sr?: string | null;
  karakteristike_en?: string | null;
  kategorija_sr: string;
  kategorija_en: string;
  pol?: string | null;
  pol_en?: string | null;
  uzrast?: string | null;
  uzrast_en?: string | null;
  materijal?: string | null;
  materijal_en?: string | null;
  brend?: string | null;
  boja?: string[];
  boja_en?: string[];
  cena: number;
  slike: string[];
  varijante?: varijante[];
  kreiran: Date;
  azuriran: Date;
  rating?: string;
  numReviews?: number;
  avgRating?: number | null;
  ratingCount?: number;
};
// Klasični tip za proizvod, koristi se u celoj aplikaciji osim za validaciju korisnika

export interface stavkePorudzbine {
  id: string;
  kolicina: number;
  cena: number;
  rating?: number | null;
  slika?: string | null;
  boja?: string | null;
  velicina?: string | null;
  proizvod?: {
    naziv_sr: string;
    naziv_en: string;
  };
}

export interface Porudzbina {
  id: string;
  kreiran: Date;
  ukupno: number;
  status: string;
  stavkePorudzbine?: stavkePorudzbine[];
}


// Tip za podatke prijave
export type PrijavaData = z.infer<ReturnType<typeof prijavaSchema>>;




