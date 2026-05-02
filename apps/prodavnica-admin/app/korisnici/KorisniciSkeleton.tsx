"use client";

export default function KorisniciSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="relative w-full overflow-x-auto">
            <div className="w-full caption-bottom text-sm">
              <div className="bg-gray-50">
                <div className="grid grid-cols-5">
                  {['Ime', 'Email', 'Telefon', 'Uloga', 'Akcije'].map((h) => (
                    <div key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</div>
                  ))}
                </div>
              </div>
              <div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 border-t">
                    <div className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24" /></div>
                    <div className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-32" /></div>
                    <div className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20" /></div>
                    <div className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16" /></div>
                    <div className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
