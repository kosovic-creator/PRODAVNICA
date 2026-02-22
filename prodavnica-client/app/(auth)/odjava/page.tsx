/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useLanguage } from '@/app/components/LanguageContext';
import { getNamespace } from '@/lib/translations';

export default function OdjavaPage() {
  const { lang } = useLanguage();
  const t = getNamespace(lang, 'auth');

  useEffect(() => {
    signOut({ callbackUrl: "/prijava" });
  }, []);

  return (
    <div className="flex items-center justify-center h-32 gap-2 text-blue-700 font-semibold">
      <FaSignOutAlt className="text-2xl" />
      <span>{t['logout.Odjavljujem se'] || 'Odjavljujem se...'}</span>
    </div>
  );
}