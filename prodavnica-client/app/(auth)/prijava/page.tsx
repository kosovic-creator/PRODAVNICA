import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import PrijavaForm from './PrijavaForm';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageFromCookies();
  const authMessages = getLocaleMessages(lang, 'auth');
  const title = authMessages.login?.title || 'Prijava';
  const description = lang === 'en'
    ? 'Sign in to your account to access exclusive offers and manage your personal information.'
    : 'Prijavite se na svoj nalog kako biste pristupili ekskluzivnim ponudama i upravljali svojim podacima.';

  return {
    title,
    description,
  };
}

async function setRememberMeCookie(email: string) {
  'use server';

  const cookieStore = await cookies();
  cookieStore.set('rememberMe', email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export default async function PrijavaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const errorMessage = params.error || '';

  const cookieStore = await cookies();
  const savedEmail = cookieStore.get('rememberMe')?.value || '';

  return (
    <PrijavaForm
      savedEmail={savedEmail}
      errorMessage={errorMessage}
      onRememberMe={setRememberMeCookie}
    />
  );
}