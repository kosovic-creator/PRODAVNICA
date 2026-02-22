'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { VarijantaData } from '@/lib/actions/proizvodi';

interface ProizvodVarijanteFormProps {
  varijante: VarijantaData[];
  onChange: (varijante: VarijantaData[]) => void;
  errors?: Record<string, string>;
}

const dostupneVelicine = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];
const dostupneProdavnice = [
  { id: 1, label: 'Delta' },
  { id: 2, label: 'Centar' },
  { id: 3, label: 'Outlet' }
];

export default function ProizvodVarijanteForm({
  varijante,
  onChange,
  errors = {}
}: ProizvodVarijanteFormProps) {
  const [novaVarijanta, setNovaVarijanta] = useState<VarijantaData>({
    boja: '',
    velicina: '',
    kolicina: 0,
    prodavnica_br: 1
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [varijantaError, setVarijantaError] = useState<string | null>(null);

  const handleAddVarijanta = () => {
    setVarijantaError(null);

    if (!novaVarijanta.velicina) {
      setVarijantaError('Veličina je obavezna');
      return;
    }

    if (novaVarijanta.kolicina <= 0) {
      setVarijantaError('Količina mora biti veća od 0');
      return;
    }

    if (!novaVarijanta.prodavnica_br) {
      setVarijantaError('Prodavnica je obavezna');
      return;
    }

    // Provjeri da li već postoji ista kombinacija
    const exists = varijante.some((v, idx) =>
      idx !== editIndex &&
      v.boja.toLowerCase() === novaVarijanta.boja.toLowerCase() &&
      v.velicina === novaVarijanta.velicina &&
      v.prodavnica_br === novaVarijanta.prodavnica_br
    );

    if (exists) {
      setVarijantaError('Ova kombinacija boje i veličine već postoji');
      return;
    }

    if (editIndex !== null) {
      // Update
      const updated = [...varijante];
      updated[editIndex] = novaVarijanta;
      onChange(updated);
      setEditIndex(null);
    } else {
      // Add new
      onChange([...varijante, novaVarijanta]);
    }

    setNovaVarijanta({
      boja: '',
      velicina: '',
      kolicina: 0,
      prodavnica_br: 1
    });
  };

  const handleEditVarijanta = (index: number) => {
    setNovaVarijanta(varijante[index]);
    setEditIndex(index);
  };

  const handleDeleteVarijanta = (index: number) => {
    onChange(varijante.filter((_, i) => i !== index));
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setNovaVarijanta({
      boja: '',
      velicina: '',
      kolicina: 0,
      prodavnica_br: 1
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Varijante proizvoda (Boja + Veličina + Količina + Prodavnica)</h3>

      {varijantaError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {varijantaError}
        </div>
      )}

      {/* Form za dodavanje/uređivanje varijante */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 p-4 bg-white rounded border">
        <div>
          <Label className="block text-sm font-medium mb-1">Boja</Label>
          <Input
            type="text"
            placeholder="npr. Crvena"
            value={novaVarijanta.boja}
            onChange={(e) => {
              setVarijantaError(null);
              setNovaVarijanta({ ...novaVarijanta, boja: e.target.value });
            }}
            aria-invalid={varijantaError ? 'true' : 'false'}
            className="border-gray-300"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">Veličina</Label>
          <select
            value={novaVarijanta.velicina}
            onChange={(e) => {
              setVarijantaError(null);
              setNovaVarijanta({ ...novaVarijanta, velicina: e.target.value });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">Izaberite</option>
            {dostupneVelicine.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">Količina</Label>
          <Input
            type="number"
            min="0"
            value={novaVarijanta.kolicina}
            onChange={(e) => {
              setVarijantaError(null);
              setNovaVarijanta({ ...novaVarijanta, kolicina: parseInt(e.target.value) || 0 });
            }}
            className="border-gray-300"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">Prodavnica</Label>
          <select
            value={String(novaVarijanta.prodavnica_br)}
            onChange={(e) => {
              setVarijantaError(null);
              setNovaVarijanta({ ...novaVarijanta, prodavnica_br: Number(e.target.value) });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            {dostupneProdavnice.map((prodavnica) => (
              <option key={prodavnica.id} value={prodavnica.id}>{prodavnica.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-end">
          <Button
            type="button"
            onClick={handleAddVarijanta}
            className="flex-1 text-white hover:text-white"
          >
            {editIndex !== null ? 'Ažuriraj' : 'Dodaj'}
          </Button>
          {editIndex !== null && (
            <Button
              type="button"
              onClick={handleCancelEdit}
              variant="outline"
              className="flex-1"
            >
              Otkaži
            </Button>
          )}
        </div>
      </div>

      {/* Tabela sa varijantama */}
      {varijante.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-3 py-2 text-left">Boja</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Veličina</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Količina</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Prodavnica</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {varijante.map((varijanta, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-3 py-2">{varijanta.boja}</td>
                  <td className="border border-gray-300 px-3 py-2">{varijanta.velicina}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">{varijanta.kolicina}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {dostupneProdavnice.find((p) => p.id === varijanta.prodavnica_br)?.label || `Prodavnica ${varijanta.prodavnica_br}`}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditVarijanta(index)}
                      >
                        Izmjeni
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteVarijanta(index)}
                      >
                        Obriši
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Još nema varijanti. Dodajte prvu varijante!
        </div>
      )}

      {errors.varijante && <p className="mt-2 text-sm text-red-600">{errors.varijante}</p>}
    </div>
  );
}
