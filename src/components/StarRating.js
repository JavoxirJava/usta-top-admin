'use client';

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'



export function StarRating({
  rating,
  maxRating = 5,
  onRatingChange,
  readOnly = false,
  size = 20,
  className = '',
}) {
  const [hoverRating, setHoverRating] = useState(null)

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = (hoverRating !== null ? hoverRating : rating) >= starValue

        return (
          <motion.button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onRatingChange?.(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(null)}
            whileHover={!readOnly ? { scale: 1.2 } : undefined}
            whileTap={!readOnly ? { scale: 0.9 } : undefined}
            className={`
              relative focus:outline-none transition-colors duration-200
              ${readOnly ? 'cursor-default' : 'cursor-pointer'}
              ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
            `}
            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
          >
            <Star
              size={size}
              fill={isFilled ? 'currentColor' : 'none'}
              strokeWidth={isFilled ? 0 : 2}
              className="relative z-10"
            />
            {/* Glow effect for filled stars */}
            {isFilled && (
              <div className="absolute inset-0 bg-yellow-400/20 blur-sm rounded-full transform scale-150" />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
