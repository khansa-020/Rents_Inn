// 'use client'

// import Image from 'next/image'
// import { Mulish } from 'next/font/google'
// import { useEffect, useMemo, useState, useCallback } from 'react'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
// import { CheckCircle2, X as CloseIcon } from 'lucide-react'


// const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

// /* ----------------------------- UI Primitives ----------------------------- */
// function Card({ children, className = '' }) {
//   return <div className={`rounded-lg border bg-white text-slate-950 shadow-sm ${className}`}>{children}</div>
// }
// function CardContent({ children, className = '' }) {
//   return <div className={`p-6 ${className}`}>{children}</div>
// }
// function Button({ children, className = '', size = 'md', variant = 'default', onClick, ...props }) {
//   const base =
//     'inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
//   const sizes = { xs: 'px-2 py-1 text-xs h-8', sm: 'px-3 py-2 text-sm h-9', md: 'px-4 py-2 text-base h-10', lg: 'px-6 py-3 text-lg h-12' }
//   const variants = {
//     default: 'bg-[#01F5FF] text-slate-900 hover:bg-[#00DDEE] focus:ring-[#01F5FF]',
//     outline: 'border border-[#01F5FF] text-[#01F5FF] bg-transparent hover:bg-[#01F5FF] hover:text-slate-900 focus:ring-[#01F5FF]',
//     ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
//   }
//   return (
//     <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
//       {children}
//     </button>
//   )
// }

// /* --------------------------------- Icons -------------------------------- */
// function PlayIcon({ className = '' }) {
//   return (
//     <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
//       <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.25" />
//       <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
//     </svg>
//   )
// }
// function ChevronLeft({ className = '' }) {
//   return (
//     <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
//       <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   )
// }
// function ChevronRight({ className = '' }) {
//   return (
//     <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
//       <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   )
// }

// /* ------------------------------ Utils ------------------------------ */
// const INTERVAL_MIN = 15

// const addHours = (d, h) => new Date(d.getTime() + h * 3600_000)
// const roundUpToInterval = (date, intervalMinutes = INTERVAL_MIN) => {
//   const d = new Date(date)
//   const ms = intervalMinutes * 60 * 1000
//   const rounded = new Date(Math.ceil(d.getTime() / ms) * ms)
//   rounded.setSeconds(0, 0)
//   return rounded
// }
// const toYMD = (d) => {
//   const y = d.getFullYear()
//   const m = String(d.getMonth() + 1).padStart(2, '0')
//   const day = String(d.getDate()).padStart(2, '0')
//   return `${y}-${m}-${day}`
// }
// const to12h = (d) => {
//   let h = d.getHours()
//   const m = String(d.getMinutes()).padStart(2, '0')
//   const ampm = h >= 12 ? 'PM' : 'AM'
//   h = h % 12
//   if (h === 0) h = 12
//   return `${h}:${m} ${ampm}`
// }
// const parseTimeOption = (value, baseDate) => {
//   const [hh, mm] = value.split(':').map(Number)
//   const d = new Date(baseDate)
//   d.setHours(hh, mm, 0, 0)
//   return d
// }
// const makeTimeOptions = (interval = INTERVAL_MIN) => {
//   const opts = []
//   for (let h = 0; h < 24; h++) {
//     for (let m = 0; m < 60; m += interval) {
//       const d = new Date()
//       d.setHours(h, m, 0, 0)
//       const label = to12h(d)
//       const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
//       opts.push({ label, value })
//     }
//   }
//   return opts
// }

