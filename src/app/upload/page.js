"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { PageTransition } from '@/components/PageTransition';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <PageTransition className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add to Portfolio
          </h1>
          <p className="text-gray-500">
            Showcase your best work to attract more clients
          </p>
        </div>

        <GlassCard className="p-8 md:p-10">
          <form className="space-y-8">
            {/* Upload Area */}
            <div
              className={`
                relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300
                ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'}
              `}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Click or drag image to upload
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <GlassButton type="button" variant="secondary" className="mt-2">
                  Select File
                </GlassButton>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Project Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g. Modern Kitchen Renovation"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Category
                </label>
                <select className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
                  <option>Electrical</option>
                  <option>Plumbing</option>
                  <option>Carpentry</option>
                  <option>Painting</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  placeholder="Describe what you did..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <GlassButton variant="secondary" type="button">
                Cancel
              </GlassButton>
              <GlassButton type="submit" className="px-8">
                Save Project
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
