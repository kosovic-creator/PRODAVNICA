"use client";

import { useState, useTransition } from "react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "@prodavnica/ui";
import { obrisiOcenuStavke, upsertOcenaStavke } from "@/lib/actions";

interface RateStavkaProps {
  stavkaId: string;
  userId: string;
  initialRating?: number | null;
  t: Record<string, string>;
}

export default function RateStavka({ stavkaId, userId, initialRating = null, t }: RateStavkaProps) {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [hovered, setHovered] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const handleRate = (value: number) => {
    startTransition(async () => {
      const result = await upsertOcenaStavke(stavkaId, userId, value);

      if (!result.success) {
        const msg = result.error === 'ONLY_COMPLETED' ? (t.ocena_samo_zavrsene || 'Ocena je dostupna samo za završene porudžbine') : (result.error || t.greska_ocena || 'Greška pri čuvanju ocene');
        toast.error(msg);
        return;
      }

      setRating(value);
      toast.success(result.message || t.ocena_sacuvana || "Ocena je sačuvana");
    });
  };

  const handleClear = () => {
    if (!rating) return;

    startTransition(async () => {
      const result = await obrisiOcenuStavke(stavkaId, userId);

      if (!result.success) {
        const msg = result.error === 'ONLY_COMPLETED' ? (t.ocena_samo_zavrsene || 'Ocena je dostupna samo za završene porudžbine') : (result.error || t.greska_ocena || 'Greška pri brisanju ocene');
        toast.error(msg);
        return;
      }

      setRating(null);
      toast.success(result.message || t.ocena_obrisana || "Ocena je obrisana");
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
            aria-label={(t.oceni_zvezdicama || "Ocenite sa") + " " + value}
          >
            <FaStar className={value <= activeValue ? "text-yellow-400" : "text-gray-300"} />
          </Button>
        ))}
        <span className="text-sm text-gray-600">
          {rating ? `${rating}/5` : t.nije_ocenjeno || "Nije ocenjeno"}
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
          {t.obrisi_ocenu || "Obriši ocenu"}
        </Button>
      </div>
    </div>
  );
}
