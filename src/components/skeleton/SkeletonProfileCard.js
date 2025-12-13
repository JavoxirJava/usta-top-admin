import React from 'react';

export function SkeletonProfileCard() {
  return (
    <div className="p-6 md:p-8 border border-white/20 rounded-xl animate-pulse bg-gray-100/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/5" />
          <div className="h-3 bg-gray-200 rounded w-2/5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-2/5" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