// /* ----------------------------- Floating Alert ---------------------------- */
// function FloatingAlert({ show, title = 'Success', message = 'Booking saved. We’ll contact you shortly.', onClose }) {
//   return (
//     <div
//       className={`fixed z-[100] transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
//       w-full max-w-sm sm:max-w-xs bottom-0 sm:bottom-4 sm:right-4 sm:translate-x-0`}
//       style={{ left: show ? '50%' : '50%', transform: show ? 'translate(-50%, 0)' : 'translate(-50%, 1rem)' }}
//     >
//       <div className="mx-auto sm:mx-0 flex items-start gap-3 rounded-xl border border-[#01F5FF]/60 bg-white/95 backdrop-blur p-4 shadow-2xl w-[90%] sm:w-auto">
//         <CheckCircle2 className="w-5 h-5 text-[#01F5FF] mt-0.5 flex-shrink-0" />
//         <div className="pr-6">
//           <p className="text-slate-900 font-semibold">{title}</p>
//           <p className="text-slate-600 text-sm break-words">{message}</p>
//         </div>
//         <button aria-label="Close" onClick={onClose} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 transition">
//           <CloseIcon className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   )
// }

// /* --------------------------- Datepicker Enhancements --------------------- */
// function CustomHeader({ date, changeYear, changeMonth, onClose }) {
//   const years = useMemo(() => {
//     const y = new Date().getFullYear()
//     const arr = []
//     for (let i = y - 50; i <= y + 10; i++) arr.push(i)
//     return arr
//   }, [])
//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ]
//   return (
//     <div className="flex items-center justify-between px-3 py-2 border-b bg-white sticky top-0">
//       <div className="flex items-center gap-2">
//         <select
//           aria-label="Month"
//           className="rounded-md border border-slate-300 text-sm px-2 py-1 bg-white"
//           value={months[date.getMonth()]}
//           onChange={(e) => changeMonth(months.indexOf(e.target.value))}
//         >
//           {months.map((m) => <option key={m} value={m}>{m}</option>)}
//         </select>
//         <select
//           aria-label="Year"
//           className="rounded-md border border-slate-300 text-sm px-2 py-1 bg-white"
//           value={date.getFullYear()}
//           onChange={(e) => changeYear(Number(e.target.value))}
//         >
//           {years.map((y) => <option key={y} value={y}>{y}</option>)}
//         </select>
//       </div>
//       <button
//         type="button"
//         aria-label="Close calendar"
//         onClick={onClose}
//         className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
//       >
//         <CloseIcon className="w-4 h-4" />
//       </button>
//     </div>
//   )
// }
// function CalendarContainerWrap({ className, children }) {
//   return <div className={`${className || ''} booking-calendar`}>{children}</div>
// }

// /* ------------------------------ Booking Widget --------------------------- */
// /* Date pickers for dates + dropdown selects for times. No 1‑hour constraint. */
// function BookingWidget({ defaultGuests = 1, onBooked }) {
//   const now = useMemo(() => roundUpToInterval(new Date()), [])
//   const defaultCheckOut = useMemo(() => addHours(now, 24), [now])

//   const [checkInDate, setCheckInDate] = useState(now)
//   const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut)

//   const timeOptions = useMemo(() => makeTimeOptions(INTERVAL_MIN), [])
//   const [checkInTime, setCheckInTime] = useState(() => `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
//   const [checkOutTime, setCheckOutTime] = useState(() => {
//     const out = defaultCheckOut
//     return `${String(out.getHours()).padStart(2, '0')}:${String(out.getMinutes()).padStart(2, '0')}`
//   })

//   const [guests, setGuests] = useState(defaultGuests)
//   const [name, setName] = useState('')
//   const [mobile, setMobile] = useState('')
//   const [errors, setErrors] = useState({})
//   const [saving, setSaving] = useState(false)
//   const [savedOk, setSavedOk] = useState(false)

//   const checkInDT = useMemo(() => parseTimeOption(checkInTime, checkInDate), [checkInDate, checkInTime])
//   const checkOutDT = useMemo(() => parseTimeOption(checkOutTime, checkOutDate), [checkOutDate, checkOutTime])

//   const validate = () => {
//     const e = {}
//     if (!name.trim()) e.name = 'Name is required'
//     if (!mobile.trim()) e.mobile = 'Mobile number is required'
//     else if (!/^[0-9+\-\s()]{7,20}$/.test(mobile)) e.mobile = 'Enter a valid phone number'
//     setErrors(e)
//     return Object.keys(e).length === 0
//   }

