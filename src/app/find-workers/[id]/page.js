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

        </PageTransition>
    )
}
