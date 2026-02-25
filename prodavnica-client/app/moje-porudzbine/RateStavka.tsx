"use client";

import { useState, useTransition } from "react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "@prodavnica/ui";
import { obrisiOcenuStavke, upsertOcenaStavke } from "@/lib/actions";
import { useI18n } from "@/app/components/I18nProvider";

interface RateStavkaProps {
  stavkaId: string;
  userId: string;
  initialRating?: number | null;
}

export default function RateStavka({ stavkaId, userId, initialRating = null }: RateStavkaProps) {
  const { t } = useI18n();
  const tr = (key: string) => t('moje_porudzbine', key);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [hovered, setHovered] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const handleRate = (value: number) => {
    startTransition(async () => {
      const result = await upsertOcenaStavke(stavkaId, userId, value);

      if (!result.success) {
        const msg = result.error === 'ONLY_COMPLETED' ? tr('ocena_samo_zavrsene') : (result.error || tr('greska_ocena'));
        toast.error(msg);
        return;
      }

      setRating(value);
      toast.success(result.message || tr('ocena_sacuvana'));
    });
  };

  const handleClear = () => {
    if (!rating) return;

    startTransition(async () => {
      const result = await obrisiOcenuStavke(stavkaId, userId);

      if (!result.success) {
        const msg = result.error === 'ONLY_COMPLETED' ? tr('ocena_samo_zavrsene') : (result.error || tr('greska_ocena'));
        toast.error(msg);
        return;
      }

      setRating(null);
      toast.success(result.message || tr('ocena_obrisana'));
    });
  };

  const activeValue = hovered || rating || 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            type="button"
            variant="ghost"
            size="icon-sm"
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(value)}
            disabled={isPending}
            aria-label={tr('oceni_zvezdicama') + " " + value}
          >
            <FaStar className={value <= activeValue ? "text-yellow-400" : "text-gray-300"} />
          </Button>
        ))}
        <span className="text-sm text-gray-600">
          {rating ? `${rating}/5` : tr('nije_ocenjeno')}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={handleClear}
          variant="outline"
        >
          {tr('obrisi_ocenu')}
        </Button>
      </div>
    </div>
  );
}
