"use client"; 

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';


export function GlassCard({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-white/60 backdrop-blur-xl
        border border-white/40
        shadow-[0_8px_32px_rgba(31,38,135,0.07)]
        rounded-3xl
        ${className}
      `}
      whileHover={
        hoverEffect
          ? {
              scale: 1.02,
              y: -5,
            }
          : undefined
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      {...props}
    >
      {/* Glossy reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none" />
      {children}
    </motion.div>
  );
}
