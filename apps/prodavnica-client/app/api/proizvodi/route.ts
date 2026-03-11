import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    try {
        const skip = (page - 1) * pageSize;
        const proizvodi = await prisma.proizvod.findMany({
            where: search
                ? {
                    OR: [
                        { naziv_en: { contains: search, mode: 'insensitive' } },
                        { naziv_sr: { contains: search, mode: 'insensitive' } },
                        { opis_en: { contains: search, mode: 'insensitive' } },
                        { opis_sr: { contains: search, mode: 'insensitive' } },
                        { kategorija_en: { contains: search, mode: 'insensitive' } },
                        { kategorija_sr: { contains: search, mode: 'insensitive' } },
                        { pol_en: { contains: search, mode: 'insensitive' } },
                        { pol: { contains: search, mode: 'insensitive' } },
                        { uzrast_en: { contains: search, mode: 'insensitive' } },
                        { uzrast: { contains: search, mode: 'insensitive' } },
                        { materijal_en: { contains: search, mode: 'insensitive' } },
                        { materijal: { contains: search, mode: 'insensitive' } },
                        { brend: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            skip,
            take: pageSize,
            include: {
                varijante: true
            }
        });

        // Map varijante to varijante for API response (already correct name)
        const result = proizvodi.map(p => ({
            ...p
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Greška pri dohvaćanju proizvoda:", error);
        return NextResponse.json({ error: "Greška pri dohvaćanju proizvoda." }, { status: 500 });
    }
}
