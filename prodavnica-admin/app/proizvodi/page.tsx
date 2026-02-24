// ...existing code...
import React from 'react';
import prisma from '@/lib/prisma';
import ClientProizvodiTable from './ClientProizvodiTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Proizvodi",
};

export default async function ProizvodiPage() {
  // SSR paginacija
  const page = 1;
  const pageSize = 10;
  const total = await prisma.proizvod.count();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const proizvodi = await prisma.proizvod.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { naziv_sr: 'asc' },
    include: {
      varijante: true
    }
  });

  return <ClientProizvodiTable proizvodi={proizvodi} total={total} totalPages={totalPages} page={page} />;
}
