/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getKorpa } from '@/lib/actions/korpa';
import type { ReactNode } from 'react';
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { Providers } from "./components/Providers";
import { getServerLanguage } from "@/i18n/i18n.server";
import PWARegister from "./components/PWARegister";
import InstallBanner from "./components/InstallBanner";
import OfflineNotice from "./components/OfflineNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | Prodavnica`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
    children: ReactNode;
}): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  const lang = await getServerLanguage();

  let brojUKorpi = 0;
  if (isLoggedIn && session?.user?.id) {
    try {
      const korpa = await getKorpa(session.user.id);
      if (korpa.success && korpa.data?.stavke) {
        brojUKorpi = korpa.data.stavke.reduce((sum, s) => sum + (s.kolicina || 1), 0);
      }
    } catch (e) {
      brojUKorpi = 0;
    }
  }

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers initialLang={lang}>
          <PWARegister />
          <OfflineNotice />
          <InstallBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
