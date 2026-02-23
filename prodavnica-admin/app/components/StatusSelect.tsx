'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@prodavnica/ui";
import { azurirajStatusPorudzbine } from '@/lib/actions/porudzbine';
import { toast } from 'sonner';

interface StatusSelectProps {
  porudzbinaId: string;
  trenutniStatus: string;
}

export function StatusSelect({ porudzbinaId, trenutniStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(trenutniStatus);
  const [isPending, setIsPending] = useState(false);

  const handleStatusChange = async (noviStatus: string) => {
    setIsPending(true);
    try {
      const result = await azurirajStatusPorudzbine(porudzbinaId, noviStatus);

      if (result.success) {
        setStatus(noviStatus);
        toast.success('Status ažuriran', {
          description: `Status porudžbine je promenjen na: ${noviStatus}`,
        });
      } else {
        toast.error('Greška', {
          description: result.error || 'Greška pri ažuriranju statusa',
        });
      }
    } catch (error) {
      toast.error('Greška', {
        description: 'Došlo je do greške',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Izaberite status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Na čekanju">Na čekanju</SelectItem>
        <SelectItem value="U obradi">U obradi</SelectItem>
        <SelectItem value="Poslato">Poslato</SelectItem>
        <SelectItem value="Završeno">Završeno</SelectItem>
        <SelectItem value="Otkazano">Otkazano</SelectItem>
      </SelectContent>
    </Select>
  );
}