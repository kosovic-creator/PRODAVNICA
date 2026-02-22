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
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/app/components/LanguageContext';
import { getNamespace } from '@/lib/translations';
import SelectVarijanteModal from './SelectVarijanteModal';

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

export default function AddToCartButton({ proizvod, selectedBoja, selectedVelicina, t: tProizvodi }: AddToCartButtonProps) {
  const { lang } = useLanguage();
  const t = getNamespace(lang, 'addToCartButton');
  const { data: session } = useSession();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSelectedBoja, setLocalSelectedBoja] = useState<string | null>(selectedBoja || null);
  const [localSelectedVelicina, setLocalSelectedVelicina] = useState<string | null>(selectedVelicina || null);
  const { refreshKorpa } = useCart();

  const hasVarijante = proizvod.varijante && proizvod.varijante.length > 0;

  const handleDodajUKorpu = async (boja?: string, velicina?: string) => {
    const korisnikId = session?.user?.id;
    if (!korisnikId) {
      toast.error(t.loginRequired, { duration: 4000 });
      router.push('/prijava');
      return;
    }

    if (isAdding) return;

    setIsAdding(true);

    startTransition(async () => {
      try {
        const result = await dodajUKorpu({
          korisnikId,
          proizvodId: proizvod.id,
          kolicina: 1,
          boja: boja || selectedBoja || undefined,
          velicina: velicina || selectedVelicina || undefined
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
        setError(t.addErrorGeneric);
        toast.error(t.addErrorGeneric, { duration: 4000 });
      } finally {
        setIsAdding(false);
      }
    });
  };

  const handleOpenModal = () => {
    const korisnikId = session?.user?.id;
    if (!korisnikId) {
      toast.error(t.loginRequired, { duration: 4000 });
      router.push('/prijava');
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmVarijanta = (boja: string, velicina: string) => {
    setLocalSelectedBoja(boja);
    setLocalSelectedVelicina(velicina);
    setIsModalOpen(false);
    handleDodajUKorpu(boja, velicina);
  };

  // Ako su već odabrane boja i veličina (npr. na stranici detaljnog proizvoda), direktno dodaj u korpu
  const handleClick = () => {
    if (selectedBoja && selectedVelicina) {
      // Direktno dodaj u korpu bez otvaranja modala
      handleDodajUKorpu(selectedBoja, selectedVelicina);
    } else {
      // Otvori modal za odabir varijante
      handleOpenModal();
    }
  };

  return (
    <>
      <Button
        variant="default"
        className="flex items-center justify-center gap-2 rounded-none flex-1 w-full h-full"
        onClick={handleClick}
        disabled={!hasVarijante || isAdding || isPending}
      >
        {isAdding ? (
          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <FaCartPlus />
        )}
        {isAdding
          ? t.adding
          : !hasVarijante
          ? t.outOfStock
          : t.addToCart
        }
      </Button>
      <div>{error && <p className="text-sm text-red-600 mt-2">{error}</p>}</div>

      <SelectVarijanteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmVarijanta}
        proizvod={proizvod}
        t={tProizvodi || {}}
      />
    </>
  );
}