'use client';

import React from 'react';
import AuthProvider from './AuthProvider';
import { LanguageProvider } from './LanguageContext';
import type { Language } from './LanguageContext';

export function Providers({ children, initialLang = 'sr' }: { children: React.ReactNode; initialLang?: Language }) {
  return (
    <AuthProvider>
      <LanguageProvider initialLang={initialLang}>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
}
