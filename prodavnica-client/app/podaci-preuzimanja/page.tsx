import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
// SuccessRedirect je client komponenta
import SuccessRedirect from './SuccessRedirect';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { getPodaciPreuzimanja, createPodaciPreuzimanja, updatePodaciPreuzimanja } from '@/lib/actions/podaci-preuzimanja';
import { ocistiKorpu } from '@/lib/actions/korpa';
import { revalidatePath } from 'next/cache';
import { getServerSession as getSession } from 'next-auth';
import { z } from 'zod';
import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Metadata } from 'next';
import PodaciPreuzimanjaSkeleeton from './components/PodaciPreuzimanjaSkeleeton';

export const metadata: Metadata = {
  title: 'Podaci za preuzimanje',
  description: 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.',
};
export default async function PodaciPreuzimanjaPage({ searchParams }: { searchParams?: Promise<{ error?: string; success?: string }> | { error?: string; success?: string } }) {
  const lang = await getLanguageFromCookies();
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const t = getLocaleMessages(lang, 'podaci-preuzimanja');
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/prijava');
  }
  const userId = session.user.id;

  const result = await getPodaciPreuzimanja(userId);
  const podaci = result.success && result.data ? result.data : null;

  function getFormStateFromParams(params: { error?: string; success?: string } | undefined) {
    let error: Record<string, string[]> | { global?: string } = {};
    let success = false;
    if (params?.error) {
      try {
        error = JSON.parse(params.error);
      } catch { }
    }
    if (params?.success === '1') success = true;
    return { error, success };
  }
  const formState = getFormStateFromParams(params);

  function isFieldErrors(error: Record<string, string[]> | { global?: string }): error is Record<string, string[]> {
    return !('global' in error);
  }

  async function handleSubmit(formData: FormData) {
    'use server';
    const session = await getSession(authOptions);
    if (!session?.user?.id) {
      redirect('/prijava');
    }
    const userId = session.user.id;
    const podaciSchema = z.object({
      ime: z.string().min(2, t.ime_error || 'Ime je obavezno'),
      prezime: z.string().min(2, t.prezime_error || 'Prezime je obavezno'),
      adresa: z.string().min(2, t.adresa_error || 'Adresa je obavezna'),
      drzava: z.string().min(2, t.drzava_error || 'Država je obavezna'),
      grad: z.string().min(2, t.grad_error || 'Grad je obavezan'),
      postanskiBroj: z.string().min(2, t.postanskiBroj_error || 'Poštanski broj je obavezan'),
      telefon: z.string().min(5, t.telefon_error || 'Telefon je obavezan').max(20).regex(/^\+?[0-9\s]*$/, t.telefon_error || 'Telefon nije validan'),
    });
    const values = {
      ime: formData.get('ime')?.toString() || '',
      prezime: formData.get('prezime')?.toString() || '',
      adresa: formData.get('adresa')?.toString() || '',
      drzava: formData.get('drzava')?.toString() || '',
      grad: formData.get('grad')?.toString() || '',
      postanskiBroj: formData.get('postanskiBroj')?.toString() || '',
      telefon: formData.get('telefon')?.toString() || '',
    };
    const parsed = podaciSchema.safeParse(values);
    if (!parsed.success) {
      const error = encodeURIComponent(JSON.stringify(parsed.error.flatten().fieldErrors));
      redirect(`/podaci-preuzimanja?error=${error}`);
    }
    const resultCheck = await getPodaciPreuzimanja(userId);
    let result;
    if (resultCheck.success && resultCheck.data) {
      result = await updatePodaciPreuzimanja(userId, {
        ...parsed.data,
        postanskiBroj: Number(parsed.data.postanskiBroj),
        ime: parsed.data.ime,
        prezime: parsed.data.prezime,
      });
    } else {
      result = await createPodaciPreuzimanja(userId, {
        ...parsed.data,
        postanskiBroj: Number(parsed.data.postanskiBroj),
        ime: parsed.data.ime,
        prezime: parsed.data.prezime,
      });
    }
    revalidatePath('/podaci-preuzimanja');
    if (!result.success) {
      const error = encodeURIComponent(JSON.stringify({ global: result.error }));
      redirect(`/podaci-preuzimanja?error=${error}`);
    }
    await ocistiKorpu(userId);
    redirect('/podaci-preuzimanja?success=1');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {t.naslov}
        </h2>
        {formState.success && (
          <Suspense fallback={<PodaciPreuzimanjaSkeleeton />}>
            <SuccessRedirect message={t.uspjeh || 'Podaci su uspješno sačuvani!'} />
          </Suspense>
        )}
        {formState.error?.global && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center">
            {formState.error.global}
          </div>
        )}
        <form action={handleSubmit} className="space-y-4">
          <Input
            name="ime"
            defaultValue={podaci?.ime || ''}
            placeholder={t.ime}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.ime)}
            aria-describedby="ime-error"
          />
          {isFieldErrors(formState.error) && formState.error?.ime && Array.isArray(formState.error.ime) && (
            <p id="ime-error" className="text-red-600 text-sm mt-1">{formState.error.ime.join(', ')}</p>
          )}
          <Input
            name="prezime"
            defaultValue={podaci?.prezime || ''}
            placeholder={t.prezime}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.prezime)}
            aria-describedby="prezime-error"
          />
          {isFieldErrors(formState.error) && formState.error?.prezime && Array.isArray(formState.error.prezime) && (
            <p id="prezime-error" className="text-red-600 text-sm mt-1">{formState.error.prezime.join(', ')}</p>
          )}
          <Input
            name="adresa"
            defaultValue={podaci?.adresa || ''}
            placeholder={t.adresa}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.adresa)}
            aria-describedby="adresa-error"
          />
          {isFieldErrors(formState.error) && formState.error?.adresa && Array.isArray(formState.error.adresa) && (
            <p id="adresa-error" className="text-red-600 text-sm mt-1">{formState.error.adresa.join(', ')}</p>
          )}
          <Input
            name="drzava"
            defaultValue={podaci?.drzava || ''}
            placeholder={t.drzava}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.drzava)}
            aria-describedby="drzava-error"
          />
          {isFieldErrors(formState.error) && formState.error?.drzava && Array.isArray(formState.error.drzava) && (
            <p id="drzava-error" className="text-red-600 text-sm mt-1">{formState.error.drzava.join(', ')}</p>
          )}
          <Input
            name="grad"
            defaultValue={podaci?.grad || ''}
            placeholder={t.grad}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.grad)}
            aria-describedby="grad-error"
          />
          {isFieldErrors(formState.error) && formState.error?.grad && Array.isArray(formState.error.grad) && (
            <p id="grad-error" className="text-red-600 text-sm mt-1">{formState.error.grad.join(', ')}</p>
          )}
          <Input
            name="postanskiBroj"
            defaultValue={podaci?.postanskiBroj?.toString() || ''}
            placeholder={t.postanskiBroj}
            type="number"
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.postanskiBroj)}
            aria-describedby="postanskiBroj-error"
          />
          {isFieldErrors(formState.error) && formState.error?.postanskiBroj && Array.isArray(formState.error.postanskiBroj) && (
            <p id="postanskiBroj-error" className="text-red-600 text-sm mt-1">{formState.error.postanskiBroj.join(', ')}</p>
          )}
          <Input
            name="telefon"
            defaultValue={podaci?.telefon || ''}
            placeholder={t.telefon}
            required
            aria-invalid={!!(isFieldErrors(formState.error) && formState.error?.telefon)}
            aria-describedby="telefon-error"
          />
          {isFieldErrors(formState.error) && formState.error?.telefon && Array.isArray(formState.error.telefon) && (
            <p id="telefon-error" className="text-red-600 text-sm mt-1">{formState.error.telefon.join(', ')}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
          >
            {t.sacuvaj_podatke}
          </Button>
        </form>
      </div>
    </div>
  );
}
