import { regKorisnikSchema } from '@/lib/validators';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import RegistracijaContent from './RegistracijaContent';
import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import prisma from '@/lib/prisma';
import { createKorisnik } from '@/lib/actions/korisnici';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageFromCookies();
  const authMessages = getLocaleMessages(lang, 'auth');
  const title = authMessages.register?.title || 'Registracija';
  const description = lang === 'en'
    ? 'Create a new account to start shopping and enjoy exclusive offers from our store.'
    : 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.';

  return {
    title,
    description,
  };
}


export default async function RegistracijaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const errorParam = params?.error as string | undefined;
  const successParam = params?.success as string | undefined;
  const successEmail = params?.email as string | undefined;

  // Koristi cookie-based lokalizaciju
  const lang = await getLanguageFromCookies();
  const tAuth = getLocaleMessages(lang, 'auth');


  const initialValues = {
    email: '',
    lozinka: '',
    uloga: 'korisnik',
    potvrdaLozinke: ''
  };

  // Server action za validaciju i submit, koristi podatke iz forme
  async function handleSubmit(formData: FormData) {
    'use server';
    // Koristi cookie-based lokalizaciju
    const lang = await getLanguageFromCookies();
    const tAuth = getLocaleMessages(lang, 'auth');
    const t = (key: string) => tAuth.register[key] || key;

    const email = formData.get('email') as string;
    const lozinka = formData.get('lozinka') as string;
    const potvrdaLozinke = formData.get('potvrdaLozinke') as string;
    const uloga = formData.get('uloga') as string;

    console.log('📋 Form submission - Raw values:', {
      email: email || 'EMPTY',
      lozinka: lozinka ? `${lozinka.length} chars` : 'EMPTY',
      potvrdaLozinke: potvrdaLozinke ? `${potvrdaLozinke.length} chars` : 'EMPTY',
      uloga
    });

    const values = {
      email,
      lozinka,
      potvrdaLozinke,
      uloga,
    };

    // Validacija
    const schema = regKorisnikSchema(t).pick({ email: true, lozinka: true });
    const result = schema.safeParse(values);
    if (!result.success) {
      console.error('❌ Validation failed:', result.error.issues);
      const params = new URLSearchParams();
      result.error.issues.forEach((err) => {
        if (err.path[0]) params.append(`err_${String(err.path[0])}`, err.message);
      });
      Object.entries(values).forEach(([k, v]) => params.append(`val_${k}`, v ?? ''));
      redirect(`/registracija?${params.toString()}`);
    }

    if (values.lozinka !== values.potvrdaLozinke) {
      console.error('❌ Passwords do not match');
      const params = new URLSearchParams();
      params.append('err_potvrdaLozinke', t('passwords_do_not_match'));
      Object.entries(values).forEach(([k, v]) => params.append(`val_${k}`, v ?? ''));
      redirect(`/registracija?${params.toString()}`);
    }

    // Provera da li email već postoji
    const existing = await prisma.korisnik.findUnique({
      where: { email: values.email }
    });
    if (existing) {
      console.warn('⚠️  Email already exists:', values.email);
      redirect(`/registracija?error=email_exists`);
    }

    console.log('🚀 Calling createKorisnik with email:', values.email, 'lozinka length:', values.lozinka.length);
    // Upis korisnika u bazu preko server action funkcije
    const createResult = await createKorisnik({
      email: values.email,
      lozinka: values.lozinka,
    });

    console.log('📝 createKorisnik result:', { success: createResult.success, error: createResult.error });

    if (!createResult.success) {
      console.error('❌ createKorisnik failed:', createResult.error);
      const params = new URLSearchParams();
      params.append('err_global', createResult.error || 'Greška pri kreiranju korisnika');
      Object.entries(values).forEach(([k, v]) => params.append(`val_${k}`, v ?? ''));
      redirect(`/registracija?${params.toString()}`);
    }

    console.log('✅ Registration successful, redirecting...');
    redirect(`/registracija?success=true&email=${encodeURIComponent(values.email)}`);
  }

  const errorMap: Record<string, string> = {};
  const valueMap: Record<string, string> = {};

  if (typeof params === 'object' && params) {
    Object.entries(params).forEach(([k, v]) => {
      if (k.startsWith('err_')) errorMap[k.replace('err_', '')] = v as string;
      if (k.startsWith('val_')) valueMap[k.replace('val_', '')] = v as string;
    });
  }



  // Proverava da li je korisnik ulogovan
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;
  const email = session?.user?.email || null;

  if (isLoggedIn) {
    // Preusmeravanje u zavisnosti od uloge
    return redirect(`/profil?email=${encodeURIComponent(email || '')}`);
  }

  return (
    <RegistracijaContent
      initialValues={initialValues}
      errorMap={errorMap}
      valueMap={valueMap}
      errorParam={errorParam}
      successParam={successParam}
      successEmail={successEmail}
      formAction={handleSubmit}
    />
  );
}