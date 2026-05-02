"use client";
import { useState } from "react";
// Pretpostavljamo da postoji CloudinaryUpload komponenta u app/components/CloudinaryUpload.tsx
import CloudinaryUpload from '../../../components/CloudinaryUpload';
import { Button } from "@prodavnica/ui";

export default function CloudinaryUploadField({ initialImages = [] }: { initialImages?: string[] }) {
  const [images, setImages] = useState<string[]>(initialImages);

  const handleUpload = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const handleRemove = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Slike proizvoda</label>
      <div className="flex flex-wrap gap-4 mb-2">
        {images.map((img, idx) => (
          <div key={img + idx} className="relative group">
            <img src={img} alt="Slika proizvoda" className="w-24 h-24 object-cover rounded border" />
            <Button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:text-red-800 shadow group-hover:opacity-100 opacity-80"
              title="Ukloni sliku"
            >
              &times;
            </Button>
          </div>
        ))}
        <CloudinaryUpload onUpload={handleUpload} />
      </div>
      {/* Hidden inputs for form submit */}
      {images.map((img, idx) => (
        <input key={img + idx} type="hidden" name="slike" value={img} />
      ))}
      <div className="text-sm text-gray-500">Možete dodati više slika. Prva slika će biti glavna.</div>
    </div>
  );
}
