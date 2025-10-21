'use client'

import Image from 'next/image'
import { Mulish } from 'next/font/google'
import { useEffect, useMemo, useState, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CheckCircle2, X as CloseIcon } from 'lucide-react'

import { useBooking } from '../../context/BookingContext'  // add this

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

/* ----------------------------- UI Primitives ----------------------------- */
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

/* ------------------------------ Utils ------------------------------ */
const INTERVAL_MIN = 15

const addHours = (d, h) => new Date(d.getTime() + h * 3600_000)
const roundUpToInterval = (date, intervalMinutes = INTERVAL_MIN) => {
  const d = new Date(date)
  const ms = intervalMinutes * 60 * 1000
  const rounded = new Date(Math.ceil(d.getTime() / ms) * ms)
  rounded.setSeconds(0, 0)
  return rounded
}
const toYMD = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const to12h = (d) => {
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m} ${ampm}`
}
const parseTimeOption = (value, baseDate) => {
  const [hh, mm] = value.split(':').map(Number)
  const d = new Date(baseDate)
  d.setHours(hh, mm, 0, 0)
  return d
}
const makeTimeOptions = (interval = INTERVAL_MIN) => {
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

/* ----------------------------- Floating Alert ---------------------------- */
function FloatingAlert({ show, title = 'Success', message = 'Booking saved. We’ll contact you shortly.', onClose }) {
  return (
    <div
      className={`fixed z-[100] transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      w-full max-w-sm sm:max-w-xs bottom-0 sm:bottom-4 sm:right-4 sm:translate-x-0`}
      style={{ left: show ? '50%' : '50%', transform: show ? 'translate(-50%, 0)' : 'translate(-50%, 1rem)' }}
    >
      <div className="mx-auto sm:mx-0 flex items-start gap-3 rounded-xl border border-[#01F5FF]/60 bg-white/95 backdrop-blur p-4 shadow-2xl w-[90%] sm:w-auto">
        <CheckCircle2 className="w-5 h-5 text-[#01F5FF] mt-0.5 flex-shrink-0" />
        <div className="pr-6">
          <p className="text-slate-900 font-semibold">{title}</p>
          <p className="text-slate-600 text-sm break-words">{message}</p>
        </div>
        <button aria-label="Close" onClick={onClose} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 transition">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* --------------------------- Datepicker Enhancements --------------------- */
function CustomHeader({ date, changeYear, changeMonth, onClose }) {
  const years = useMemo(() => {
    const y = new Date().getFullYear()
    const arr = []
    for (let i = y - 50; i <= y + 10; i++) arr.push(i)
    return arr
  }, [])
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b bg-white sticky top-0">
      <div className="flex items-center gap-2">
        <select
          aria-label="Month"
          className="rounded-md border border-slate-300 text-sm px-2 py-1 bg-white"
          value={months[date.getMonth()]}
          onChange={(e) => changeMonth(months.indexOf(e.target.value))}
        >
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          aria-label="Year"
          className="rounded-md border border-slate-300 text-sm px-2 py-1 bg-white"
          value={date.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <button
        type="button"
        aria-label="Close calendar"
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
function CalendarContainerWrap({ className, children }) {
  return <div className={`${className || ''} booking-calendar`}>{children}</div>
}

/* ------------------------------ Booking Widget --------------------------- */
/* Date pickers for dates + dropdown selects for times. No 1‑hour constraint. */
function BookingWidget({ defaultGuests = 1, onBooked }) {
  const now = useMemo(() => roundUpToInterval(new Date()), [])
  const defaultCheckOut = useMemo(() => addHours(now, 24), [now])

  const [checkInDate, setCheckInDate] = useState(now)
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut)

  const timeOptions = useMemo(() => makeTimeOptions(INTERVAL_MIN), [])
  const [checkInTime, setCheckInTime] = useState(() => `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
  const [checkOutTime, setCheckOutTime] = useState(() => {
    const out = defaultCheckOut
    return `${String(out.getHours()).padStart(2, '0')}:${String(out.getMinutes()).padStart(2, '0')}`
  })

  const [guests, setGuests] = useState(defaultGuests)
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

      const freshNow = roundUpToInterval(new Date())
      const freshOut = addHours(freshNow, 24)
      setCheckInDate(freshNow)
      setCheckOutDate(freshOut)
      setCheckInTime(`${String(freshNow.getHours()).padStart(2, '0')}:${String(freshNow.getMinutes()).padStart(2, '0')}`)
      setCheckOutTime(`${String(freshOut.getHours()).padStart(2, '0')}:${String(freshOut.getMinutes()).padStart(2, '0')}`)
      setGuests(defaultGuests)
      setName('')
      setMobile('')
      setErrors({})

      onBooked?.(bookingData)
    } catch (err) {
      console.error('Booking save failed:', err)
      alert('Sorry, could not save your booking. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const pickerCommon = (onClose, minDate) => ({
    dateFormat: 'yyyy-MM-dd',
    popperPlacement: 'bottom-start',
    withPortal: true,
    portalId: 'booking-datepicker-portal',
    shouldCloseOnScroll: true,
    dropdownMode: 'select',
    showMonthDropdown: false,
    showYearDropdown: false,
    scrollableYearDropdown: true,
    yearDropdownItemNumber: 60,
    calendarClassName: 'booking-calendar',
    fixedHeight: true,
    renderCustomHeader: (props) => <CustomHeader {...props} onClose={onClose} />,
    minDate,
    onClickOutside: onClose,
    onKeyDown: (e) => { if (e.key === 'Escape') onClose() },
    calendarContainer: CalendarContainerWrap,
  })

  const [openCheckIn, setOpenCheckIn] = useState(false)
  const [openCheckOut, setOpenCheckOut] = useState(false)

  return (
    <>
      {/* Wider inline layout: 6 columns from lg (≥1024px) so fields sit in one line */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        {/* Check-in Date */}
        <div className="space-y-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Check‑in Date</label>
          <DatePicker
            selected={checkInDate}
            onChange={(d) => d && setCheckInDate(roundUpToInterval(d))}
            {...pickerCommon(() => setOpenCheckIn(false), today)}
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm"
            placeholderText="Select date"
            open={openCheckIn}
            onInputClick={() => setOpenCheckIn(true)}
            onCalendarOpen={() => setOpenCheckIn(true)}
            onCalendarClose={() => setOpenCheckIn(false)}
          />
        </div>

        {/* Check-in Time */}
        <div className="space-y-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Check‑in Time</label>
          <select
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
          >
            {timeOptions.map((t) => (
              <option key={`ci-${t.value}`} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Check‑out Date</label>
          <DatePicker
            selected={checkOutDate}
            onChange={(d) => d && setCheckOutDate(roundUpToInterval(d))}
            {...pickerCommon(() => setOpenCheckOut(false), checkInDate)}
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm"
            placeholderText="Select date"
            open={openCheckOut}
            onInputClick={() => setOpenCheckOut(true)}
            onCalendarOpen={() => setOpenCheckOut(true)}
            onCalendarClose={() => setOpenCheckOut(false)}
          />
        </div>

        {/* Check-out Time */}
        <div className="space-y-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Check‑out Time</label>
          <select
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
          >
            {timeOptions.map((t) => (
              <option key={`co-${t.value}`} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div className="space-y-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Guests</label>
          <div className="flex items-center border border-slate-300 rounded-md bg-white">
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="p-3 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
              aria-label="Decrease guests"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
            <span className="flex-1 text-center text-slate-900 font-medium text-sm" aria-live="polite">{guests}</span>
            <button
              onClick={() => setGuests((g) => g + 1)}
              className="p-3 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
              aria-label="Increase guests"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
            }}
            placeholder="Your Name"
            className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm"
            inputMode="text"
            autoComplete="name"
          />
          {errors.name && <p className="text-xs text-red-500 -mt-1">{errors.name}</p>}
        </div>

        {/* Mobile + Book Now — full row on xl, centered on sm and xl */}
        <div className="space-y-2 md:col-span-2 xl:col-span-6">
          <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Mobile</label>
          <div className="flex sm:justify-center xl:justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 w-full sm:max-w-xl xl:max-w-2xl">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value)
                  if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }))
                }}
                placeholder="+92-3XX-XXXXXXX"
                className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm"
                inputMode="tel"
                autoComplete="tel"
              />
              <Button
                onClick={handleBookNow}
                disabled={saving}
                className="w-full sm:w-auto sm:min-w-[128px] h-12 px-4"
                aria-label="Submit booking"
              >
                {saving ? 'Saving…' : 'Book Now'}
              </Button>
            </div>
          </div>
          {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
        </div>
      </div>

      <FloatingAlert show={savedOk} onClose={() => setSavedOk(false)} />

      {/* Global styles: non-blocking portal + tidy calendar */}
      <style jsx global>{`
        .react-datepicker__portal {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 16px;
          z-index: 100 !important;
          background: transparent !important;
          pointer-events: none;
        }
        .react-datepicker__portal .react-datepicker { pointer-events: auto; }

        .react-datepicker,
        .booking-calendar .react-datepicker {
          width: min(96vw, 520px);
          max-height: calc(96svh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 20px 44px rgba(2, 6, 23, 0.18);
        }

        .react-datepicker__navigation,
        .react-datepicker__navigation--previous,
        .react-datepicker__navigation--next { display: none !important; }

        .react-datepicker__header {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 2;
        }
        .react-datepicker__current-month { display: none; }

        .react-datepicker__month { padding: 8px 10px 12px 10px; }

        .react-datepicker__day-name,
        .react-datepicker__day {
          box-sizing: border-box;
          margin: 0.15rem;
          width: 2.25rem;
          height: 2.25rem;
          line-height: 2.25rem;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          user-select: none;
        }

        @media (min-width: 900px) {
          .react-datepicker {
            display: grid;
            grid-template-columns: 1fr 120px;
            align-items: stretch;
            min-height: 360px;
          }
          .react-datepicker__month-container { border-right: 1px solid #e5e7eb; min-width: 0; }
          .react-datepicker__time-container { width: 120px; background: #fff; }
          .react-datepicker__time, .react-datepicker__time-box { width: 120px; max-height: 320px; }
          .react-datepicker__time-list { scrollbar-width: thin; }
          .react-datepicker__time-list-item--selected {
            background: #01F5FF !important; color: #0f172a !important; border-radius: 6px;
          }
        }

        @media (min-width: 1200px) {
          .react-datepicker { grid-template-columns: 1fr 136px; }
          .react-datepicker__time-container, .react-datepicker__time, .react-datepicker__time-box { width: 136px; }
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: #01F5FF !important;
          color: #0f172a !important;
        }
        .react-datepicker__day:hover { background: #e6fafe; }
      `}</style>
    </>
  )
}

