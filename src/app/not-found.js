import React from 'react'
import { ArrowLeft } from 'lucide-react'
export default function NotFoundPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 text-center">
      {/* Large 404 Background Text */}
      <div className="relative">
        <h1
          className="text-9xl font-bold text-gray-100 select-none"
          aria-hidden="true"
        >
          404
        </h1>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center top-1/2 -translate-y-1/2">
          {/* This empty div helps position the content relative to the 404 if needed,
            but for this design we might want them stacked vertically or overlapping.
            Let's adjust to a vertical stack for cleaner readability as per the prompt's "centered layout" */}
        </div>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto -mt-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-1">
          We couldn't find that page
        </h2>

        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          Don't worry, even the best craftsmen take wrong turns sometimes.
        </p>

        <div className="pt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-medium shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Take Me Home
          </a>
        </div>

        <nav className="pt-12 flex flex-wrap justify-center gap-x-1 text-sm text-gray-400">
          <a
            href="/services"
            className="hover:text-blue-600 transition-colors duration-200 px-2"
          >
            Search Services
          </a>
          <span>|</span>
          <a
            href="/dashboard"
            className="hover:text-blue-600 transition-colors duration-200 px-2"
          >
            View Dashboard
          </a>
          <span>|</span>
          <a
            href="/help"
            className="hover:text-blue-600 transition-colors duration-200 px-2"
          >
            Get Help
          </a>
        </nav>
      </div>
    </main>
  )
}
