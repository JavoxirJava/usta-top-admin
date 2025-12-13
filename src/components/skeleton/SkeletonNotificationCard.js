import React from 'react';
import { Bell } from 'lucide-react';

export function SkeletonNotificationsCard() {
  return (
    <div className="p-6 md:p-8 border border-white/20 rounded-xl animate-pulse bg-gray-100/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-purple-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/5" />
          <div className="h-3 bg-gray-200 rounded w-2/5" />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="space-y-1 flex-1">
              <div className="h-3 bg-gray-300 rounded w-3/5" />
              <div className="h-2 bg-gray-200 rounded w-2/5" />
            </div>
            <div className="w-11 h-6 bg-gray-200 rounded-full" />
          </div>
        ))}
        <div className="w-32 h-10 bg-red-400 rounded-xl mt-4" />
      </div>
    </div>
  );
}
