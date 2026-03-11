'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type KreirajPorudzbinuData = {
  korisnikId: string;
  ukupno: number;
  status: string;
  email?: string;
  stavke: {
    proizvodId: string;
    kolicina: number;
    cena: number;
    opis?: string;
    slike?: string[];
    boja?: string;
    velicina?: string;
  }[];
};

export async function getPorudzbineKorisnika(korisnikId: string, page: number = 1, pageSize: number = 10) {
  try {
    if (!korisnikId) {
      return {
        success: true,
        data: { porudzbine: [], total: 0 }
      };
    }

    const skip = (page - 1) * pageSize;

    const [porudzbine, total] = await Promise.all([
      prisma.porudzbina.findMany({
        where: { korisnikId },
        skip,
        take: pageSize,
        orderBy: { kreiran: 'desc' },
        include: {
          stavkePorudzbine: {
            include: {
              proizvod: {
                select: {
                  id: true,
                  naziv_sr: true,
                  naziv_en: true,
                  slike: true,
                  cena: true
                }
              }
            },
            orderBy: { kreiran: 'asc' }
          }
        }
      }),
      prisma.porudzbina.count({ where: { korisnikId } })
    ]);

    return {
      success: true,
      data: { porudzbine, total }
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju vaših porudžbina'
    };
  }
}

export async function getPorudzbinuById(id: string) {
  try {
    const porudzbina = await prisma.porudzbina.findUnique({
      where: { id },
      include: {
        korisnik: {
          select: {
            id: true,
            email: true,
            podaciPreuzimanja: true
          }
        },
        stavkePorudzbine: {
          include: {
            proizvod: {
              select: {
                id: true,
                naziv_sr: true,
                naziv_en: true,
                opis_sr: true,
                opis_en: true,
                slike: true,
                cena: true
              }
            }
          },
          orderBy: { kreiran: 'asc' }
        }
      }
    });

    if (!porudzbina) {
      return {
        success: false,
        error: 'Porudžbina nije pronađena'
      };
    }

    return {
      success: true,
      data: porudzbina
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju porudžbine'
    };
  }
}

