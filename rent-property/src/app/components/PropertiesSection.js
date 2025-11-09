'use client'

import Image from 'next/image'
import { Mulish } from 'next/font/google'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { CheckCircle2, X as CloseIcon } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import Link from 'next/link'

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

/* ----------------------------- UI Primitives ----------------------------- */
function Card({ children, className = '' }) {
  return <div className={`rounded-lg border bg-white text-slate-950 shadow-sm ${className}`}>{children}</div>
}
function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}
function Button({ children, className = '', size = 'md', variant = 'default', onClick, ...props }) {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
  const sizes = { xs: 'px-2 py-1 text-xs h-8', sm: 'px-3 py-2 text-sm h-9', md: 'px-4 py-2 text-base h-10', lg: 'px-6 py-3 text-lg h-12' }
  const variants = {
    default: 'bg-[#01F5FF] text-slate-900 hover:bg-[#00DDEE] focus:ring-[#01F5FF]',
    outline: 'border border-[#01F5FF] text-[#01F5FF] bg-transparent hover:bg-[#01F5FF] hover:text-slate-900 focus:ring-[#01F5FF]',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

/* --------------------------------- Icons -------------------------------- */
function PlayIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.25" />
      <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
    </svg>
  )
}
function ChevronLeft({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ChevronRight({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


/* ------------------------------- Main Section ---------------------------- */
export default function PropertiesSection() {
  const [modal, setModal] = useState(null)
  const { openBooking } = useBooking()

  const isOpen = !!modal

  const openVideo = useCallback((src, title) => setModal({ type: 'video', src, title }), [])
  const openGallery = useCallback((images, startIndex = 0, title) => setModal({ type: 'gallery', images, index: startIndex, title }), [])
  // const openBookinglocal = useCallback((property) => setModal({ type: property }), [])
  const closeModal = useCallback(() => setModal(null), [])

  // Prevent background scroll while modal is open
 useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])


  // Keyboard controls for gallery
  const prevImage = useCallback(() => {
    setModal((m) =>
      m && m.type === 'gallery' ? { ...m, index: (m.index - 1 + m.images.length) % m.images.length } : m
    )
  }, [])
  const nextImage = useCallback(() => {
    setModal((m) => (m && m.type === 'gallery' ? { ...m, index: (m.index + 1) % m.images.length } : m))
  }, [])
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal()
      if (modal && modal.type === 'gallery') {
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'ArrowLeft') prevImage()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, modal, closeModal, nextImage, prevImage])

  // Touch swipe for gallery
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)
  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX)
  const onTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return
    const delta = touchEndX - touchStartX
    const threshold = 40
    if (delta > threshold) prevImage()
    if (delta < -threshold) nextImage()
    setTouchStartX(null)
    setTouchEndX(null)
  }

  
  //  Fetch properties from API
const [properties, setProperties] = useState([])
const [showAll, setShowAll] = useState(false)

    

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/admin/properties')
      const json = await res.json()
      setProperties(json.data || []) 
    } catch (err) {
      console.error('Error fetching properties:', err)
    }
  }
  fetchProperties()
}, [])
 
