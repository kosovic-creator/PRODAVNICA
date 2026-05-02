'use client';

import React from 'react';
import AuthProvider from './AuthProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { Language } from '@/i18n/constants';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './KorpaContext';
import LayoutWrapper from './LayoutWrapper';

export function Providers({ children, initialLang = 'sr' }: { children: React.ReactNode; initialLang?: Language }) {
  return (
    <AuthProvider>
      <I18nProvider initialLang={initialLang}>
        <CartProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </CartProvider>
      </I18nProvider>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