//   const handleBookNow = async () => {
//     if (!validate()) return
//     setSaving(true)
//     setSavedOk(false)
//     try {
//       const bookingData = {
//         checkIn: { date: toYMD(checkInDT), time: to12h(checkInDT) },
//         checkOut: { date: toYMD(checkOutDT), time: to12h(checkOutDT) },
//         guests,
//         name,
//         mobile,
//       }

//       const existing = JSON.parse(localStorage.getItem('bookings') || '[]')
//       existing.push(bookingData)
//       localStorage.setItem('bookings', JSON.stringify(existing, null, 2))

//       const res = await fetch('/api/save-booking', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ booking: bookingData }),
//       })
//       if (!res.ok) throw new Error(await res.text())

//       setSavedOk(true)
//       setTimeout(() => setSavedOk(false), 2500)

//       const freshNow = roundUpToInterval(new Date())
//       const freshOut = addHours(freshNow, 24)
//       setCheckInDate(freshNow)
//       setCheckOutDate(freshOut)
//       setCheckInTime(`${String(freshNow.getHours()).padStart(2, '0')}:${String(freshNow.getMinutes()).padStart(2, '0')}`)
//       setCheckOutTime(`${String(freshOut.getHours()).padStart(2, '0')}:${String(freshOut.getMinutes()).padStart(2, '0')}`)
//       setGuests(defaultGuests)
//       setName('')
//       setMobile('')
//       setErrors({})

//       onBooked?.(bookingData)
//     } catch (err) {
//       console.error('Booking save failed:', err)
//       alert('Sorry, could not save your booking. Please try again.')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const today = new Date()
//   today.setHours(0, 0, 0, 0)

//   const pickerCommon = (onClose, minDate) => ({
//     dateFormat: 'yyyy-MM-dd',
//     popperPlacement: 'bottom-start',
//     withPortal: true,
//     portalId: 'booking-datepicker-portal',
//     shouldCloseOnScroll: true,
//     dropdownMode: 'select',
//     showMonthDropdown: false,
//     showYearDropdown: false,
//     scrollableYearDropdown: true,
//     yearDropdownItemNumber: 60,
//     calendarClassName: 'booking-calendar',
//     fixedHeight: true,
//     renderCustomHeader: (props) => <CustomHeader {...props} onClose={onClose} />,
//     minDate,
//     onClickOutside: onClose,
//     onKeyDown: (e) => { if (e.key === 'Escape') onClose() },
//     calendarContainer: CalendarContainerWrap,
//   })

//   const [openCheckIn, setOpenCheckIn] = useState(false)
//   const [openCheckOut, setOpenCheckOut] = useState(false)

//   return (
//     <>
//       {/* Wider inline layout: 6 columns from lg (≥1024px) so fields sit in one line */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
//         {/* Check-in Date */}
//         <div className="space-y-2 lg:col-span-1">
//           <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Check‑in Date</label>
//           <DatePicker
//             selected={checkInDate}
//             onChange={(d) => d && setCheckInDate(roundUpToInterval(d))}
//             {...pickerCommon(() => setOpenCheckIn(false), today)}
//             className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm"
//             placeholderText="Select date"
//             open={openCheckIn}
//             onInputClick={() => setOpenCheckIn(true)}
//             onCalendarOpen={() => setOpenCheckIn(true)}
//             onCalendarClose={() => setOpenCheckIn(false)}
//           />
//         </div>

//         {/* Check-in Time */}
//         <div className="space-y-2 lg:col-span-1">
//           <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Check‑in Time</label>
//           <select
//             value={checkInTime}
//             onChange={(e) => setCheckInTime(e.target.value)}
//             className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
//           >
//             {timeOptions.map((t) => (
//               <option key={`ci-${t.value}`} value={t.value}>{t.label}</option>
//             ))}
//           </select>
//         </div>

