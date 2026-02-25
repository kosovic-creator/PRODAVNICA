'use client';

import React from 'react'
import { useI18n } from '@/app/components/I18nProvider';

const Test = () => {
  const { t } = useI18n();
  return (
    <div className="bg-cover bg-center bg-fixed min-h-screen"
         style={{ backgroundImage: "url('/spectrum-gradient.svg')" }}>

      <p className="text-4xl font-bold text-zinc-50 text-center pt-20">{t('home', 'welcome')}</p>
    </div>
  )
}

export default Test