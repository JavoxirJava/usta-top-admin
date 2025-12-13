'use client';

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { GlassCard } from './GlassCard'
import { GlassButton } from './GlassButton'
import { StarRating } from './StarRating'


export default function WorkerCard({ worker,regionName, onClick }) {
  return (
    <GlassCard
      hoverEffect
      className="flex flex-col h-full group cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={worker.avatar}
              alt={worker.first_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {worker.first_name}
            </h3>
            <p className="text-blue-600 font-medium text-sm mb-1">
              {worker.work_type || 'Worker'}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} />
              <span className="truncate">{regionName}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4 bg-white/40 p-2 rounded-lg w-fit">
          <StarRating rating={worker.rating} readOnly size={14} />
          <span className="text-xs font-medium text-gray-600">
            ({worker?.reviewCount} reviews)
          </span>
        </div>

        {/* Portfolio Preview */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {worker?.portfolio?.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={img}
                alt={`Portfolio ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/20">
          <GlassButton
            variant="secondary"
            className="w-full text-sm py-2 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
          >
            View Profile <ArrowRight size={16} />
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  )
}
