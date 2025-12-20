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
import { useRouter } from 'next/navigation'
import { commentsApi } from '@/services/commentsApi'
import { SkeletonUserCard } from '@/components/skeleton/SkeletonCard'
import apiClient from '@/lib/apiClient'
import { toast } from 'sonner'
import FormInput from '@/components/FormInput'

export default function FindWorkersPage() {
  const [workers, setWorkers] = useState([])
  const [comments, setComments] = useState([])
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [regions, setRegions] = useState([])
  const [dataModal, setDataModal] = useState(false)
  const [showJobRequestModal, setShowJobRequestModal] = useState(false)
  const [jobRequestData, setJobRequestData] = useState({
    title: '',
    description: '',
    location: '',
    budget: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter();
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
      (worker.first_name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.work_type ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.regionName ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )


  useEffect(() => {
    if (!selectedWorker) return;


  }, [selectedWorker?.id]);

  const getAvatarGradient = (name = '') => {
    const gradients = [
      'from-pink-500 to-rose-500',
      'from-blue-500 to-indigo-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-fuchsia-500',
      'from-orange-500 to-amber-500',
      'from-cyan-500 to-sky-500',
    ];

    const charCode = name.charCodeAt(0) || 0;
    return gradients[charCode % gradients.length];
  };

  const handleOpenJobRequestModal = () => {
    setShowJobRequestModal(true)
    setDataModal(false)
  }

  const handleCloseJobRequestModal = () => {
    setShowJobRequestModal(false)
    setJobRequestData({
      title: '',
      description: '',
      location: '',
      budget: ''
    })
  }

  const handleJobRequestSubmit = async (e) => {
    e.preventDefault()

    if (!selectedWorker) {
      toast.error('Please select a worker first')
      return
    }

    // Validation
    if (!jobRequestData.title.trim() || !jobRequestData.description.trim() ||
      !jobRequestData.location.trim() || !jobRequestData.budget.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      await apiClient.post('/api/job-requests', {
        masterId: selectedWorker.id,
        title: jobRequestData.title,
        description: jobRequestData.description,
        location: jobRequestData.location,
        budget: parseFloat(jobRequestData.budget)
      })

      toast.success('Job request sent successfully!')
      handleCloseJobRequestModal()
      setSelectedWorker(null) // Close worker detail modal as well
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to send job request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setJobRequestData(prev => ({
      ...prev,
      [name]: value
    }))
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
        {/* {loading && (
          <div className="text-center py-20 text-gray-500">Loading workers...</div>
        )} */}

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
                    {loading ? <SkeletonUserCard /> : <WorkerCard worker={worker} regionName={worker.regionName} onClick={() => {
                      setSelectedWorker(worker)
                      router.push(`/find-workers/${selectedWorker.id}`)
                    }} onApplyRequest={(worker) => {
                      setSelectedWorker(worker)
                      handleOpenJobRequestModal()  // Job Request modalni ochamiz
                    }} />}
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


        {/* Job Request Modal */}
        <AnimatePresence>
          {showJobRequestModal && selectedWorker && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseJobRequestModal}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-auto"
              >
                <div className="w-full max-w-2xl pointer-events-auto">
                  <GlassCard className="relative overflow-hidden bg-white/90 backdrop-blur-2xl shadow-2xl">
                    <button
                      onClick={handleCloseJobRequestModal}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-10"
                    >
                      <X size={24} />
                    </button>

                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Job Request</h2>
                      <p className="text-gray-600 mb-6">
                        Send a job request to <span className="font-semibold">{selectedWorker.first_name || selectedWorker.name}</span>
                      </p>

                      <form onSubmit={handleJobRequestSubmit} className="space-y-4">
                        <FormInput
                          label="Job Title"
                          name="title"
                          type="text"
                          value={jobRequestData.title}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Kitchen Renovation"
                        />

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="description"
                            value={jobRequestData.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Describe your job requirements..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <FormInput
                          label="Location"
                          name="location"
                          type="text"
                          value={jobRequestData.location}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Tashkent, Chilonzor"
                        />

                        <FormInput
                          label="Budget (USD)"
                          name="budget"
                          type="number"
                          value={jobRequestData.budget}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., 500"
                          min="0"
                          step="0.01"
                        />

                        <div className="flex gap-3 pt-4">
                          <GlassButton
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={handleCloseJobRequestModal}
                            disabled={submitting}
                          >
                            Cancel
                          </GlassButton>
                          <GlassButton
                            type="submit"
                            className="flex-1"
                            disabled={submitting}
                          >
                            {submitting ? 'Sending...' : 'Send Request'}
                          </GlassButton>
                        </div>
                      </form>
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
