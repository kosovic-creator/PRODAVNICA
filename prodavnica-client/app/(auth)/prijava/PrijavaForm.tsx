/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { Button } from "@prodavnica/ui";
import { Input } from "@prodavnica/ui";
import { Label } from "@prodavnica/ui";
import { Checkbox } from "@prodavnica/ui";
import { prijavaSchema } from '@/lib/validators';

interface PrijavaFormProps {
    tAuth: any;
    savedEmail: string;
    errorMessage: string;
    onRememberMe: (email: string) => Promise<void>;
}

export default function PrijavaForm({ tAuth, savedEmail, errorMessage, onRememberMe }: PrijavaFormProps) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const t = (key: string) => tAuth[key] || key;

    const validationSchema = prijavaSchema(t);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const lozinka = formData.get('lozinka') as string;
        const rememberMe = formData.get('rememberMe') === 'on';

        // Validacija sa zod shemom
        try {
            validationSchema.parse({ email, lozinka });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach(issue => {
                    const key = String(issue.path[0]);
                    newErrors[key] = issue.message;
                });
                setErrors(newErrors);
            }
            return;
        }

        // Set remember me cookie via server action
        if (rememberMe && email) {
            await onRememberMe(email);
        }

        // Sign in using next-auth
        const result = await signIn('credentials', {
            email,
            lozinka,
            redirect: false,
        });

        if (result?.error) {
            router.push('/prijava?error=Pogrešan email ili lozinka');
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={tAuth.emailPlaceholder || 'ime@primer.com'}
                  defaultValue={savedEmail}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                  required
              />
                {errors.email && touched.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
              <Label htmlFor="lozinka">{tAuth.password || 'Lozinka'}</Label>
              <Input
                  id="lozinka"
                  name="lozinka"
                  type="password"
                  placeholder={tAuth.passwordPlaceholder || '••••••••'}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={errors.lozinka ? 'border-red-500' : ''}
                  required
              />
                {errors.lozinka && touched.lozinka && (
                    <p className="text-red-500 text-sm">{errors.lozinka}</p>
                )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2">
              <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  defaultChecked={!!savedEmail}
              />
              <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                  {tAuth.rememberMe || 'Zapamti me'}
              </Label>
          </div>

          {/* Error Message */}
          {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {errorMessage}
              </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full font-medium">
              {tAuth.submit || 'Prijavi se'}
          </Button>
      </form>
  );
}
