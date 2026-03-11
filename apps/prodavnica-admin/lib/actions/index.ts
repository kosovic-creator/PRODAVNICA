// Server Actions exports
export * from './korisnici';
export * from './proizvodi';
export * from './porudzbine';


import prisma from '../prisma';

export async function getStats() {
    const korisnici = await prisma.korisnikAdmin.count({
        where: {}
    });
    const proizvodi = await prisma.proizvod.count({
        where: {}
    });
    const porudzbine = await prisma.porudzbina.count({
        where: {}
    });
    const prihodResult = await prisma.porudzbina.aggregate({
        _sum: { ukupno: true },
        where: {}
    });
    const prihod = prihodResult._sum.ukupno || 0;
    return { korisnici, proizvodi, porudzbine, prihod };
}