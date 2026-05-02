/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useActionState } from 'react';
import { handleEditProfilAction } from '@/lib/actions/profil';
import SuccessMessage from '@/app/components/SuccessMessage';
import { FaSave, FaTimes } from 'react-icons/fa';
import { Button } from "@prodavnica/ui";
import { Input } from "@prodavnica/ui";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@prodavnica/ui";
import { Label } from "@prodavnica/ui";

interface EditProfilFormProps {
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
  translations: Record<string, string>;
}

export default function EditProfilForm({ initialForm, translations }: EditProfilFormProps) {
  const t = (key: string) => translations[key] || key;
  const [state, formAction] = useActionState(async (_: any, formData: FormData) => {
    return await handleEditProfilAction(formData);
  }, { errors: {}, values: {}, success: false });
  const errors: Record<string, string | undefined> = state.errors || {};
  const values: Record<string, string> = state.values || {};

  return (
    <Card>
      <CardHeader className="text-center mb-2">
        <CardTitle className="text-2xl font-bold">{t('edit_profile')}</CardTitle>
      </CardHeader>
      <CardContent>
        {state.success && (
          <SuccessMessage
            message={translations.profil_azuriran || 'Profil uspješno ažuriran'}
            redirectTo="/profil"
            redirectDelay={2000}
          />
        )}
        <form className="flex flex-col gap-4" action={formAction}>
          <Input type="hidden" name="lang" value={translations.lang || 'sr'} />
          <Input type="hidden" name="podaciId" defaultValue={values.podaciId !== undefined ? values.podaciId : initialForm.podaciId} />
          <Input type="hidden" name="uloga" value={values.uloga !== undefined ? values.uloga : (initialForm.uloga || 'korisnik')} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="ime">{translations.name || t('name')}</Label>
              <Input
                name="ime"
                defaultValue={values.ime !== undefined ? values.ime : initialForm.ime}
                placeholder={translations.name || t('name')}
              />
              {errors.ime && <div className="text-red-500 text-sm mt-1">{errors.ime}</div>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="prezime">{translations.surname || t('surname')}</Label>
              <Input
                name="prezime"
                defaultValue={values.prezime !== undefined ? values.prezime : initialForm.prezime}
                placeholder={translations.surname || t('surname')}
              />
              {errors.prezime && <div className="text-red-500 text-sm mt-1">{errors.prezime}</div>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">{translations.email || t('email')}</Label>
            <Input
              name="email"
              type="email"
              defaultValue={values.email !== undefined ? values.email : initialForm.email}
              placeholder={translations.email || t('email')}
            />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefon">{translations.phone || t('phone')}</Label>
            <Input
              name="telefon"
              defaultValue={values.telefon !== undefined ? values.telefon : initialForm.telefon}
              placeholder={translations.phone || t('phone')}
            />
            {errors.telefon && <div className="text-red-500 text-sm mt-1">{errors.telefon}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="drzava">{translations.country || t('country')}</Label>
              <Input
                name="drzava"
                defaultValue={values.drzava !== undefined ? values.drzava : initialForm.drzava}
                placeholder={translations.country || t('country')}
              />
              {errors.drzava && <div className="text-red-500 text-sm mt-1">{errors.drzava}</div>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="grad">{translations.city || t('city')}</Label>
              <Input
                name="grad"
                defaultValue={values.grad !== undefined ? values.grad : initialForm.grad}
                placeholder={translations.city || t('city')}
              />
              {errors.grad && <div className="text-red-500 text-sm mt-1">{errors.grad}</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="postanskiBroj">{translations.postal_code || t('postal_code')}</Label>
              <Input
                name="postanskiBroj"
                defaultValue={values.postanskiBroj !== undefined ? values.postanskiBroj : initialForm.postanskiBroj}
                placeholder={translations.postal_code || t('postal_code')}
              />
              {errors.postanskiBroj && <div className="text-red-500 text-sm mt-1">{errors.postanskiBroj}</div>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="adresa">{translations.address || t('address')}</Label>
              <Input
                name="adresa"
                defaultValue={values.adresa !== undefined ? values.adresa : initialForm.adresa}
                placeholder={translations.address || t('address')}
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
              {translations.sacuvaj_izmjene || 'Sačuvaj izmjene'}
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
  );
}

