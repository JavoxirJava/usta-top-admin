  'use client'

  import React, { useState, useEffect } from 'react'
  import { motion, AnimatePresence } from 'framer-motion'
  import { Search, X, MapPin, Briefcase } from 'lucide-react'
  import { PageTransition } from '@/components/PageTransition'
  import WorkerCard from '@/components/WorkerCard'
  import { CommentSection } from '@/components/CommentSection'
  import { StarRating } from '@/components/StarRating'
  import { GlassCard } from '@/components/GlassCard'
  import { GlassButton } from '@/components/GlassButton'
  import { usersApi } from '@/services/usersApi' // import qildik
  import { regionsApi } from '@/services/regionsApi'

  export default function FindWorkersPage() {
    const [workers, setWorkers] = useState([])
    const [selectedWorker, setSelectedWorker] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true)
          const [workersRes, regionsRes] = await Promise.all([
            usersApi.getAll(),
            regionsApi.getAll(),
          ])

          const regionsData = regionsRes.data || []
          setRegions(regionsData)

          // har bir workerga region name qo'shamiz 
          const workersData = (workersRes.data || []).filter(worker => worker.role === 'MASTER').map(worker => {
            const region = regionsData.find(
              r => Number(r.id) === Number(worker.region_id)
            )

            return {
              ...worker,
              regionName: region?.name ?? 'Unknown'
            }
          })


          setWorkers(workersData)
        } catch (err) {
          console.error('Error fetching workers or regions:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }, [])

    const filteredWorkers = workers.filter(
      (worker) =>
        worker.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.work_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.regionName.toLowerCase().includes(searchQuery.toLowerCase())
    )


    const handleAddComment = (workerId, comment) => {
      const newComment = {
        ...comment,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }

      setWorkers((prevWorkers) =>
        prevWorkers.map((w) => {
          if (w.id === workerId) {
            const updatedComments = [newComment, ...w.comments]
            const totalRating = updatedComments.reduce((sum, c) => sum + c.rating, 0)
            const newRating = Number((totalRating / updatedComments.length).toFixed(1))
            return { ...w, comments: updatedComments, rating: newRating, reviewCount: updatedComments.length }
          }
          return w
        })
      )

      if (selectedWorker && selectedWorker.id === workerId) {
        setSelectedWorker((prev) => {
          if (!prev) return null
          const updatedComments = [newComment, ...prev.comments]
          const totalRating = updatedComments.reduce((sum, c) => sum + c.rating, 0)
          const newRating = Number((totalRating / updatedComments.length).toFixed(1))
          return { ...prev, comments: updatedComments, rating: newRating, reviewCount: updatedComments.length }
        })
      }
    }

    return (
      <PageTransition className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Craftsmen</h1>
              <p className="text-gray-600 text-lg">Discover talented workers for your next project</p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or profession..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20 text-gray-500">Loading workers...</div>
          )}

          {/* Workers Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredWorkers.map((worker) => (
                    <motion.div
                      key={worker.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <WorkerCard worker={worker} regionName={worker.regionName} onClick={() => setSelectedWorker(worker)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredWorkers.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">No workers found matching your search.</p>
                </div>
              )}
            </>
          )}

          {/* Worker Detail Modal */}
          <AnimatePresence>
            {selectedWorker && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedWorker(null)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                />
                <motion.div
                  layoutId={`worker-${selectedWorker.id}`}
                  initial={{ opacity: 0, y: 100, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.9 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                >
                  <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto">
                    <GlassCard className="relative overflow-hidden bg-white/90 backdrop-blur-2xl shadow-2xl">
                      <button
                        onClick={() => setSelectedWorker(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-10"
                      >
                        <X size={24} />
                      </button>

                      <div className="flex flex-col md:flex-row">
                        {/* Left Column */}
                        <div className="p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200/50 bg-white/40">
                          <div className="text-center md:text-left">
                            <img
                              src={selectedWorker.avatar}
                              alt={selectedWorker.name}
                              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto md:mx-0 mb-6"
                            />
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedWorker.name}</h2>
                            <p className="text-blue-600 font-medium text-lg mb-4">{selectedWorker.profession}</p>

                            <div className="space-y-3 text-gray-600 mb-8">
                              <div className="flex items-center justify-center md:justify-start gap-2">
                                <MapPin size={18} />
                                <span>{selectedWorker.location}</span>
                              </div>
                              <div className="flex items-center justify-center md:justify-start gap-2">
                                <StarRating rating={selectedWorker.rating} readOnly size={18} />
                                <span className="font-medium text-gray-900">{selectedWorker.rating}</span>
                                <span className="text-sm">({selectedWorker.reviewCount} reviews)</span>
                              </div>
                              <div className="flex items-center justify-center md:justify-start gap-2">
                                <Briefcase size={18} />
                                <span>{selectedWorker.portfolio?.length || 0} Projects Completed</span>
                              </div>
                            </div>

                            <GlassButton className="w-full justify-center">Contact Worker</GlassButton>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="p-8 md:w-2/3 bg-white/20">
                          <div className="mb-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Gallery</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {selectedWorker.portfolio?.map((img, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-sm group"
                                >
                                  <img
                                    src={img}
                                    alt={`Project ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-gray-200/50 pt-10">
                            <CommentSection
                              comments={selectedWorker.comments || []}
                              onAddComment={(comment) => handleAddComment(selectedWorker.id, comment)}
                            />
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    )
  }
