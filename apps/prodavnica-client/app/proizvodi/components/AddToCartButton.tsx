'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import type { DefaultSession } from 'next-auth';
import { useRouter } from 'next/navigation';
import { FaCartPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Proizvodi } from '../../../types';
import { dodajUKorpu } from './../../../lib/actions/korpa';
import { useCart } from '../../components/KorpaContext';
import { Button } from "@prodavnica/ui";
import { useI18n } from '@/i18n/I18nProvider';
import SuccessMessage from '@/app/components/SuccessMessage';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
  }
}

interface AddToCartButtonProps {
  proizvod: Proizvodi;
  selectedBoja?: string | null;
  selectedBojaEn?: string | null;
  selectedVelicina?: string | null;
  t?: Record<string, string>;
}

export default function AddToCartButton({ proizvod, selectedBoja, selectedBojaEn, selectedVelicina }: AddToCartButtonProps) {
  const { t } = useI18n();
  const { data: session } = useSession();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { refreshKorpa } = useCart();

  const hasVarijante = proizvod.varijante && proizvod.varijante.length > 0;

  const handleClick = () => {
    const korisnikId = session?.user?.id;

    // Proveri da li je korisnik prijavljen
    if (!korisnikId) {
      setLoginError(t('addToCartButton', 'loginRequired') || 'Morate biti prijavljeni');
      return;
    }

    // Ako je odabrana veličina (boja je opciona), dodaj u korpu
    if (selectedVelicina) {
      handleDodajUKorpu();
    } else {
      // Ako veličina nije odabrana (grid prikaz), preusmeri na stranicu detalja
      router.push(`/proizvodi/${proizvod.id}`);
    }
  };

  const handleDodajUKorpu = async () => {
    const korisnikId = session?.user?.id;
    if (!korisnikId || isAdding) return;

    setIsAdding(true);

    startTransition(async () => {
      try {
        const result = await dodajUKorpu({
          korisnikId,
          proizvodId: proizvod.id,
          kolicina: 1,
          boja: selectedBoja || undefined,
          boja_en: selectedBojaEn || undefined,
          velicina: selectedVelicina || undefined
        });

        if (!result.success) {
          toast.error(result.error || t('addToCartButton', 'addError') || 'Greška pri dodavanju u korpu', { duration: 4000 });
          return;
        }

        // Ažuriraj broj stavki u korpi globalno
        await refreshKorpa();

        toast.success(t('addToCartButton', 'addSuccess') || 'Proizvod je dodat u korpu', { duration: 2000 });
        setTimeout(() => {
          router.push('/korpa');
        }, 1200);
      } catch (error) {
        console.error('Greška:', error);
        toast.error(t('addToCartButton', 'addErrorGeneric') || 'Došlo je do greške', { duration: 4000 });
      } finally {
        setIsAdding(false);
      }
    });
  };

  return (
    <>
      {loginError && (
        <SuccessMessage
          message={loginError}
          type="error"
          redirectTo="/prijava"
          redirectDelay={2000}
        />
      )}
      <Button
        variant="default"
        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
        onClick={handleClick}
        disabled={!hasVarijante || isAdding || isPending}
        suppressHydrationWarning
      >
        {isAdding ? (
          <>
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            <span suppressHydrationWarning>{t('addToCartButton', 'adding') || 'Dodavanje...'}</span>
          </>
        ) : (
          <>
            <FaCartPlus className="w-5 h-5" />
            <span suppressHydrationWarning>
              {!hasVarijante
                ? t('addToCartButton', 'outOfStock') || 'Nema na stanju'
                : t('addToCartButton', 'addToCart') || 'Dodaj u korpu'}
            </span>
          </>
        )}
      </Button>
    </>
  );
}