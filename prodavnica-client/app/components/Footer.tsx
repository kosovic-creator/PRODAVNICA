'use client';

import { HydrationGuard } from './HydrationGuard';
import FooterStatic from './FooterStatic';
import FooterContent from './FooterContent';

const Footer = () => {
  return (
    <footer className="mt-auto bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-300 border-t-4 border-amber-500">
      {/* Lokalizovana verzija nakon hidratacije */}
      <HydrationGuard fallback={<FooterStatic />}>
        <FooterContent />
      </HydrationGuard>
    </footer>
  );
};

export default Footer;
