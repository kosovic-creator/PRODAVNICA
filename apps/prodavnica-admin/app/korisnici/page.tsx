import { getKorisnici, getKorisniciAdmin } from '@/lib/actions/korisnici';
import { Metadata } from 'next';
import KorisniciContent from './KorisniciContent';

export const metadata: Metadata = {
  title: "Korisnici",
};

export default async function AdminKorisniciPage() {
  const page = 1;
  const pageSize = 10;
  const korisniciResult = await getKorisnici(page, pageSize);
  const adminResult = await getKorisniciAdmin(page, pageSize);

  return (
    <KorisniciContent
      korisniciInit={korisniciResult.success && korisniciResult.data ? korisniciResult.data.korisnici : []}
      totalInit={korisniciResult.success && korisniciResult.data ? korisniciResult.data.total : 0}
      adminKorisniciInit={adminResult.success && adminResult.data ? adminResult.data.korisnici : []}
      adminTotalInit={adminResult.success && adminResult.data ? adminResult.data.total : 0}
      page={page}
      pageSize={pageSize}
    />
  );
}