//         {/* Check-out Date */}
//         <div className="space-y-2 lg:col-span-1">
//           <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Check‑out Date</label>
//           <DatePicker
//             selected={checkOutDate}
//             onChange={(d) => d && setCheckOutDate(roundUpToInterval(d))}
//             {...pickerCommon(() => setOpenCheckOut(false), checkInDate)}
//             className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm"
//             placeholderText="Select date"
//             open={openCheckOut}
//             onInputClick={() => setOpenCheckOut(true)}
//             onCalendarOpen={() => setOpenCheckOut(true)}
//             onCalendarClose={() => setOpenCheckOut(false)}
//           />
//         </div>

//         {/* Check-out Time */}
//         <div className="space-y-2 lg:col-span-1">
//           <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Check‑out Time</label>
//           <select
//             value={checkOutTime}
//             onChange={(e) => setCheckOutTime(e.target.value)}
//             className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm bg-white"
//           >
//             {timeOptions.map((t) => (
//               <option key={`co-${t.value}`} value={t.value}>{t.label}</option>
//             ))}
//           </select>
//         </div>

//         {/* Guests */}
//         <div className="space-y-2 lg:col-span-1">
//           <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Guests</label>
//           <div className="flex items-center border border-slate-300 rounded-md bg-white">
//             <button
//               onClick={() => setGuests((g) => Math.max(1, g - 1))}
//               className="p-3 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
//               aria-label="Decrease guests"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
//             </button>
//             <span className="flex-1 text-center text-slate-900 font-medium text-sm" aria-live="polite">{guests}</span>
//             <button
//               onClick={() => setGuests((g) => g + 1)}
//               className="p-3 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
//               aria-label="Increase guests"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
//             </button>
//           </div>
//         </div>

//         {/* Name */}
//         <div className="space-y-2 lg:col-span-1">
//           <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => {
//               setName(e.target.value)
//               if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
//             }}
//             placeholder="Your Name"
//             className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm"
//             inputMode="text"
//             autoComplete="name"
//           />
//           {errors.name && <p className="text-xs text-red-500 -mt-1">{errors.name}</p>}
//         </div>

//         {/* Mobile + Book Now — full row on xl, centered on sm and xl */}
//         <div className="space-y-2 md:col-span-2 xl:col-span-6">
//           <label className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Mobile</label>
//           <div className="flex sm:justify-center xl:justify-center">
//             <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 w-full sm:max-w-xl xl:max-w-2xl">
//               <input
//                 type="tel"
//                 value={mobile}
//                 onChange={(e) => {
//                   setMobile(e.target.value)
//                   if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }))
//                 }}
//                 placeholder="+92-3XX-XXXXXXX"
//                 className="w-full p-3 border border-slate-300 rounded-md text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01F5FF] focus:border-[#01F5FF] text-sm"
//                 inputMode="tel"
//                 autoComplete="tel"
//               />
//               <Button
//                 onClick={handleBookNow}
//                 disabled={saving}
//                 className="w-full sm:w-auto sm:min-w-[128px] h-12 px-4"
//                 aria-label="Submit booking"
//               >
//                 {saving ? 'Saving…' : 'Book Now'}
//               </Button>
//             </div>
//           </div>
//           {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
//         </div>
//       </div>

//       <FloatingAlert show={savedOk} onClose={() => setSavedOk(false)} />

//       {/* Global styles: non-blocking portal + tidy calendar */}
//       <style jsx global>{`
//         .react-datepicker__portal {
//           position: fixed;
//           inset: 0;
//           display: grid;
//           place-items: center;
//           padding: 16px;
//           z-index: 100 !important;
//           background: transparent !important;
//           pointer-events: none;
//         }
//         .react-datepicker__portal .react-datepicker { pointer-events: auto; }

//         .react-datepicker,
//         .booking-calendar .react-datepicker {
//           width: min(96vw, 520px);
//           max-height: calc(96svh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
//           background: #fff;
//           border-radius: 16px;
//           border: 1px solid #e5e7eb;
//           overflow: hidden;
//           box-shadow: 0 20px 44px rgba(2, 6, 23, 0.18);
//         }

