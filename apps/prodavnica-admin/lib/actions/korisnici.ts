/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export type KorisnikData = {
  email: string;
  lozinka?: string;
  ime?: string;
  prezime?: string;
  uloga?: string;
  adresa: string;
  drzava: string;
  grad: string;
  telefon: string;
  postanskiBroj: number;
};

export type UpdateKorisnikData = KorisnikData & {
  id: string;
  podaciPreuzimanjaId?: string;
};

export type RegistracijaData = {
  email: string;
  lozinka: string;
  ime: string;
  prezime: string;
  uloga?: string;
};

export async function getKorisniciAdmin(page: number = 1, pageSize: number = 10) {
  try {
    const skip = (page - 1) * pageSize;
    const [korisnici, total] = await Promise.all([
      prisma.korisnikAdmin.findMany({
        skip,
        take: pageSize,
        orderBy: { kreiran: 'desc' }
      }),
      prisma.korisnikAdmin.count()
    ]);

    return {
      success: true,
      data: {
        korisnici: korisnici.map(korisnik => ({
          ...korisnik,
          podaciPreuzimanja: null
        })),
        total
      }
    };
  } catch (error) {
    console.error('Error fetching korisnici:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju korisnika'
    };
  }
}

export async function getKorisnici(page: number = 1, pageSize: number = 10) {
  try {
    const skip = (page - 1) * pageSize;
    const [korisnici, total] = await Promise.all([
      prisma.korisnik.findMany({
        skip,
        take: pageSize,
        orderBy: { kreiran: 'desc' },
        include: {
          podaciPreuzimanja: true
        }
      }),
      prisma.korisnik.count()
    ]);

    return {
      success: true,
      data: { korisnici, total }
    };
  } catch (error) {
    console.error('Error fetching korisnici:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju korisnika'
    };
  }
}

export async function getKorisnikById(id: string) {
  try {
    const korisnik = await prisma.korisnik.findUnique({
      where: { id },
      include: { podaciPreuzimanja: true }
    });

    if (!korisnik) {
      return {
        success: false,
        error: 'Korisnik nije pronađen'
      };
    }

    return {
      success: true,
      data: korisnik
    };
  } catch (error) {
    console.error('Error fetching korisnik:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju korisnika'
    };
  }
}

export async function createKorisnik(data: Partial<KorisnikData>) {
  try {
    const { email, lozinka, ime, prezime, uloga = 'korisnik', adresa, drzava, grad, telefon, postanskiBroj } = data;

    if (!email || !lozinka || !ime) {
      throw new Error('Nedostaju obavezna polja za korisnika');
    }

    // Provjera da li već postoji korisnik sa tim emailom
    const existing = await prisma.korisnik.findUnique({ where: { email: email as string } });
    if (existing) {
      return {
        success: false,
        error: 'email_exists'
      };
    }

    // Hash lozinke prije upisa
    const hash = await bcrypt.hash(lozinka as string, 10);

    let korisnik;
    if (adresa && drzava && grad && telefon && postanskiBroj) {
      if (!prezime) {
        throw new Error('Nedostaje prezime za podatke preuzimanja');
      }
      korisnik = await prisma.korisnik.create({
        data: {
          email: email as string,
          lozinka: hash,
          ime: ime as string,
          uloga,
          podaciPreuzimanja: {
            create: {
              ime: ime as string,
              prezime: prezime as string,
              adresa,
              drzava,
              grad,
              telefon,
              postanskiBroj
            }
          }
        },
        include: { podaciPreuzimanja: true }
      });
    } else {
      korisnik = await prisma.korisnik.create({
        data: {
          email: email as string,
          lozinka: hash,
          ime: ime as string,
          uloga
        }
      });
    }

    revalidatePath('/korisnici');

    return {
      success: true,
      data: korisnik
    };
  } catch (error) {
    console.error('Error creating korisnik:', error);
    // Specifična poruka za unique constraint
    if (error instanceof Error && (error as any).code === 'P2002') {
      return {
        success: false,
        error: 'email_exists'
      };
    }
    return {
      success: false,
      error: 'Greška pri kreiranju korisnika'
    };
  }
}

