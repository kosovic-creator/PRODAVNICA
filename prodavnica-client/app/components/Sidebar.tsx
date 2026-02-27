'use client';

import * as React from 'react';
import { useI18n } from '@/i18n/I18nProvider';

import { usePathname, useRouter } from 'next/navigation';
import { FaBoxOpen, FaUser, FaTimes, FaShoppingBag, FaChartBar, FaCog, FaPhone, FaInfoCircle, FaHistory, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@prodavnica/ui";


interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function SidebarContent({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);



  // Funkcija za navigaciju koja zadržava trenutni jezik
  const navigateWithLang = (path: string) => {
    // Ako je već na trenutnoj strani, samo zatvori sidebar
    if (pathname === path) {
      onClose();
      return;
    }

    // Prvo zatvori sidebar, pa navigiraj
    onClose();

    // Mali delay da se UI updateuje prije navigacije
    setTimeout(() => {
      router.push(path);
    }, 100);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };


  // User menu items
  const menuItems = React.useMemo(() => [
    { path: '/proizvodi', icon: FaBoxOpen, label: t('sidebar', 'proizvodi') },
  ], [t]);

  const userItems = [
    { path: '/profil', icon: FaUser, label: t('sidebar', 'profile') },
    { path: '/moje-porudzbine', icon: FaHistory, label: t('sidebar', 'my_orders') },
    { path: '/omiljeni', icon: FaHeart, label: t('sidebar', 'favorites') },
  ];

  return (
    <>
      {/* Sidebar - modifikujemo za mobilnu verziju */}
      <span className="text-xs text-slate-500 absolute left-2 top-0">lang display removed</span>
      <div className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] bg-linear-to-b from-stone-100 to-slate-50 backdrop-blur-md shadow-2xl z-50 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        w-64 flex flex-col text-slate-900
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="font-bold text-slate-900 text-lg">
            </h2>
          </div>
          <Button variant="ghost"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label={t('sidebar', 'close_sidebar')}
          >
            <FaTimes className="w-5 h-5 text-slate-900 " />
          </Button>
        </div>

        {/* User Info */}
        {session?.user && (
          <div className="p-4 border-b border-slate-300 bg-white/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 truncate text-sm">
                  {session.user.name}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu - flex-1 za proširenje */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Button variant="ghost"
                    onClick={() => navigateWithLang(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                      ${active ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'}`}
                  >
                    <span className={`flex items-center justify-center ${active ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'} rounded-full w-8 h-8`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  </Button>
                </li>
              );
            })}

            {/* User dropdown menu - only visible for logged in users */}
            {session?.user && (
              <li className="relative">
                <Button variant="ghost"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200
                    ${userDropdownOpen ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`flex items-center justify-center ${userDropdownOpen ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'} rounded-full w-8 h-8`}>
                      <FaUser className="w-5 h-5" />
                    </span>
                    <span className="font-medium text-sm truncate">{t('sidebar', 'profile')}</span>
                  </span>
                  <span className={`text-xs transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </Button>

                {/* Dropdown items */}
                {userDropdownOpen && (
                  <ul className="mt-1 space-y-1 bg-slate-100 rounded-lg p-2">
                    {userItems.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <li key={item.path}>
                          <Button variant="ghost"
                            onClick={() => {
                              navigateWithLang(item.path);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center px-11 py-2 rounded-lg transition-all duration-200 text-sm
                              ${active ? 'bg-white text-slate-900 font-semibold' : 'text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer'}`}
                          >
                            <span className="truncate">{item.label}</span>
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>

        {/* Footer - flex-shrink-0 da ostane na dnu */}
        <div className="p-4 border-t border-slate-300 bg-stone-100/70 shrink-0">
          {session?.user && (
            <Button variant="ghost"
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-100 transition-all duration-200 mb-3"
            >
              <span className="flex items-center justify-center bg-red-100 text-red-600 rounded-full w-8 h-8">
                <FaSignOutAlt className="w-5 h-5" />
              </span>
              <span className="font-medium text-sm truncate">{t('sidebar', 'logout')}</span>
            </Button>
          )}
          <div className="text-center">
            <p className="text-xs text-slate-600">{t('sidebar', 'web_trgovina')}</p>
            <p className="text-xs text-slate-500">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Overlay za zatvaranje klikom van sidebar-a */}
      {open && (
        <div
          className="fixed top-16 left-64 right-0 bottom-0 z-30 bg-black/5"
          onClick={onClose}
        />
      )}
    </>
  );
}

// Glavna Sidebar komponenta sa Suspense
export default function Sidebar({ open, onClose }: SidebarProps) {
  return <SidebarContent open={open} onClose={onClose} />;
}
