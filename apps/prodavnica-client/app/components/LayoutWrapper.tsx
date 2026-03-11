"use client";
import React, { Suspense } from "react";
import { Roboto, Roboto_Mono } from 'next/font/google';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import LayoutSkeleton from "./LayoutSkeleton";

const GeistSans = Roboto({ subsets: ['latin'], variable: '--font-sans' });
const GeistMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <Navbar setSidebarOpen={setSidebarOpen} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Suspense fallback={<LayoutSkeleton />}>
        <main style={{ marginLeft: sidebarOpen ? 256 : 0, transition: 'margin-left 0.3s' }}>
          {children}
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}
