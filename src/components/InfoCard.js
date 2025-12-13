"use client"; 

import React from 'react';
import { GlassCard } from './GlassCard';
import { Mail, Phone, MapPin, Award } from 'lucide-react';

export function InfoCards({userInfo, region}) {
  const items = [
    {
      icon: Mail,
      label: 'Email',
      value: userInfo?.email,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: userInfo?.phone_number,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: region?.name || 'Address not set',
    },
    {
      icon: Award,
      label: 'Experience',
      value: userInfo.experience === null ? 'No experience' : userInfo.experience,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <GlassCard
          key={i}
          className="p-6 flex items-center gap-4"
          hoverEffect
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <item.icon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{item.label}</p>
            <p className="text-gray-900 font-bold">{item.value}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
