'use client'

import Image from 'next/image'
import { Mulish } from 'next/font/google'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { CheckCircle2, Search, Filter } from 'lucide-react'
import { useBooking } from '../../../context/BookingContext'

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

/* ----------------------------- UI Components ----------------------------- */
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

/* ----------------------------- Skeleton Loader ----------------------------- */
function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm animate-pulse overflow-hidden">
      <div className="h-48 sm:h-56 lg:h-64 bg-slate-200" />
      <div className="p-4 sm:p-6 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-8 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- Icons ----------------------------- */
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

/* ----------------------------- Main Page ----------------------------- */
export default function AllPropertiesPage() {
  const [modal, setModal] = useState(null)
  const { openBooking } = useBooking()
  const [properties, setProperties] = useState([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ location: '', sector: '', price: '' })
  const [loading, setLoading] = useState(true) // ✅ Added loading state


  const [visibleCount, setVisibleCount] = useState(3)
const [loadingMore, setLoadingMore] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    if (loadingMore || loading) return
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      setLoadingMore(true)
      setTimeout(() => {
        setVisibleCount(prev => prev + 3) // load 3 more each time
        setLoadingMore(false)
      }, 800) // skeleton delay
    }
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [loadingMore, loading])


  const isOpen = !!modal

  const openVideo = useCallback((src, title) => setModal({ type: 'video', src, title }), [])
  const openGallery = useCallback((images, startIndex = 0, title) => setModal({ type: 'gallery', images, index: startIndex, title }), [])
  const closeModal = useCallback(() => setModal(null), [])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  const prevImage = useCallback(() => {
    setModal(m => m && m.type === 'gallery' ? { ...m, index: (m.index - 1 + m.images.length) % m.images.length } : m)
  }, [])
  const nextImage = useCallback(() => {
    setModal(m => m && m.type === 'gallery' ? { ...m, index: (m.index + 1) % m.images.length } : m)
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('/api/admin/properties')
        const json = await res.json()
        setProperties(json.data || [])
      } catch (err) {
        console.error('Error fetching all properties:', err)
      } finally {
        setLoading(false) // ✅ stop skeleton after data load
      }
    }
    fetchAll()
  }, [])

  const filtered = useMemo(() => {
    let list = properties
    if (search.trim()) {
      const term = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.location?.toLowerCase().includes(term) ||
          p.sector?.toLowerCase().includes(term)
      )
    }
    if (filters.location) list = list.filter(p => p.location === filters.location)
    if (filters.sector) list = list.filter(p => p.sector === filters.sector)
    if (filters.price === 'low-high') {
      list = [...list].sort((a, b) => (parseFloat(a.priceRegular || a.price) || 0) - (parseFloat(b.priceRegular || b.price) || 0))
    }
    if (filters.price === 'high-low') {
      list = [...list].sort((a, b) => (parseFloat(b.priceRegular || b.price) || 0) - (parseFloat(a.priceRegular || a.price) || 0))
    }
    return list
  }, [search, properties, filters])

  const uniqueLocations = [...new Set(properties.map(p => p.location).filter(Boolean))]
  const uniqueSectors = [...new Set(properties.map(p => p.sector).filter(Boolean))]

  return (
    <>
      <section
        className={`${mulish.className} py-20 sm:py-24`}
        style={{
          background: 'linear-gradient(135deg, #001F3F 0%, #012448ff 40%, #022948ff 60%, #063d4cff 100%)',
        }}
      >
        <div className="container mx-auto px-4">
          {/* Header with search */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 lg:mb-10 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-4">All Properties</h2>
              <div className="w-16 h-0.5 bg-[#01F5FF] mx-auto sm:mx-0"></div>
            </div>

            <div className="relative text-white w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by name, location, sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#01F5FF]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
            </div>
          </div>

          {/* Filters */}
          <div className="filters flex flex-wrap items-center gap-4 justify-center sm:justify-start mb-12">
            <div className="flex items-center gap-2 text-white">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold">Filters:</span>
            </div>

            <select
              className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-md text-white text-sm px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-[#01F5FF] transition"
              value={filters.location}
              onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-md text-white text-sm px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-[#01F5FF] transition"
              value={filters.sector}
              onChange={(e) => setFilters(f => ({ ...f, sector: e.target.value }))}
            >
              <option value="">All Sectors</option>
              {uniqueSectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>

            <select
              className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-md text-white text-sm px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-[#01F5FF] transition"
              value={filters.price}
              onChange={(e) => setFilters(f => ({ ...f, price: e.target.value }))}
            >
              <option value="">Sort by Price</option>
              <option value="low-high">Low → High</option>
              <option value="high-low">High → Low</option>
            </select>

            <button
              onClick={() => setFilters({ location: '', sector: '', price: '' })}
              className="text-xs sm:text-sm px-4 py-2 rounded-md bg-[#01F5FF]/10 border border-[#01F5FF]/30 text-[#01F5FF] hover:bg-[#01F5FF]/20 shadow-md transition"
            >
              Reset
            </button>
          </div>

        {/* ✅ Property grid + gradual scroll loading */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
  {loading
    ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
    : filtered.length > 0
      ? (
        <>
          {filtered.slice(0, visibleCount).map((property, index) => {
            const isGallery = property.mediaType === 'imageGallery'
            const isVideo = property.mediaType === 'video'
            const isHighlight = !!property.highlight

            return (
              <Card
                key={property.id || index}
                className={[
                  'overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300',
                  isHighlight
                    ? 'relative border-transparent bg-white shadow-lg ring-2 ring-offset-2 ring-[#01F5FF]/80 shadow-cyan-500/20'
                    : 'border-slate-200',
                ].join(' ')}
              >
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

                <div className="relative h-48 sm:h-56 lg:h-64 bg-slate-100">
                  {isVideo ? (
                    <>
                      <img src={property.poster} alt={`${property.name} poster`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <button type="button" onClick={() => openVideo(property.video, property.name)} className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-flex items-center justify-center rounded-full text-white bg-black/50 hover:bg-black/60 w-14 h-14 sm:w-16 sm:h-16 shadow-lg">
                          <PlayIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                        </span>
                      </button>
                    </>
                  ) : isGallery ? (
                    <>
                      <Image
                        src={property.images?.[0] || '/fallback.jpg'}
                        alt="Property image"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => openGallery(property.images, 0, property.name)}
                        className="absolute bottom-3 right-3 bg-black/60 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full hover:bg-black/80"
                      >
                        View photos ({property.images.length})
                      </button>
                    </>
                  ) : null}
                </div>

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
                  {property.sector && <p className="text-slate-600 text-xs mb-2">Sector: {property.sector}</p>}
                  <p className="text-black text-sm mb-4">{property.description}</p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {!isHighlight ? (
                      <span className="text-slate-900 font-semibold text-sm sm:text-base">From {property.price}</span>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-slate-500 line-through text-sm">Regular price {property.priceRegular}</span>
                          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-emerald-700 text-xs font-semibold">
                            {property.discountPercent}% OFF
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#01F5FF] via-cyan-500 to-emerald-400">
                            {property.priceDiscounted}
                          </span>
                          <span className="text-slate-500 text-sm">now</span>
                        </div>
                      </div>
                    )}
                    <Button size="sm" onClick={() => openBooking(property)} className="min-w-[120px]">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {loadingMore && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`s-${i}`} />)}
        </>
      )
      : (
        <div className="text-center text-white/70 col-span-full py-10 text-lg">No properties match your search.</div>
      )}
</div>

        </div>
      </section>
      



      {/* -------- MODALS -------- */}
      {isOpen && modal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-[1200px]">
            <button onClick={closeModal} className="absolute -top-10 right-0 text-white/90 hover:text-white text-2xl">×</button>

            {modal.type === 'video' && (
              <div className="mx-auto" style={{ maxWidth: 'min(96vw, calc(80svh * 16 / 9))', height: 'min(80svh, calc(96vw * 9 / 16))' }}>
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                  <video src={modal.src} className="absolute inset-0 w-full h-full object-contain" controls autoPlay playsInline />
                </div>
              </div>
            )}

            {modal.type === 'gallery' && (
              <div
                className="mx-auto"
                style={{ maxWidth: 'min(96vw, calc(80svh * 16 / 9))', height: 'min(80svh, calc(96vw * 9 / 16))' }}
              >
                <div
                  className="relative w-full h-full rounded-xl overflow-hidden bg-black select-none"
                >
                  <img src={modal.images[modal.index]} alt="Gallery" className="absolute inset-0 w-full h-full object-contain" />
                  <button type="button" onClick={() => prevImage()} className="absolute inset-y-0 left-0 w-1/2 z-10" />
                  <button type="button" onClick={() => nextImage()} className="absolute inset-y-0 right-0 w-1/2 z-10" />

                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white rounded-full p-2 z-20">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white rounded-full p-2 z-20">
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-20">
                    {modal.index + 1} / {modal.images.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
