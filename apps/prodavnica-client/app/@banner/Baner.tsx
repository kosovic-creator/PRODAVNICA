'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export default function Baner() {
  const { t } = useI18n();
  const [bannerCurrent, setBannerCurrent] = useState(0);
  const bannerImages = ['/slike-proizvoda/p2-1-converted-from-jpg-2.png', '/slike-proizvoda/p6-1.png', '/slike-proizvoda/kolaž.png'];

  // Lokalizovani banner tituli
  const bannerTitles = useMemo(() => {
    return [
      t('home', 'banner_new_collection'),
      t('home', 'banner_summer_fashion'),
      t('home', 'banner_premium_choice'),
    ];
  }, [t]);

  useEffect(() => {
    if (bannerImages.length > 1) {
      const timer = setInterval(() => {
        setBannerCurrent((prev) => (prev + 1) % bannerImages.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [bannerImages.length]);

  return (
    <div className="w-full h-64 sm:h-96 relative overflow-hidden bg-linear-to-b from-gray-900 to-white">
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Left side - Text and Button */}
        <div className="flex flex-col justify-center z-10 max-w-md">
          <p className="text-gray-300 text-sm sm:text-base uppercase tracking-wider mb-2" suppressHydrationWarning>
            {t('home', 'banner_popular_products')}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 line-clamp-2" suppressHydrationWarning>
            {bannerTitles[bannerCurrent] || '...'}
          </h2>
          <Link href="/proizvodi">
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-2xl transition duration-300 w-fit" suppressHydrationWarning>
              {t('home', 'banner_view_products')}
            </button>
          </Link>
        </div>

        {/* Right side - Product Image */}
        <div className="flex-1 flex items-center justify-end h-full relative">
          <Image
            src={bannerImages[bannerCurrent]}
            alt="Product banner"
            width={900}
            height={900}
            className="h-full w-auto object-contain drop-shadow-2xl transition-opacity duration-700"
            sizes="(max-width: 640px) 40vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {bannerImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setBannerCurrent(idx)}
            className={`w-2 h-2 rounded-full transition ${idx === bannerCurrent ? 'bg-white w-6' : 'bg-gray-400'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
