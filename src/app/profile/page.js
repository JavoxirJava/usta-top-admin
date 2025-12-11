'use client'
import React from 'react'
import { ProfileHeader } from '@/components/ProfileHeader'
import { InfoCards } from '@/components/InfoCard'
import { PortfolioSection } from '@/components/PortfolioSection'
import { FloatingCTA } from '@/components/FloatingCTA'
import { PageTransition } from '@/components/PageTransition'
export default function ProfilePage() {
  return (
    <PageTransition className="min-h-screen pb-24">
      <ProfileHeader />

      <main className="max-w-7xl mx-auto px-6 space-y-12">
        <InfoCards />

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 pl-2 border-l-4 border-blue-500">
            Featured Work
          </h2>
          <PortfolioSection />
        </div>
      </main>

      <FloatingCTA />
    </PageTransition>
  )
}
