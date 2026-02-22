'use client';

import { useState } from 'react';
import { Proizvodi } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type VarijantaSummary = {
  boja: string;
  velicina: string;
  kolicina: number;
};

interface SelectVarijanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (boja: string, velicina: string) => void;
  proizvod: Proizvodi;
  t: Record<string, string>;
}

export default function SelectVarijanteModal({
  isOpen,
  onClose,
  onConfirm,
  proizvod,
  t,
}: SelectVarijanteModalProps) {
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

  // Handle color change
  const handleBojaChange = (boja: string) => {
    setSelectedBoja(boja);
    setSelectedVelicina(null);
    setSelectedVarijanta(null);
  };

  // Handle size change
  const handleVelicinaChange = (velicina: string) => {
    setSelectedVelicina(velicina);

    // Find the varijanta with selected boja and velicina
    if (selectedBoja) {
      const varijanta = varijanteSummary.find(v => v.boja === selectedBoja && v.velicina === velicina);
      setSelectedVarijanta(varijanta || null);
    }
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (selectedBoja && selectedVelicina) {
      onConfirm(selectedBoja, selectedVelicina);
      handleClose();
    }
  };

  // Handle close
  const handleClose = () => {
    setSelectedBoja(null);
    setSelectedVelicina(null);
    setSelectedVarijanta(null);
    onClose();
  };

  // Check if selection is complete
  const isSelectionComplete = selectedBoja && selectedVelicina && selectedVarijanta;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t['odaberi_varijantu'] || 'Odaberi varijantu'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                          {velicina} {varijanta && varijanta.kolicina > 0 ? `(${varijanta.kolicina})` : <span className="text-red-600 font-semibold">{t['nema_zalihama'] || 'nema na zalihama'}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Varijante Table */}
          {varijanteSummary.length > 0 && (
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
                            onClick={() => {
                              setSelectedBoja(varijanta.boja);
                              setSelectedVelicina(varijanta.velicina);
                              setSelectedVarijanta(varijanta);
                            }}
                            disabled={varijanta.kolicina === 0}
                          >
                            {selectedVarijanta?.boja === varijanta.boja && selectedVarijanta?.velicina === varijanta.velicina ? '✓' : t['odaberi'] || 'Odaberi'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={handleClose}>
              {t['otkaži'] || 'Otkaži'}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isSelectionComplete}
            >
              {t['potvrdi'] || 'Potvrdi'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
