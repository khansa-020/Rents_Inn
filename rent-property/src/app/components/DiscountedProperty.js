'use client'

import { useEffect, useState } from 'react'

export default function DiscountedPropertySection() {
  const [property, setProperty] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0) // ✅ for image slider

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch('/api/admin/addspecialproperty')
        const data = await res.json()

        if (data.ok && Array.isArray(data.data)) {
          const featured = data.data.find(
            (p) => p.discountEnabled === true && p.highlight === true
          )
          setProperty(featured || null)
        }
      } catch (err) {
        console.error('Error loading discounted property:', err)
      }
    }

    fetchProperty()
  }, [])

  // ✅ Auto change images every 30 seconds
  useEffect(() => {
    if (property?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % property.images.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [property])

  if (!property) {
    return (
      <section className="py-12 text-center text-gray-500 bg-gray-50">
        No discounted featured property available right now.
      </section>
    )
  }

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden shadow-2xl my-12 rounded-2xl">

      {/* ✅ Background Image/Video Slider - No UI change */}
      <div className="absolute inset-0 transition-transform duration-[2s] ease-out hover:scale-110">
        {property.mediaType === 'video' && property.videoUrl ? (
          <video
            src={property.videoUrl}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          Array.isArray(property.images) && property.images.length > 0 && (
            <img
              key={currentIndex}
              src={property.images[currentIndex]}
              alt={property.name || 'Discounted Property'}
              className="w-full h-full object-cover"
            />
          )
        )}
      </div>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 text-white">

        {/* Discount Badge */}
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 rounded-full" />
          <div className="relative bg-gradient-to-r from-red-600 to-red-500 px-5 py-2 rounded-full text-sm md:text-base font-bold shadow-2xl border border-red-400/50">
            <span className="drop-shadow-lg">🔥 {property.discountPercent}% OFF</span>
          </div>
        </div>

        {/* Name */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-2xl max-w-4xl leading-tight">
          {property.name || 'Discounted Property'}
        </h2>

        {/* Description */}
        <div className="mb-6 max-w-2xl backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-base md:text-lg text-gray-100 leading-relaxed">
            {property.description || 'Exclusive offer on this highlighted property!'}
          </p>
        </div>

        {/* Pricing */}
        <div className="mb-8 space-y-2">
          {property.discountEnabled && property.priceRegular && (
            <div className="flex items-center gap-3">
              <p className="text-gray-300 line-through text-xl md:text-2xl font-medium opacity-75">
                {property.priceRegular}
              </p>
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                SAVE {property.discountPercent}%
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <p className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 drop-shadow-lg">
              {property.priceDiscounted || property.price || 'Not Available'}
            </p>

            {/* ✅ Show selected price type instead of "per night" */}
            <span className="text-gray-300 text-sm">
              {property.priceType || 'Per Day'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="group relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-10 py-4 rounded-xl text-base font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Book Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>

          <button className="group backdrop-blur-md bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 px-10 py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-xl transform hover:-translate-y-1 active:translate-y-0">
            <span className="flex items-center justify-center gap-2">
              View Details
              <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </button>
        </div>

        {/* Timer */}
        <div className="mt-6 flex items-center gap-2 text-yellow-300 text-sm animate-pulse">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Limited Time Offer</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 via-purple-500/10 to-transparent rounded-bl-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-500/20 via-emerald-500/10 to-transparent rounded-tr-full blur-2xl" />
    </section>
  )
}
