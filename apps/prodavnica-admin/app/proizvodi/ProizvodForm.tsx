/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import CloudinaryUploadField from './izmeni/[id]/CloudinaryUploadField';
import SuccessMessage from '@/app/components/SuccessMessage';
import ProizvodVarijanteForm from './ProizvodVarijanteForm';
import { noviProizvodSchemaStatic } from '@/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
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
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [varijante, setVarijante] = useState<VarijantaData[]>(
    proizvod?.varijante?.map(v => ({
      boja: v.boja,
      boja_en: v.boja_en ?? '',
      velicina: v.velicina,
      kolicina: v.kolicina,
      prodavnica_br: v.prodavnica_br ?? 1
    })) || []
  );

  const isEditMode = !!proizvod;
  const schema = isEditMode ? updateProizvodSchema : noviProizvodSchemaStatic;

  // Real-time validacija sa touched state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Označi polje kao touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validacija
    try {
      const fieldSchema = schema.shape[name as keyof typeof schema.shape];
      if (fieldSchema) {
        let parsedValue: string | number = value;
        if (name === 'cena' || name === 'kolicina') {
          parsedValue = value ? Number(value) : 0;
        }

        fieldSchema.parse(parsedValue);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: error.issues[0]?.message || 'Nevalidna vrijednost'
        }));
      }
    }
  };

  // Validacija pojedinačnog polja pri blur event-u
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Označi polje kao touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validacija pri blur event-u
    try {
      const fieldSchema = schema.shape[name as keyof typeof schema.shape];
      if (fieldSchema) {
        let parsedValue: string | number = value;
        if (name === 'cena' || name === 'kolicina') {
          parsedValue = value ? Number(value) : 0;
        }

        fieldSchema.parse(parsedValue);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: error.issues[0]?.message || 'Nevalidna vrijednost'
        }));
      }
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrors({});

    // Mark all fields as touched
    setTouched({
      naziv_sr: true,
      naziv_en: true,
      kategorija_sr: true,
      kategorija_en: true,
      cena: true,
      slike: true,
      varijante: true,
    });

    // Validate varijante
    if (varijante.length === 0) {
      setErrors({ varijante: 'Molimo dodajte bar jednu varijante proizvoda' });
      setError('Molimo dodajte bar jednu varijante proizvoda');
      return;
    }

    // Extract unique boje from varijante for both languages
    const jedinstvene_boje = Array.from(new Set(varijante.map(v => v.boja)));
    const jedinstvene_boje_en = Array.from(new Set(varijante.map(v => v.boja_en)));

    const formData = new FormData(e.currentTarget);

    const data = {
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
      boja: jedinstvene_boje.length > 0 ? jedinstvene_boje : undefined,
      boja_en: jedinstvene_boje_en.length > 0 ? jedinstvene_boje_en : undefined,
      materijal: (formData.get('materijal') as string) || undefined,
      materijal_en: (formData.get('materijal_en') as string) || undefined,
      cena: Number(formData.get('cena')),
      slike: isEditMode
        ? (proizvod?.slike ?? [])
        : (formData.getAll('slike').filter(Boolean) as string[]),
      varijante: varijante // Dodaj varijante
    };

    // Validacija cijele forme
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setError('Molimo popravite greške u formi.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await serverAction(data);
        if (result?.success === false) {
          setError(result.error || `Došlo je do greške prilikom ${isEditMode ? 'izmene' : 'dodavanja'} proizvoda.`);
        } else {
          setSuccessMsg(`Proizvod je uspešno ${isEditMode ? 'izmenjen' : 'dodat'}!`);
          setTimeout(() => {
            setSuccessMsg(null);
            router.push('/proizvodi');
          }, 2000);
        }
      } catch (err) {
        console.error('ServerAction catch greška:', err);
        setError(`Došlo je do greške prilikom ${isEditMode ? 'izmene' : 'dodavanja'} proizvoda.`);
      }
    });
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
      {successMsg && <SuccessMessage message={successMsg} />}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isEditMode && (
        <h2 className="text-2xl font-bold mb-6 text-gray-600">Izmjeni proizvod</h2>
      )}

      {!isEditMode && (
        <h2 className="text-2xl font-bold mb-6 text-gray-600">Dodaj novi proizvod</h2>
      )}

      <form className="space-y-4 w-full" onSubmit={handleSubmit} noValidate>
        {/* DODAVANJE I IZMENA - ISTA FORMA */}

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
                defaultValue={isEditMode ? proizvod?.naziv_sr : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.naziv_sr && !!errors.naziv_sr}
              />
              {touched.naziv_sr && errors.naziv_sr && <p className="mt-1 text-sm text-red-600">{errors.naziv_sr}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Kategorija (SR)</Label>
              <Input
                type="text"
                name="kategorija_sr"
                placeholder="Kategorija (SR)"
                defaultValue={isEditMode ? proizvod?.kategorija_sr : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.kategorija_sr && !!errors.kategorija_sr}
              />
              {touched.kategorija_sr && errors.kategorija_sr && <p className="mt-1 text-sm text-red-600">{errors.kategorija_sr}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Opis (SR)</Label>
              <Textarea
                name="opis_sr"
                placeholder="Opis (SR)"
                defaultValue={isEditMode ? proizvod?.opis_sr || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.opis_sr && !!errors.opis_sr}
              />
              {touched.opis_sr && errors.opis_sr && <p className="mt-1 text-sm text-red-600">{errors.opis_sr}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Karakteristike (SR)</Label>
              <Input
                type="text"
                name="karakteristike_sr"
                placeholder="Karakteristike (SR)"
                defaultValue={isEditMode ? proizvod?.karakteristike_sr || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.karakteristike_sr && !!errors.karakteristike_sr}
              />
              {touched.karakteristike_sr && errors.karakteristike_sr && <p className="mt-1 text-sm text-red-600">{errors.karakteristike_sr}</p>}
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
                defaultValue={isEditMode ? proizvod?.naziv_en : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.naziv_en && !!errors.naziv_en}
              />
              {touched.naziv_en && errors.naziv_en && <p className="mt-1 text-sm text-red-600">{errors.naziv_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Kategorija (EN)</Label>
              <Input
                type="text"
                name="kategorija_en"
                placeholder="Kategorija (EN)"
                defaultValue={isEditMode ? proizvod?.kategorija_en : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.kategorija_en && !!errors.kategorija_en}
              />
              {touched.kategorija_en && errors.kategorija_en && <p className="mt-1 text-sm text-red-600">{errors.kategorija_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Opis (EN)</Label>
              <Textarea
                name="opis_en"
                placeholder="Opis (EN)"
                defaultValue={isEditMode ? proizvod?.opis_en || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.opis_en && !!errors.opis_en}
              />
              {touched.opis_en && errors.opis_en && <p className="mt-1 text-sm text-red-600">{errors.opis_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Karakteristike (EN)</Label>
              <Input
                type="text"
                name="karakteristike_en"
                placeholder="Karakteristike (EN)"
                defaultValue={isEditMode ? proizvod?.karakteristike_en || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.karakteristike_en && !!errors.karakteristike_en}
              />
              {touched.karakteristike_en && errors.karakteristike_en && <p className="mt-1 text-sm text-red-600">{errors.karakteristike_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Pol (EN)</Label>
              <select
                name="pol_en"
                defaultValue={isEditMode ? proizvod?.pol_en || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.pol_en && !!errors.pol_en}
              >
                <option value="">Pol (EN)</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
              {touched.pol_en && errors.pol_en && <p className="mt-1 text-sm text-red-600">{errors.pol_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Uzrast (EN)</Label>
              <select
                name="uzrast_en"
                defaultValue={isEditMode ? proizvod?.uzrast_en || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.uzrast_en && !!errors.uzrast_en}
              >
                <option value="">Uzrast (EN)</option>
                <option value="ADULTS">ADULTS</option>
                <option value="CHILDREN">CHILDREN</option>
              </select>
              {touched.uzrast_en && errors.uzrast_en && <p className="mt-1 text-sm text-red-600">{errors.uzrast_en}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Materijal (EN)</Label>
              <Input
                type="text"
                name="materijal_en"
                placeholder="Materijal (EN)"
                defaultValue={isEditMode ? proizvod?.materijal_en || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.materijal_en && !!errors.materijal_en}
              />
              {touched.materijal_en && errors.materijal_en && <p className="mt-1 text-sm text-red-600">{errors.materijal_en}</p>}
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
                defaultValue={isEditMode ? proizvod?.cena : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.cena && !!errors.cena}
              />
              {touched.cena && errors.cena && <p className="mt-1 text-sm text-red-600">{errors.cena}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Pol</Label>
              <select
                name="pol"
                defaultValue={isEditMode ? proizvod?.pol || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.pol && !!errors.pol}
              >
                <option value="">Pol</option>
                <option value="MUŠKI">MUŠKI</option>
                <option value="ŽENSKI">ŽENSKI</option>
              </select>
              {touched.pol && errors.pol && <p className="mt-1 text-sm text-red-600">{errors.pol}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Uzrast</Label>
              <select
                name="uzrast"
                defaultValue={isEditMode ? proizvod?.uzrast || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.uzrast && !!errors.uzrast}
              >
                <option value="">Uzrast</option>
                <option value="ODRASLI">ODRASLI</option>
                <option value="DJECA">DJECA</option>
              </select>
              {touched.uzrast && errors.uzrast && <p className="mt-1 text-sm text-red-600">{errors.uzrast}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Brend</Label>
              <Input
                type="text"
                name="brend"
                placeholder="Brend"
                defaultValue={isEditMode ? proizvod?.brend || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.brend && !!errors.brend}
              />
              {touched.brend && errors.brend && <p className="mt-1 text-sm text-red-600">{errors.brend}</p>}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Materijal</Label>
              <Input
                type="text"
                name="materijal"
                placeholder="Materijal"
                defaultValue={isEditMode ? proizvod?.materijal || '' : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.materijal && !!errors.materijal}
              />
              {touched.materijal && errors.materijal && <p className="mt-1 text-sm text-red-600">{errors.materijal}</p>}
            </div>

            <ProizvodVarijanteForm
              varijante={varijante}
              onChange={setVarijante}
              errors={errors}
            />
            {errors.varijante && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {errors.varijante}
              </p>
            )}

            {!isEditMode && (
              <>
                <CloudinaryUploadField initialImages={[]} />
                {touched.slike && errors.slike && <p className="mt-1 text-sm text-red-600">{errors.slike}</p>}
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
            disabled={isPending || Object.keys(errors).length > 0}
            className="text-white hover:text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
          >
            {isPending ? 'Čuvam...' : isEditMode ? 'Izmeni' : 'Sačuvaj'}
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
