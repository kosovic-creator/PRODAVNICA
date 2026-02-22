import ProizvodForm from '../ProizvodForm';
import { createProizvod } from '@/lib/actions/proizvodi';
import type { ProizvodData } from '@/lib/actions/proizvodi';

async function handleCreate(data: ProizvodData) {
    'use server';

    return await createProizvod(data);
}

export default function DodajProizvodPage() {
    return (
        <div className="max-w-xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Dodaj proizvod</h2>
            <ProizvodForm serverAction={handleCreate} />
      </div>
  );
}