export async function kreirajPorudzbinu(data: KreirajPorudzbinuData) {
  try {
    const { korisnikId, ukupno, status, email, stavke } = data;

    if (!korisnikId || !stavke || stavke.length === 0) {
      console.error('[kreirajPorudzbinu] Invalid data:', { korisnikId, stavkeCount: stavke?.length });
      return {
        success: false,
        error: 'Neispravni podaci za porudžbinu'
      };
    }

    console.log('[kreirajPorudzbinu] Starting to create order for user:', korisnikId, 'with', stavke.length, 'items');

    // Create order with order items in transaction
    const porudzbina = await prisma.$transaction(async (tx) => {
      // Create the order
      console.log('[kreirajPorudzbinu] Creating order with status:', status);
      const novaPorudzbina = await tx.porudzbina.create({
        data: {
          korisnikId,
          ukupno,
          status,
          email
        }
      });

      console.log('[kreirajPorudzbinu] Order created with ID:', novaPorudzbina.id);

      // Create order items and decrease product variants
      const stavkePorudzbine = await Promise.all(
        stavke.map(async stavka => {
          // Create order item
          const stavkaPorudzbine = await tx.stavkaPorudzbine.create({
            data: {
              porudzbinaId: novaPorudzbina.id,
              proizvodId: stavka.proizvodId,
              kolicina: stavka.kolicina,
              cena: stavka.cena,
              opis: stavka.opis,
              slika: Array.isArray(stavka.slike) ? stavka.slike[0] : stavka.slike,
              boja: stavka.boja,
              velicina: stavka.velicina
            }
          });

          console.log('[kreirajPorudzbinu] Order item created:', stavkaPorudzbine.id, 'with color:', stavka.boja, 'size:', stavka.velicina);

          // Decrease quantity from varijante if color and size are provided
          if (stavka.boja && stavka.velicina) {
            console.log('[kreirajPorudzbinu] Updating variant quantity for product:', stavka.proizvodId, 'color:', stavka.boja, 'size:', stavka.velicina);
            try {
              // First, find any variant with this product, color, and size
              const existingVariant = await tx.proizvodVarijanta.findFirst({
                where: {
                  proizvodId: stavka.proizvodId,
                  boja: stavka.boja,
                  velicina: stavka.velicina
                }
              });

              if (existingVariant) {
                const updated = await tx.proizvodVarijanta.update({
                  where: { id: existingVariant.id },
                  data: {
                    kolicina: {
                      decrement: stavka.kolicina
                    }
                  }
                });
                console.log('[kreirajPorudzbinu] Variant updated, new quantity:', updated.kolicina);
              } else {
                console.log('[kreirajPorudzbinu] Variant not found for product:', stavka.proizvodId, 'color:', stavka.boja, 'size:', stavka.velicina);
              }
            } catch (err) {
              console.error('[kreirajPorudzbinu] Error updating variant:', err);
              // Don't throw - just log the error and continue
              // throw err;
            }
          } else {
            console.log('[kreirajPorudzbinu] No variant update needed - missing boja or velicina');
          }

          return stavkaPorudzbine;
        })
      );

      return { ...novaPorudzbina, stavkePorudzbine };
    });

    console.log('[kreirajPorudzbinu] Transaction completed successfully. Order ID:', porudzbina.id);

    revalidatePath('/moje-porudzbine');

    return {
      success: true,
      data: porudzbina
    };
  } catch (error) {
    console.error('[kreirajPorudzbinu] Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška pri kreiranju porudžbine';
    return {
      success: false,
      error: errorMessage
    };
  }
}

export async function getOcenaStavke(stavkaId: string, korisnikId: string) {
  try {
    if (!stavkaId || !korisnikId) {
      return { success: false, error: 'Nedostaju podaci' };
    }

    const stavka = await prisma.stavkaPorudzbine.findFirst({
      where: {
        id: stavkaId,
        porudzbina: { korisnikId, status: 'Završeno' }
      },
      select: { rating: true }
    });

    if (!stavka) {
      return { success: false, error: 'Stavka nije pronađena' };
    }

    return { success: true, data: stavka.rating ?? null };
  } catch (error) {
    console.error('Error fetching rating:', error);
    return { success: false, error: 'Greška pri učitavanju ocene' };
  }
}

export async function upsertOcenaStavke(stavkaId: string, korisnikId: string, rating: number) {
  try {
    if (!stavkaId || !korisnikId) {
      return { success: false, error: 'Nedostaju podaci' };
    }

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      return { success: false, error: 'Ocena mora biti između 1 i 5' };
    }

    const stavka = await prisma.stavkaPorudzbine.findFirst({
      where: {
        id: stavkaId,
        porudzbina: { korisnikId, status: 'Završeno' }
      },
      select: { id: true, proizvodId: true }
    });

    if (!stavka) {
      // Stavka ne pripada završenoj porudžbini korisnika
      return { success: false, error: 'ONLY_COMPLETED' };
    }

    const updated = await prisma.stavkaPorudzbine.update({
      where: { id: stavkaId },
      data: { rating }
    });

    revalidatePath('/moje-porudzbine');
    revalidatePath('/proizvodi');
    if (stavka.proizvodId) {
      revalidatePath(`/proizvodi/${stavka.proizvodId}`);
    }

    return { success: true, data: updated, message: 'Ocena je sačuvana' };
  } catch (error) {
    console.error('Error saving rating:', error);
    return { success: false, error: 'Greška pri čuvanju ocene' };
  }
}

export async function obrisiOcenuStavke(stavkaId: string, korisnikId: string) {
  try {
    if (!stavkaId || !korisnikId) {
      return { success: false, error: 'Nedostaju podaci' };
    }

    const stavka = await prisma.stavkaPorudzbine.findFirst({
      where: {
        id: stavkaId,
        porudzbina: { korisnikId, status: 'Završeno' }
      },
      select: { id: true, proizvodId: true }
    });

    if (!stavka) {
      // Stavka ne pripada završenoj porudžbini korisnika
      return { success: false, error: 'ONLY_COMPLETED' };
    }

    const updated = await prisma.stavkaPorudzbine.update({
      where: { id: stavkaId },
      data: { rating: null }
    });

    revalidatePath('/moje-porudzbine');
    revalidatePath('/proizvodi');
    if (stavka.proizvodId) {
      revalidatePath(`/proizvodi/${stavka.proizvodId}`);
    }

    return { success: true, data: updated, message: 'Ocena je obrisana' };
  } catch (error) {
    console.error('Error deleting rating:', error);
    return { success: false, error: 'Greška pri brisanju ocene' };
  }
}

export async function azurirajStatusPorudzbine(porudzbinaId: string, noviStatus: string) {
  try {
    const porudzbina = await prisma.porudzbina.update({
      where: { id: porudzbinaId },
      data: { status: noviStatus },
    });

    revalidatePath('/moje-porudzbine');

    return {
      success: true,
      data: porudzbina,
    };
  } catch (error) {
    console.error('Greška pri ažuriranju statusa porudžbine:', error);
    return {
      success: false,
      error: 'Greška pri ažuriranju statusa porudžbine',
    };
  }
}