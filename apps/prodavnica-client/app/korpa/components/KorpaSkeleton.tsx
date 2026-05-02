"use client";

export default function KorpaSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
