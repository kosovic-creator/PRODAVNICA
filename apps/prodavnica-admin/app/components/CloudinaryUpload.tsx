"use client";
import React, { useState } from 'react';
import { Input } from "@prodavnica/ui";
import { Button } from "@prodavnica/ui";

interface Props {
  onUpload?: (url: string) => void;
}

export default function CloudinaryUpload({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'prodavnica'); // npr. 'web-upload'

      const res = await fetch('https://api.cloudinary.com/v1_1/dykz9ack1/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        if (onUpload) onUpload(data.secure_url);
      } else {
        setError('Upload nije uspio!');
      }
    } catch (err) {
      setError('Greška pri uploadu!');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Uploadujem...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {imageUrl && (
        <div className="space-y-2">
          <img src={imageUrl} alt="Uploadovana slika" className="max-w-[300px]" />
          <p>URL: {imageUrl}</p>
          <Button type="button" onClick={() => setImageUrl(null)} variant="secondary">Ukloni</Button>
        </div>
      )}
    </div>
  );
}
