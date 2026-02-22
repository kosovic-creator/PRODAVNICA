/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaTrashAlt, FaCreditCard, FaShoppingCart } from 'react-icons/fa';
import { ocistiKorpu } from '@/lib/actions/korpa';
import { kreirajPorudzbinu } from '@/lib/actions/porudzbine';
import { getPodaciPreuzimanja } from '@/lib/actions/podaci-preuzimanja';
import { posaljiObavestenjePorudzbina } from '@/lib/actions/email';
import { getProizvodById } from '@/lib/actions/proizvodi';
import { useCart } from '../../components/KorpaContext';
import SuccessMessage from '@/app/components/SuccessMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StripeCheckoutForm from '@/app/components/StripeCheckoutForm';
import { useLanguage } from '@/app/components/LanguageContext';
import { getNamespace } from '@/lib/translations';


interface stavkeKorpe {
  id: string;
  kolicina: number;
  boja?: string | null;
  velicina?: string | null;
  proizvod?: {
    id: string;
    naziv_sr: string;
    naziv_en: string;
    cena: number;
    slika?: string | null;
  } | null;
}

interface KorpaActionsProps {
  userId: string;
  stavke: stavkeKorpe[];
}

export default function KorpaActions({ userId, stavke }: KorpaActionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const ukupno = stavke.reduce((acc, s) => acc + (s.proizvod ? s.proizvod.cena * s.kolicina : 0), 0);
  const { refreshKorpa } = useCart();
  const { lang } = useLanguage();
  const t = getNamespace(lang, 'korpa');

  const [pendingKorpa, setPendingKorpa] = useState(false);
  const [pendingMontrypay, setPendingMontrypay] = useState(false);
  const [pendingKupovina, setPendingKupovina] = useState(false);
  const [pendingStripe, setPendingStripe] = useState(false);

  const isprazniKorpu = async () => {
    setPendingKorpa(true);
    try {
      const result = await ocistiKorpu(userId);

      if (!result.success) {
        setMessage(result.error || 'Greška pri brisanju korpe');
        return;
      }

      await refreshKorpa();
      console.log('Korpa je ispražnjena i stanje proizvoda smanjeno');

      // Redirect na proizvodi
      router.push('/proizvodi');
    } catch (error) {
      console.error('Greška pri brisanju korpe ili ažuriranju stanja proizvoda:', error);
      setMessage(t.error || 'Greška pri brisanju korpe');
    } finally {
      setPendingKorpa(false);
    }
  };

  const potvrdiPorudzbinu = async (): Promise<{ success: boolean; ukupno?: number }> => {
    console.log('[KorpaActions] Email koji se šalje:', session?.user?.email);
    try {
      console.log('[KorpaActions] Kreiranje porudžbine...');
      const porudzbinaData = {
        korisnikId: userId,
        ukupno,
        status: 'Na čekanju',
        email: session?.user?.email || '',
        stavke: stavke.map(s => ({
          proizvodId: s.proizvod?.id || '',
          kolicina: s.kolicina,
          cena: s.proizvod?.cena || 0,
          slika: s.proizvod?.slika || undefined,
          boja: s.boja || undefined,
          velicina: s.velicina || undefined
        })),
      };

      const result = await kreirajPorudzbinu(porudzbinaData);
      console.log('[KorpaActions] Rezultat kreiranja porudžbine:', result);

      if (!result.success) {
        setMessage(result.error || t.error || 'Greška pri kreiranju porudžbine');
        return { success: false };
      }

      return { success: true, ukupno };
    } catch (error) {
      console.error('[KorpaActions] Error creating order:', error);
      setMessage(t.error || 'Greška pri kreiranju porudžbine');
      return { success: false };
    }
  };

  const handleZavrsiKupovinu = async () => {
    setPendingKupovina(true);
    try {
      console.log('[KorpaActions] Pokrenut završetak kupovine');
      // Check delivery data
      const podaciResult = await getPodaciPreuzimanja(userId);
      console.log('[KorpaActions] Podaci za preuzimanje:', podaciResult);

      if (!podaciResult.success || !podaciResult.data) {
        setMessage(t.no_data_redirect || "Nemate unete podatke za preuzimanje. Bićete preusmereni na stranicu za unos podataka.");
        setTimeout(() => {
          router.push('/podaci-preuzimanja');
        }, 2000);
        return;
      }

      // PRVO kreiraj porudžbinu
      const result = await potvrdiPorudzbinu();
      console.log('[KorpaActions] Rezultat potvrde porudžbine:', result);

      if (!result.success) {
        return; // Zaustavi izvršavanje ako kreiranje nije uspelo
      }

      // Poziv za email obavještenje korisniku i adminu
      await posaljiObavestenjePorudzbina({
        korisnikEmail: session?.user?.email || '',
        adminEmail: process.env.EMAIL_USER || '',
        subjectKorisnik: 'Nova porudžbina',
        subjectAdmin: 'Nova porudžbina Adminu',
        tip: 'porudzbina',
        ukupno,
        stavke: stavke.map(s => ({
          naziv: s.proizvod?.naziv_sr || 'Nepoznat proizvod',
          kolicina: s.kolicina,
          cena: s.proizvod?.cena || 0,
          boja: s.boja,
          velicina: s.velicina
        })),
      });

      // Prikaži success obaveštenje
      setSuccessMessage(t.kupovina_uspesna);
      setShowSuccess(true);

      // Očisti korpu i redirect nakon 3 sekunde
      setTimeout(async () => {
        await ocistiKorpu(userId);
        refreshKorpa();
        router.push('/moje-porudzbine');
      }, 3000);
    } catch (error) {
      console.error('[KorpaActions] Error completing purchase:', error);
      setMessage(t.error || 'Greška pri završavanju kupovine');
    } finally {
      setPendingKupovina(false);
    }
  };

  const handleStripeSuccess = async () => {
    setPendingStripe(true);
    try {
      const podaciResult = await getPodaciPreuzimanja(userId);

      if (!podaciResult.success || !podaciResult.data) {
        setMessage(t.no_data_redirect || 'Nemate unete podatke za preuzimanje. Bićete preusmereni na stranicu za unos podataka.');
        setTimeout(() => {
          router.push('/podaci-preuzimanja');
        }, 2000);
        return;
      }

      const result = await potvrdiPorudzbinu();
      if (!result.success) return;

      await posaljiObavestenjePorudzbina({
        korisnikEmail: session?.user?.email || '',
        adminEmail: process.env.EMAIL_USER || '',
        subjectKorisnik: 'Porudžbina plaćena karticom (Stripe)',
        subjectAdmin: 'Nova Stripe porudžbina',
        tip: 'placanje',
        ukupno,
        stavke: stavke.map(s => ({
          naziv: s.proizvod?.naziv_sr || 'Nepoznat proizvod',
          kolicina: s.kolicina,
          cena: s.proizvod?.cena || 0,
          boja: s.boja,
          velicina: s.velicina
        })),
      });

      setSuccessMessage(t.kupovina_uspesna || 'Porudžbina je uspešno plaćena');
      setShowSuccess(true);

      setTimeout(async () => {
        await ocistiKorpu(userId);
        refreshKorpa();
        router.push('/moje-porudzbine');
      }, 2500);
    } catch (error) {
      console.error('[KorpaActions] Error after Stripe payment:', error);
      setMessage(t.error || 'Greška posle plaćanja');
    } finally {
      setPendingStripe(false);
    }
  };

  const handleMontrypayPlaćanje = async () => {
    setPendingMontrypay(true);
    try {
      console.log('[KorpaActions] Pokrenut Montrypay checkout');
      const podaciResult = await getPodaciPreuzimanja(userId);
      console.log('[KorpaActions] Podaci za preuzimanje:', podaciResult);

      if (!podaciResult.success || !podaciResult.data) {
        setMessage(t.no_data_redirect || "Nemate unete podatke za preuzimanje. Bićete preusmereni na stranicu za unos podataka.");
        setTimeout(() => {
          router.push('/podaci-preuzimanja');
        }, 3000);
        return;
      }

      // PRVO kreiraj porudžbinu
      const result = await potvrdiPorudzbinu();
      console.log('[KorpaActions] Rezultat potvrde porudžbine (Montrypay):', result);

      if (!result.success) {
        return; // Zaustavi izvršavanje ako kreiranje nije uspelo
      }

      // Email obaveštenje
      await posaljiObavestenjePorudzbina({
        korisnikEmail: session?.user?.email || '',
        adminEmail: process.env.EMAIL_USER || '',
        subjectKorisnik: 'Nova porudžbina plaćena putem Montrypay-a',
        subjectAdmin: 'Porudžbina uspešno plaćena putem Montrypay-a',
        tip: 'placanje',
        ukupno,
        stavke: stavke.map(s => ({
          naziv: s.proizvod?.naziv_sr || 'Nepoznat proizvod',
          kolicina: s.kolicina,
          cena: s.proizvod?.cena || 0,
          boja: s.boja,
          velicina: s.velicina
        })),
      });

      // Prikaži success obaveštenje
      setSuccessMessage(t.montrypay_success || 'Porudžbina je kreirana!');
      setShowSuccess(true);

      // Očisti korpu i redirect nakon 3 sekunde
      setTimeout(async () => {
        await ocistiKorpu(userId);
        refreshKorpa();
        router.push('/moje-porudzbine');
      }, 3000);
    } catch (error) {
      console.error('[KorpaActions] Error during Montrypay checkout:', error);
      setMessage(t.error || 'Greška pri Montrypay plaćanju');
    } finally {
      setPendingMontrypay(false);
    }
  };

  // if (!stavke.length && !showSuccess) return null;

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {message}
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <SuccessMessage message={successMessage} />
      )}

      <Card className="shadow-lg border-2">
        <CardContent className="p-4 space-y-4">
          {/* Naslov */}
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
            {t.pregled_korpe || 'Pregled korpe'}
          </h2>

          {/* Ukupno */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-700">
                {t.ukupno || 'Ukupno'}:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {ukupno.toFixed(2)} €
              </span>
            </div>
          </div>

          <Separator />

          {/* Akcije dugmad */}
          <div className="space-y-3">
            {/* Završi kupovinu - glavno */}
            <Button
              onClick={handleZavrsiKupovinu}
              disabled={pendingKupovina || isPending}
              size="lg"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              {pendingKupovina ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                  <FaShoppingCart className="mr-2 h-5 w-5" />
              )}
              {t.zavrsi_kupovinu || 'Završi kupovinu'}
            </Button>

            {/* Montrypay */}
            <Button
              onClick={handleMontrypayPlaćanje}
              disabled={pendingMontrypay || isPending}
              size="lg"
              variant="outline"
              className="w-full h-11 text-base font-medium border-2 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 transition-all"
            >
              {pendingMontrypay ? (
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaCreditCard className="mr-2 h-4 w-4" />
              )}
              {t.montrypay || 'Montrypay'}
            </Button>

            <Separator className="my-3" />

            {/* Stripe Checkout */}
            <div className="pt-1">
              <p className="text-xs text-gray-500 mb-2 text-center">{t.ili_platite_karticom || 'Ili platite karticom'}</p>
              <StripeCheckoutForm
                amountInCents={Math.round(ukupno * 100)}
                onSuccess={handleStripeSuccess}
                disabled={pendingKorpa || pendingMontrypay || pendingKupovina || pendingStripe || isPending}
              />
            </div>

            <Separator className="my-3" />

            {/* Isprazni korpu */}
            <Button
              onClick={isprazniKorpu}
              disabled={pendingKorpa || isPending}
              variant="ghost"
              size="sm"
              className="w-full h-10 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
            >
              {pendingKorpa ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaTrashAlt className="mr-2 h-3 w-3" />
              )}
              {t.isprazni_korpu || 'Isprazni korpu'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}