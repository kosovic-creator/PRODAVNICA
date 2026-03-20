export type ProizvodVarijanta = {
  id: string;
  proizvodId: string;
  boja: string;
  boja_en: string;
  velicina: string;
  kolicina: number;
  prodavnica_br: number;
  kreiran: Date;
  azuriran: Date;
};

export type Proizvod = {
  id: string;
  // API polja
  naziv: string;
  opis: string;
  kategorija: string;
  karakteristike?: string;
  // Lokalizovana polja
  naziv_sr?: string;
  naziv_en?: string;
  opis_sr?: string;
  opis_en?: string;
  karakteristike_sr?: string;
  karakteristike_en?: string;
  kategorija_sr?: string;
  kategorija_en?: string;
  pol?: string;
  pol_en?: string;
  uzrast?: string;
  uzrast_en?: string;
  brend?: string;
  boja?: string[]; // Sada je niz boja
  boja_en?: string[];
  materijal?: string;
  materijal_en?: string;
  cena: number;
  slike?: string[];
  varijante?: ProizvodVarijanta[]; // Nove varijante sa veličinama i količinama
  popust?: number;
  kreiran: Date;
  azuriran: Date;
}

// Tip koji odgovara strukturi Server Actions
export type ProizvodServerAction = {
  id: string;
  cena: number;
  slika: string | null;
  kolicina: number;
  kreiran: Date;
  azuriran: Date;
  naziv_sr: string;
  naziv_en: string;
  opis_sr: string | null;
  opis_en: string | null;
  karakteristike_sr: string | null;
  karakteristike_en: string | null;
  kategorija_sr: string;
  kategorija_en: string;
  velicina: string | null;
  pol: string | null;
  pol_en: string | null;
  uzrast: string | null;
  uzrast_en: string | null;
  brend: string | null;
  boja: string | null;
  materijal: string | null;
  materijal_en: string | null;
}

// export type Proizvod = {
//   id: string;
//   // API polja
//   cena: number;
//   slika?: string | null;
//   kolicina: number;
//   naziv: string;
//   opis?: string | null;
//   kategorija: string;
//   karakteristike?: string | null;
//   // Lokalizovana polja
//   naziv_sr: string;
//   naziv_en: string;
//   opis_sr?: string;
//   opis_en?: string;
//   karakteristike_sr?: string;
//   karakteristike_en?: string;
//   kategorija_sr: string;
//   kategorija_en: string;
//   kreiran?: Date;
//   azuriran?: Date;
// };


export type Korisnik = {
  id: string;
  email: string;
  lozinka?: string | null;
  uloga: string;
  ime?: string | null;
  kreiran: Date;
  azuriran: Date;
  podaciPreuzimanja?: {
    id: string;
    korisnikId: string;
    ime: string;
    prezime: string;
    adresa: string;
    drzava: string;
    grad: string;
    postanskiBroj: number;
    telefon: string;
    kreiran: Date;
    azuriran: Date;
  } | null;
};

export type StavkaKorpe = {
  id: string;
  korisnikId: string;
  proizvodId: string;
  kolicina: number;
  boja?: string | null;
  velicina?: string | null;
  kreiran: Date;
  azuriran: Date;
  proizvod?: Proizvod;
};

export type Porudzbina = {
  id: string;
  korisnikId: string;
  ukupno: number;
  status: string;
  email?: string | null;
  kreiran: Date;
  azuriran: Date;
  idPlacanja?: string | null;
  stavkePorudzbine?: StavkaPorudzbine[];
  korisnik: {
    id: string;
    ime: string | null;
    email: string;
    podaciPreuzimanja?: {
      ime: string;
      prezime: string;
    } | null;
  };
};

export type StavkaPorudzbine = {
  id: string;
  porudzbinaId: string;
  proizvodId: string;
  kolicina: number;
  cena: number;
  boja?: string | null;
  velicina?: string | null;
  slika?: string | null;
  opis?: string | null;
  kreiran: Date;
  azuriran: Date;
  proizvod?: Proizvod;
};

export type Omiljeni = {
  id: string;
  korisnikId: string;
  proizvodId: string;
  kreiran: Date;
  proizvod: {
    id: string;
    cena: number;
    slika?: string | null;
    kolicina: number;
    kreiran: Date;
    azuriran: Date;
    prevodi: Array<{
      id: string;
      proizvodId: string;
      jezik: string;
      naziv: string;
      opis?: string | null;
      karakteristike?: string | null;
      kategorija: string;
    }>;
  };
};

export type ProizvodTranslation = {
  id: string;
  proizvodId: string;
  jezik: string;
  naziv: string;
  opis?: string | null;
  karakteristike?: string | null;
  kategorija: string;
};

export type TranslationData = {
  naziv: string;
  opis: string;
  karakteristike: string;
  kategorija: string;
};

