'use client';

import RegistracijaForm from './RegistracijaForm';

interface RegistracijaContentProps {
  initialValues: {
    email: string;
    lozinka: string;
    uloga: string;
    potvrdaLozinke: string;
  };
  errorMap: Record<string, string>;
  valueMap: Record<string, string>;
  errorParam?: string;
  successParam?: string;
  successEmail?: string;
  posta?: string;
  formAction: (formData: FormData) => Promise<void>;
}

export default function RegistracijaContent({
  initialValues,
  errorMap,
  valueMap,
  errorParam,
  successParam,
  successEmail,
  posta,
  formAction,
}: RegistracijaContentProps) {
  return (
    <RegistracijaForm
      initialValues={initialValues}
      errorMap={errorMap}
      valueMap={valueMap}
      errorParam={errorParam}
      successParam={successParam}
      successEmail={successEmail}
      posta={posta}
      formAction={formAction}
    />
  );
}
