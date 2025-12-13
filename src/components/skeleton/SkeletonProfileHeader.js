"use client";

import React from "react";
import { GlassCard } from "../GlassCard";

export function SkeletonProfileHeader() {
  return (
    <div className="pt-32 pb-8 px-6">
      <GlassCard className="max-w-7xl mx-auto p-8 md:p-12 overflow-visible">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 animate-pulse">

          {/* Avatar skeleton */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full blur opacity-60" />
            <div className="relative w-[140px] h-[140px] rounded-full bg-gray-300 border-4 border-white shadow-2xl" />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-gray-300 border-4 border-white rounded-full" />
          </div>

          {/* Info skeleton */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full">

            {/* Name */}
            <div className="h-10 w-64 bg-gray-300 rounded-lg mx-auto md:mx-0" />

            {/* Badge */}
            <div className="h-7 w-40 bg-gray-200 rounded-full mx-auto md:mx-0" />

            {/* Location + link */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="h-5 w-44 bg-gray-200 rounded-md" />
              <div className="h-5 w-36 bg-gray-200 rounded-md" />
            </div>

            {/* Social icons */}
            <div className="flex justify-center md:justify-start gap-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-11 h-11 bg-gray-200 rounded-xl"
                />
              ))}
            </div>

          </div>
        </div>
      </GlassCard>
    </div>
  );
}
