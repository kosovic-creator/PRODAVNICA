'use client';
import React from 'react';

interface RegistracijaMessageProps {
  type: 'success' | 'error';
  message: string;
}

export function RegistracijaMessage({ type, message }: RegistracijaMessageProps) {
  React.useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(() => {
        window.location.href = '/prijava';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  if (type === 'success') {
    return (
      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-600 text-center font-semibold">{message}</p>
        {/* <p className="text-green-500 text-center text-sm mt-1">Preusmjeravamo vas za 3 sekunde...</p> */}
      </div>
    );
  }

  return (
    <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      {message}
    </div>
  );
}
