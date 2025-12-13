"use client";

import React from "react";
import { GlassCard } from "../GlassCard";

export function SkeletonInfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <GlassCard
          key={i}
          className="p-6 flex items-center gap-4"
        >
          {/* Icon skeleton */}
          <div className="p-3 rounded-xl bg-gray-200 w-12 h-12" />

          {/* Text skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded-md" />
            <div className="h-5 w-32 bg-gray-300 rounded-md" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
