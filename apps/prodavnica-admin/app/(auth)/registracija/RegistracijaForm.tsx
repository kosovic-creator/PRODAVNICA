'use client';

import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { RegistracijaMessage } from './RegistracijaMessage';
import { Input } from "@prodavnica/ui";
import { Button } from "@prodavnica/ui";
import Link from 'next/link';
import { registracijaSchema } from '@/zod';
import { z } from 'zod';

interface RegistracijaFormComponentProps {
  errorParam?: string | string[];
  successParam?: string | string[];
}

export function RegistracijaFormComponent({
  errorParam,
  successParam
}: RegistracijaFormComponentProps) {
  const [formData, setFormData] = useState({
    email: '',
    ime: '',
    prezime: '',
    lozinka: '',
    potvrdaLozinke: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  // Real-time validation
  const validateField = (name: string, value: string) => {
    const fieldErrors: Record<string, string> = { ...errors };

    if (name === 'email') {
      if (!value) {
        fieldErrors.email = 'Email je obavezan';
      } else if (!z.string().email().safeParse(value).success) {
        fieldErrors.email = 'Neispravan email format';
      } else {
        delete fieldErrors.email;
      }
    }

    if (name === 'ime') {
      if (!value) {
        fieldErrors.ime = 'Ime je obavezno';
      } else if (value.length < 2) {
        fieldErrors.ime = 'Ime mora imati najmanje 2 karaktera';
      } else {
        delete fieldErrors.ime;
      }
    }

    if (name === 'prezime') {
      if (!value) {
        fieldErrors.prezime = 'Prezime je obavezno';
      } else if (value.length < 2) {
        fieldErrors.prezime = 'Prezime mora imati najmanje 2 karaktera';
      } else {
        delete fieldErrors.prezime;
      }
    }

    if (name === 'lozinka') {
      if (!value) {
        fieldErrors.lozinka = 'Lozinka je obavezna';
      } else if (value.length < 6) {
        fieldErrors.lozinka = 'Lozinka mora imati najmanje 6 karaktera';
      } else {
        delete fieldErrors.lozinka;
      }
      // Also validate confirmation if it's filled
      if (formData.potvrdaLozinke && value !== formData.potvrdaLozinke) {
        fieldErrors.potvrdaLozinke = 'Lozinke se ne poklapaju';
      } else if (formData.potvrdaLozinke && value === formData.potvrdaLozinke) {
        delete fieldErrors.potvrdaLozinke;
      }
    }

    if (name === 'potvrdaLozinke') {
      if (!value) {
        fieldErrors.potvrdaLozinke = 'Potvrda lozinke je obavezna';
      } else if (value !== formData.lozinka) {
        fieldErrors.potvrdaLozinke = 'Lozinke se ne poklapaju';
      } else {
        delete fieldErrors.potvrdaLozinke;
      }
    }

    setErrors(fieldErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (fieldTouched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    setFieldTouched({
      email: true,
      ime: true,
      prezime: true,
      lozinka: true,
      potvrdaLozinke: true,
    });

    // Final validation
    const result = registracijaSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      for (const err of result.error.issues) {
        newErrors[String(err.path[0])] = err.message;
      }

      // Check password match
      if (formData.lozinka !== formData.potvrdaLozinke) {
        newErrors.potvrdaLozinke = 'Lozinke se ne poklapaju';
      }

      setErrors(newErrors);
      return;
    }

    // Check password confirmation
    if (formData.lozinka !== formData.potvrdaLozinke) {
      setErrors(prev => ({
        ...prev,
        potvrdaLozinke: 'Lozinke se ne poklapaju'
      }));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/registracija', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          ime: formData.ime,
          prezime: formData.prezime,
          lozinka: formData.lozinka,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect after success
        window.location.href = '/registracija?success=1';
      } else if (data.error === 'Korisnik sa ovom email adresom već postoji') {
        setErrors({ email: 'Email je već registrovan' });
      } else {
        setErrors({ form: data.error || 'Došlo je do greške pri registraciji' });
      }
    } catch (error) {
      console.error('Greška pri registraciji:', error);
      setErrors({ form: 'Došlo je do greške pri registraciji' });
    } finally {
      setIsLoading(false);
    }
  };

  const errorMessage =
    errorParam === 'email_exists'
      ? 'Email je već registrovan.'
      : errorParam === 'validation'
        ? 'Neispravni podaci. Molimo proverite sva polja.'
        : errorParam
          ? 'Došlo je do greške pri registraciji.'
          : null;

  const getInputClass = (fieldName: string) => {
    const hasError = fieldTouched[fieldName] && errors[fieldName];
    return `w-full px-3 py-2 border rounded-md input-focus transition-colors !input-focus!ring-0 ${
      hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
    }`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center">
          <FaUserPlus className="text-lg shrink-0" />
          Registracija
        </h1>

        {successParam && <RegistracijaMessage type="success" message="Uspješna registracija!" />}
        {errorMessage && <RegistracijaMessage type="error" message={errorMessage} />}
        {errors.form && <RegistracijaMessage type="error" message={errors.form} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${
              fieldTouched.email && errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
            }`}>
              <FaEnvelope className="text-lg shrink-0" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass('email')}
                placeholder='email'
                disabled={isLoading}
              />
            </div>
            {fieldTouched.email && errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Ime */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${
              fieldTouched.ime && errors.ime ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
            }`}>
              <FaUser className="text-lg shrink-0" />
              <Input
                id="ime"
                name="ime"
                type="text"
                value={formData.ime}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass('ime')}
                placeholder='ime'
                disabled={isLoading}
              />
            </div>
            {fieldTouched.ime && errors.ime && (
              <p className="text-red-600 text-sm mt-1">{errors.ime}</p>
            )}
          </div>

          {/* Prezime */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${
              fieldTouched.prezime && errors.prezime ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
            }`}>
              <FaUser className="text-lg shrink-0" />
              <Input
                id="prezime"
                name="prezime"
                type="text"
                value={formData.prezime}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass('prezime')}
                placeholder='prezime'
                disabled={isLoading}
              />
            </div>
            {fieldTouched.prezime && errors.prezime && (
              <p className="text-red-600 text-sm mt-1">{errors.prezime}</p>
            )}
          </div>

          {/* Lozinka */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${
              fieldTouched.lozinka && errors.lozinka ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
            }`}>
              <FaLock className="text-lg shrink-0" />
              <Input
                id="lozinka"
                name="lozinka"
                type="password"
                value={formData.lozinka}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass('lozinka')}
                placeholder='lozinka'
                disabled={isLoading}
              />
            </div>
            {fieldTouched.lozinka && errors.lozinka && (
              <p className="text-red-600 text-sm mt-1">{errors.lozinka}</p>
            )}
          </div>

          {/* Potvrda Lozinke */}
          <div>
            <div className={`flex items-center gap-3 border p-3 rounded-lg transition-colors ${
              fieldTouched.potvrdaLozinke && errors.potvrdaLozinke ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
            }`}>
              <FaLock className="text-lg shrink-0" />
              <Input
                id="potvrdaLozinke"
                name="potvrdaLozinke"
                type="password"
                value={formData.potvrdaLozinke}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass('potvrdaLozinke')}
                placeholder='potvrdi lozinku'
                disabled={isLoading}
              />
            </div>
            {fieldTouched.potvrdaLozinke && errors.potvrdaLozinke && (
              <p className="text-red-600 text-sm mt-1">{errors.potvrdaLozinke}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Link
              href="/prijava"
              className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Otkaži
            </Link>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? 'Registrovanje...' : 'Registruj'}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Već imate nalog?{' '}
          <Link href="/prijava" className="text-blue-600 hover:underline">
            Prijava
          </Link>
        </div>
      </div>
    </div>
  );
}
