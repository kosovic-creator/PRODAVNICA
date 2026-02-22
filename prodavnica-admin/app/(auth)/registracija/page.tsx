import { RegistracijaFormComponent } from './RegistracijaForm';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const errorParam = params?.error;
  const successParam = params?.success;

  return (
    <RegistracijaFormComponent
      errorParam={errorParam}
      successParam={successParam}
    />
  );
}