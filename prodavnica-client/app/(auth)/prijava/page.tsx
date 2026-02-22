import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PrijavaForm from './PrijavaForm';

export const metadata: Metadata = {
  title: 'Prijava',
  description: 'Prijavite se na svoj nalog kako biste pristupili ekskluzivnim ponudama i upravljali svojim podacima.',
};

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
  const lang = await getLanguageFromCookies();
  const authMessages = getLocaleMessages(lang, 'auth');
  const tAuth = authMessages.login || {};

  const cookieStore = await cookies();
  const savedEmail = cookieStore.get('rememberMe')?.value || '';

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center mb-2 flex flex-col items-center">
            <Image
              src="/apple-touch-icon.png"
              width={70}
              height={70}
              alt="Prodavnica logo"
              priority
            />
            <CardTitle className="text-2xl font-bold">{tAuth.title || 'Prijava'}</CardTitle>
          </CardHeader>

          <CardContent>
            <PrijavaForm
              tAuth={tAuth}
              savedEmail={savedEmail}
              errorMessage={errorMessage}
              onRememberMe={setRememberMeCookie}
            />

            {/* Link na registraciju */}
            <div className="text-center mt-4">
              <p className="text-sm">
                {tAuth.noAccount || 'Nemate nalog?'}{' '}
                <Link
                  href="/registracija"
                  className="text-primary hover:underline font-medium"
                >
                  {tAuth.registerHere || 'Registrujte se'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

