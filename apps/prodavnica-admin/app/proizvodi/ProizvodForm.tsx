/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CloudinaryUploadField from './izmeni/[id]/CloudinaryUploadField';
import SuccessMessage from '@/app/components/SuccessMessage';
import ProizvodVarijanteForm from './ProizvodVarijanteForm';
import { noviProizvodSchemaStatic } from '@/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { Input } from "@prodavnica/ui";
import { Textarea } from "@prodavnica/ui";
import { Label } from "@prodavnica/ui";
import { Button } from "@prodavnica/ui";
import type { Proizvod } from '@/types';
import type { VarijantaData } from '@/lib/actions/proizvodi';

// Schema za update proizvoda (slike su opcionalne za update)
const updateProizvodSchema = noviProizvodSchemaStatic.extend({
  slike: z.array(z.string().url()).optional(),
}).refine(data => data.slike && data.slike.length > 0, {
  message: 'Slika je obavezna',
  path: ['slike'],
});

interface ProizvodFormProps {
  serverAction: (data: any) => Promise<{ success: boolean; error?: string }>;
  proizvod?: Proizvod; // Ako je undefined, radi se o dodavanju novog proizvoda
}

export default function ProizvodForm({ serverAction, proizvod }: ProizvodFormProps) {
  const router = useRouter();
  const [varijante, setVarijante] = useState<VarijantaData[]>(proizvod?.varijante || []);
  const isEditMode = !!proizvod;
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      // Priprema podataka
      const schema = isEditMode ? updateProizvodSchema : noviProizvodSchemaStatic;
      let varijante: VarijantaData[] = [];
      try {
        const varijanteStr = formData.get('varijante');
        if (typeof varijanteStr === 'string') {
          varijante = JSON.parse(varijanteStr);
        }
      } catch { }
      const data: any = {
        ...(isEditMode && { id: proizvod!.id }),
        naziv_sr: formData.get('naziv_sr') as string,
        naziv_en: formData.get('naziv_en') as string,
        opis_sr: (formData.get('opis_sr') as string) || undefined,
        opis_en: (formData.get('opis_en') as string) || undefined,
        karakteristike_sr: (formData.get('karakteristike_sr') as string) || undefined,
        karakteristike_en: (formData.get('karakteristike_en') as string) || undefined,
        kategorija_sr: formData.get('kategorija_sr') as string,
        kategorija_en: formData.get('kategorija_en') as string,
        pol: (formData.get('pol') as string) || undefined,
        pol_en: (formData.get('pol_en') as string) || undefined,
        uzrast: (formData.get('uzrast') as string) || undefined,
        uzrast_en: (formData.get('uzrast_en') as string) || undefined,
        brend: (formData.get('brend') as string) || undefined,
        boja: varijante.length > 0 ? Array.from(new Set(varijante.map(v => v.boja))) : undefined,
        boja_en: varijante.length > 0 ? Array.from(new Set(varijante.map(v => v.boja_en))) : undefined,
        materijal: (formData.get('materijal') as string) || undefined,
        materijal_en: (formData.get('materijal_en') as string) || undefined,
        cena: Number(formData.get('cena')),
        popust: formData.get('popust') ? Number(formData.get('popust')) : undefined,
        slike: isEditMode
          ? (proizvod?.slike ?? [])
          : (formData.getAll('slike').filter(Boolean) as string[]),
        varijante,
      };
      // Zod validacija na serveru
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        return { success: false, errors: fieldErrors, varijante };
      }
      // Poziv server action
      const result = await serverAction(data);
      if (!result.success) {
        return { success: false, errors: { global: result.error || 'Greška na serveru' }, varijante };
      }
      return { success: true, errors: {}, varijante };
    },
    { success: false, errors: {}, varijante: proizvod?.varijante || [] }
  );

  useEffect(() => {
    if (state.success && isEditMode) {
      const timeout = setTimeout(() => {
        router.push('/proizvodi');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [state.success, isEditMode, router]);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
      {state.success && <SuccessMessage message={`Proizvod je uspešno ${proizvod ? 'izmenjen' : 'dodat'}!`} />}
      {state.errors.global && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {state.errors.global}
        </div>
      )}

      {proizvod && (
        <h2 className="text-2xl font-bold mb-6 text-gray-600">Izmjeni proizvod</h2>
      )}

      {!proizvod && (
        <h2 className="text-2xl font-bold mb-6 text-gray-600">Dodaj novi proizvod</h2>
      )}

      <form className="space-y-4 w-full" action={formAction} noValidate>

        {/* SRPSKI PODACI */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Srpski (SR)</h3>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1">Naziv (SR)</Label>
              <Input
                type="text"
                name="naziv_sr"
                placeholder="Naziv (SR)"
                defaultValue={proizvod?.naziv_sr || ''}
                aria-invalid={!!state.errors.naziv_sr}
              />
              {state.errors.naziv_sr && <p className="mt-1 text-sm text-red-600">{state.errors.naziv_sr}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Kategorija (SR)</Label>
              <Input
                type="text"
                name="kategorija_sr"
                placeholder="Kategorija (SR)"
                defaultValue={proizvod?.kategorija_sr || ''}
                aria-invalid={!!state.errors.kategorija_sr}
              />
              {state.errors.kategorija_sr && <p className="mt-1 text-sm text-red-600">{state.errors.kategorija_sr}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Opis (SR)</Label>
              <Textarea
                name="opis_sr"
                placeholder="Opis (SR)"
                defaultValue={proizvod?.opis_sr || ''}
                aria-invalid={!!state.errors.opis_sr}
              />
              {state.errors.opis_sr && <p className="mt-1 text-sm text-red-600">{state.errors.opis_sr}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Karakteristike (SR)</Label>
              <Input
                type="text"
                name="karakteristike_sr"
                placeholder="Karakteristike (SR)"
                defaultValue={proizvod?.karakteristike_sr || ''}
                aria-invalid={!!state.errors.karakteristike_sr}
              />
              {state.errors.karakteristike_sr && <p className="mt-1 text-sm text-red-600">{state.errors.karakteristike_sr}</p>}
            </div>
          </div>
        </div>

        {/* ENGLESKI PODACI */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Engleski (EN)</h3>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1">Naziv (EN)</Label>
              <Input
                type="text"
                name="naziv_en"
                placeholder="Naziv (EN)"
                defaultValue={proizvod?.naziv_en || ''}
                aria-invalid={!!state.errors.naziv_en}
              />
              {state.errors.naziv_en && <p className="mt-1 text-sm text-red-600">{state.errors.naziv_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Kategorija (EN)</Label>
              <Input
                type="text"
                name="kategorija_en"
                placeholder="Kategorija (EN)"
                defaultValue={proizvod?.kategorija_en || ''}
                aria-invalid={!!state.errors.kategorija_en}
              />
              {state.errors.kategorija_en && <p className="mt-1 text-sm text-red-600">{state.errors.kategorija_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Opis (EN)</Label>
              <Textarea
                name="opis_en"
                placeholder="Opis (EN)"
                defaultValue={proizvod?.opis_en || ''}
                aria-invalid={!!state.errors.opis_en}
              />
              {state.errors.opis_en && <p className="mt-1 text-sm text-red-600">{state.errors.opis_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Karakteristike (EN)</Label>
              <Input
                type="text"
                name="karakteristike_en"
                placeholder="Karakteristike (EN)"
                defaultValue={proizvod?.karakteristike_en || ''}
                aria-invalid={!!state.errors.karakteristike_en}
              />
              {state.errors.karakteristike_en && <p className="mt-1 text-sm text-red-600">{state.errors.karakteristike_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Pol (EN)</Label>
              <select
                name="pol_en"
                defaultValue={proizvod?.pol_en || ''}
                aria-invalid={!!state.errors.pol_en}
              >
                <option value="">Pol (EN)</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
              {state.errors.pol_en && <p className="mt-1 text-sm text-red-600">{state.errors.pol_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Uzrast (EN)</Label>
              <select
                name="uzrast_en"
                defaultValue={proizvod?.uzrast_en || ''}
                aria-invalid={!!state.errors.uzrast_en}
              >
                <option value="">Uzrast (EN)</option>
                <option value="ADULTS">ADULTS</option>
                <option value="CHILDREN">CHILDREN</option>
              </select>
              {state.errors.uzrast_en && <p className="mt-1 text-sm text-red-600">{state.errors.uzrast_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Materijal (EN)</Label>
              <Input
                type="text"
                name="materijal_en"
                placeholder="Materijal (EN)"
                defaultValue={proizvod?.materijal_en || ''}
                aria-invalid={!!state.errors.materijal_en}
              />
              {state.errors.materijal_en && <p className="mt-1 text-sm text-red-600">{state.errors.materijal_en}</p>}
            </div>
          </div>
        </div>

        {/* OSTALI PODACI */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Ostali podaci</h3>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1">Cena</Label>
              <Input
                type="number"
                name="cena"
                placeholder="Cena"
                defaultValue={proizvod?.cena || ''}
                aria-invalid={!!state.errors.cena}
              />
              {state.errors.cena && <p className="mt-1 text-sm text-red-600">{state.errors.cena}</p>}
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Popust</Label>
              <Input
                type="number"
                name="popust"
                placeholder="Popust"
                defaultValue={proizvod?.popust || ''}
                aria-invalid={!!state.errors.popust}
                step="0.01"
                min="0"
              />
              {state.errors.popust && <p className="mt-1 text-sm text-red-600">{state.errors.popust}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Pol</Label>
              <select
                name="pol"
                defaultValue={proizvod?.pol || ''}
                aria-invalid={!!state.errors.pol}
              >
                <option value="">Pol</option>
                <option value="MUŠKI">MUŠKI</option>
                <option value="ŽENSKI">ŽENSKI</option>
              </select>
              {state.errors.pol && <p className="mt-1 text-sm text-red-600">{state.errors.pol}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Uzrast</Label>
              <select
                name="uzrast"
                defaultValue={proizvod?.uzrast || ''}
                aria-invalid={!!state.errors.uzrast}
              >
                <option value="">Uzrast</option>
                <option value="ODRASLI">ODRASLI</option>
                <option value="DJECA">DJECA</option>
              </select>
              {state.errors.uzrast && <p className="mt-1 text-sm text-red-600">{state.errors.uzrast}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Brend</Label>
              <Input
                type="text"
                name="brend"
                placeholder="Brend"
                defaultValue={proizvod?.brend || ''}
                aria-invalid={!!state.errors.brend}
              />
              {state.errors.brend && <p className="mt-1 text-sm text-red-600">{state.errors.brend}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Materijal</Label>
              <Input
                type="text"
                name="materijal"
                placeholder="Materijal"
                defaultValue={proizvod?.materijal || ''}
                aria-invalid={!!state.errors.materijal}
              />
              {state.errors.materijal && <p className="mt-1 text-sm text-red-600">{state.errors.materijal}</p>}
            </div>


            <ProizvodVarijanteForm
              varijante={varijante}
              onChange={v => {
                setVarijante(v);
              }}
              errors={state.errors}
            />
            {/* Hidden input to serialize varijante for form submission */}
            <input type="hidden" name="varijante" value={JSON.stringify(varijante)} />
            {state.errors.varijante && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {state.errors.varijante}
              </p>
            )}

            {!proizvod && (
              <>
                <CloudinaryUploadField initialImages={[]} />
                {state.errors.slike && <p className="mt-1 text-sm text-red-600">{state.errors.slike}</p>}
              </>
            )}

            {isEditMode && proizvod?.slike && (
              <div>
                <Label className="block text-sm font-medium mb-1">Slike</Label>
                <div className="flex gap-2 flex-wrap">
                  {proizvod.slike.map((slika, idx) => (
                    <div key={idx} className="relative">
                      <Image src={slika} alt={`Slika ${idx + 1}`} width={80} height={80} className="h-20 w-20 object-cover rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t w-full">
          <Button
            type="submit"
            disabled={isPending}
            className="text-white hover:text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
          >
            {isPending ? 'Čuvam...' : proizvod ? 'Izmeni' : 'Sačuvaj'}
          </Button>
          <Button
            type="button"
            onClick={() => router.push('/proizvodi')}
            variant="outline"
            className="px-2 py-1 rounded flex-1"
          >
            Odustani
          </Button>
        </div>
      </form>
    </div>
  );
}