export async function updateProfilKorisnika(id: string, data: {
  ime?: string;
  email: string;
  uloga?: string;
}) {
  try {
    const korisnik = await prisma.korisnik.update({
      where: { id },
      data: {
        ime: data.ime,
        email: data.email,
        uloga: data.uloga
      },
      include: { podaciPreuzimanja: true }
    });

    revalidatePath('/profil');
    revalidatePath('/korisnici');

    return {
      success: true,
      data: korisnik
    };
  } catch (error) {
    console.error('Error updating korisnik profile:', error);
    return {
      success: false,
      error: 'Greška pri ažuriranju profila'
    };
  }
}

export async function updateKorisnik(data: UpdateKorisnikData) {
  try {
    const { id, email, lozinka, ime, prezime, uloga, adresa, drzava, grad, telefon, postanskiBroj, podaciPreuzimanjaId } = data;

    const korisnik = await prisma.korisnik.update({
      where: { id },
      data: {
        email,
        lozinka,
        ime,
        uloga,
        podaciPreuzimanja: {
          update: {
            where: { id: podaciPreuzimanjaId },
            data: {
              ime: ime as string,
              prezime: prezime as string,
              adresa,
              drzava,
              grad,
              telefon,
              postanskiBroj
            }
          }
        }
      },
      include: { podaciPreuzimanja: true }
    });

    revalidatePath('/korisnici');

    return {
      success: true,
      data: korisnik
    };
  } catch (error) {
    console.error('Error updating korisnik:', error);
    return {
      success: false,
      error: 'Greška pri ažuriranju korisnika'
    };
  }
}

export async function deleteKorisnik(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'ID je obavezan.'
      };
    }

    // Check if user exists
    const existingKorisnik = await prisma.korisnik.findUnique({
      where: { id }
    });

    if (!existingKorisnik) {
      return {
        success: false,
        error: 'Korisnik nije pronađen'
      };
    }

    // Check if user has any orders
    const porudzbineCount = await prisma.porudzbina.count({
      where: { korisnikId: id }
    });

    if (porudzbineCount > 0) {
      return {
        success: false,
        error: `Ne možete obrisati korisnika koji ima ${porudzbineCount} porudžbin(a). Prvo obrišite sve porudžbine korisnika.`
      };
    }

    // Delete related data first using transaction
    await prisma.$transaction(async (tx) => {
      // Delete cart items
      await tx.stavkaKorpe.deleteMany({
        where: { korisnikId: id }
      });

      // Delete favorites
      await tx.omiljeni.deleteMany({
        where: { korisnikId: id }
      });

      // Finally delete the user (podaciPreuzimanja will be deleted automatically due to cascade)
      await tx.korisnik.delete({
        where: { id }
      });
    });

    revalidatePath('//korisnici');

    return {
      success: true,
      message: 'Korisnik je uspešno obrisan'
    };
  } catch (error) {
    console.error('Error deleting korisnik:', error);
    return {
      success: false,
      error: 'Greška pri brisanju korisnika'
    };
  }
}

export async function deleteKorisnikAdmin(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'ID je obavezan.'
      };
    }

    const existingKorisnik = await prisma.korisnikAdmin.findUnique({
      where: { id }
    });

    if (!existingKorisnik) {
      return {
        success: false,
        error: 'Admin korisnik nije pronađen'
      };
    }

    await prisma.korisnikAdmin.delete({
      where: { id }
    });

    revalidatePath('/korisnici');

    return {
      success: true,
      message: 'Admin korisnik je uspešno obrisan'
    };
  } catch (error) {
    console.error('Error deleting admin korisnik:', error);
    return {
      success: false,
      error: 'Greška pri brisanju admin korisnika'
    };
  }
}

export async function registrujKorisnika(data: RegistracijaData) {
  try {
    const { email, lozinka, ime, prezime, uloga = 'korisnik' } = data;

    // Check if user already exists
    const existing = await prisma.korisnikAdmin.findUnique({
      where: { email }
    });

    if (existing) {
      return {
        success: false,
        error: 'Korisnik sa ovom email adresom već postoji'
      };
    }

    // Hash password pre upisa u bazu
    const hash = await bcrypt.hash(lozinka, 10);
    const korisnik = await prisma.korisnikAdmin.create({
      data: {
        email,
        lozinka: hash,
        ime,
        prezime,
        uloga
      }
    });

    return {
      success: true,
      data: {
        id: korisnik.id,
        email: korisnik.email,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        uloga: korisnik.uloga
      },
      message: 'Korisnik je uspešno registrovan'
    };
  } catch (error) {
    console.error('Error registering korisnik:', error);
    return {
      success: false,
      error: 'Greška pri registraciji korisnika'
    };
  }
}