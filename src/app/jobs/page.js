"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { PageTransition } from '@/components/PageTransition';
import { MapPin, Calendar, DollarSign, Clock, Check, X } from 'lucide-react';

const JOBS = [
  {
    id: 1,
    title: 'Full Apartment Wiring',
    client: 'John Doe',
    location: 'Downtown, SF',
    budget: '$2,500',
    date: 'Oct 24',
    status: 'pending',
    type: 'Electrical',
  },
  {
    id: 2,
    title: 'Bathroom Pipe Fix',
    client: 'Alice Smith',
    location: 'Mission Dist, SF',
    budget: '$450',
    date: 'Oct 25',
    status: 'pending',
    type: 'Plumbing',
  },
  {
    id: 3,
    title: 'Kitchen Cabinet Install',
    client: 'Robert Johnson',
    location: 'Sunset, SF',
    budget: '$1,200',
    date: 'Oct 26',
    status: 'completed',
    type: 'Carpentry',
  },
  {
    id: 4,
    title: 'Smart Home Setup',
    client: 'Emily Davis',
    location: 'SoMa, SF',
    budget: '$800',
    date: 'Oct 27',
    status: 'pending',
    type: 'Electrical',
  },
];

export default function JobsPage() {
  const [filter, setFilter] = useState('pending');
  const filteredJobs = JOBS.filter(
    (job) => filter === 'all' || job.status === filter
  );

  return (
    <PageTransition className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Requests</h1>
            <p className="text-gray-500">Manage your incoming work</p>
          </div>

          {/* Glass Tabs */}
          <div className="flex p-1 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 w-fit">
            {['pending', 'completed', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`
                  relative px-6 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                  ${filter === tab ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}
                `}
              >
                {filter === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white shadow-sm rounded-lg"
                    transition={{
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <GlassCard className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                        {job.type}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} /> {job.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600 mb-4">{job.client}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} /> {job.location}
                      </div>
                      <div className="flex items-center gap-1 text-gray-900 font-semibold">
                        <DollarSign size={16} /> {job.budget}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} /> Est. 2 days
                      </div>
                    </div>
                  </div>

                  {job.status === 'pending' && (
                    <div className="flex gap-3 w-full md:w-auto">
                      <GlassButton
                        variant="secondary"
                        className="flex-1 md:flex-none justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X size={20} />
                      </GlassButton>
                      <GlassButton className="flex-1 md:flex-none justify-center bg-green-500 hover:bg-green-600 border-none text-white">
                        <Check size={20} /> Accept
                      </GlassButton>
                    </div>
                  )}

                  {job.status === 'completed' && (
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium text-sm">
                      Completed
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
