import { RegistracijaFormComponent } from './RegistracijaForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Registracija",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <RegistracijaFormComponent />
  );
}