//         .react-datepicker__navigation,
//         .react-datepicker__navigation--previous,
//         .react-datepicker__navigation--next { display: none !important; }

//         .react-datepicker__header {
//           background: #fff;
//           border-bottom: 1px solid #e5e7eb;
//           padding: 0;
//           position: sticky;
//           top: 0;
//           z-index: 2;
//         }
//         .react-datepicker__current-month { display: none; }

//         .react-datepicker__month { padding: 8px 10px 12px 10px; }

//         .react-datepicker__day-name,
//         .react-datepicker__day {
//           box-sizing: border-box;
//           margin: 0.15rem;
//           width: 2.25rem;
//           height: 2.25rem;
//           line-height: 2.25rem;
//           font-size: 0.95rem;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 8px;
//           user-select: none;
//         }

//         @media (min-width: 900px) {
//           .react-datepicker {
//             display: grid;
//             grid-template-columns: 1fr 120px;
//             align-items: stretch;
//             min-height: 360px;
//           }
//           .react-datepicker__month-container { border-right: 1px solid #e5e7eb; min-width: 0; }
//           .react-datepicker__time-container { width: 120px; background: #fff; }
//           .react-datepicker__time, .react-datepicker__time-box { width: 120px; max-height: 320px; }
//           .react-datepicker__time-list { scrollbar-width: thin; }
//           .react-datepicker__time-list-item--selected {
//             background: #01F5FF !important; color: #0f172a !important; border-radius: 6px;
//           }
//         }

//         @media (min-width: 1200px) {
//           .react-datepicker { grid-template-columns: 1fr 136px; }
//           .react-datepicker__time-container, .react-datepicker__time, .react-datepicker__time-box { width: 136px; }
//         }

//         .react-datepicker__day--selected,
//         .react-datepicker__day--keyboard-selected {
//           background: #01F5FF !important;
//           color: #0f172a !important;
//         }
//         .react-datepicker__day:hover { background: #e6fafe; }
//       `}</style>
//     </>
//   )
// }

// /* ------------------------------- Main Section ---------------------------- */
// export default function PropertiesSection() {
//   const [modal, setModal] = useState(null)
//   const isOpen = !!modal

//   const openVideo = useCallback((src, title) => setModal({ type: 'video', src, title }), [])
//   const openGallery = useCallback((images, startIndex = 0, title) => setModal({ type: 'gallery', images, index: startIndex, title }), [])
//   const openBooking = useCallback((property) => setModal({ type: 'booking', property }), [])
//   const closeModal = useCallback(() => setModal(null), [])

//   // Prevent background scroll while modal is open
//   useEffect(() => {
//     if (!isOpen) return
//     const { style } = document.body
//     const prev = style.overflow
//     style.overflow = 'hidden'
//     return () => { style.overflow = prev }
//   }, [isOpen])

//   // Keyboard controls for gallery
//   const prevImage = useCallback(() => {
//     setModal((m) =>
//       m && m.type === 'gallery' ? { ...m, index: (m.index - 1 + m.images.length) % m.images.length } : m
//     )
//   }, [])
//   const nextImage = useCallback(() => {
//     setModal((m) => (m && m.type === 'gallery' ? { ...m, index: (m.index + 1) % m.images.length } : m))
//   }, [])
//   useEffect(() => {
//     if (!isOpen) return
//     const onKey = (e) => {
//       if (e.key === 'Escape') closeModal()
//       if (modal && modal.type === 'gallery') {
//         if (e.key === 'ArrowRight') nextImage()
//         if (e.key === 'ArrowLeft') prevImage()
//       }
//     }
//     window.addEventListener('keydown', onKey)
//     return () => window.removeEventListener('keydown', onKey)
//   }, [isOpen, modal, closeModal, nextImage, prevImage])

