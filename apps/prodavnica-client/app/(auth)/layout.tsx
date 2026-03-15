import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  // Samo renderuj children, koristiće se automatski root layout
  return <>{children}</>;
}
