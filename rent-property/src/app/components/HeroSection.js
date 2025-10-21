'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, X as CloseIcon } from 'lucide-react'
import { Mulish } from 'next/font/google'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

/* ----------------------------- Floating Alert ----------------------------- */
function FloatingAlert({
  show,
  title = 'Success',
  message = 'Booking saved. We’ll contact you shortly.',
  onClose,
}) {
  return (
    <div
      className={`fixed z-[100] transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      } w-full max-w-sm sm:max-w-xs bottom-0 sm:bottom-4 sm:right-4 sm:translate-x-0`}
      style={{ left: '50%', transform: show ? 'translate(-50%, 0)' : 'translate(-50%, 1rem)' }}
    >
      <div className="mx-auto sm:mx-0 flex items-start gap-3 rounded-xl border border-[#01F5FF]/60 bg-white/95 backdrop-blur p-4 shadow-2xl w-[90%] sm:w-auto">
        <CheckCircle2 className="w-5 h-5 text-[#01F5FF] mt-0.5 flex-shrink-0" />
        <div className="pr-6">
          <p className="text-slate-900 font-semibold">{title}</p>
          <p className="text-slate-600 text-sm break-words">{message}</p>
        </div>
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 transition"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* --------------------------------- Button -------------------------------- */
function Button({ children, className = '', size = 'md', variant = 'default', onClick, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
  const sizes = {
    xs: 'px-2 py-1 text-xs h-7',
    sm: 'px-3 py-2 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12',
  }
  const variants = {
    default: 'bg-[#01F5FF] text-slate-900 hover:bg-[#00DDEE] focus:ring-[#01F5FF]',
    outline:
      'border border-[#01F5FF] text-[#01F5FF] bg-transparent hover:bg-[#01F5FF] hover:text-slate-900 focus:ring-[#01F5FF]',
    link: 'text-[#01F5FF] hover:text-[#00DDEE] underline-offset-4 hover:underline bg-transparent p-0 h-auto',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

/* --------------------------------- Utils --------------------------------- */
const INTERVAL_MIN = 15

function roundUpToInterval(date, intervalMinutes = INTERVAL_MIN) {
  const d = new Date(date)
  const ms = intervalMinutes * 60 * 1000
  const rounded = new Date(Math.ceil(d.getTime() / ms) * ms)
  rounded.setSeconds(0, 0)
  return rounded
}

function addMinutes(d, minutes) {
  return new Date(d.getTime() + minutes * 60 * 1000)
}

function toYMD(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function to12h(d) {
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m} ${ampm}`
}

function parseTimeOption(value, baseDate) {
  const [hh, mm] = value.split(':').map(Number)
  const d = new Date(baseDate)
  d.setHours(hh, mm, 0, 0)
  return d
}

function makeTimeOptions(interval = INTERVAL_MIN) {
  const opts = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      const d = new Date()
      d.setHours(h, m, 0, 0)
      const label = to12h(d)
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      opts.push({ label, value })
    }
  }
  return opts
}

/* ------------------------------ Booking Widget --------------------------- */
function BookingWidget() {
  const now = useMemo(() => new Date(), [])
  const defaultCheckIn = useMemo(() => roundUpToInterval(addMinutes(now, 15)), [now])
  const defaultCheckOut = useMemo(() => addMinutes(defaultCheckIn, 24 * 60), [defaultCheckIn])

  const [checkInDate, setCheckInDate] = useState(defaultCheckIn)
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut)

  const timeOptions = useMemo(() => makeTimeOptions(INTERVAL_MIN), [])

  const [checkInTime, setCheckInTime] = useState(() => {
    const hh = String(defaultCheckIn.getHours()).padStart(2, '0')
    const mm = String(defaultCheckIn.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  })

  const [checkOutTime, setCheckOutTime] = useState(() => {
    const hh = String(defaultCheckOut.getHours()).padStart(2, '0')
    const mm = String(defaultCheckOut.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  })

  const [guests, setGuests] = useState(1)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  const checkInDT = useMemo(() => parseTimeOption(checkInTime, checkInDate), [checkInDate, checkInTime])
  const checkOutDT = useMemo(() => parseTimeOption(checkOutTime, checkOutDate), [checkOutDate, checkOutTime])

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!mobile.trim()) e.mobile = 'Mobile number is required'
    else if (!/^[0-9+\-\s()]{7,20}$/.test(mobile)) e.mobile = 'Enter a valid phone number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleBookNow = async () => {
    if (!validate()) return
    setSaving(true)
    setSavedOk(false)
    try {
      const bookingData = {
        checkIn: { date: toYMD(checkInDT), time: to12h(checkInDT) },
        checkOut: { date: toYMD(checkOutDT), time: to12h(checkOutDT) },
        guests,
        name,
        mobile,
      }

      const existing = JSON.parse(localStorage.getItem('bookings') || '[]')
      existing.push(bookingData)
      localStorage.setItem('bookings', JSON.stringify(existing, null, 2))

      const res = await fetch('/api/save-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: bookingData }),
      })
      if (!res.ok) throw new Error(await res.text())

      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 2500)

      const fresh = roundUpToInterval(new Date())
      const freshOut = addMinutes(fresh, 24 * 60)
      setCheckInDate(fresh)
      setCheckOutDate(freshOut)
      setCheckInTime(`${String(fresh.getHours()).padStart(2, '0')}:${String(fresh.getMinutes()).padStart(2, '0')}`)
      setCheckOutTime(`${String(freshOut.getHours()).padStart(2, '0')}:${String(freshOut.getMinutes()).padStart(2, '0')}`)
      setGuests(1)
      setName('')
      setMobile('')
      setErrors({})
    } catch (err) {
      console.error('Booking save failed:', err)
      alert('Sorry, could not save your booking. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 items-end">
        {/* Check-in Date */}
        <div className="space-y-2 xl:col-span-1">
          <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Check-in Date</label>
          <DatePicker
            selected={checkInDate}
            onChange={(d) => d && setCheckInDate(roundUpToInterval(d))}
            minDate={today}
            dateFormat="yyyy-MM-dd"
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
            placeholderText="Select date"
          />
        </div>

        {/* Check-in Time */}
        <div className="space-y-2 xl:col-span-1">
          <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Check-in Time</label>
          <select
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
          >
            {timeOptions.map((t) => (
              <option key={`ci-${t.value}`} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2 xl:col-span-1">
          <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Check-out Date</label>
          <DatePicker
            selected={checkOutDate}
            onChange={(d) => d && setCheckOutDate(roundUpToInterval(d))}
            minDate={checkInDate}
            dateFormat="yyyy-MM-dd"
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
            placeholderText="Select date"
          />
        </div>

        {/* Check-out Time */}
        <div className="space-y-2 xl:col-span-1">
          <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Check-out Time</label>
          <select
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
          >
            {timeOptions.map((t) => (
              <option key={`co-${t.value}`} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div className="space-y-2 xl:col-span-1">
          <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Guests</label>
          <div className="flex items-center border border-slate-300 rounded-md bg-white">
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="p-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              aria-label="Decrease guests"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="flex-1 text-center text-slate-900 font-medium text-sm">{guests}</span>
            <button
              onClick={() => setGuests((g) => g + 1)}
              className="p-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              aria-label="Increase guests"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2 xl:col-span-1">
          <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
            }}
            placeholder="Your Name"
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
            autoComplete="name"
          />
          {errors.name && <p className="text-xs text-red-500 -mt-1">{errors.name}</p>}
        </div>

        {/* Mobile + CTA — centered at ≥640px and again on ≥1280px (full row on xl) */}
        <div className="space-y-2 sm:col-span-2 xl:col-span-6">
          <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Mobile</label>
          <div className="flex sm:justify-center xl:justify-center">
            <div className="flex w-full sm:max-w-xl xl:max-w-2xl items-stretch gap-2">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value)
                  if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }))
                }}
                placeholder="+92-3XX-XXXXXXX"
                className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
                autoComplete="tel"
              />
              <Button onClick={handleBookNow} disabled={saving} className="px-4 min-w-[120px] h-12">
                {saving ? 'Saving...' : 'Book Now'}
              </Button>
            </div>
          </div>
          {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
        </div>
      </div>

      <FloatingAlert show={savedOk} onClose={() => setSavedOk(false)} />

      <style jsx global>{`
        .react-datepicker {
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: #01f5ff !important;
          color: #0f172a !important;
        }
        .react-datepicker__day:hover {
          background: #e6fafe;
        }
      `}</style>
    </>
  )
}

/* --------------------------- Hero Background Slider ---------------------- */
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { image: '/img1.jpeg', alt: 'Islamabad' },
    { image: '/img2.jpeg', alt: 'Islamabad' },
    { image: '/img3.jpeg', alt: 'Islamabad' },
    { image: '/img4.jpeg', alt: 'Islamabad' },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 translate-x-0'
              : index === (currentSlide - 1 + slides.length) % slides.length
              ? 'opacity-0 -translate-x-full'
              : 'opacity-0 translate-x-full'
          }`}
        >
          <Image
            src={slide.image || '/placeholder.svg'}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80"></div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-[#01F5FF] scale-110' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------- Hero Section ---------------------------- */
export default function HeroSection() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerOffset = window.innerWidth >= 768 ? 140 : 160
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className={`${mulish.className} relative min-h-screen flex flex-col justify-center overflow-hidden pt-32 sm:pt-36 md:pt-40 pb-8`}
    >
      <HeroSlider />

      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 flex-1 flex flex-col justify-center">
        <div className="space-y-6 sm:space-y-8 mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-bold animate-fade-in-up">
            Rooms & Apartment for rent in B-17
          </h1>

          <div className="w-24 h-0.5 bg-[#01F5FF] mx-auto animate-fade-in-up animation-delay-200"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto px-4 leading-relaxed animate-fade-in-up animation-delay-400">
            Discover premium rentals in Islamabad — from luxury apartments to comfortable homes in B-17 & D-17 Islamabad
          </p>
          <button
            onClick={() => scrollToSection('properties')}
            className="bg-[#01F5FF] hover:bg-[#00DDEE] text-slate-900 px-6 py-2 text-sm mx-auto font-semibold rounded-md animate-fade-in-up animation-delay-600"
          >
            Explore Properties
          </button>
        </div>

        <div className="mt-8 sm:mt-12 animate-fade-in-up animation-delay-800 relative z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-6 max-w-7xl mx-auto">
            <BookingWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
