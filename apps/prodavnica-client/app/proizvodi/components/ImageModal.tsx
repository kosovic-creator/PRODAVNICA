"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@prodavnica/ui";

type ImageModalProps = {
  src: string;
  alt: string;
};

export default function ImageModal({ src, alt }: ImageModalProps) {
  const [showModal, setShowModal] = useState(false);

  if (!src) return null;

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={500}
        height={400}
        className="w-full h-auto object-cover rounded-lg shadow-md cursor-zoom-in"
        unoptimized
        priority
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowModal(false)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <Image
              src={src}
              alt={alt}
              width={900}
              height={700}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
              unoptimized
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full"
              onClick={() => setShowModal(false)}
              aria-label="Zatvori"
            >
              <span className="text-xl">✕</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