//   // Touch swipe for gallery
//   const [touchStartX, setTouchStartX] = useState(null)
//   const [touchEndX, setTouchEndX] = useState(null)
//   const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX)
//   const onTouchEnd = () => {
//     if (touchStartX === null || touchEndX === null) return
//     const delta = touchEndX - touchStartX
//     const threshold = 40
//     if (delta > threshold) prevImage()
//     if (delta < -threshold) nextImage()
//     setTouchStartX(null)
//     setTouchEndX(null)
//   }

  
//   // ✅ Fetch properties from API
// const [properties, setProperties] = useState([])

    

// useEffect(() => {
//   const fetchProperties = async () => {
//     try {
//       const res = await fetch('/api/admin/properties')
//       const json = await res.json()
//       setProperties(json.data || []) 
//     } catch (err) {
//       console.error('Error fetching properties:', err)
//     }
//   }
//   fetchProperties()
// }, [])



//   /* ---------- Scroll hint logic for Booking Modal ---------- */
//   useEffect(() => {
//     if (modal?.type !== 'booking') return
//     const container = document.getElementById('booking-scroll-container')
//     const indicator = document.getElementById('scroll-indicator')
//     if (!container || !indicator) return

//     const checkScroll = () => {
//       const hasOverflow = container.scrollHeight > container.clientHeight + 1
//       if (!hasOverflow) {
//         indicator.style.opacity = '0'
//         return
//       }
//       const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10
//       indicator.style.opacity = nearBottom ? '0' : '1'
//     }

//     // Initial + listeners
//     checkScroll()
//     container.addEventListener('scroll', checkScroll)
//     window.addEventListener('resize', checkScroll)

//     // Small delayed check (images/fonts can change height)
//     const t = setTimeout(checkScroll, 150)

//     return () => {
//       clearTimeout(t)
//       container.removeEventListener('scroll', checkScroll)
//       window.removeEventListener('resize', checkScroll)
//     }
//   }, [modal])

//   return (
//     <>
//       <section id="properties" className={`${mulish.className} py-20 sm:py-24 bg-slate-900`}>
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12 lg:mb-16">
//             <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-6">Properties</h2>
//             <div className="w-16 h-0.5 bg-[#01F5FF] mx-auto mb-6 lg:mb-8"></div>
//           </div>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
//             {properties.map((property, index) => {
//               const isGallery = property.mediaType === 'imageGallery'
//               const isVideo = property.mediaType === 'video'
//               const isHighlight = !!property.highlight
//               const isFirstCard = index === 0

