'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateStavkuKorpe, ukloniStavkuKorpe } from '@/lib/actions';
import { useCart } from '../../components/KorpaContext';
import { Button } from "@prodavnica/ui";
import { useI18n } from '@/i18n/I18nProvider';


interface KorpaItemProps {
  stavka: {
    id: string;
    kolicina: number;
    boja?: string | null;
    boja_en?: string | null;
    velicina?: string | null;
    proizvod?: {
      id: string;
      naziv_sr: string;
      naziv_en: string;
      cena: number;
      slike?: string[]; // Change from 'string | null' to 'string[]'
    } | null;
  };
}

export default function KorpaItem({ stavka }: KorpaItemProps) {
  const [isPending, startTransition] = useTransition();
  const { refreshKorpa } = useCart();
  const [message, setMessage] = useState('');
  const { language, t } = useI18n();
  const handleKolicina = async (kolicina: number) => {
    if (kolicina < 1) return;

    startTransition(async () => {
      try {
        const result = await updateStavkuKorpe(stavka.id, kolicina);

        if (!result.success) {
          setMessage(result.error || 'Greška pri ažuriranju');
          return;
        }

        await refreshKorpa();
      } catch (error) {
        console.error('Greška pri ažuriranju kolicine:', error);
        setMessage(t('korpa', 'error') || 'Greška pri ažuriranju količine');
      }
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await ukloniStavkuKorpe(stavka.id);

        if (!result.success) {
          setMessage(result.error || 'Greška pri brisanju');
          return;
        }

        await refreshKorpa();
        toast.success(t('korpa', 'artikal_izbrisan') || 'Artikal je uklonjen iz korpe', { duration: 3000 });
      } catch (error) {
        console.error('Greška pri brisanju stavke:', error);
        setMessage(t('korpa', 'error') || 'Greška pri brisanju stavke');
      }
    });
  };

  if (!stavka.proizvod) return null;

  const imageUrl = Array.isArray(stavka.proizvod.slike) && stavka.proizvod.slike.length > 0
    ? stavka.proizvod.slike[0]
    : '/placeholder.png';
  const naziv = language === 'en' ? stavka.proizvod.naziv_en : stavka.proizvod.naziv_sr;
  const boja = language === 'en' ? (stavka.boja_en || stavka.boja) : stavka.boja;
  const velicina = stavka.velicina;

  const handleCardClick = (e: React.MouseEvent) => {
    // Ako je kliknut button ili kontrola, ne otvaraj proizvod
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.preventDefault();
      return;
    }
  };

  return (
    <Link
      href={`/proizvodi/${stavka.proizvod?.id}`}
      onClick={handleCardClick}
      className="flex flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm border min-h-24 cursor-pointer hover:shadow-md transition-shadow"
    >
      {message && <p className="text-red-600 text-sm">{message}</p>}

      {/* Slika */}
      <div className="w-24 h-24 relative shrink-0 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={naziv}
          fill
          sizes="(max-width: 768px) 100vw, 96px"
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.png';
          }}
        />
      </div>

      {/* Info - lijevo */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate text-base">{naziv}</h3>

        {/* Boja i veličina */}
        <div className="flex flex-wrap gap-2 text-sm">
          {boja && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              {t('korpa', 'boja') || 'Boja'}: <span className="font-medium">{boja}</span>
            </span>
          )}
          {velicina && (
            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200">
              {t('korpa', 'velicina') || 'Veličina'}: <span className="font-medium">{velicina}</span>
            </span>
          )}
        </div>

        {/* Cijena i količina kontrole */}
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleKolicina(stavka.kolicina - 1)}
              disabled={isPending || stavka.kolicina <= 1}
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label={t('korpa', 'smanji_kolicinu') || "Smanji količinu"}
            >
              <FaMinus className="w-3 h-3" />
            </Button>
            <span className="w-10 text-center font-semibold">{stavka.kolicina}</span>
            <Button
              onClick={() => handleKolicina(stavka.kolicina + 1)}
              disabled={isPending}
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label={t('korpa', 'povecaj_kolicinu') || "Povećaj količinu"}
            >
              <FaPlus className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex-1" />

          {/* Cijena */}
          <p className="font-bold text-lg text-gray-900">
            {(stavka.proizvod.cena * stavka.kolicina).toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Delete button - desno */}
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleDelete}
          disabled={isPending}
          variant="destructive"
          size="icon"
          className="h-9 w-9 flex items-center justify-center"
          aria-label={t('korpa', 'izbrisi_artikal') || "Izbriši artikal"}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Link>
  );
}