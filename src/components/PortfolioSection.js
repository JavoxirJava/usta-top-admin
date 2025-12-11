"use client";

import React from 'react';
import { GlassCard } from './GlassCard';
import { motion } from 'framer-motion';

const PROJECTS = [
  {
    id: 1,
    title: 'Modern Kitchen Lighting',
    category: 'Electrical',
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Smart Home Hub',
    category: 'Automation',
    img: 'https://images.unsplash.com/photo-1558002038-1091a166111c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Garden Landscape',
    category: 'Outdoor',
    img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

export function PortfolioSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {PROJECTS.map((project, i) => (
        <GlassCard
          key={project.id}
          className="group cursor-pointer p-3"
          hoverEffect
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              src={project.img}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider text-gray-800">
              {project.category}
            </div>
          </div>

          <div className="px-2 pb-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
