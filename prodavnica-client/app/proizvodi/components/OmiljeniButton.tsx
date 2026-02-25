'use client';
import { useState, useEffect, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { getOmiljeni, dodajUOmiljene, ukloniIzOmiljenih } from '../../../lib/actions/omiljeni';
import { Button } from "@prodavnica/ui";
import { useI18n } from '@/app/components/I18nProvider';

interface OmiljeniButtonProps {
  proizvodId: string;
}

interface Omiljeni {
  id: string;
  proizvodId: string;
  korisnikId: string;
}

export default function OmiljeniButton({ proizvodId }: OmiljeniButtonProps) {
  const { data: session } = useSession();
  const [omiljeni, setOmiljeni] = useState<Omiljeni[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();

  // Load omiljeni when user session changes
  useEffect(() => {
    const loadOmiljeni = async () => {
      if (!session?.user?.id) {
        setOmiljeni([]);
        return;
      }

      setLoading(true);
      try {
        const result = await getOmiljeni(session.user.id);
        if (result.success && result.data) {
          setOmiljeni(
            (result.data.omiljeni || []).map((om:Omiljeni) => ({
              id: String(om.id),
              proizvodId: String(om.proizvodId),
              korisnikId: String(om.korisnikId),
            }))
          );
        }
      } catch (error) {
        console.error('Error loading omiljeni:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOmiljeni();
  }, [session?.user?.id]);

  const isProizvodOmiljeni = omiljeni.some(om => om.proizvodId === proizvodId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error(t('proizvodi', 'morate_biti_prijavljeni_za_omiljene') || 'Morate biti prijavljeni', { duration: 4000 });
      return;
    }

    if (!session.user.id) {
      toast.error(t('proizvodi', 'morate_biti_prijavljeni_za_omiljene') || 'Morate biti prijavljeni', { duration: 4000 });
      return;
    }

    const isCurrentlyOmiljeni = omiljeni.some(om => om.proizvodId === proizvodId);

    startTransition(async () => {
      try {
        if (isCurrentlyOmiljeni) {
          // Remove from favorites
          const result = await ukloniIzOmiljenih(session.user.id as string, proizvodId as string);
          if (result.success) {
            setOmiljeni(prev => prev.filter(om => om.proizvodId !== proizvodId));
            toast.success(t('proizvodi', 'uklonjen_iz_omiljenih') || 'Uklonjen iz omiljenih', { duration: 3000 });
          } else {
            toast.error(result.error || 'Greška pri uklanjanju iz omiljenih', { duration: 3000 });
          }
        } else {
          const result = await dodajUOmiljene(session.user.id as string, proizvodId as string);
          if (result.success) {
            // Reload favorites list
            const reloadResult = await getOmiljeni(session.user.id as string);
            if (reloadResult.success && reloadResult.data) {
              setOmiljeni(
                (reloadResult.data.omiljeni || []).map((om:Omiljeni) => ({
                  id: String(om.id),
                  proizvodId: String(om.proizvodId),
                  korisnikId: String(om.korisnikId),
                }))
              );
              toast.success(t('proizvodi', 'dodat_u_omiljene') || 'Dodato u omiljene', { duration: 3000 });
            }
          } else {
            toast.error(result.error || 'Greška pri dodavanju u omiljene', { duration: 3000 });
          }
        }
      } catch (error) {
        console.error('Error toggling omiljeni:', error);
        toast.error('Došlo je do greške', { duration: 3000 });
      }
    });
  };

  if (!session?.user) return null;

  return (
    <Button
      onClick={handleClick}
      disabled={loading || isPending}
      variant="outline"
      size="icon"
      className={isProizvodOmiljeni ? "rounded-full text-red-600" : "rounded-full"}
      title={isProizvodOmiljeni ? (t('proizvodi', 'omiljeni_ukloniti') || 'Ukloni iz omiljenih') : (t('proizvodi', 'omiljeni_dodati') || 'Dodaj u omiljene')}
      aria-label={isProizvodOmiljeni ? (t('proizvodi', 'omiljeni_ukloniti') || 'Ukloni iz omiljenih') : (t('proizvodi', 'omiljeni_dodati') || 'Dodaj u omiljene')}
    >
      {isPending ? (
        <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <Heart
          size={20}
          fill={isProizvodOmiljeni ? 'currentColor' : 'none'}
        />
      )}
    </Button>
  );
}