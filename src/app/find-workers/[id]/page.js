'use client'
import React, { useEffect, useState } from 'react'
import { ProfileHeader } from '@/components/ProfileHeader'
import { InfoCards } from '@/components/InfoCard'
import { PortfolioSection } from '@/components/PortfolioSection'
import { FloatingCTA } from '@/components/FloatingCTA'
import { PageTransition } from '@/components/PageTransition'
import { usersApi } from '@/services/usersApi'
import { portfolioImagesApi } from '@/services/portfolioImagesApi'
import { portfoliosApi } from '@/services/portfoliosApi'
import { regionsApi } from '@/services/regionsApi'
import { toast } from 'sonner'
import { SkeletonProfileHeader } from '@/components/skeleton/SkeletonProfileHeader'
import { SkeletonInfoCards } from '@/components/skeleton/SkeletonInfoCard'
import { SkeletonPortfolioSection } from '@/components/skeleton/SkeletonPortfolioSection'
import { SkeletonSectionTitle } from '@/components/skeleton/SkeletonSectionTitle'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { GlassButton } from '@/components/GlassButton'
import FormInput from '@/components/FormInput'
import apiClient from '@/lib/apiClient'

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [region, setRegion] = useState(null)
    const [portfolios, setPortfolios] = useState([])
    const [loading, setLoading] = useState(true)
    const [showJobRequestModal, setShowJobRequestModal] = useState(false)
    const [jobRequestData, setJobRequestData] = useState({
        title: '',
        description: '',
        location: '',
        budget: ''
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/')
            const userId = pathParts[pathParts.length - 1]  // oxirgi bo‘lak ID
            fetchUser(userId)
        }
    }, [])

    const fetchUser = async (id) => {
        try {
            setLoading(true)
            const res = await usersApi.getById(id)
            const userData = res.data
            setUser(userData)

            if (userData.region_id) {
                fetchRegion(userData.region_id)
            }

            // Portfoliolari va rasmalarini olish
            fetchPortfoliosWithImages(userData.id)

        } catch (err) {
            toast.error(`Error fetching user: ${err.message}`)
            setLoading(false)
        }
    }

    const fetchRegion = async (id) => {
        try {
            const res = await regionsApi.getById(id)
            setRegion(res.data)
        } catch (err) {
            toast.error(`Error fetching region: ${err.message}`);
        }
    }

    const fetchPortfoliosWithImages = async (userId) => {
        try {
            // 1. Barcha portfoliolarni olamiz
            const portfoliosRes = await portfoliosApi.getAll()
            const userPortfolios = portfoliosRes.data.filter(p => p.user_id == userId)

            // 2. Barcha portfolio-images ni olamiz
            const imagesRes = await portfolioImagesApi.getAll()
            const portfolioImages = imagesRes.data

            // 3. Har bir portfolio uchun tegishli rasm(lar)ni qo‘shamiz
            const portfoliosWithImages = userPortfolios.map(p => {
                const images = portfolioImages
                    .filter(img => img.portfolio_id == p.id.toString()) // string vs numberga e'tibor
                    .map(img => img.image_path)
                return {
                    ...p,
                    images
                }
            })

            setPortfolios(portfoliosWithImages)
        } catch (err) {
            toast.error(`Error fetching portfolios: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenJobRequestModal = () => setShowJobRequestModal(true)
    const handleCloseJobRequestModal = () => {
        setShowJobRequestModal(false)
        setJobRequestData({ title: '', description: '', location: '', budget: '' })
    }

    const handleJobRequestSubmit = async (e) => {
        e.preventDefault()
        if (!user?.id) return toast.error('Worker information not available')

        if (!jobRequestData.title || !jobRequestData.description || !jobRequestData.location || !jobRequestData.budget) {
            return toast.error('Please fill in all fields')
        }

        try {
            setSubmitting(true)
            await apiClient.post('/api/job-requests', {
                masterId: user.id,
                ...jobRequestData,
                budget: parseFloat(jobRequestData.budget)
            })
            toast.success('Job request sent successfully!')
            handleCloseJobRequestModal()
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Failed to send job request')
        } finally {
            setSubmitting(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setJobRequestData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <PageTransition className="min-h-screen pb-24">
            {loading ? <SkeletonProfileHeader /> : <ProfileHeader regionName={region?.name} userInfo={user} />}
            <main className="max-w-7xl mx-auto px-6 space-y-12">
                {loading ? <SkeletonInfoCards /> : <InfoCards region={region} userInfo={user} />}

                <div className="space-y-8">
                    {loading ? <SkeletonSectionTitle /> :
                        <h2 className="text-3xl font-bold text-gray-900 pl-2 border-l-4 border-blue-500">Portfolios</h2>
                    }
                    {loading ? <SkeletonPortfolioSection /> :
                        <PortfolioSection portfolios={portfolios} />
                    }
                </div>
            </main>

            <FloatingCTA number={user?.phone_number} onBookNow={handleOpenJobRequestModal} />

            {/* Job Request Modal */}
            <AnimatePresence>
                {showJobRequestModal && user && (
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
                            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
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
                                            Send a job request to <span className="font-semibold">{user.first_name || user.name || 'Worker'}</span>
                                        </p>
                                        <form onSubmit={handleJobRequestSubmit} className="space-y-4">
                                            <FormInput label="Job Title" name="title" type="text" value={jobRequestData.title} onChange={handleInputChange} required placeholder="e.g., Kitchen Renovation" />
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Description <span className="text-red-500">*</span>
                                                </label>
                                                <textarea name="description" value={jobRequestData.description} onChange={handleInputChange} required placeholder="Describe your job requirements..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <FormInput label="Location" name="location" type="text" value={jobRequestData.location} onChange={handleInputChange} required placeholder="e.g., Tashkent, Chilonzor" />
                                            <FormInput label="Budget (USD)" name="budget" type="number" value={jobRequestData.budget} onChange={handleInputChange} required placeholder="e.g., 500" min="0" step="0.01" />
                                            <div className="flex gap-3 pt-4">
                                                <GlassButton type="button" variant="secondary" className="flex-1" onClick={handleCloseJobRequestModal} disabled={submitting}>Cancel</GlassButton>
                                                <GlassButton type="submit" className="flex-1" disabled={submitting}>{submitting ? 'Sending...' : 'Send Request'}</GlassButton>
                                            </div>
                                        </form>
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </PageTransition>
    )
}
