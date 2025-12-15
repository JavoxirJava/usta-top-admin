"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';


export function GlassButton({
  children,
  type,
  variant = 'primary',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-[#2F80ED]/90 text-white border-transparent hover:bg-[#2F80ED]',
    secondary: 'bg-white/40 text-gray-800 border-white/40 hover:bg-white/60',
    danger: 'bg-red-500/80 text-white border-transparent hover:bg-red-500',
  };

  return (
    <motion.button
      type={type}
      className={`
          relative px-6 py-3 rounded-2xl font-semibold
          backdrop-blur-md border shadow-lg
          flex items-center justify-center gap-2
          transition-colors duration-200
          ${variants[variant]}
          ${className}
        `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
