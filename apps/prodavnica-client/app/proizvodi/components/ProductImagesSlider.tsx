"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@prodavnica/ui";

export default function ProductImagesSlider({ slike, naziv, t }: { slike: string[]; naziv: string; t: Record<string, string> }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="md:w-1/2 p-8 flex flex-col gap-4">
      {slike.length > 0 ? (
        <>
          <div className="relative w-full">
            <div className="flex overflow-x-auto gap-4">
              {slike.map((src, idx) => (
                <div key={idx} className="shrink-0 w-48 h-48 flex items-center justify-center">
                  <Image
                    src={src}
                    alt={`${naziv} ${idx + 1}`}
                    width={192}
                    height={192}
                    className="object-cover rounded-lg shadow-md cursor-zoom-in w-full h-full"
                    unoptimized
                    priority={idx === 0}
                    onClick={() => setSelectedImage(src)}
                  />
                </div>
              ))}
            </div>
          </div>
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative" onClick={e => e.stopPropagation()}>
                <Image
                  src={selectedImage}
                  alt={naziv}
                  width={900}
                  height={700}
                  className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  unoptimized
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Zatvori"
                >
                  <span className="text-xl">✕</span>
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">{t['nema_proizvoda_prikaz'] || 'Nema slike'}</span>
        </div>
      )}
    </div>
  );
}
