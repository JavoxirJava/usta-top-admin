"use client";

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';

const CRAFTSMEN = [
  {
    id: 1,
    name: 'Alex Morgan',
    role: 'Electrician',
    rating: 4.9,
    location: 'San Francisco',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Interior Designer',
    rating: 5.0,
    location: 'New York',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Mike Ross',
    role: 'Plumber',
    rating: 4.8,
    location: 'Chicago',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
];

export default function HomePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <PageTransition className="min-h-screen pt-32 pb-20 px-6">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-24 relative">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 -right-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
        >
          Find the perfect <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F80ED] to-purple-600">
            Craftsman
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Connect with top-rated professionals for your home projects. Trusted,
          verified, and ready to help.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-2 shadow-2xl">
              <Search className="ml-4 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="What service do you need?"
                className="w-full px-4 py-3 bg-transparent border-none outline-none text-lg text-gray-800 placeholder-gray-400"
              />
              <GlassButton className="hidden md:flex">Search</GlassButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Craftsmen */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Top Rated Pros</h2>
          <Link
            href="/jobs"
            className="text-[#2F80ED] font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CRAFTSMEN.map((person, i) => (
            <Link key={person.id} href="/profile">
              <GlassCard
                hoverEffect
                className="p-6 h-full flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={person.img}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {person.name}
                </h3>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
                  {person.role}
                </span>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 w-full pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900">{person.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {person.location}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
