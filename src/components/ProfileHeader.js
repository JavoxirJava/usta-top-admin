"use client"; // <- Framer Motion va interaktiv elementlar uchun kerak

import React from 'react';
import { GlassCard } from './GlassCard';
import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Twitter, Linkedin, Github, Star } from 'lucide-react';

export function ProfileHeader() {
    return (
        <div className="pt-32 pb-8 px-6">
            <GlassCard className="max-w-7xl mx-auto p-8 md:p-12 overflow-visible">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                    {/* Profile Image with Ring */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative shrink-0"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-70" />
                        <div className="relative w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white shadow-2xl">
                            <img
                                src="https://ausinet.edu.au/wp-content/uploads/elementor/thumbs/11-piw2phzs3y16ocm8maohsiq2ovyyj3og2ydg8ruvfa.png"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg" />
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
                            >
                                Ulugbek Raxmatillayev
                            </motion.h1>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold"
                            >
                                <Star size={14} fill="currentColor" /> Top Rated Electrician
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-600 font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                United Kingdom, London
                            </div>
                            <div className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                ulugbek.electrical
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-center md:justify-start gap-3 pt-2"
                        >
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="p-2.5 bg-white/50 border border-white/40 rounded-xl hover:bg-white hover:scale-110 transition-all shadow-sm text-gray-600 hover:text-blue-600"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </motion.div>
                    </div>

                    {/* Stats */}
                    {/* <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-8 md:gap-12 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-12 w-full md:w-auto justify-center md:justify-start"
          >
            {[
              { label: 'Followers', val: '12k' },
              { label: 'Projects', val: '85' },
              { label: 'Rating', val: '4.9' },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-3xl font-bold text-gray-900">{stat.val}</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div> */}
                </div>
            </GlassCard>
        </div>
    );
}
