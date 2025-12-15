"use client"; 

import React from 'react';
import { GlassButton } from './GlassButton';
import { MessageSquare, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function FloatingCTA({number}) {
  const router = useRouter()
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-6 pointer-events-none"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-2 flex gap-3 pointer-events-auto">
        <GlassButton variant="secondary" className="px-6" onClick={() => {router.prefetch(`https://t.me/${number}`)}}>
          <MessageSquare size={20} />
          <span className="hidden md:inline">Message</span>
        </GlassButton>
        <GlassButton className="px-8 shadow-blue-500/30">
          <Calendar size={20} />
          Book Now
        </GlassButton>
      </div>
    </motion.div>
  );
}
