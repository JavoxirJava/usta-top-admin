'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home,
    User,
    Briefcase,
    Upload,
    Settings,
    Menu,
    X,
    LayoutDashboard,
} from 'lucide-react'

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    function handleRoute(path) {
        router.push(path)
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    const [user, setUser] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user")
      if (storedUser) setUser(JSON.parse(storedUser))
    }
  }, [])
    const links = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/profile', label: 'Profile', icon: User },
        { path: user?.role === 'MASTER' ? '/jobs' : "/find-workers", label: user?.role === "MASTER" ? 'Jobs' : "Workers", icon: Briefcase },
        { path: '/upload', label: 'Upload', icon: Upload },
        { path: '/settings', label: 'Settings', icon: Settings },
    ]

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div
                        className="
              backdrop-blur-xl bg-white/70 border border-white/40 shadow-lg 
              rounded-2xl px-6 py-3 flex items-center justify-between
            "
                    >
                        <span
                            onClick={() => { handleRoute('/') }}
                            className="text-2xl cursor-pointer font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2F80ED] to-purple-600"
                        >
                            UstaTop
                        </span>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-2">
                            {links.map((link) => {
                                const Icon = link.icon
                                const isActive = pathname === link.path

                                return (
                                    <span
                                        key={link.path}
                                        onClick={() => { handleRoute(link.path) }}
                                        className="relative cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-[#2F80ED]/10 rounded-xl"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        <span
                                            className={`relative z-10 flex items-center gap-2 ${isActive
                                                ? 'text-[#2F80ED]'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon size={16} />
                                            {link.label}
                                        </span>
                                    </span>
                                )
                            })}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="ml-4 px-5 py-2 cursor-pointer bg-[#2F80ED] text-white rounded-xl font-medium shadow-lg shadow-blue-500/20"
                                onClick={() => { handleRoute('/login') }}
                            >
                                Login
                            </motion.button>
                        </div>

                        {/* Mobile Toggle */}
                        <span
                            className="lg:hidden cursor-pointer p-2 text-gray-600"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X /> : <Menu />}
                        </span>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white/90 backdrop-blur-xl pt-32 px-6 md:hidden"
                    >

                        <div className="flex flex-col gap-4">
                            {links.map((link) => {
                                const Icon = link.icon
                                const isActive = pathname === link.path

                                return (
                                    <button
                                        key={link.path}
                                        onClick={() => {
                                            setIsOpen(false)
                                            handleRoute(link.path)
                                        }}
                                        className={`
                      p-4 rounded-2xl flex items-center gap-4 text-lg font-medium
                      ${isActive
                                                ? 'bg-[#2F80ED]/10 text-[#2F80ED]'
                                                : 'text-gray-600'
                                            }
                    `}
                                    >
                                        <Icon />
                                        {link.label}
                                    </button>
                                )
                            })}

                            <button onClick={() => {
                                setIsOpen(false)
                                handleRoute('/login')
                            }}>
                                <button className="w-full p-4 bg-[#2F80ED] text-white rounded-2xl font-bold mt-4 shadow-xl">
                                    Login
                                </button>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
