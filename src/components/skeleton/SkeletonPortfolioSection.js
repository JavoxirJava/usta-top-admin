"use client";

import React from "react";
import { GlassCard } from "../GlassCard";

export function SkeletonPortfolioSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <GlassCard key={i} className="p-3">
          {/* Image skeleton */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 bg-gray-200" />

          {/* Category badge skeleton */}
          <div className="h-5 w-20 bg-gray-300 rounded-lg mb-2" />

          {/* Title skeleton */}
          <div className="h-6 w-32 bg-gray-300 rounded-md" />
        </GlassCard>
      ))}
    </div>
  );
}
