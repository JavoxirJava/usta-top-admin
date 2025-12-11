'use client';

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Send, Calendar } from 'lucide-react'
import { GlassButton } from './GlassButton'
import { StarRating } from './StarRating'


export function CommentSection({
  comments,
  onAddComment,
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format'
    if (rating === 0) newErrors.rating = 'Please select a rating'
    if (!text.trim()) newErrors.text = 'Comment is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onAddComment({ name, email, rating, text })

    setName('')
    setEmail('')
    setRating(0)
    setText('')
    setErrors({})
  }

  return (
    <div className="space-y-8">
      {/* Comment Form */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Leave a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.name ? 'border-red-300 ring-2 ring-red-100' : 'border-white/60'}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.email ? 'border-red-300 ring-2 ring-red-100' : 'border-white/60'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-gray-600">Rating:</span>
              <StarRating rating={rating} onRatingChange={setRating} size={24} />
            </div>
            {errors.rating && <p className="text-xs text-red-500 ml-1">{errors.rating}</p>}
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className={`w-full p-4 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${errors.text ? 'border-red-300 ring-2 ring-red-100' : 'border-white/60'}`}
            />
            {errors.text && <p className="text-xs text-red-500 ml-1">{errors.text}</p>}
          </div>

          <div className="flex justify-end">
            <GlassButton type="submit" className="w-full md:w-auto">
              <Send size={18} /> Post Review
            </GlassButton>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Reviews <span className="text-sm font-normal text-gray-500">({comments.length})</span>
        </h3>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {comments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-500 bg-white/20 rounded-xl border border-white/30"
              >
                No reviews yet. Be the first to share your experience!
              </motion.div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/40 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{comment.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <Calendar size={12} /> {comment.date}
                      </div>
                    </div>
                    <StarRating rating={comment.rating} readOnly size={16} />
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{comment.text}</p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
