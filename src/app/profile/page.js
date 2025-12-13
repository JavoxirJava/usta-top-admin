"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { PageTransition } from '@/components/PageTransition';
import { Bell, Lock, User, Globe, Moon, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SkeletonSectionTitle } from '@/components/skeleton/SkeletonSectionTitle';
import { toast } from 'sonner';
import { usersApi } from '@/services/usersApi';
import { SkeletonProfileCard } from '@/components/skeleton/SkeletonProfileCard';
import { SkeletonNotificationsCard } from '@/components/skeleton/SkeletonNotificationCard';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setFormData({
          first_name: parsedUser.first_name || '',
          last_name: parsedUser.last_name || '',
          email: parsedUser.email || '',
          phone_number: parsedUser.phone_number || ''
        });

        setLoading(false)
      }
    }
  }, [])

  const handleSignOut = () => {
    // LocalStorage tozalash
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Login sahifasiga yo'naltirish
    router.push("/login");
  };

  const handleSaveChanges = async () => {
    if (!user?.id) return;
    setLoading(true)
    try {

      const updatedUser = await usersApi.update(user.id, formData);

      // LocalStorage va state yangilash
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
      setUser(updatedUser.data);

      toast.success("Profile updated successfully!");
      setLoading(false)
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <PageTransition className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {loading ? <SkeletonSectionTitle /> : <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>}

        <div className="space-y-6">
          {/* Profile Settings */}
          {loading ? <SkeletonProfileCard /> : <GlassCard className="p-6 md:p-8">
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
                  value={formData.first_name}
                  onChange={(e) => {
                    setFormData({ ...formData, first_name: e.target.value })
                    setIsDirty(true);
                  }}

                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => {
                    setFormData({ ...formData, last_name: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setIsDirty(true);
                  }}

                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => {
                    setFormData({ ...formData, phone_number: e.target.value });
                    setIsDirty(true);
                  }}

                  className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl"
                />
              </div>
            </div>

          </GlassCard>}


          {loading ? <SkeletonSectionTitle /> : <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>}

          {/* Notifications */}
          {loading ? <SkeletonNotificationsCard /> : <GlassCard className="p-6 md:p-8">
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
              <GlassButton
                variant="danger"
                className="px-6 flex items-center gap-2"
                onClick={handleSignOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </GlassButton>
            </div>
          </GlassCard>}

          {loading ? <div className="flex justify-end pt-4">
            <div className="w-32 h-10 bg-gray-300 rounded-xl animate-pulse" />
          </div> : <div className="flex justify-end pt-4">
            <GlassButton
              className={`px-8 flex items-center justify-center gap-2 ${isSaving || !isDirty ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={handleSaveChanges}
              disabled={!isDirty || isSaving}
              whileHover={{ scale: !isSaving && isDirty ? 1.05 : 1 }}
              whileTap={{ scale: !isSaving && isDirty ? 0.95 : 1 }}
            >
              {isSaving ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
              ) : null}
              <span>{isSaving || loading ? 'Saving...' : 'Save Changes'}</span>
            </GlassButton>
          </div>}
        </div>
      </div>
    </PageTransition>
  );
}
