"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "./KorpaContext";
import { useSession } from "next-auth/react";
import { useI18n } from '@/i18n/I18nProvider';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaBars, FaUserCircle } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { Button } from "@prodavnica/ui";
import { Input } from "@prodavnica/ui"

export interface NavbarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen }) => {
  const { language, setLanguage, t } = useI18n();
  const tr = (key: string) => t('navbar', key);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const { brojUKorpi } = useCart();
  const badgeCount = brojUKorpi;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const handleLangSwitch = () => {
    const newLang = language === 'sr' ? 'en' : 'sr';
    setLanguage(newLang);
    // Bez router.refresh() - stanje se ažurira kroz I18nProvider
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-900 text-white" suppressHydrationWarning>
        {(
          <>
            {/* Left Section - Hamburger + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button variant="ghost"
                className="px-2 py-2 sm:px-3 focus:outline-none rounded-lg hover:bg-gray-700 touch-manipulation transition-colors"
                onClick={() => setSidebarOpen?.(true)}
                aria-label="Otvori meni"
              >
                <FaBars className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </Button>
              <Button variant="ghost"
                className="px-2 py-2 sm:px-3 focus:outline-none rounded-lg hover:bg-gray-700 transition-colors"
                asChild
              >
                <Link href="/">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-amber-100" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </Link>
              </Button>
            </div>
            {/* Center Section - Desktop Search */}
            <div className="hidden lg:flex w-full max-w-md mx-2 sm:mx-4">
              <form action="/proizvodi" method="get" className="flex items-center w-full relative" suppressHydrationWarning>
                <Input
                  type="text"
                  name="search"
                  className="flex-1 border rounded-full px-4 py-2 pr-12 bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:outline-none focus:border-red-500"
                  placeholder={tr('search')}
                  suppressHydrationWarning
                />
                <Button type="submit" className="absolute right-3 bg-transparent hover:bg-transparent text-gray-500 border-none p-0" suppressHydrationWarning>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </Button>
              </form>
            </div>
            {/* Mobile search button */}
            <Button variant="ghost"
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Search"
              onClick={() => setShowMobileSearch(v => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
              </svg>
            </Button>
          {/* Right Section - Profile, Cart, Language Switcher */}
            <div className="flex items-center gap-3 text-white">
              {/* Profile dropdown for logged-in user - hidden on mobile */}
            {isLoggedIn ? (
              <>
                  <div className="hidden sm:block relative" ref={dropdownRef}>
                    <Button variant="ghost"
                    onClick={() => setDropdownOpen(v => !v)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer text-white"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                      <FaUserCircle className="text-white text-2xl" />
                      <span className="hidden sm:inline">{tr('profile')}</span>
                    <span className="ml-1">▼</span>
                    </Button>
                  {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 text-slate-900  hover:bg-gray-100 transition">
                        <Link href="/profil" className="block px-4 py-3 hover:bg-slate-100" onClick={() => setDropdownOpen(false)}>{tr('profile')}</Link>
                        <Link href="/moje-porudzbine" className="block px-4 py-3 hover:bg-slate-100" onClick={() => setDropdownOpen(false)}>{tr('my_orders')}</Link>
                        <Link href="/omiljeni" className="block px-4 py-3 hover:bg-slate-100" onClick={() => setDropdownOpen(false)}>{tr('favorites')}</Link>
                        <hr className="my-1 border-slate-200" />
                        <Button variant="ghost"
                          onClick={() => {
                            setDropdownOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-100 text-slate-900"
                      >
                        <FaSignOutAlt />
                          <span>{tr('logout')}</span>
                        </Button>
                    </div>
                  )}
                </div>
                  {/* Logout button - hidden on mobile */}
                  <Button variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer text-white"
                    title={tr('logout')}
                >
                    <FaSignOutAlt className="text-lg sm:text-xl" />
                    <span className="hidden sm:inline">{tr('logout')}</span>
                  </Button>
              </>
            ) : (
                  <Link href="/prijava" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-700 transition text-white">
                    <FaSignInAlt className="text-lg sm:text-xl" />
                    <span>{tr('login') || 'Prijava'}</span>
              </Link>
            )}
            {/* Cart badge */}
              <Link href="/korpa" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition relative">
              <span className="relative">
                  <FaShoppingCart className="text-lg sm:text-xl" />
                {badgeCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold border border-black shadow">
                    {badgeCount}
                  </span>
                )}
              </span>
                {/* <span>{t.cart}</span> */}
            </Link>
            {/* Login link for guests */}
            {/* Login link for guests - removed duplicate */}
            {/* Language Switcher inline */}
              <Button
                variant="ghost"
                onClick={handleLangSwitch}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-2xl leading-none cursor-pointer"
              >
                {language === 'sr' ? '🇬🇧' : '🇲🇪'}
              </Button>
          </div>
        </>
      )}
      </nav>
      {/* Mobile search dropdown */}
      {showMobileSearch && (
        <div className="lg:hidden w-full px-3 py-2 bg-black/80 border-b border-white/20 shadow-md flex justify-center items-center text-white backdrop-blur-md">
          <form action="/proizvodi" method="get" className="flex items-center w-full max-w-md relative">
            <Input
              type="text"
              name="search"
              className="flex-1 border rounded-full px-4 py-2 pr-12 bg-black/30 text-white placeholder:text-gray-300 border-white/20 focus:outline-none focus:border-gray-500"
              placeholder={tr('search')}
            />
            <Button type="submit" className="absolute right-3 bg-transparent hover:bg-transparent text-gray-500 border-none p-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </Button>
          </form>
          <Button
            className="ml-2 p-2 rounded-lg hover:bg-white/10 text-white"
            aria-label="Zatvori pretragu"
            onClick={() => setShowMobileSearch(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
              <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Button>
        </div>
      )}
    </>
  );
};

export default Navbar;