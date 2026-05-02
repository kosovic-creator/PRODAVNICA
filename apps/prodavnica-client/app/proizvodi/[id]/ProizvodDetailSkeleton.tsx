"use client";

export default function ProizvodDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Slike */}
          <div className="space-y-4">
            <div className="w-full h-96 bg-gray-200 rounded-lg" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          {/* Detalji */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-1/4" />
            </div>

            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>

            <div className="flex gap-3">
              <div className="h-12 bg-gray-200 rounded flex-1" />
              <div className="h-12 bg-gray-200 rounded flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
