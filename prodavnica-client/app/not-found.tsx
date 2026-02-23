"use client";

import Link from "next/link";
import { Button } from "@prodavnica/ui";
import { useLanguage } from '@/app/components/LanguageContext';
import { t } from '@/lib/translations';

export default function NotFoundClient() {
  const { lang } = useLanguage();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-100 to-gray-300">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 animate-bounce">
        {t(lang, 'notFound', 'page_not_found')}
      </h1>
      <Button variant='default' asChild size="lg">
        <Link href="/">
          {t(lang, 'notFound', 'back_to_home')}
        </Link>
      </Button>
    </main>
  );
}
