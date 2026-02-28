'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { t } = useI18n();

  const pocetna = t('common', 'pocetna');

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
