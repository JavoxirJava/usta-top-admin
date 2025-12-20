'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { PageTransition } from '@/components/PageTransition';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications');
      const data = res.data;

      // Normalize response to always be an array
      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (Array.isArray(data?.notifications)) {
        setNotifications(data.notifications);
      } else {
        console.error('Unexpected notifications response format:', data);
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <PageTransition className="min-h-screen pt-32 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && Array.isArray(notifications) && notifications.length === 0 && (
          <p className="text-gray-500">No notifications yet</p>
        )}

        <div className="space-y-4">
          {Array.isArray(notifications) && notifications.length > 0 && notifications.map((notif) => (
            <GlassCard key={notif.id} className="p-4 flex flex-col">
              <p className="text-gray-700">{notif.message}</p>
              <p className="text-gray-400 text-sm mt-1">
                Type: {notif.type} | Read: {notif.isRead ? 'Yes' : 'No'}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
