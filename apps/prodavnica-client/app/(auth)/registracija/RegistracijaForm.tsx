/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useActionState } from 'react';
import { handleRegistracijaAction } from './handleRegistracijaAction';
import SuccessMessage from '@/app/components/SuccessMessage';
import { Button } from "@prodavnica/ui";
import { Input } from "@prodavnica/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@prodavnica/ui";
import { Label } from "@prodavnica/ui";

interface RegistracijaFormProps {
  translations: Record<string, string>;
}

export default function RegistracijaFormNew({ translations }: RegistracijaFormProps) {
  const t = (key: string) => translations[key] || key;
  const [state, formAction, pending] = useActionState(
    async (_: any, formData: FormData) => {
      return await handleRegistracijaAction(formData);
    },
    { errors: {}, success: false },
  );
  const errors: Record<string, string | undefined> = state.errors || {};

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center mb-2 flex flex-col items-center">
            <CardTitle className="text-2xl font-bold">{t('register.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {state.success && (
              <SuccessMessage
                message={t('register_success') || 'Uspešno ste se registrovali. Preusmeravanje na stranicu za prijavu...'}
                redirectTo="/prijava"
                redirectDelay={2000}
              />
            )}
            <form action={formAction} className="space-y-4">
              <Input type="hidden" name="uloga" value="korisnik" />
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t('register.email')}
                  disabled={pending}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lozinka">{t('register.password')}</Label>
                <Input
                  id="lozinka"
                  name="lozinka"
                  type="password"
                  required
                  placeholder={t('register.password')}
                  disabled={pending}
                />
                {errors.lozinka && <p className="text-sm text-red-600">{errors.lozinka}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="potvrdaLozinke">{t('register.confirm_password')}</Label>
                <Input
                  id="potvrdaLozinke"
                  name="potvrdaLozinke"
                  type="password"
                  required
                  placeholder={t('register.confirm_password')}
                  disabled={pending}
                />
                {errors.potvrdaLozinke && <p className="text-sm text-red-600">{errors.potvrdaLozinke}</p>}
              </div>
              {errors.global && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{errors.global}</div>}
              <Button type="submit" className="w-full font-medium" disabled={pending}>
                {pending ? t('register.loading') || 'Registracija...' : t('register.submit') || 'Registruj se'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
