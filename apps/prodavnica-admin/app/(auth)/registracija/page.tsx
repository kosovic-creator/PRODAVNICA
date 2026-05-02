import { RegistracijaFormComponent } from './RegistracijaForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Registracija",
};

export default async function Page() {
  return (
    <RegistracijaFormComponent />
  );
}