/* ------------------------------- Main Section ---------------------------- */
export default function BookingSection() {
//   const [modal, setModal] = useState(null)
  const { modal,  closeBooking } = useBooking()  // get from context
  const isOpen = !!modal

//   const openBooking = useCallback((property) => setModal({ type: 'booking', property }), [])
//   const closeModal = useCallback(() => setModal(null), [])

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return
    const { style } = document.body
    const prev = style.overflow
    style.overflow = 'hidden'
    return () => { style.overflow = prev }
  }, [isOpen])

  /* ---------- Scroll hint logic for Booking Modal ---------- */
  useEffect(() => {
    if (modal?.type !== 'booking') return
    const container = document.getElementById('booking-scroll-container')
    const indicator = document.getElementById('scroll-indicator')
    if (!container || !indicator) return

    const checkScroll = () => {
      const hasOverflow = container.scrollHeight > container.clientHeight + 1
      if (!hasOverflow) {
        indicator.style.opacity = '0'
        return
      }
      const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10
      indicator.style.opacity = nearBottom ? '0' : '1'
    }

    // Initial + listeners
    checkScroll()
    container.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    // Small delayed check (images/fonts can change height)
    const t = setTimeout(checkScroll, 150)

    return () => {
      clearTimeout(t)
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [modal])

  return (
    <>
     
      {/* -------- MODALS -------- */}
      {isOpen && modal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6" style={{ minHeight: '100svh' }}>
          {/* <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} /> */}
<div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeBooking} />


          {/* Wider, scrollable modal container */}
          <div className="relative z-10 w-full max-w-[1200px]">
            <button
              onClick={closeBooking}
              className="absolute -top-10 right-0 sm:-top-12 text-white/90 hover:text-white text-2xl"
              aria-label="Close"
            >
              ×
            </button>

            {/* Booking Modal — scrollable & expanded with scroll hint */}
            {modal.type === 'booking' && (
              <div className="mx-auto w-full">
                <div
                  className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-white max-h-[90svh] overflow-y-auto"
                  id="booking-scroll-container"
                >
                  {/* Bottom fade + hint (only visible when content overflows / not at bottom) */}
                  <div
                    id="scroll-indicator"
                    className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent flex items-end justify-center text-[11px] sm:text-xs text-slate-500 pointer-events-none opacity-0 transition-opacity duration-200"
                    aria-hidden="true"
                  >
                    <div className="mb-1 px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 shadow-sm">
                      ↑ Scroll for more
                    </div>
                  </div>

                  {/* Header (sticky for long content) */}
                  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5">
                      {/* <div className="relative w-16 h-16 rounded-md overflow-hidden hidden sm:block">
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
                      </div> */}
                      <button
                        onClick={closeBooking} 
                        aria-label="Close booking"
                        className="self-start sm:self-auto text-slate-400 hover:text-slate-600 transition p-1"
                      >
                        <CloseIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg">
                      <BookingWidget
                        defaultGuests={1}
                        onBooked={() => {
                          // optionally close after success
                          // setTimeout(() => closeModal(), 1200)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        // </div>
      )}
    </>
  )
}
