"use client"; // <- Framer Motion va interaktiv elementlar uchun kerak

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { PageTransition } from '@/components/PageTransition';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Users, Briefcase, DollarSign } from 'lucide-react';
import { dashboardApi } from '@/services/dashboardApi';
import { toast } from 'sonner';
import { SkeletonDashboardPage } from '@/components/skeleton/SkeletonDashboardPage';

const data = [
  { name: 'Mon', jobs: 4, income: 240 },
  { name: 'Tue', jobs: 3, income: 139 },
  { name: 'Wed', jobs: 2, income: 980 },
  { name: 'Thu', jobs: 6, income: 390 },
  { name: 'Fri', jobs: 8, income: 480 },
  { name: 'Sat', jobs: 5, income: 380 },
  { name: 'Sun', jobs: 1, income: 100 },
];



export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyActive, setWeeklyActive] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // localStorage yoki API orqali user olish
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const fetchDashboard = async (range = 'monthly') => {
    try {
      const res = await dashboardApi.getAll({ range })
      setStats(res.data?.stats);
      setWeeklyData(res.data?.weeklyData);
      setWeeklyActive(res.data?.weeklyActive);
    } catch (err) {
      toast.error("Error: " + err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      // Dashboard stats fetch qilish
      fetchDashboard();
    }

  }, [user]);

  if (!user || loading) return <SkeletonDashboardPage />;
  const STATS = user.role === "MASTER" ? [
    { label: 'Total Clients', value: stats?.totalClients, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Jobs', value: stats?.activeJobs, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
  ] : [
    { label: 'Total Masters', value: stats?.totalMasters, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Workers', value: stats?.activeWorkers, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];
  const areaChartData = weeklyData; // weekly total clients (master) yoki total masters (user)
  const barChartData = weeklyActive; // weekly active jobs (master) yoki active workers (user)

  return (
    <PageTransition className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Overview of your performance</p>
          </div>
          <div className="flex gap-2">
            <select
              onChange={(e) => fetchDashboard(e.target.value)}
              className="bg-white/50 border rounded-xl px-4 py-2"
            >
              <option value="daily">Last 1 Day</option>
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {STATS.map((stat, i) => (
            <GlassCard key={i} className="p-6 flex items-center gap-4" hoverEffect>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <motion.h3
                  className="text-2xl font-bold text-gray-900"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {stat.value}
                </motion.h3>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Income */}
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{user.role === "MASTER" ? "Weekly Clients" : "Weekly Masters"}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2F80ED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2F80ED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area type="monotone" dataKey={user.role === "MASTER" ? "clients" : "masters"} stroke="#2F80ED" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Job Requests */}
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6"> {user.role === "MASTER" ? "Job Requests" : "Active Workers"}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey={user.role === "MASTER" ? "jobs" : "workers"} fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
