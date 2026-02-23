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
import { useLanguage } from '@/app/components/LanguageContext';
import { getNamespace } from '@/lib/translations';

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
  selectedVelicina?: string | null;
  t?: Record<string, string>;
}

export default function AddToCartButton({ proizvod, selectedBoja, selectedVelicina }: AddToCartButtonProps) {
  const { lang } = useLanguage();
  const t = getNamespace(lang, 'addToCartButton');
  const { data: session } = useSession();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const { refreshKorpa } = useCart();

  const hasVarijante = proizvod.varijante && proizvod.varijante.length > 0;

  const handleClick = () => {
    const korisnikId = session?.user?.id;

    // Proveri da li je korisnik prijavljen
    if (!korisnikId) {
      toast.error(t.loginRequired, { duration: 4000 });
      router.push('/prijava');
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
          velicina: selectedVelicina || undefined
        });

        if (!result.success) {
          toast.error(result.error || t.addError, { duration: 4000 });
          return;
        }

        // Ažuriraj broj stavki u korpi globalno
        await refreshKorpa();

        toast.success(t.addSuccess, { duration: 4000 });
      } catch (error) {
        console.error('Greška:', error);
        toast.error(t.addErrorGeneric, { duration: 4000 });
      } finally {
        setIsAdding(false);
      }
    });
  };

  return (
    <Button
      variant="default"
      className="w-full h-full text-sm font-medium rounded-none flex items-center justify-center gap-2"
      onClick={handleClick}
      disabled={!hasVarijante || isAdding || isPending}
    >
      {isAdding ? (
        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <FaCartPlus className="w-4 h-4" />
      )}
      {isAdding
        ? t.adding
        : !hasVarijante
          ? t.outOfStock
          : t.addToCart
      }
    </Button>
  );
}