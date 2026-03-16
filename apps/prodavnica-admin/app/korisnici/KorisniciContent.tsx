"use client";
import { useState } from "react";
import SuccessMessage from '../components/SuccessMessage';
import KorisniciSkeleton from './KorisniciSkeleton';
import ClientKorisniciTable from './ClientKorisniciTable';
import type { Korisnik } from '@/types';

interface KorisniciContentProps {
  korisniciInit: Korisnik[];
  totalInit: number;
  adminKorisniciInit: Korisnik[];
  adminTotalInit: number;
  page: number;
  pageSize: number;
}

export default function KorisniciContent({
  korisniciInit,
  totalInit,
  adminKorisniciInit,
  adminTotalInit,
  page,
  pageSize,
}: KorisniciContentProps) {
  const [activeTab, setActiveTab] = useState<'korisnici' | 'admin'>('korisnici');

  const totalPages = Math.ceil((activeTab === 'admin' ? adminTotalInit : totalInit) / pageSize);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Upravljanje korisnicima</h1>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('korisnici')}
            className={`pb-2 border-b-2 text-sm font-medium transition-colors ${activeTab === 'korisnici'
                ? 'border-blue-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Korisnici
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`pb-2 border-b-2 text-sm font-medium transition-colors ${activeTab === 'admin'
                ? 'border-blue-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Admin korisnici
          </button>
        </nav>
      </div>
      <ClientKorisniciTable
        korisnici={activeTab === 'admin' ? adminKorisniciInit : korisniciInit}
        total={activeTab === 'admin' ? adminTotalInit : totalInit}
        page={page}
        totalPages={totalPages}
        tab={activeTab}
      />
    </div>
  );
}
