/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useI18n } from '@/app/components/I18nProvider';

export default function OdjavaPage() {
  const { t } = useI18n();

  useEffect(() => {
    signOut({ callbackUrl: "/prijava" });
  }, []);

  return (
    <div className="flex items-center justify-center h-32 gap-2 text-blue-700 font-semibold">
      <FaSignOutAlt className="text-2xl" />
      <span>{t('auth', 'logout.Odjavljujem se') || 'Odjavljujem se...'}</span>
    </div>
  );
}