//check 
const simpleProperties = properties.filter(
    p => !p.highlight && !p.discountPercent
  )

  return (
    <>
      <section id="properties" className={`${mulish.className} py-20 sm:py-24 bg-slate-900`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-6">Properties</h2>
            <div className="w-16 h-0.5 bg-[#01F5FF] mx-auto mb-6 lg:mb-8"></div>
          </div>

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(showAll ? properties : simpleProperties.slice(0, 3)).map((property, index) => {
              
          // <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          //  {(showAll ? properties : properties.slice(0, 3)).map((property, index) => {
              const isGallery = property.mediaType === 'imageGallery'
              const isVideo = property.mediaType === 'video'
              const isHighlight = !!property.highlight
              const isFirstCard = index === 0

              return (
                <Card
                  key={index}
                  className={[
                    'overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300',
                    isHighlight ? 'relative border-transparent bg-white shadow-lg ring-2 ring-offset-2 ring-[#01F5FF]/80 shadow-cyan-500/20' : 'border-slate-200',
                  ].join(' ')}
                >
                  {/* Discount ribbon */}
                  {isHighlight && (
                    <div className="absolute left-0 top-4 z-20">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#01F5FF] via-cyan-400 to-emerald-300 blur opacity-70 rounded-r-full"></div>
                        <div className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 text-white rounded-r-full">
                          <span className="relative inline-flex">
                            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#01F5FF] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#01F5FF]"></span>
                          </span>
                          <span className="text-xs font-semibold tracking-wide">
                            {property.discountPercent}% OFF • {property.priceNote}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media */}
                  <div className="relative h-48 sm:h-56 lg:h-64 bg-slate-100">
                    {isVideo ? (
                      <>
                        <img
                          src={property.poster}
                          alt={`${property.name} poster`}
                          className="absolute inset-0 w-full h-full object-cover bg-red group-hover:scale-110 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => openVideo(property.video, property.name)}
                          className="absolute inset-0 flex items-center justify-center"
                          aria-label={`Play ${property.name} video`}
                        >
                          <span className="inline-flex items-center justify-center rounded-full text-white bg-black/50 hover:bg-black/60 w-14 h-14 sm:w-16 sm:h-16 shadow-lg">
                            <PlayIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                          </span>
                        </button>
                      </>
                    ) : isGallery ? (
                      <>
                       <Image
                          src={property.images[2] || property.images[0] || '/fallback.jpg'}
                          alt="Property image"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={`object-cover group-hover:scale-110 transition-transform duration-300 ${isHighlight ? 'contrast-110' : ''}`}
                          priority={index === 0}
                        />
                        
                        <button
                          type="button"
                          onClick={() => {
                            const previewSrc = property.images[0]
                            const previewIndex = property.images.indexOf(previewSrc)
                            openGallery(property.images, previewIndex >= 0 ? previewIndex : 0, property.name)
                          }}
                          className="absolute inset-0"
                          aria-label={`View photos of ${property.name}`}
                          title="View photos"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const previewSrc = property.images[0]
                            const previewIndex = property.images.indexOf(previewSrc)
                            openGallery(property.images, previewIndex >= 0 ? previewIndex : 0, property.name)
                          }}
                          className={[
                            'absolute bottom-3 right-3 rounded-full text-xs sm:text-sm px-3 py-1.5 shadow-md',
                            isFirstCard
                              ? 'bg-white/85 text-black hover:bg-white'
                              : isHighlight
                                ? 'text-white bg-gradient-to-r from-[#01F5FF] via-cyan-400 to-emerald-300 hover:from-cyan-400 hover:to-[#01F5FF]'
                                : 'text-white bg-black/60 hover:bg-black/70',
                          ].join(' ')}
                        >
                          View photos ({property.images.length})
                        </button>
                      </>
                    ) : null}
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl text-slate-900 font-semibold mb-2 flex items-center gap-2">
                      {property.name}
                      {isHighlight && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 border border-emerald-200">
                          Hot Deal
                        </span>
                      )}
                    </h3>
                    <p className="text-black text-sm mb-2 font-medium">{property.location}</p>
                    <p className="text-black text-sm mb-4">{property.description}</p>

                    {/* Pricing + CTA */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {!isHighlight ? (
                        <span className="text-slate-900 font-semibold text-sm sm:text-base">PKR {property.price} / {property.priceType}</span>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-slate-500 line-through text-sm">Regular price PKR {property.price} / {property.priceType}</span>
                           <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-emerald-700 text-xs font-semibold">
                              {property.discountPercent}% OFF
                            </span>
                            <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-cyan-700 text-xs font-semibold">
                              {property.priceNote}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#01F5FF] via-cyan-500 to-emerald-400">
                              PKR {property.priceDiscounted} / {property.priceType}
                            </span>
                            <span className="text-slate-500 text-sm">now</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openBooking(property)}
                          className="min-w-[120px]"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
             {!showAll && properties.length > 3 && (
            <div className="text-center mt-8">
              <Link href="/user/all-properties">
            <Button className=""
            size='lg'>
              View All
            </Button>
          </Link>
            </div>
          )}

        </div>
      </section>

      {/* -------- MODALS -------- */}
      {isOpen && modal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6" style={{ minHeight: '100svh' }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />

          {/* Wider, scrollable modal container */}
          <div className="relative z-10 w-full max-w-[1200px]">
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 sm:-top-12 text-white/90 hover:text-white text-2xl"
              aria-label="Close"
            >
              ×
            </button>

            {/* Video Modal */}
            {modal.type === 'video' && (
              <div
                className="mx-auto"
                style={{ maxWidth: 'min(96vw, calc(80svh * 16 / 9))', height: 'min(80svh, calc(96vw * 9 / 16))' }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black">
                  <video src={modal.src} className="absolute inset-0 w-full h-full object-contain" controls autoPlay playsInline />
                </div>
              </div>
            )}

            {/* Gallery Modal */}
            {modal.type === 'gallery' && (
              <div
                className="mx-auto"
                style={{ maxWidth: 'min(96vw, calc(80svh * 16 / 9))', height: 'min(80svh, calc(96vw * 9 / 16))' }}
              >
                <div
                  className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black select-none"
                  onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                  onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
                  onTouchEnd={onTouchEnd}
                >
                  <img
                    src={modal.images[modal.index]}
                    alt={`Gallery ${modal.index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />

                  <button type="button" onClick={prevImage} aria-label="Previous image" className="absolute inset-y-0 left-0 w-1/2 z-10" />
                  <button type="button" onClick={nextImage} aria-label="Next image" className="absolute inset-y-0 right-0 w-1/2 z-10" />

                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white rounded-full p-2 sm:p-3 z-20"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white rounded-full p-2 sm:p-3 z-20"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 text-white text-xs sm:text-sm px-2 py-1 rounded z-20">
                    {modal.index + 1} / {modal.images.length}
                  </div>
                </div>
              </div>
            )}

                  {/* Header (sticky for long content) */}
                  {/* <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden hidden sm:block">
                        {modal.property?.mediaType === 'video' ? (
                          <img src={modal.property.poster} alt="Poster" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <img src={modal.property?.images?.[0]} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-slate-900">
                          Book: {modal.property?.name ?? 'Property'}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600">{modal.property?.location}</p>
                      </div>
                      <button
                        onClick={closeModal}
                        aria-label="Close booking"
                        className="self-start sm:self-auto text-slate-400 hover:text-slate-600 transition p-1"
                      >
                        <CloseIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div> */}
                  
                </div>
              </div>
            )}
         
    </>
  )
}
