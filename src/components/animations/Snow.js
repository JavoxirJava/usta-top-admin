'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Snow() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  if (windowSize.width === 0) return null; // SSR paytida hech narsa render qilmaymiz

  return (
    <motion.div
      className="absolute w-2 h-2 bg-white/70 rounded-full"
      initial={{
        x: Math.random() * windowSize.width,
        y: -10,
        opacity: Math.random(),
      }}
      animate={{
        y: windowSize.height + 20,
        x: `+=${Math.random() * 40 - 20}`,
      }}
      transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
    />
  );
}
