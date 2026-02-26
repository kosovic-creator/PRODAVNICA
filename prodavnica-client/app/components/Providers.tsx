'use client';

import React from 'react';
import AuthProvider from './AuthProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { Language } from '@/i18n/constants';

export function Providers({ children, initialLang = 'sr' }: { children: React.ReactNode; initialLang?: Language }) {
  return (
    <AuthProvider>
      <I18nProvider initialLang={initialLang}>
        {children}
      </I18nProvider>
    </AuthProvider>
  );
}
