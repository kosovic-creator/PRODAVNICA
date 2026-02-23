'use client';
import { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { z } from 'zod';
import { korisnikSchema } from '@/lib/validators';
import { Button } from "@prodavnica/ui";
import { Input } from "@prodavnica/ui";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@prodavnica/ui";
import { Label } from "@prodavnica/ui";

interface EditProfilFormProps {
  handleEditProfil: (formData: FormData) => Promise<void>;
  initialForm: {
    ime: string;
    prezime: string;
    email: string;
    telefon: string;
    drzava: string;
    grad: string;
    postanskiBroj: string;
    adresa: string;
    uloga: string;
    podaciId: string;
  };
  errorMap: Record<string, string>;
  valueMap: Record<string, string>;
  translations: Record<string, string>;
}

export default function EditProfilForm({
  handleEditProfil,
  initialForm,
  errorMap: serverErrorMap,
  valueMap,
  translations,
}: EditProfilFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>(serverErrorMap);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const t = (key: string) => translations[key] || key;

  // Koristi postojeću korisnikSchema, ali bez lozinka i slika polja
  const validationSchema = korisnikSchema(t).omit({ lozinka: true, slika: true, uloga: true });

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = validationSchema.shape[name as keyof typeof validationSchema.shape];
      if (!fieldSchema) return;

      fieldSchema.parse(value);

      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        if (firstError?.message) {
          setErrors(prev => ({ ...prev, [name]: firstError.message }));
        }
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (touched[name]) {
      validateField(name, value);
    }
  };

  return (
    <>
      {/* Skrivena upotreba jezika kako bi se izbjeglo upozorenje o nekorištenim varijablama */}
      <span style={{ display: 'none' }}></span>
      <Card>
        <CardHeader className="text-center mb-2">
          <CardTitle className="text-2xl font-bold">{t('edit_profile')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleEditProfil(formData);
          }}>
            <Input type="hidden" name="podaciId" defaultValue={valueMap.podaciId || initialForm.podaciId} />
            <Input type="hidden" name="uloga" value={valueMap.uloga || initialForm.uloga || 'korisnik'} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ime">{translations.name || t('name')}</Label>
                <Input
                  name="ime"
                  defaultValue={valueMap.ime || initialForm.ime}
                  placeholder={translations.name || t('name')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.ime && <div className="text-red-500 text-sm mt-1">{errors.ime}</div>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="prezime">{translations.surname || t('surname')}</Label>
                <Input
                  name="prezime"
                  defaultValue={valueMap.prezime || initialForm.prezime}
                  placeholder={translations.surname || t('surname')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.prezime && <div className="text-red-500 text-sm mt-1">{errors.prezime}</div>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">{translations.email || t('email')}</Label>
              <Input
                name="email"
                type="email"
                defaultValue={valueMap.email || initialForm.email}
                placeholder={translations.email || t('email')}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="telefon">{translations.phone || t('phone')}</Label>
              <Input
                name="telefon"
                defaultValue={valueMap.telefon || initialForm.telefon}
                placeholder={translations.phone || t('phone')}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.telefon && <div className="text-red-500 text-sm mt-1">{errors.telefon}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="drzava">{translations.country || t('country')}</Label>
                <Input
                  name="drzava"
                  defaultValue={valueMap.drzava || initialForm.drzava}
                  placeholder={translations.country || t('country')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.drzava && <div className="text-red-500 text-sm mt-1">{errors.drzava}</div>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="grad">{translations.city || t('city')}</Label>
                <Input
                  name="grad"
                  defaultValue={valueMap.grad || initialForm.grad}
                  placeholder={translations.city || t('city')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.grad && <div className="text-red-500 text-sm mt-1">{errors.grad}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="postanskiBroj">{translations.postal_code || t('postal_code')}</Label>
                <Input
                  name="postanskiBroj"
                  defaultValue={valueMap.postanskiBroj || initialForm.postanskiBroj}
                  placeholder={translations.postal_code || t('postal_code')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.postanskiBroj && <div className="text-red-500 text-sm mt-1">{errors.postanskiBroj}</div>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="adresa">{translations.address || t('address')}</Label>
                <Input
                  name="adresa"
                  defaultValue={valueMap.adresa || initialForm.adresa}
                  placeholder={translations.address || t('address')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.adresa && <div className="text-red-500 text-sm mt-1">{errors.adresa}</div>}
              </div>
            </div>

            <CardFooter className="flex flex-col gap-3 mt-4 pt-2">
              <Button
                type="submit"
                variant="default"
                className="w-full flex items-center justify-center gap-2"
              >
                <FaSave />
                {translations.sacuvaj_izmjene || t('sacuvaj_izmjene')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.location.href = '/profil'}
                className="w-full flex items-center justify-center gap-2"
              >
                <FaTimes />
                {translations.odkazivanje || t('odkazivanje')}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </>
  );
}