"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { PageTransition } from '@/components/PageTransition';
import { Bell, Lock, User, Globe, Moon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <PageTransition className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Profile Information
                </h2>
                <p className="text-sm text-gray-500">
                  Update your personal details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="Alex"
                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Morgan"
                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="alex@example.com"
                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl"
                />
              </div>
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Bell size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Notifications
                </h2>
                <p className="text-sm text-gray-500">
                  Manage how you receive updates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: 'New Job Requests',
                  desc: 'Get notified when a client sends a request',
                },
                {
                  label: 'Messages',
                  desc: 'Receive emails when you get a new message',
                },
                {
                  label: 'Marketing',
                  desc: 'Receive updates about new features',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="flex justify-end pt-4">
            <GlassButton className="px-8">Save Changes</GlassButton>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
