'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProizvodNajnoviji() {

  try {
    const proizvod = await prisma.proizvod.findMany({
     take: 4,
      orderBy: {
        kreiran: 'desc'
      },
      include: {
        varijante: true
      }
    });

    if (!proizvod) {
      return {
        success: false,
        error: 'Nema proizvoda'
      };
    }

    return {
      success: true,
      data: proizvod
    };
  } catch (error) {
    console.error('Greška pri učitavanju  najnovijih proizvoda:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju proizvoda'
    };
  }
}

export async function getProizvodi(page: number = 1, pageSize: number = 10, search?: string) {
  try {
    const skip = (page - 1) * pageSize;

    const where = search && search.trim() !== '' ? {
      OR: [
        { naziv_sr: { contains: search, mode: 'insensitive' as const } },
        { naziv_en: { contains: search, mode: 'insensitive' as const } },
        { opis_sr: { contains: search, mode: 'insensitive' as const } },
        { opis_en: { contains: search, mode: 'insensitive' as const } },
        { kategorija_sr: { contains: search, mode: 'insensitive' as const } },
        { kategorija_en: { contains: search, mode: 'insensitive' as const } },
        { pol: { contains: search, mode: 'insensitive' as const } },
        { pol_en: { contains: search, mode: 'insensitive' as const } },
        { uzrast: { contains: search, mode: 'insensitive' as const } },
        { uzrast_en: { contains: search, mode: 'insensitive' as const } },
        { materijal: { contains: search, mode: 'insensitive' as const } },
        { materijal_en: { contains: search, mode: 'insensitive' as const } },
        { brend: { contains: search, mode: 'insensitive' as const } },
      ]
    } : undefined;

    const [proizvodi, total] = await Promise.all([
      prisma.proizvod.findMany({
        skip,
        take: pageSize,
        orderBy: {
          azuriran: 'desc'
        },
        where,
        include: {
          varijante: true
        }
      }),
      prisma.proizvod.count({ where }),
    ]);

    type RatingResult = { proizvodId: string; _avg: { rating: number | null }; _count: { rating: number } };
    let ratings: RatingResult[] = [];

    if (proizvodi.length) {
      const groupByResult = await prisma.stavkaPorudzbine.groupBy({
        by: ['proizvodId'],
        where: {
          proizvodId: { in: proizvodi.map(p => p.id) },
          rating: { not: null },
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      ratings = groupByResult as RatingResult[];

      // Sort manually after fetching if needed
      ratings.sort((a, b) => a.proizvodId.localeCompare(b.proizvodId));
    }

    const ratingMap = ratings.reduce<Record<string, { avg: number | null; count: number }>>((acc, item) => {
      acc[item.proizvodId] = {
        avg: item._avg.rating != null ? Number(item._avg.rating) : null,
        count: item._count.rating
      };
      return acc;
    }, {});

    // Transform data to include both language fields
    const proizvodiSaPrevod = proizvodi.map(proizvod => ({
      id: proizvod.id,
      cena: proizvod.cena,
      slike: proizvod.slike,
      varijante: proizvod.varijante,
      boja: Array.isArray(proizvod.boja) ? proizvod.boja : [],
      boja_en: Array.isArray(proizvod.boja_en) ? proizvod.boja_en : [],
      kreiran: proizvod.kreiran,
      azuriran: proizvod.azuriran,
      naziv_sr: proizvod.naziv_sr,
      naziv_en: proizvod.naziv_en,
      opis_sr: proizvod.opis_sr ?? undefined,
      opis_en: proizvod.opis_en ?? undefined,
      karakteristike_sr: proizvod.karakteristike_sr ?? undefined,
      karakteristike_en: proizvod.karakteristike_en ?? undefined,
      kategorija_sr: proizvod.kategorija_sr,
      kategorija_en: proizvod.kategorija_en,
      pol: proizvod.pol ?? undefined,
      pol_en: proizvod.pol_en ?? undefined,
      uzrast: proizvod.uzrast ?? undefined,
      uzrast_en: proizvod.uzrast_en ?? undefined,
      materijal: proizvod.materijal ?? undefined,
      materijal_en: proizvod.materijal_en ?? undefined,
      brend: proizvod.brend ?? undefined,
      avgRating: ratingMap[proizvod.id]?.avg ?? null,
      ratingCount: ratingMap[proizvod.id]?.count ?? 0,
    }));

    return {
      success: true,
      data: { proizvodi: proizvodiSaPrevod, total }
    };
  } catch (error) {
    console.error('Error fetching proizvodi:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju proizvoda'
    };
  }
}

export async function getProizvodById(id: string) {
  try {
    const proizvod = await prisma.proizvod.findUnique({
      where: { id },
      include: {
        varijante: true
      }
    });

    if (!proizvod) {
      return {
        success: false,
        error: 'Proizvod nije pronađen'
      };
    }

    let ratingAvg: number | null = null;
    let ratingCount = 0;
    try {
      const ratingAggregate = await prisma.stavkaPorudzbine.aggregate({
        where: { proizvodId: id, rating: { not: null } },
        _avg: { rating: true },
        _count: { rating: true }
      });
      ratingAvg = ratingAggregate._avg.rating != null ? Number(ratingAggregate._avg.rating) : null;
      ratingCount = ratingAggregate._count.rating;
    } catch (e) {
      console.warn('Rating aggregate failed, continuing without ratings:', e);
    }

    return {
      success: true,
      data: {
        id: proizvod.id,
        cena: proizvod.cena,
        slike: proizvod.slike,
        varijante: proizvod.varijante,
        boja: proizvod.boja,
        boja_en: proizvod.boja_en,
        kreiran: proizvod.kreiran,
        azuriran: proizvod.azuriran,
        naziv_sr: proizvod.naziv_sr,
        naziv_en: proizvod.naziv_en,
        opis_sr: proizvod.opis_sr,
        opis_en: proizvod.opis_en,
        karakteristike_sr: proizvod.karakteristike_sr,
        karakteristike_en: proizvod.karakteristike_en,
        kategorija_sr: proizvod.kategorija_sr,
        kategorija_en: proizvod.kategorija_en,
        pol: proizvod.pol ?? undefined,
        pol_en: proizvod.pol_en ?? undefined,
        uzrast: proizvod.uzrast ?? undefined,
        uzrast_en: proizvod.uzrast_en ?? undefined,
        materijal: proizvod.materijal ?? undefined,
        materijal_en: proizvod.materijal_en ?? undefined,
        brend: proizvod.brend ?? undefined,
        avgRating: ratingAvg,
        ratingCount: ratingCount
      }
    };
  } catch (error) {
    console.error('Error fetching proizvod:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju製品'
    };
  }
}

export async function getRaspolozivostPoProdavnicama(
  proizvodId: string,
  boja: string,
  velicina: string
) {
  try {
    if (!proizvodId || !boja || !velicina) {
      return {
        success: false,
        error: 'Nedostaju parametri'
      };
    }

    const varijante = await prisma.proizvodVarijanta.findMany({
      where: {
        proizvodId,
        boja,
        velicina
      },
      select: {
        prodavnica_br: true,
        kolicina: true
      }
    });

    const dostupno = varijante.reduce<Record<number, number>>((acc, v) => {
      acc[v.prodavnica_br] = (acc[v.prodavnica_br] || 0) + v.kolicina;
      return acc;
    }, {});

    const data = Object.entries(dostupno)
      .map(([prodavnica_br, kolicina]) => ({
        prodavnica_br: Number(prodavnica_br),
        kolicina
      }))
      .filter((item) => item.kolicina > 0)
      .sort((a, b) => a.prodavnica_br - b.prodavnica_br);

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching availability by store:', error);
    return {
      success: false,
      error: 'Greška pri učitavanju dostupnosti'
    };
  }
}
