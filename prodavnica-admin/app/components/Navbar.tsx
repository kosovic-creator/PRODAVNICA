'use client';

import React, { useState } from 'react';
import { signOut } from "next-auth/react";
import { FaUserShield, FaUsers, FaBox, FaShoppingCart, FaSignOutAlt, FaHome, FaBars, FaTimes } from "react-icons/fa";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const MenuItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: FaHome,
      isActive: pathname === '/'
    },
    {
      href: '/korisnici',
      label: 'Korisnici',
      icon: FaUsers,
      isActive: pathname.startsWith('/korisnici')
    },
    {
      href: '/proizvodi',
      label: 'Proizvodi',
      icon: FaBox,
      isActive: pathname.startsWith('/proizvodi')
    },
    {
      href: '/porudzbine',
      label: 'Porudžbine',
      icon: FaShoppingCart,
      isActive: pathname.startsWith('/porudzbine')
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center gap-3">
            <FaUserShield className="text-2xl" />
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900"> Panel</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {MenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium
                    ${item.isActive
                      ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section - User Info & Logout */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span>Dobrodošli,</span>
              <span className="font-medium text-gray-900">
                {session?.user?.name || session?.user?.email || "Gost"}
              </span>
            </div>

            {/* Desktop Logout */}
            <Button variant='ghost'
              onClick={() => signOut({ callbackUrl: "/prijava" })}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm text-gray-700 hover:text-red-600"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Odjava
            </Button>

            {/* Mobile Menu Button */}
            <Button variant='ghost'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-5 h-5 text-gray-700" />
              ) : (
                <FaBars className="w-5 h-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {MenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                    ${item.isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100 hover:'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Logout */}
            <Button variant='ghost'
              onClick={() => {
                setMobileMenuOpen(false);
                signOut({ callbackUrl: "/prijava" });
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              Odjava
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}