//               return (
//                 <Card
//                   key={index}
//                   className={[
//                     'overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-300',
//                     isHighlight ? 'relative border-transparent bg-white shadow-lg ring-2 ring-offset-2 ring-[#01F5FF]/80 shadow-cyan-500/20' : 'border-slate-200',
//                   ].join(' ')}
//                 >
//                   {/* Discount ribbon */}
//                   {isHighlight && (
//                     <div className="absolute left-0 top-4 z-20">
//                       <div className="relative">
//                         <div className="absolute -inset-0.5 bg-gradient-to-r from-[#01F5FF] via-cyan-400 to-emerald-300 blur opacity-70 rounded-r-full"></div>
//                         <div className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 text-white rounded-r-full">
//                           <span className="relative inline-flex">
//                             <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#01F5FF] opacity-75"></span>
//                             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#01F5FF]"></span>
//                           </span>
//                           <span className="text-xs font-semibold tracking-wide">
//                             {property.discountPercent}% OFF • {property.priceNote}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Media */}
//                   <div className="relative h-48 sm:h-56 lg:h-64 bg-slate-100">
//                     {isVideo ? (
//                       <>
//                         <img
//                           src={property.poster}
//                           alt={`${property.name} poster`}
//                           className="absolute inset-0 w-full h-full object-cover bg-red group-hover:scale-110 transition-transform duration-300"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => openVideo(property.video, property.name)}
//                           className="absolute inset-0 flex items-center justify-center"
//                           aria-label={`Play ${property.name} video`}
//                         >
//                           <span className="inline-flex items-center justify-center rounded-full text-white bg-black/50 hover:bg-black/60 w-14 h-14 sm:w-16 sm:h-16 shadow-lg">
//                             <PlayIcon className="w-7 h-7 sm:w-8 sm:h-8" />
//                           </span>
//                         </button>
//                       </>
//                     ) : isGallery ? (
//                       <>
//                        <Image
//                           src={property.images[2] || property.images[0] || '/fallback.jpg'}
//                           alt="Property image"
//                           fill
//                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                           className={`object-cover group-hover:scale-110 transition-transform duration-300 ${isHighlight ? 'contrast-110' : ''}`}
//                           priority={index === 0}
//                         />
                        
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const previewSrc = property.images[0]
//                             const previewIndex = property.images.indexOf(previewSrc)
//                             openGallery(property.images, previewIndex >= 0 ? previewIndex : 0, property.name)
//                           }}
//                           className="absolute inset-0"
//                           aria-label={`View photos of ${property.name}`}
//                           title="View photos"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const previewSrc = property.images[0]
//                             const previewIndex = property.images.indexOf(previewSrc)
//                             openGallery(property.images, previewIndex >= 0 ? previewIndex : 0, property.name)
//                           }}
//                           className={[
//                             'absolute bottom-3 right-3 rounded-full text-xs sm:text-sm px-3 py-1.5 shadow-md',
//                             isFirstCard
//                               ? 'bg-white/85 text-black hover:bg-white'
//                               : isHighlight
//                                 ? 'text-white bg-gradient-to-r from-[#01F5FF] via-cyan-400 to-emerald-300 hover:from-cyan-400 hover:to-[#01F5FF]'
//                                 : 'text-white bg-black/60 hover:bg-black/70',
//                           ].join(' ')}
//                         >
//                           View photos ({property.images.length})
//                         </button>
//                       </>
//                     ) : null}
//                   </div>

//                   {/* Content */}
//                   <CardContent className="p-4 sm:p-6">
//                     <h3 className="text-lg sm:text-xl text-slate-900 font-semibold mb-2 flex items-center gap-2">
//                       {property.name}
//                       {isHighlight && (
//                         <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 border border-emerald-200">
//                           Hot Deal
//                         </span>
//                       )}
//                     </h3>
//                     <p className="text-black text-sm mb-2 font-medium">{property.location}</p>
//                     <p className="text-black text-sm mb-4">{property.description}</p>

//                     {/* Pricing + CTA */}
//                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                       {!isHighlight ? (
//                         <span className="text-slate-900 font-semibold text-sm sm:text-base">From {property.price}</span>
//                       ) : (
//                         <div className="space-y-1">
//                           <div className="flex flex-wrap items-center gap-3">
//                             <span className="text-slate-500 line-through text-sm">Regular price {property.priceRegular}</span>
//                             <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-emerald-700 text-xs font-semibold">
//                               {property.discountPercent}% OFF
//                             </span>
//                             <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-cyan-700 text-xs font-semibold">
//                               {property.priceNote}
//                             </span>
//                           </div>
//                           <div className="flex items-baseline gap-2">
//                             <span className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#01F5FF] via-cyan-500 to-emerald-400">
//                               {property.priceDiscounted}
//                             </span>
//                             <span className="text-slate-500 text-sm">now</span>
//                           </div>
//                         </div>
//                       )}

//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           onClick={() => openBooking(property)}
//                           className="min-w-[120px]"
//                         >
//                           Book Now
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>
//         </div>
//       </section>

//       {/* -------- MODALS -------- */}
//       {isOpen && modal && (
//         <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6" style={{ minHeight: '100svh' }}>
//           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />

//           {/* Wider, scrollable modal container */}
//           <div className="relative z-10 w-full max-w-[1200px]">
//             <button
//               onClick={closeModal}
//               className="absolute -top-10 right-0 sm:-top-12 text-white/90 hover:text-white text-2xl"
//               aria-label="Close"
//             >
//               ×
//             </button>

