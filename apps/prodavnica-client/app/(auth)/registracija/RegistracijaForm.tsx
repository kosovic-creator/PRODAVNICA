/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import SuccessMessage from '@/app/components/SuccessMessage';
import { regKorisnikSchema } from '@/lib/validators';
import { Button } from "@prodavnica/ui";
import { Input } from "@prodavnica/ui";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@prodavnica/ui";
import { Label } from "@prodavnica/ui";
import { useI18n } from '@/i18n/I18nProvider';


export interface RegistracijaFormProps {
  initialValues: {
    email: string;
    lozinka: string;
    uloga: string;
    potvrdaLozinke: string;
  };
  errorMap: Record<string, string>;
  valueMap: Record<string, string>;
  errorParam?: string;
  successParam?: string;
  successEmail?: string;
  posta?: string;
  formAction: (formData: FormData) => Promise<void>; // <-- Add this line
}

export default function RegistracijaForm({
  initialValues,
  errorMap,
  valueMap,
  errorParam,
  successParam,
  successEmail,
  posta,
  formAction,
}: RegistracijaFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>(errorMap);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [localSuccessEmail, setLocalSuccessEmail] = useState<string>(successEmail || '');
  const [localEmail, setLocalEmail] = useState<string>('');
  const [localLozinka, setLocalLozinka] = useState<string>('');
  const [localPotvrdaLozinke, setLocalPotvrdaLozinke] = useState<string>('');
  const router = useRouter();
  const { t: i18nT } = useI18n();

  const { pending } = useFormStatus();

  const t = (key: string) => i18nT('auth', `register.${key}`);

  const validationSchema = regKorisnikSchema(t).pick({
    email: true,
    lozinka: true
  }).extend({
    potvrdaLozinke: regKorisnikSchema(t).shape.lozinka
  });
  // Removed unnecessary useEffect for localPosta
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
  // dodajanje provere poklapanja lozinki i email pri blur validaciji
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);

    // Dodatna validacija za potvrdaLozinke
    if (name === 'potvrdaLozinke' || name === 'lozinka') {
      const form = e.target.form;
      if (form) {
        const lozinka = (form.elements.namedItem('lozinka') as HTMLInputElement)?.value;
        const potvrdaLozinke = (form.elements.namedItem('potvrdaLozinke') as HTMLInputElement)?.value;

        if (potvrdaLozinke && lozinka !== potvrdaLozinke) {
          setErrors(prev => ({ ...prev, potvrdaLozinke: t('passwords_do_not_match') || 'Lozinke se ne poklapaju' }));
        } else if (lozinka === potvrdaLozinke) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.potvrdaLozinke;
            return newErrors;
          });
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (touched[name]) {
      validateField(name, value);
    }

    // Real-time validacija za poklapanje lozinki
    if (name === 'potvrdaLozinke' || name === 'lozinka') {
      const form = e.target.form;
      if (form && touched.potvrdaLozinke) {
        const lozinka = (form.elements.namedItem('lozinka') as HTMLInputElement)?.value;
        const potvrdaLozinke = (form.elements.namedItem('potvrdaLozinke') as HTMLInputElement)?.value;

        if (potvrdaLozinke && lozinka !== potvrdaLozinke) {
          setErrors(prev => ({ ...prev, potvrdaLozinke: t('passwords_do_not_match') || 'Lozinke se ne poklapaju' }));
        } else if (lozinka === potvrdaLozinke) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.potvrdaLozinke;
            return newErrors;
          });
        }
      }
    }
  };

  // Lokalno stanje za prikaz greške
  const [showError, setShowError] = useState<boolean>(!!errorParam || !!errors.global);

  // Kada se promeni errorParam ili errors.global, ažuriraj showError SAMO PRVI PUT
  useEffect(() => {
    if (!!errorParam || !!errors.global) setShowError(true);
    // eslint-disable-next-line
  }, []); // prazna lista zavisnosti - samo na mount

  useEffect(() => {
    setLocalEmail(initialValues.email || '');
    setLocalLozinka(initialValues.lozinka || '');
    setLocalPotvrdaLozinke(initialValues.potvrdaLozinke || '');
  }, [initialValues]);

  const handleTryAgain = () => {
    setErrors({});
    setLocalEmail('');
    setLocalLozinka('');
    setLocalPotvrdaLozinke('');
    setTouched({});
    setShowError(false); // Sakrij grešku i omogući polja
  };

  const showLocalError = !!errorParam || !!errors.global;

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center mb-2 flex flex-col items-center">
            {/* Success Message */}
            {successParam === 'true' && (
              <SuccessMessage message={t('register_success') || 'Uspešno ste se registrovali. Preusmeravanje na stranicu za prijavu...'} />
            )}
            {/* Error Messages */}
            {showError && (
              <>
                {errors.global ? (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {errors.global}
                  </div>
                ) : errorParam === 'email_exists' ? (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {t('email_exists') || 'Email je već registrovan.'}
                  </div>
                ) : errorParam ? (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {t('error_occurred') || 'Došlo je do greške pri registraciji.'}
                  </div>
                ) : null}
              </>
            )}
            {/* <Image
              src='/apple-touch-icon.png'
              width={70}
              height={70}
              alt="Prodavnica logo"
              priority={true}
            /> */}
            <CardTitle className="text-2xl font-bold" suppressHydrationWarning>{t('title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <Input type="hidden" name="uloga" value="korisnik" />

              {/* Email Input */}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t('email')}
                  value={localEmail}
                  onChange={e => {
                    setLocalEmail(e.target.value);
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  disabled={showError}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <Label htmlFor="lozinka" suppressHydrationWarning>{t('password')}</Label>
                <Input
                  id="lozinka"
                  name="lozinka"
                  type="password"
                  required
                  placeholder={t('password')}
                  value={localLozinka}
                  onChange={e => {
                    setLocalLozinka(e.target.value);
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  disabled={showError}
                />
                {errors.lozinka && (
                  <p className="text-sm text-red-600">{errors.lozinka}</p>
                )}
              </div>


              {/* Confirm Password Input */}
              <div className="space-y-1">
                <Label htmlFor="potvrdaLozinke" suppressHydrationWarning>{t('confirm_password')}</Label>
                <Input
                  id="potvrdaLozinke"
                  name="potvrdaLozinke"
                  type="password"
                  required
                  placeholder={t('confirm_password')}
                  value={localPotvrdaLozinke}
                  onChange={e => {
                    setLocalPotvrdaLozinke(e.target.value);
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  disabled={showError}
                />
                {errors.potvrdaLozinke && (
                  <p className="text-sm text-red-600">{errors.potvrdaLozinke}</p>
                )}
              </div>

              {/* Submit or Try Again Button */}
              {showError ? (
                <Button
                  type="button"
                  className="w-full font-medium"
                  onClick={handleTryAgain}
                  suppressHydrationWarning
                >
                  {t('try_again') || 'Pokušaj ponovo'}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full font-medium"
                  disabled={pending}
                    suppressHydrationWarning
                >
                  {pending ? t('loading') || 'Registracija...' : t('submit')}
                </Button>
              )}

              {/* Link ka prijavi */}
              <div className="text-center">
                <p className="text-sm" suppressHydrationWarning>
                  {t('have_account') || 'Već imate nalog?'}{' '}
                  <Link
                    href="/prijava"
                    className="text-primary hover:underline font-medium transition-colors hover:text-blue-600"
                  >
                    {t('login_link') || 'Prijavite se'}
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>


        </Card>
      </div>
    </div>
  );
}
