'use client';

import { ReactNode } from 'react';
import { useI18n } from './I18nProvider';

/**
 * HydrationGuard komponenta čeka dok se i18n hidratizuje prije nego što rendira
 * Sprečava hydration mismatch greške kada je sadržaj translacijski zavisan
 */
export function HydrationGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { isHydrated } = useI18n();

  if (!isHydrated) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
