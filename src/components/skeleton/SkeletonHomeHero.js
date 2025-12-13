"use client";

import React from "react";

export function SkeletonHeroSection() {
  return (
    <section className="max-w-4xl mx-auto text-center mb-24 relative animate-pulse">

      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gray-200 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 -right-20 w-72 h-72 bg-gray-200 rounded-full blur-3xl -z-10" />

      {/* Headline skeleton */}
      <div className="h-12 md:h-16 w-72 md:w-96 mx-auto rounded-lg bg-gray-300 mb-4" />
      <div className="h-12 md:h-16 w-60 md:w-80 mx-auto rounded-lg bg-gray-300 mb-6" />

      {/* Paragraph skeleton */}
      <div className="h-5 w-64 md:w-96 mx-auto rounded-md bg-gray-200 mb-2" />
      <div className="h-5 w-64 md:w-80 mx-auto rounded-md bg-gray-200 mb-12" />

      {/* Search bar skeleton */}
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center bg-gray-200 rounded-2xl p-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full ml-4" />
          <div className="flex-1 h-10 bg-gray-300 rounded-lg mx-4" />
          <div className="hidden md:flex w-20 h-10 bg-gray-300 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
