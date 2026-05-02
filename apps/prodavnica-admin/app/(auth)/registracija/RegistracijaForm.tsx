"use client";
import SuccessMessage from '../../components/SuccessMessage';
import React from 'react';
import { useActionState } from 'react';
import { FaUserPlus, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Input } from "@prodavnica/ui";
import { registracijaSchema } from '@/zod';

export function RegistracijaFormComponent() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: { success: boolean; errors: Record<string, string> }, formData: FormData) => {
      const data = {
        email: formData.get('email') as string,
        ime: formData.get('ime') as string,
        prezime: formData.get('prezime') as string,
        lozinka: formData.get('lozinka') as string,
        potvrdaLozinke: formData.get('potvrdaLozinke') as string,
      };
      // Zod validacija na serveru
      const result = registracijaSchema.safeParse(data);
      const errors: Record<string, string> = {};
      if (!result.success) {
        for (const err of result.error.issues) {
          errors[String(err.path[0])] = err.message;
        }
      }
      if (data.lozinka !== data.potvrdaLozinke) {
        errors.potvrdaLozinke = 'Lozinke se ne poklapaju';
      }
      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }
      // Poziv server action
      const response = await fetch('/api/registracija', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          ime: data.ime,
          prezime: data.prezime,
          lozinka: data.lozinka,
        }),
      });
      const res = await response.json();
      if (res.success) {
        return { success: true, errors: {} };
      } else if (res.error === 'Korisnik sa ovom email adresom već postoji' || res.error === 'email_exists') {
        return { success: false, errors: { email: 'Email je već registrovan' } };
      } else {
        return { success: false, errors: { form: res.error || 'Došlo je do greške pri registraciji' } };
      }
    },
    { success: false, errors: {} }
  );

  const getInputClass = (fieldName: string) => {
    const errors = state.errors as Record<string, string>;
    const hasError = errors[fieldName];
    return `w-full px-3 py-2 border rounded-md input-focus transition-colors !input-focus!ring-0 ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center">
          <FaUserPlus className="text-lg shrink-0" />
          Registracija
        </h1>

        {state.success && <SuccessMessage message="Uspješna registracija!" type="success" />}
        {state.errors.form && <SuccessMessage message={state.errors.form} type="error" />}

        <form action={formAction} className="space-y-4">
          {/* Email */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${typeof state.errors === 'object' && 'email' in state.errors && state.errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`}>
              <FaEnvelope className="text-lg shrink-0" />
              <Input
                id="email"
                name="email"
                type="email"
                // required
                className={getInputClass('email')}
                placeholder='email'
                aria-invalid={typeof state.errors === 'object' && 'email' in state.errors ? !!state.errors.email : false}
                disabled={isPending}
              />
            </div>
            {typeof state.errors === 'object' && 'email' in state.errors && state.errors.email && (
              <p className="text-red-600 text-sm mt-1">{state.errors.email}</p>
            )}
          </div>

          {/* Ime */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${typeof state.errors === 'object' && 'ime' in state.errors && state.errors.ime ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`}>
              <FaUser className="text-lg shrink-0" />
              <Input
                id="ime"
                name="ime"
                type="text"
                // required
                className={getInputClass('ime')}
                placeholder='ime'
                aria-invalid={typeof state.errors === 'object' && 'ime' in state.errors ? !!state.errors.ime : false}
                disabled={isPending}
              />
            </div>
            {typeof state.errors === 'object' && 'ime' in state.errors && state.errors.ime && (
              <p className="text-red-600 text-sm mt-1">{state.errors.ime}</p>
            )}
          </div>

          {/* Prezime */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${typeof state.errors === 'object' && 'prezime' in state.errors && state.errors.prezime ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`}>
              <FaUser className="text-lg shrink-0" />
              <Input
                id="prezime"
                name="prezime"
                type="text"
                // required
                className={getInputClass('prezime')}
                placeholder='prezime'
                aria-invalid={typeof state.errors === 'object' && 'prezime' in state.errors ? !!state.errors.prezime : false}
                disabled={isPending}
              />
            </div>
            {typeof state.errors === 'object' && 'prezime' in state.errors && state.errors.prezime && (
              <p className="text-red-600 text-sm mt-1">{state.errors.prezime}</p>
            )}
          </div>

          {/* Lozinka */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${typeof state.errors === 'object' && 'lozinka' in state.errors && state.errors.lozinka ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`}>
              <FaLock className="text-lg shrink-0" />
              <Input
                id="lozinka"
                name="lozinka"
                type="password"
                // required
                className={getInputClass('lozinka')}
                placeholder='lozinka'
                aria-invalid={typeof state.errors === 'object' && 'lozinka' in state.errors ? !!state.errors.lozinka : false}
                disabled={isPending}
              />
            </div>
            {typeof state.errors === 'object' && 'lozinka' in state.errors && state.errors.lozinka && (
              <p className="text-red-600 text-sm mt-1">{state.errors.lozinka}</p>
            )}
          </div>

          {/* Potvrda Lozinke */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${typeof state.errors === 'object' && 'potvrdaLozinke' in state.errors && state.errors.potvrdaLozinke ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`}>
              <FaLock className="text-lg shrink-0" />
              <Input
                id="potvrdaLozinke"
                name="potvrdaLozinke"
                type="password"
                // required
                className={getInputClass('potvrdaLozinke')}
                placeholder='potvrdi lozinku'
                aria-invalid={typeof state.errors === 'object' && 'potvrdaLozinke' in state.errors ? !!state.errors.potvrdaLozinke : false}
                disabled={isPending}
              />
            </div>
            {typeof state.errors === 'object' && 'potvrdaLozinke' in state.errors && state.errors.potvrdaLozinke && (
              <p className="text-red-600 text-sm mt-1">{state.errors.potvrdaLozinke}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? 'Registrujem...' : 'Registruj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
