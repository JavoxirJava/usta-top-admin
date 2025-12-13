'use client'
import React, { useEffect, useState } from 'react'
import { ProfileHeader } from '@/components/ProfileHeader'
import { InfoCards } from '@/components/InfoCard'
import { PortfolioSection } from '@/components/PortfolioSection'
import { FloatingCTA } from '@/components/FloatingCTA'
import { PageTransition } from '@/components/PageTransition'
import { userApi } from '@/services/userApi'
import { SkeletonProfileHeader } from '@/components/skeleton/SkeletonProfileHeader'
import { SkeletonInfoCards } from '@/components/skeleton/SkeletonInfoCard'
import { toast } from 'sonner'
import { regionsApi } from '@/services/regionsApi'
import { SkeletonPortfolioSection } from '@/components/skeleton/SkeletonPortfolioSection'
import { SkeletonSectionTitle } from '@/components/skeleton/SkeletonSectionTitle'
import { usersApi } from '@/services/usersApi'
export default function ProfilePage() {
    const [user, setUser] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState()
    const userId = window.location.pathname
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/')
            const userId = pathParts[pathParts.length - 1]  // oxirgi bo‘lak ID
            fetchUser(userId)
        }
    }, [])

    const fetchUser = async (id) => {
        try {
            const res = await usersApi.getById(id)
            setUser(res.data)
            if (res.data.region_id) {
                fetchRegion(res.data.region_id)
            }
        } catch (err) {
            toast.error(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const fetchRegion = async (id) => {
        try {
            const res = await regionsApi.getById(id)
            setRegion(res.data)
            console.log(res.data)
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }



    return (
        <PageTransition className="min-h-screen pb-24">
            {loading ? <SkeletonProfileHeader /> :
                <ProfileHeader regionName={region?.name} userInfo={user} />}
            <main className="max-w-7xl mx-auto px-6 space-y-12">
                {loading && (
                    <SkeletonInfoCards />
                ) || (
                        <InfoCards region={region} userInfo={user} />
                    )}
                <div className="space-y-8">
                    {loading ? <SkeletonSectionTitle /> :
                        (<h2 className="text-3xl font-bold text-gray-900 pl-2 border-l-4 border-blue-500">
                            Featured Work
                        </h2>)}
                    {loading ? <SkeletonPortfolioSection /> : <PortfolioSection />}
                </div>
            </main>

            <FloatingCTA />
        </PageTransition>
    )
}
