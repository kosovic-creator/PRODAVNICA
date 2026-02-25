'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@prodavnica/ui";
import PrijavaForm from './PrijavaForm';
import { useI18n } from '@/app/components/I18nProvider';

interface PrijavaContentProps {
  savedEmail: string;
  errorMessage: string;
  onRememberMe: (email: string) => Promise<void>;
}

export default function PrijavaContent({
  savedEmail,
  errorMessage,
  onRememberMe,
}: PrijavaContentProps) {
  const { t } = useI18n();

  const tLogin = {
    title: t('auth', 'login.title') || 'Prijava',
    noAccount: t('auth', 'login.noAccount') || 'Nemate nalog?',
    registerHere: t('auth', 'login.registerHere') || 'Registrujte se',
  };

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center mb-2 flex flex-col items-center" suppressHydrationWarning>
            <CardTitle className="text-2xl font-bold" suppressHydrationWarning>{tLogin.title || 'Prijava'}</CardTitle>
          </CardHeader>

          <CardContent>
            <PrijavaForm
              savedEmail={savedEmail}
              errorMessage={errorMessage}
              onRememberMe={onRememberMe}
            />

            {/* Link na registraciju */}
            <div className="text-center mt-4">
              <p className="text-sm" suppressHydrationWarning>
                {tLogin.noAccount || 'Nemate nalog?'}{' '}
                <Link
                  href="/registracija"
                  className="text-primary hover:underline font-medium"
                >
                  {tLogin.registerHere || 'Registrujte se'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
