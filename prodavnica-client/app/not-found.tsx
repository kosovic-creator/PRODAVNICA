"use client";

import Link from "next/link";
import { Button } from "@prodavnica/ui";
import { useI18n } from '@/app/components/I18nProvider';

export default function NotFoundClient() {
  const { t } = useI18n();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-100 to-gray-300">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 animate-bounce">
        {t('notFound', 'page_not_found')}
      </h1>
      <Button variant='default' asChild size="lg">
        <Link href="/">
          {t('notFound', 'back_to_home')}
        </Link>
      </Button>
    </main>
  );
}
