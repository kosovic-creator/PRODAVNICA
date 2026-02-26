'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import { useState, useEffect } from 'react';
import type { Language } from '@/i18n/constants';

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
  initialLang?: Language;
}

export default function Breadcrumbs({ items, initialLang }: BreadcrumbsProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  // For SSR/hydration, use initialLang prop to ensure consistency
  // After mount, use reactive i18n translation
  const pocetna = mounted
    ? t('common', 'pocetna')
    : initialLang === 'en' ? 'HOME' : 'POČETNA';

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 overflow-x-auto">
      <Link href="/" className="text-gray-600 hover:text-gray-900 whitespace-nowrap uppercase font-medium">
        {pocetna}
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-gray-900 whitespace-nowrap uppercase font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 whitespace-nowrap uppercase font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
