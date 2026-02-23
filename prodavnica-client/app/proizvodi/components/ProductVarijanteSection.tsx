'use client';

import { useState } from 'react';
import { Proizvodi } from '@/types';
import AddToCartButton from './AddToCartButton';
import { Button } from "@prodavnica/ui";

type VarijantaSummary = {
  boja: string;
  velicina: string;
  kolicina: number;
};

const PRODAVNICE_LABELS: Record<number, string> = {
  1: 'Delta',
  2: 'Centar',
  3: 'Outlet'
};

interface ProductVarijanteSectionProps {
  proizvod: Proizvodi;
  t: Record<string, string>;
}

export default function ProductVarijanteSection({ proizvod, t }: ProductVarijanteSectionProps) {
  const [selectedBoja, setSelectedBoja] = useState<string | null>(null);
  const [selectedVelicina, setSelectedVelicina] = useState<string | null>(null);
  const [selectedVarijanta, setSelectedVarijanta] = useState<VarijantaSummary | null>(null);

  const varijante = proizvod.varijante || [];

  const varijanteSummary = Array.from(
    varijante.reduce<Map<string, VarijantaSummary>>((acc, v) => {
      const key = `${v.boja}__${v.velicina}`;
      const current = acc.get(key);
      if (current) {
        current.kolicina += v.kolicina;
      } else {
        acc.set(key, { boja: v.boja, velicina: v.velicina, kolicina: v.kolicina });
      }
      return acc;
    }, new Map()).values()
  );

  // Get unique colors and sizes from varijante
  const boje = Array.from(new Set(varijanteSummary.map(v => v.boja)));

  // Filter varijante based on selected color and size
  const dostupneVelicine = selectedBoja
    ? Array.from(new Set(varijanteSummary.filter(v => v.boja === selectedBoja).map(v => v.velicina)))
    : [];

  // Update selected varijanta when selections change
  const handleBojaChange = (boja: string) => {
    setSelectedBoja(boja);
    setSelectedVelicina(null);
    setSelectedVarijanta(null);
  };

  const handleVelicinaChange = (velicina: string) => {
    setSelectedVelicina(velicina);

    // Find the varijanta with selected boja and velicina
    if (selectedBoja) {
      const varijanta = varijanteSummary.find(v => v.boja === selectedBoja && v.velicina === velicina);
      setSelectedVarijanta(varijanta || null);
    }
  };

  const handleCompleteSelection = (boja: string, velicina: string) => {
    const varijanta = varijanteSummary.find(v => v.boja === boja && v.velicina === velicina);
    if (varijanta) {
      setSelectedBoja(boja);
      setSelectedVelicina(velicina);
      setSelectedVarijanta(varijanta);
    }
  };

  const dostupnostPoProdavnicama = selectedBoja && selectedVelicina
    ? varijante
      .filter(v => v.boja === selectedBoja && v.velicina === selectedVelicina && v.kolicina > 0)
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
      {/* Boje Section */}
      {boje.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">{t['boja'] || 'Boja'}:</h3>
          <div className="flex flex-wrap gap-2">
            {boje.map((boja) => (
              <button
                key={boja}
                onClick={() => handleBojaChange(boja)}
                className={`px-4 py-2 rounded border-2 transition ${
                  selectedBoja === boja
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {boja}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Veličine Section */}
      {selectedBoja && dostupneVelicine.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">{t['velicina'] || 'Veličina'}:</h3>
          <div className="flex flex-wrap gap-2">
            {dostupneVelicine.map((velicina) => {
              const varijanta = varijanteSummary.find(v => v.boja === selectedBoja && v.velicina === velicina);
              return (
                <button
                  key={velicina}
                  onClick={() => handleVelicinaChange(velicina)}
                  disabled={!varijanta || varijanta.kolicina === 0}
                  className={`px-4 py-2 rounded border-2 transition ${
                    selectedVelicina === velicina
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : varijanta && varijanta.kolicina > 0
                      ? 'border-gray-300 hover:border-gray-400'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {velicina} {varijanta && varijanta.kolicina > 0 ? `(${varijanta.kolicina})` : '(0)'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedBoja && selectedVelicina && (
        <div className="bg-gray-50 border border-gray-200 rounded p-4">
          <h4 className="font-semibold text-gray-900 mb-2">{t['dostupno_po_prodavnicama'] || 'Dostupno po prodavnicama'}:</h4>
          {dostupneProdavnice.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
              {dostupneProdavnice.map((item) => (
                <div key={item.prodavnica_br} className="flex items-center justify-between bg-white border border-gray-200 rounded px-3 py-2">
                  <span className="font-medium">{PRODAVNICE_LABELS[item.prodavnica_br] || `Prodavnica ${item.prodavnica_br}`}</span>
                  <span>{item.kolicina}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t['nema_zalihama'] || 'Nema na zalihama'}</p>
          )}
        </div>
      )}

      {/* Table View of All Varijante */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t['dostupne_varijante'] || 'Dostupne varijante'}:</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2 text-left">{t['boja'] || 'Boja'}</th>
                <th className="p-2 text-left">{t['velicina'] || 'Veličina'}</th>
                <th className="p-2 text-center">{t['kolicina'] || 'Količina'}</th>
                <th className="p-2 text-center">{t['akcija'] || 'Akcija'}</th>
              </tr>
            </thead>
            <tbody>
              {varijanteSummary.map((varijanta) => (
                <tr
                  key={`${varijanta.boja}-${varijanta.velicina}`}
                  className={`border-b ${
                    selectedVarijanta?.boja === varijanta.boja && selectedVarijanta?.velicina === varijanta.velicina
                      ? 'bg-blue-50'
                      : varijanta.kolicina === 0
                        ? 'bg-red-50'
                        : ''
                  }`}
                >
                  <td className="p-2">{varijanta.boja}</td>
                  <td className="p-2">{varijanta.velicina}</td>
                  <td className={`p-2 text-center font-semibold ${varijanta.kolicina === 0 ? 'text-red-600' : ''}`}>
                    {varijanta.kolicina === 0 ? (
                      <span className="text-red-600">{t['nema_zalihama'] || 'nema'}</span>
                    ) : (
                      varijanta.kolicina
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <Button
                      size="sm"
                      variant={
                        selectedVarijanta?.boja === varijanta.boja && selectedVarijanta?.velicina === varijanta.velicina
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleCompleteSelection(varijanta.boja, varijanta.velicina)}
                      disabled={varijanta.kolicina === 0}
                    >
                      {selectedVarijanta?.boja === varijanta.boja && selectedVarijanta?.velicina === varijanta.velicina
                        ? t['izabrano'] || 'Izabrano'
                        : t['izaberi'] || 'Izaberi'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add to Cart Button */}
      {selectedVarijanta && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
          <p className="text-green-700 mb-4">
            {t['izabran'] || 'Izabrana'}:{' '}
            <span className="font-semibold">
              {selectedVarijanta.boja} / {selectedVarijanta.velicina} ({selectedVarijanta.kolicina} {t['dostupno'] || 'dostupno'})
            </span>
          </p>
          <AddToCartButton proizvod={proizvod} selectedBoja={selectedBoja} selectedVelicina={selectedVelicina} t={t} />
        </div>
      )}
    </div>
  );
}
