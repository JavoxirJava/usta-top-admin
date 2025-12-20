'use client'

import React, { useEffect, useRef, useState } from 'react'
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
    Bell,
} from 'lucide-react'
import { notificationApi } from '@/services/notificationApi'

export function Navigation() {
    const dropdownRef = useRef(null);

    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    async function fetchNotifications() {
        try {
            setLoading(true)
            const res = await notificationApi.getMy()
            setNotifications(res?.data)
        } catch (err) {
            console.error(err)
            toast.error('Failed to load notifications')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleToggle = () => setOpen(!open)

    const unreadCount = notifications.filter(n => !n.isRead).length


    function handleRoute(path) {
        router.push(path)
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user')
            const storedToken = localStorage.getItem('authToken')

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser)
                    setUser(parsedUser)
                } catch (error) {
                    console.error('User parse error:', error)
                    localStorage.removeItem('user')
                }
            }

            if (storedToken) setToken(storedToken)
        }
    }, [])


    const links = [
        { path: '/', label: 'Home', icon: Home },
        ...(token && user.role !== "ADMIN"

            ? [
                { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
            ]
            : []),

        { path: user?.role === 'MASTER' ? '/jobs' : "/find-workers", label: user?.role === "MASTER" ? 'Jobs' : "Workers", icon: Briefcase },
        // ...(token && user.role === "MASTER"

        //     ? [
        //         { path: '/upload', label: 'Upload', icon: Upload }
        //     ]
        //     : []), ,
        ...(token && user.role !== "ADMIN"

            ? [
                { path: '/profile', label: 'Profile', icon: User }
            ]
            : []),
    ]

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropdownRef]);


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

                            {!token &&
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="ml-4 px-5 py-2 cursor-pointer bg-[#2F80ED] text-white rounded-xl font-medium shadow-lg shadow-blue-500/20"
                                    onClick={() => { handleRoute('/login') }}
                                >
                                    Login
                                </motion.button>
                            }
                            {token && <button onClick={handleToggle} className="relative p-2 rounded-full hover:bg-gray-100 transition">
                                <Bell size={24} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                                )}
                            </button>}
                            {/* Bell button */}


                            {/* Notification dropdown */}
                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        ref={dropdownRef}

                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-20 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                                    >
                                        {loading ? (
                                            <div className="p-4 text-gray-500 text-center">Loading...</div>
                                        ) : notifications.length === 0 ? (
                                            <div className="p-4 text-gray-500 text-center">No notifications</div>
                                        ) : (
                                            <div className="flex flex-col" >
                                                {notifications.map(n => (
                                                    <div
                                                        onClick={() => { router.push('/job-requests') }}
                                                        key={n.id}
                                                        className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition
                      ${!n.isRead ? 'bg-blue-50' : 'bg-white'}
                    `}
                                                    >
                                                        <p className="font-medium text-gray-900">{n.type || 'Notification'}</p>
                                                        <p className="text-gray-600 text-sm">{n.message}</p>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            {new Date(n.createdAt).toLocaleString('en-US', {
                                                                timeZone: 'Asia/Tashkent',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                        className="fixed inset-0 z-40 bg-white/90 backdrop-blur-xl pt-32 px-6 xl:hidden"
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

                            {!token && <button onClick={() => {
                                setIsOpen(false)
                                handleRoute('/login')
                            }}>
                                <button className="w-full p-4 bg-[#2F80ED] text-white rounded-2xl font-bold mt-4 shadow-xl">
                                    Login
                                </button>
                            </button>}
                            {token && <button onClick={handleToggle} className="relative p-2 rounded-full hover:bg-gray-100 transition">
                                <Bell size={24} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                                )}
                            </button>}
                            {/* Bell button */}


                            {/* Notification dropdown */}
                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        ref={dropdownRef}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                                    >
                                        {loading ? (
                                            <div className="p-4 text-gray-500 text-center">Loading...</div>
                                        ) : notifications.length === 0 ? (
                                            <div className="p-4 text-gray-500 text-center">No notifications</div>
                                        ) : (
                                            <div className="flex flex-col" >
                                                {notifications.map(n => (
                                                    <div
                                                        onClick={() => { router.push('/job-requests') }}
                                                        key={n.id}
                                                        className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition
                      ${!n.isRead ? 'bg-blue-50' : 'bg-white'}
                    `}
                                                    >
                                                        <p className="font-medium text-gray-900">{n.type || 'Notification'}</p>
                                                        <p className="text-gray-600 text-sm">{n.message}</p>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            {new Date(n.createdAt).toLocaleString('en-US', {
                                                                timeZone: 'Asia/Tashkent',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
