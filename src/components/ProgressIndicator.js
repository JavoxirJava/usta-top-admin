'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10" />

        {/* Active Progress Line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full -z-10"
          initial={{ width: '0%' }}
          animate={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isActive = stepNumber === currentStep

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 
                  transition-colors duration-300 z-10 bg-white
                  ${isActive ? 'border-blue-500 text-blue-500 shadow-lg shadow-blue-500/20' : ''}
                  ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'border-gray-300 text-gray-400' : ''}
                `}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted ? '#3B82F6' : '#FFFFFF',
                  borderColor:
                    isCompleted || isActive ? '#3B82F6' : '#D1D5DB',
                }}
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <span className="font-bold text-sm">{stepNumber}</span>
                )}
              </motion.div>

              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {stepNumber === 1 && 'Personal'}
                {stepNumber === 2 && 'Account'}
                {stepNumber === 3 && 'Role'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
