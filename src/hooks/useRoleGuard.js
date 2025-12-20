// src/hooks/useRoleGuard.ts
'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export const useRoleGuard = () => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userRaw = localStorage.getItem('user')
    if (!userRaw) return

    const user = JSON.parse(userRaw)

    // ADMIN user panelga kirmaydi
    if (user.role === 'ADMIN' && !pathname.startsWith('/admin')) {
      router.replace('/admin')
    }

    // USER yoki MASTER admin panelga kirmaydi
    if (
      user.role !== 'ADMIN' &&
      pathname.startsWith('/admin')
    ) {
      router.replace('/')
    }
  }, [pathname])
}
