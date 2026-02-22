/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import SuccessMessage from "@/app/components/SuccessMessage";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { korisnikSchemaStatic } from "@/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEyeSlash, FaEye, FaSave, FaTimes } from "react-icons/fa";
import z from "zod";


type ClientKorisniciProps = {
  serverAction: (formData: FormData) => Promise<{ success: boolean }>;
};

export default function ClientKorisnici({ serverAction }: ClientKorisniciProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm({
    defaultValues: {
      ime: '',
      prezime: '',
      email: '',
      lozinka: '',
      uloga: 'admin',
      telefon: '',
      adresa: '',
      grad: '',
      drzava: '',
      postanskiBroj: '',
    }
  });

  // Validacija pojedinačnog polja pri blur event-u
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validira samo to jedno polje
    try {
      const fieldSchema = korisnikSchemaStatic.shape[name as keyof typeof korisnikSchemaStatic.shape];
      if (fieldSchema) {
        fieldSchema.parse(value || '');
        // Ako validacija prođe, ukloni grešku za to polje
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

  const onSubmit = async (values: any) => {
    setIsPending(true);
    try {
      korisnikSchemaStatic.parse(values);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value as string));
      const result = await serverAction(formData);
      if (result.success) {
        setSuccessMsg('Korisnik je uspješno kreiran!');
        setTimeout(() => {
          router.push('/korisnici');
        }, 2000);
      } else {
        form.setError('root', { message: 'Došlo je do greške pri kreiranju korisnika' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const allowedFields = [
          "ime", "prezime", "email", "telefon", "drzava", "grad",
          "postanskiBroj", "adresa", "uloga", "lozinka", "root"
        ] as const;

        type AllowedField = typeof allowedFields[number];

        error.issues.forEach((err) => {
          const field = err.path[0];
          if (allowedFields.includes(field as AllowedField)) {
            form.setError(field as AllowedField, { message: err.message });
          }
        });
      } else {
        form.setError('root', { message: 'Došlo je do greške pri kreiranju korisnika' });
      }
    } finally {
      setIsPending(false);
    }
  };

  // Move errors state here, before return
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  return (
    <div className="flex justify-center items-start min-h-screen py-8">
      <Label htmlFor="lozinka" className="block text-sm font-medium text-gray-700 mb-1">
        {successMsg && <SuccessMessage message={successMsg} />}
      </Label>
      {/* If you want to show general errors, ensure errors.general exists */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white border rounded-lg p-6">
          {/* Osnovne informacije */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Osnovne informacije</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ime" className="block text-sm font-medium text-gray-700 mb-1">
                  <FormField
                    control={form.control}
                    name="ime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ime *</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </label>
                <label htmlFor="prezime" className="block text-sm font-medium text-gray-700 mb-1">
                  Prezime *
                </label>
                <Input
                  type="text"
                  id="prezime"
                  name="prezime"
                  required
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.prezime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.prezime && <p className="mt-1 text-sm text-red-600">{errors.prezime}</p>}
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lozinka"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lozinka *</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input {...field} type={showPassword ? "text" : "password"} required className="pr-10" />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        variant="ghost"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FaEye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uloga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uloga</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Odaberite ulogu" />
                        </SelectTrigger>
                      </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> {/* Kraj grid-a */}
          </div> {/* Kraj mb-6 */}
          {/* Action buttons */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={isPending}
             
            >
              <FaSave className="w-4 h-4" />
              {isPending ? 'Kreiram...' : 'Kreiraj korisnika'}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              Otkaži
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

