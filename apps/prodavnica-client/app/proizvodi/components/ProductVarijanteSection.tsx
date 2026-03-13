'use client';

import { useMemo, useState } from 'react';
import { Proizvodi } from '@/types';
import AddToCartButton from './AddToCartButton';
import { Heart } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

type VarijantaSummary = {
  boja: string;
  boja_en: string;
  velicina: string;
  kolicina: number;
};

const PRODAVNICE_LABELS: Record<number, string> = {
  1: 'Delta',
  2: 'Centar',
  3: 'Outlet'
};

type SizeUnit = 'EU' | 'US' | 'CM';

interface ProductVarijanteSectionProps {
  proizvod: Proizvodi;
  t: Record<string, string>;
}

export default function ProductVarijanteSection({ proizvod, t }: ProductVarijanteSectionProps) {
  const { language } = useI18n();
  const [selectedBoja, setSelectedBoja] = useState<string | null>(null);
  const [selectedBojaEn, setSelectedBojaEn] = useState<string | null>(null);
  const [selectedVelicina, setSelectedVelicina] = useState<string | null>(null);
  const [selectedVarijanta, setSelectedVarijanta] = useState<VarijantaSummary | null>(null);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('EU');
  const [showStoreAvailability, setShowStoreAvailability] = useState(false);

  const varijante = proizvod.varijante || [];

  const bojaMap = useMemo(() => {
    const sr = Array.isArray(proizvod.boja) ? proizvod.boja : [];
    const en = Array.isArray(proizvod.boja_en) ? proizvod.boja_en : [];
    return sr.reduce<Record<string, string>>((acc, srBoja, index) => {
      const enBoja = en[index];
      if (typeof enBoja === 'string' && enBoja.trim()) {
        acc[srBoja] = enBoja;
      }
      return acc;
    }, {});
  }, [proizvod.boja, proizvod.boja_en]);

  const varijanteSummary = Array.from(
    varijante.reduce<Map<string, VarijantaSummary>>((acc, v) => {
      const key = `${v.boja}__${v.velicina}`;
      const current = acc.get(key);
      if (current) {
        current.kolicina += v.kolicina;
      } else {
        acc.set(key, {
          boja: v.boja,
          boja_en: (v.boja_en && v.boja_en.trim()) || bojaMap[v.boja] || '',
          velicina: v.velicina,
          kolicina: v.kolicina,
        });
      }
      return acc;
    }, new Map()).values()
  );

  // Get unique colors and sizes from varijante
  const sveVelicine = Array.from(new Set(varijanteSummary.map(v => v.velicina)));

  // Filter colors based on selected size (only show colors with available stock)
  const dostupneBoje = selectedVelicina
    ? Array.from(
      varijanteSummary
        .filter(v => v.velicina === selectedVelicina && v.kolicina > 0)
        .reduce<Map<string, { boja: string; label: string }>>((acc, v) => {
          if (!acc.has(v.boja)) {
            acc.set(v.boja, {
              boja: v.boja,
              label: language === 'en' ? (v.boja_en || v.boja) : v.boja,
            });
          }
          return acc;
        }, new Map())
        .values()
    )
    : [];

  // Update selected varijanta when selections change
  const handleVelicinaChange = (velicina: string) => {
    setSelectedVelicina(velicina);
    setSelectedBoja(null); // Reset boja when velicina changes
    setSelectedBojaEn(null);

    // Get all colors available for this size
    const bojeZaVelicinu = Array.from(new Set(
      varijanteSummary
        .filter(v => v.velicina === velicina && v.kolicina > 0)
        .map(v => v.boja)
    ));

    if (bojeZaVelicinu.length === 1) {
      // Auto-select the only available color
      const varijanta = varijanteSummary.find(v => v.velicina === velicina && v.boja === bojeZaVelicinu[0]);
      setSelectedBoja(bojeZaVelicinu[0]);
      setSelectedBojaEn((varijanta?.boja_en && varijanta.boja_en.trim()) || bojaMap[bojeZaVelicinu[0]] || bojeZaVelicinu[0]);
      setSelectedVarijanta(varijanta || null);
    } else if (bojeZaVelicinu.length === 0) {
      // No colors available, set a basic varijanta with just size
      // Calculate total quantity for this size
      const ukupnaKolicina = varijanteSummary
        .filter(v => v.velicina === velicina)
        .reduce((sum, v) => sum + v.kolicina, 0);
      setSelectedVarijanta({
        boja: '',
        boja_en: '',
        velicina,
        kolicina: ukupnaKolicina
      });
    } else {
      // Multiple colors available, wait for user to select
      setSelectedVarijanta(null);
    }
  };

  const handleBojaChange = (boja: string) => {
    setSelectedBoja(boja);

    // Find the varijanta with selected velicina and boja
    if (selectedVelicina) {
      const varijanta = varijanteSummary.find(v => v.velicina === selectedVelicina && v.boja === boja);
      setSelectedBojaEn((varijanta?.boja_en && varijanta.boja_en.trim()) || bojaMap[boja] || boja);
      setSelectedVarijanta(varijanta || null);
    }
  };

  const dostupnostPoProdavnicama = selectedVelicina
    ? varijante
      .filter(v => {
        const velicinaMatch = v.velicina === selectedVelicina;
        const bojaMatch = selectedBoja ? v.boja === selectedBoja : true;
        return velicinaMatch && bojaMatch && v.kolicina > 0;
      })
      .reduce<Record<number, number>>((acc, v) => {
        const br = v.prodavnica_br ?? 1;
        acc[br] = (acc[br] || 0) + v.kolicina;
        return acc;
      }, {})
    : {};

  const dostupneProdavnice = Object.entries(dostupnostPoProdavnicama)
    .map(([prodavnica_br, kolicina]) => ({
      prodavnica_br: Number(prodavnica_br),
      kolicina
    }))
    .filter((item) => item.kolicina > 0)
    .sort((a, b) => a.prodavnica_br - b.prodavnica_br);

  // If no varijante, show message
  if (varijante.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
        <p className="text-red-600">{t['nema_dostupnih_proizvoda'] || 'Nema dostupnih varijanti'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Veličine Section sa Size Unit Selector */}
      <div>
        {/* Size Unit Selector */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">{t['velicina'] || 'VELIČINA'}:</h3>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
            {(['EU', 'US', 'CM'] as SizeUnit[]).map((unit) => (
              <button
                key={unit}
                onClick={() => setSizeUnit(unit)}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${sizeUnit === unit
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
                  }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {sveVelicine.map((velicina) => {
            // Sum all quantities for this size (regardless of color)
            const ukupnaKolicina = varijanteSummary
              .filter(v => v.velicina === velicina)
              .reduce((sum, v) => sum + v.kolicina, 0);
            const isAvailable = ukupnaKolicina > 0;
            const isSelected = selectedVelicina === velicina;

            return (
              <button
                key={velicina}
                onClick={() => handleVelicinaChange(velicina)}
                disabled={!isAvailable}
                className={`
                  px-3 py-3 rounded-md border-2 transition font-semibold text-sm
                  ${isSelected
                    ? 'border-black bg-black text-white'
                    : isAvailable
                      ? 'border-gray-300 hover:border-gray-500 bg-white'
                      : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                  }
                `}
              >
                {velicina}
              </button>
            );
          })}
        </div>
      </div>

      {/* Boje Section - prikazuje se samo ako postoje boje za izabranu veličinu */}
      {selectedVelicina && dostupneBoje.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">{t['boja'] || 'BOJA'}:</h3>
          <div className="flex flex-wrap gap-2">
            {dostupneBoje.map(({ boja, label }) => (
              <button
                key={boja}
                onClick={() => handleBojaChange(boja)}
                className={`px-4 py-2 rounded-md border-2 transition font-medium text-sm ${selectedBoja === boja
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dugme Dostupnost u radnjama */}
      {selectedVelicina && dostupneProdavnice.length > 0 && (
        <button
          onClick={() => setShowStoreAvailability(!showStoreAvailability)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md text-sm font-semibold hover:border-gray-400 transition bg-white"
        >
          {showStoreAvailability
            ? `▲ ${t['sakrij_dostupnost_u_radnjama'] || 'Sakrij dostupnost u radnjama'}`
            : `▼ ${t['dostupnost_u_radnjama'] || 'Dostupnost u radnjama'}`}
        </button>
      )}

      {/* Prikaz dostupnosti po prodavnicama */}
      {showStoreAvailability && selectedVelicina && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">{t['dostupno_po_prodavnicama'] || 'Dostupno po prodavnicama'}:</h4>
          {dostupneProdavnice.length > 0 ? (
            <div className="space-y-2">
              {dostupneProdavnice.map((item) => (
                <div key={item.prodavnica_br} className="flex items-center justify-between bg-white border border-gray-200 rounded px-4 py-3">
                  <span className="font-medium text-gray-900">{PRODAVNICE_LABELS[item.prodavnica_br] || `Prodavnica ${item.prodavnica_br}`}</span>
                  <span className="text-green-600 font-semibold">{item.kolicina} kom</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t['nema_zalihama'] || 'Nema na zalihama'}</p>
          )}
        </div>
      )}

      {/* Add to Cart and Favorite Buttons - enable when size is selected */}
      {selectedVelicina && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <AddToCartButton proizvod={proizvod} selectedBoja={selectedBoja} selectedBojaEn={selectedBojaEn} selectedVelicina={selectedVelicina} t={t} />
            </div>
            <button
              className="px-6 py-3 border-2 border-gray-300 rounded-md hover:border-gray-400 transition flex items-center justify-center"
              aria-label="Dodaj u omiljene"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold">
              {(selectedBoja ? `${language === 'en' ? (selectedBojaEn || selectedBoja) : selectedBoja} / ` : '')}{selectedVelicina}
            </span>
            {selectedVarijanta && (
              <>
                {' - '}
                <span className="text-green-600">{selectedVarijanta.kolicina} {t['dostupno'] || 'dostupno'}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
