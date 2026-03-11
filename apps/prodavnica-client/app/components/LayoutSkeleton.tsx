"use client";

export default function LayoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4" />
        </div>

        {/* Grid of card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-pulse">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              {/* Image skeleton */}
              <div className="mb-4 h-32 bg-gray-200 rounded-lg" />

              {/* Title skeleton */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

              {/* Description skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>

              {/* Price skeleton */}
              <div className="h-5 bg-gray-300 rounded w-1/3 mb-4" />

              {/* Buttons skeleton */}
              <div className="flex gap-2 h-10">
                <div className="flex-1 bg-gray-300 rounded" />
                <div className="flex-1 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
