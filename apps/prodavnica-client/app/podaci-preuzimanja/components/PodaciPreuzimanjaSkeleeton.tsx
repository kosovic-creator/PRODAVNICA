"use client";

export default function podaciPreuzimanjaSkeleeton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8" />

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <div className="h-12 bg-gray-200 rounded flex-1" />
            <div className="h-12 bg-gray-200 rounded flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
