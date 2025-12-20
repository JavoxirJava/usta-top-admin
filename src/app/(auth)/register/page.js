'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  User,
  Calendar,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Briefcase,
  Phone,
} from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { GlassButton } from '@/components/GlassButton'
import { PageTransition } from '@/components/PageTransition'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import apiClient from '@/lib/apiClient'
import { toast } from 'sonner'
import { regionsApi } from '@/services/regionsApi'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRegion()
  }, [])
  const fetchRegion = async () => {
    try {
      const res = await regionsApi.getAll()
      setRegions(res.data)
    } catch (err) {
      toast.error(`Something went wrong: ${err}`)
    } finally {
      setLoading(false)
    }
  }
  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    phone: '',
    email: '',
    password: '',
    region_id: '',
    role: '', // 'MASTER' or 'user'
  })
  const [errors, setErrors] = useState({})
  // Validation Logic
  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.first_name.trim())
      newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!formData.age || Number(formData.age) < 18)
      newErrors.age = 'Must be at least 18'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    else if (formData.phone.length !== 9)
      newErrors.phone = 'Enter valid 9-digit number'
    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }
  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6)
      newErrors.password = 'Min 6 characters'
    if (!formData.region_id) newErrors.region_id = 'Please select a region'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const validateStep3 = () => {
    const newErrors = {}
    if (!formData.role) newErrors.role = 'Please select a role'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  // Navigation Handlers
  const handleNext = () => {
    let isValid = false
    if (step === 1) isValid = validateStep1()
    if (step === 2) isValid = validateStep2()
    if (isValid) {
      setDirection(1)
      setStep((prev) => prev + 1)
    }
  }
  const handleBack = () => {
    setDirection(-1)
    setStep((prev) => prev - 1)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (validateStep3()) {
        setIsSubmitting(true)
        // Simulate API call
        const response = await apiClient.post("/api/auth/register", formData)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('authToken', response.data?.token)
        router.push('/dashboard')
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
  }
  const updateField = (field, value) => {
    if (field === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 9)
      setFormData((prev) => ({
        ...prev,
        [field]: digitsOnly,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
    // Clear error when typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = {
          ...prev,
        }
        delete newErrors[field]
        return newErrors
      })
    }
  }
  const formatPhoneDisplay = (phone) => {
    if (!phone) return ''
    const digits = phone.replace(/\D/g, '')
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`
    if (digits.length <= 7)
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`
  }
  // Animation Variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }
  return (
    <PageTransition className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl"
        />

      </div>

      <GlassCard className="w-full max-w-lg p-8 md:p-10 relative z-10">
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 left-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500">Join our community of craftsmen</p>
        </div>

        <ProgressIndicator currentStep={step} totalSteps={3} />

        <form onSubmit={handleSubmit} className="min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.3,
                }}
                className="space-y-5 flex-1"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) =>
                          updateField('first_name', e.target.value)
                        }
                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.first_name ? 'border-red-300 ring-2 ring-red-100' : 'border-white/40'}`}
                        placeholder="John"
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-xs text-red-500 ml-1">
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) =>
                          updateField('last_name', e.target.value)
                        }
                        className={`w-full pl-12 pr-4 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.last_name ? 'border-red-300 ring-2 ring-red-100' : 'border-white/40'}`}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.last_name && (
                      <p className="text-xs text-red-500 ml-1">
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Age
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.age ? 'border-red-300 ring-2 ring-red-100' : 'border-white/40'}`}
                      placeholder="25"
                    />
                  </div>
                  {errors.age && (
                    <p className="text-xs text-red-500 ml-1">{errors.age}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-700 font-medium pointer-events-none">
                      +998
                    </div>
                    <input
                      type="tel"
                      value={formatPhoneDisplay(formData.phone)}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={`w-full pl-24 pr-4 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.phone ? 'border-red-300 ring-2 ring-red-100' : 'border-white/40'}`}
                      placeholder="90 123 45 67"
                      maxLength={12}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 ml-1">{errors.phone}</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.3,
                }}
                className="space-y-5 flex-1"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.email ? 'border-red-300 ring-2 ring-red-100' : 'border-white/40'}`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 ml-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.password ? 'border-red-300 ring-2 ring-red-100' : 'border-white/40'}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 ml-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">
                    Region
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <select
                      value={formData.region_id || ""}
                      onChange={(e) => updateField('region_id', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer ${errors.region ? 'border-red-300 ring-2 ring-red-100' : 'border-white/40'}`}
                    >
                      <option value={""} disabled>
                        Select your region
                      </option>
                      {regions && regions.length > 0 && regions.map((reg) => {
                        return (<option key={reg.id} value={reg.id}>{reg.name}</option>)
                      })}
                    </select>
                  </div>
                  {errors.region && (
                    <p className="text-xs text-red-500 ml-1">{errors.region}</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.3,
                }}
                className="space-y-6 flex-1"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Who are you?
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Select your primary role on the platform
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <label
                    className={`
                      relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                      ${formData.role === 'MASTER' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-white/40 bg-white/50 hover:border-blue-200 hover:bg-white/80'}
                    `}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="MASTER"
                      checked={formData.role === 'MASTER'}
                      onChange={(e) => updateField('role', e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 rounded-full mr-4 ${formData.role === 'MASTER' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      <Briefcase size={24} />
                    </div>
                    <div className="flex-1">
                      <span className="block font-bold text-gray-900">
                        MASTER / Craftsman
                      </span>
                      <span className="text-sm text-gray-500">
                        I want to offer my services and find jobs
                      </span>
                    </div>
                    {formData.role === 'MASTER' && (
                      <motion.div
                        initial={{
                          scale: 0,
                        }}
                        animate={{
                          scale: 1,
                        }}
                        className="text-blue-500"
                      >
                        <CheckCircle
                          size={24}
                          fill="currentColor"
                          className="text-white"
                        />
                      </motion.div>
                    )}
                  </label>

                  <label
                    className={`
                      relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                      ${formData.role === 'user' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-white/40 bg-white/50 hover:border-blue-200 hover:bg-white/80'}
                    `}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="USER"
                      checked={formData.role === 'USER'}
                      onChange={(e) => updateField('role', e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 rounded-full mr-4 ${formData.role === 'USER' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      <User size={24} />
                    </div>
                    <div className="flex-1">
                      <span className="block font-bold text-gray-900">
                        User / Client
                      </span>
                      <span className="text-sm text-gray-500">
                        I want to find and hire craftsmen
                      </span>
                    </div>
                    {formData.role === 'user' && (
                      <motion.div
                        initial={{
                          scale: 0,
                        }}
                        animate={{
                          scale: 1,
                        }}
                        className="text-blue-500"
                      >
                        <CheckCircle
                          size={24}
                          fill="currentColor"
                          className="text-white"
                        />
                      </motion.div>
                    )}
                  </label>
                </div>
                {errors.role && (
                  <p className="text-center text-xs text-red-500">
                    {errors.role}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200/50">
            {step > 1 && (
              <GlassButton
                type="button"
                variant="secondary"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 justify-center"
              >
                <ArrowLeft size={18} /> Back
              </GlassButton>
            )}

            {step < 3 ? (
              <GlassButton
                type="button"
                onClick={handleNext}
                className={`flex-1 justify-center ${step === 1 ? 'w-full' : ''}`}
              >
                Next Step <ArrowRight size={18} />
              </GlassButton>
            ) : (
              <GlassButton
                type="submit"
                disabled={isSubmitting || !formData.role}
                className="flex-1 justify-center bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Complete Registration <CheckCircle size={18} />
                  </>
                )}
              </GlassButton>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button onClick={() => router.push("/login")} className="text-blue-600 font-bold hover:underline">
            Sign In
          </button>
        </div>
      </GlassCard>
    </PageTransition>
  )
}