//             {/* Video Modal */}
//             {modal.type === 'video' && (
//               <div
//                 className="mx-auto"
//                 style={{ maxWidth: 'min(96vw, calc(80svh * 16 / 9))', height: 'min(80svh, calc(96vw * 9 / 16))' }}
//               >
//                 <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black">
//                   <video src={modal.src} className="absolute inset-0 w-full h-full object-contain" controls autoPlay playsInline />
//                 </div>
//               </div>
//             )}

//             {/* Gallery Modal */}
//             {modal.type === 'gallery' && (
//               <div
//                 className="mx-auto"
//                 style={{ maxWidth: 'min(96vw, calc(80svh * 16 / 9))', height: 'min(80svh, calc(96vw * 9 / 16))' }}
//               >
//                 <div
//                   className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black select-none"
//                   onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
//                   onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
//                   onTouchEnd={onTouchEnd}
//                 >
//                   <img
//                     src={modal.images[modal.index]}
//                     alt={`Gallery ${modal.index + 1}`}
//                     className="absolute inset-0 w-full h-full object-contain pointer-events-none"
//                   />

//                   <button type="button" onClick={prevImage} aria-label="Previous image" className="absolute inset-y-0 left-0 w-1/2 z-10" />
//                   <button type="button" onClick={nextImage} aria-label="Next image" className="absolute inset-y-0 right-0 w-1/2 z-10" />

//                   <button
//                     type="button"
//                     onClick={prevImage}
//                     aria-label="Previous image"
//                     className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white rounded-full p-2 sm:p-3 z-20"
//                   >
//                     <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={nextImage}
//                     aria-label="Next image"
//                     className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white rounded-full p-2 sm:p-3 z-20"
//                   >
//                     <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
//                   </button>

//                   <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 text-white text-xs sm:text-sm px-2 py-1 rounded z-20">
//                     {modal.index + 1} / {modal.images.length}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Booking Modal — scrollable & expanded with scroll hint */}
//             {modal.type === 'booking' && (
//               <div className="mx-auto w-full">
//                 <div
//                   className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-white max-h-[90svh] overflow-y-auto"
//                   id="booking-scroll-container"
//                 >
//                   {/* Bottom fade + hint (only visible when content overflows / not at bottom) */}
//                   <div
//                     id="scroll-indicator"
//                     className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent flex items-end justify-center text-[11px] sm:text-xs text-slate-500 pointer-events-none opacity-0 transition-opacity duration-200"
//                     aria-hidden="true"
//                   >
//                     <div className="mb-1 px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 shadow-sm">
//                       ↑ Scroll for more
//                     </div>
//                   </div>

//                   {/* Header (sticky for long content) */}
//                   <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5">
//                       <div className="relative w-16 h-16 rounded-md overflow-hidden hidden sm:block">
//                         {modal.property?.mediaType === 'video' ? (
//                           <img src={modal.property.poster} alt="Poster" className="absolute inset-0 w-full h-full object-cover" />
//                         ) : (
//                           <img src={modal.property?.images?.[0]} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="text-base sm:text-lg font-semibold text-slate-900">
//                           Book: {modal.property?.name ?? 'Property'}
//                         </h4>
//                         <p className="text-xs sm:text-sm text-slate-600">{modal.property?.location}</p>
//                       </div>
//                       <button
//                         onClick={closeModal}
//                         aria-label="Close booking"
//                         className="self-start sm:self-auto text-slate-400 hover:text-slate-600 transition p-1"
//                       >
//                         <CloseIcon className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-4 sm:p-6">
//                     <div className="bg-white/95 backdrop-blur-sm rounded-lg">
//                       <BookingWidget
//                         defaultGuests={1}
//                         onBooked={() => {
//                           // optionally close after success
//                           // setTimeout(() => closeModal(), 1200)
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
