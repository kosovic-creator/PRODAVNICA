import prisma from '@/lib/prisma';
import ProizvodForm from '../../ProizvodForm';
import { updateProizvod } from '@/lib/actions/proizvodi';
import type { UpdateProizvodData } from '@/lib/actions/proizvodi';

async function handleUpdate(data: UpdateProizvodData) {
  'use server';

  return await updateProizvod(data);
}

export default async function IzmeniProizvodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proizvod = await prisma.proizvod.findUnique({
    where: { id },
    include: {
      varijante: true
    }
  });
  if (!proizvod) {
    return <div className="text-red-600">Proizvod nije pronađen</div>;
  }
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <ProizvodForm
        proizvod={{
          ...proizvod,
          naziv: proizvod.naziv_sr ?? proizvod.naziv_en ?? '',
          opis: proizvod.opis_sr ?? proizvod.opis_en ?? '',
          kategorija: proizvod.kategorija_sr ?? proizvod.kategorija_en ?? '',
          opis_sr: proizvod.opis_sr ?? undefined,
          opis_en: proizvod.opis_en ?? undefined,
          karakteristike_sr: proizvod.karakteristike_sr ?? undefined,
          karakteristike_en: proizvod.karakteristike_en ?? undefined,
          pol: proizvod.pol ?? undefined,
          pol_en: proizvod.pol_en ?? undefined,
          uzrast: proizvod.uzrast ?? undefined,
          uzrast_en: proizvod.uzrast_en ?? undefined,
          brend: proizvod.brend ?? undefined,
          boja: proizvod.boja ?? undefined,
          materijal: proizvod.materijal ?? undefined,
          materijal_en: proizvod.materijal_en ?? undefined,
          varijante: proizvod.varijante
        }}
        serverAction={handleUpdate}
      />
    </div>
  );
}
