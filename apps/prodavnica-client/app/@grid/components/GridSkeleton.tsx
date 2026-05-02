"use client";

export default function GridSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-full h-32 bg-gray-200 rounded mb-4" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="flex gap-0">
              <div className="h-10 bg-gray-200 rounded flex-1" />
              <div className="h-10 bg-gray-200 rounded flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
