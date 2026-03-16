import RegistracijaFormNew from './RegistracijaForm';
import { getLocaleMessages, getLanguageFromCookies } from '@/i18n/i18n';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageFromCookies();
  const authMessages = getLocaleMessages(lang, 'auth');
  const title = authMessages.register?.title || 'Registracija';
  const description = lang === 'en'
    ? 'Create a new account to start shopping and enjoy exclusive offers from our store.'
    : 'Dobrodošli u našu prodavnicu! Pregledajte našu široku ponudu proizvoda i pronađite savršene artikle za sebe.';

  return {
    title,
    description,
  };
}


export default async function RegistracijaPage() {
  const lang = await getLanguageFromCookies();
  const tAuth = getLocaleMessages(lang, 'auth');
  return <RegistracijaFormNew translations={tAuth.register || {}} />;
}
