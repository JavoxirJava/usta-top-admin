"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SkeletonHeroSection } from '@/components/skeleton/SkeletonHomeHero';
import { usersApi } from '@/services/usersApi';
import { regionsApi } from '@/services/regionsApi';
import { SkeletonSectionTitle } from '@/components/skeleton/SkeletonSectionTitle';
import { SkeletonUserCard } from '@/components/skeleton/SkeletonCard';
import { portfolioImagesApi } from '@/services/portfolioImagesApi';
import { url } from '@/lib/apiClient';

// const CRAFTSMEN = [
//   {
//     id: 1,
//     name: 'Alex Morgan',
//     role: 'Electrician',
//     rating: 4.9,
//     location: 'San Francisco',
//     img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//   },
//   {
//     id: 2,
//     name: 'Sarah Chen',
//     role: 'Interior Designer',
//     rating: 5.0,
//     location: 'New York',
//     img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//   },
//   {
//     id: 3,
//     name: 'Mike Ross',
//     role: 'Plumber',
//     rating: 4.8,
//     location: 'Chicago',
//     img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//   },
// ];

export default function HomePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
      (user.role ?? '').toLowerCase().includes(searchQuery.toLowerCase()) || (user.work_type ?? '').toLowerCase().includes(searchQuery.toLowerCase());
  });
  console.log(users)
  const fetchUsers = async () => {
    try {
      setLoading(true)

      const resUsers = await usersApi.getAll()
      let usersData = resUsers.data.filter(u => u.role === 'MASTER')

      // regionlarni olish (sizdagi kod)
      const regionIds = [...new Set(usersData.map(u => u.region_id))]
      const regionsData = {}

      await Promise.all(
        regionIds.map(async (id) => {
          if (!id) return
          try {
            const res = await regionsApi.getById(id)
            regionsData[id] = res.data.name
          } catch {
            regionsData[id] = 'Unknown'
          }
        })
      )

      // 🔥 IMAGE + REGION birga birlashtiramiz
      const usersWithExtras = await Promise.all(
        usersData.map(async (u) => {
          let imageUrl = null

          if (u.image_id) {
            try {
              const imgRes = await portfolioImagesApi.getById(u.image_id)
              imageUrl = imgRes.data.image_path
            } catch {
              imageUrl = null
            }
          }

          return {
            ...u,
            regionName: u.region_id
              ? regionsData[u.region_id] || 'Unknown'
              : 'Unknown',
            imageUrl // 👈 CARD SHU BILAN ISHLAYDI
          }
        })
      )

      setUsers(usersWithExtras)
    } catch (err) {
      toast.error('Error: Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }


  function getGradientColor(name) {
    const colors = [
      ["#2F80ED", "#56CCF2"],
      ["#FF5F6D", "#FFC371"],
      ["#36D1DC", "#5B86E5"],
      ["#FFB75E", "#ED8F03"],
      ["#00B09B", "#96C93D"]
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index].join(",");
  }


  return (
    <PageTransition className="min-h-screen pt-32 pb-20 px-6">
      {/* Hero Section */}
      {loading ? <SkeletonHeroSection /> :
        (<section className="max-w-4xl mx-auto text-center mb-24 relative">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}

                  type="text"
                  placeholder="What service do you need?"
                  className="w-full px-4 py-3 bg-transparent border-none outline-none text-lg text-gray-800 placeholder-gray-400"
                />
                <GlassButton className="hidden md:flex">Search</GlassButton>
              </div>
            </div>
          </motion.div>
        </section>)
      }

      {/* Featured Craftsmen */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          {loading ? <SkeletonSectionTitle /> : (<h2 className="text-3xl font-bold text-gray-900">Top Rated Pros</h2>)}
          {loading ?
            (<div className="w-32 h-10 bg-gray-300 rounded-md animate-pulse"></div>) : <button onClick={() => { router.push('/find-workers') }}
              className="text-[#2F80ED] font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight size={16} />
            </button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? users.length > 0
              ? users.map((_, i) => <SkeletonUserCard key={i} />)
              : Array.from({ length: 3 }).map((_, i) => <SkeletonUserCard key={i} />)
            : filteredUsers && filteredUsers.length > 0
              ? filteredUsers.map((person, i) => (
                <div key={person.id} onClick={() => router.push(`/find-workers/${person.id}`)}>
                  {loading
                    ? <SkeletonUserCard />
                    :
                    (<GlassCard
                      hoverEffect
                      className="p-6 h-full flex flex-col items-center text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="relative mb-4">
                        <div
                          className={`w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold`}
                          style={{
                            background: `linear-gradient(135deg, ${getGradientColor(person.first_name)})`
                          }}
                        >
                          {person.imageUrl ? (
                            <img
                              src={`${url}${person.imageUrl}`}
                              alt={`${person.imageUrl } avatar`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            person.first_name?.[0]?.toUpperCase() || '?'
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
                      </div>


                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {`${person.first_name} ${person.last_name}`}
                      </h3>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
                        {person.role}
                      </span>

                      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 w-full pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-bold text-gray-900">{person.rating || '5'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {person.regionName}
                        </div>
                      </div>
                    </GlassCard>)}
                </div>
              )) : <p className="text-center col-span-full text-gray-500">No users found.</p>
          }
        </div>

      </section>
    </PageTransition >
  );
}
