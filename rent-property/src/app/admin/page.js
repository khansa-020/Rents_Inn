'use client'

import { useEffect, useMemo, useState } from 'react'
import { Mulish } from 'next/font/google'
import { Search, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'] // multiple weights for headings/body
})

// Deterministic (SSR-safe) date formatter
const formatDateTimeUTC = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
}

export default function AdminPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')



  // fetched data
  const [messages, setMessages] = useState([])
  const [bookings, setBookings] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  // 🔐 Client-side guard
  // useEffect(() => {
  //   const ok =
  //     typeof window !== 'undefined' &&
  //     sessionStorage.getItem('adminAuthed') === '1'
  //   if (!ok) router.replace('/')
  // }, [router])

useEffect(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token || role !== 'admin') {
    router.replace('/user/login')
  }
}, [router])


  // fetch files from API routes
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        setLoading(true)
        const [mRes, bRes, pRes] = await Promise.all([
          fetch('/api/admin/messages', { cache: 'no-store' }),
          fetch('/api/admin/bookings', { cache: 'no-store' }),
          fetch('/api/admin/properties', { cache: 'no-store' }),
          
        ])
        const [mJson, bJson, pJson] = await Promise.all([mRes.json(), bRes.json(), pRes.json()])

        if (!alive) return
        if (!mJson.ok) throw new Error(mJson.error || 'Failed to load messages')
        if (!bJson.ok) throw new Error(bJson.error || 'Failed to load bookings')
        if (!pJson.ok) throw new Error(pJson.error || 'Failed to load properties')
  

        const msgs = (mJson.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        const bks = (bJson.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
         const prpt = (pJson.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setMessages(msgs)
        setBookings(bks)
        setProperties(prpt)
        setError(null)
      } catch (e) {
        console.error(e)
        if (alive) setError(e.message || 'Load error')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [])

  // 🔎 Shared search across both datasets
  const filteredMessages = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return messages
    return messages.filter(({ createdAt, contact }) =>
      [
        createdAt,
        contact?.name,
        contact?.email,
        contact?.mobile,
        contact?.message
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [query, messages])

  const filteredBookings = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return bookings
    return bookings.filter(({ createdAt, booking }) =>
      [
        createdAt,
        booking?.name,
        booking?.mobile,
        booking?.guests,
        booking?.checkIn?.date,
        booking?.checkIn?.time,
        booking?.checkOut?.date,
        booking?.checkOut?.time
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [query, bookings])

  //  const filteredProperties = useMemo(() => {
  //   const q = query.toLowerCase().trim()
  //   if (!q) return properties
  //   return properties.filter(({ createdAt, property }) =>
  //     [
  //       createdAt,
  //       property?.mediaType,
  //       property?.highlight,
  //       property?.name,
  //       property?.location,
  //       property?.description,
  //       property?.priceRegular,
  //       property?.priceNote,
  //       property?.priceDiscounted,
  //       property?.priceNote,
  //       property?.discountPercent,
  //       property?.poster,
  //       property?.video,
  //       property?.images?.join(' '),
  //     ]
  //       .join(' ')
  //       .toLowerCase()
  //       .includes(q)
  //   )
  // }, [query, properties])


 const filteredProperties = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return properties
    return properties.filter((p) =>
      [
        p.createdAt,
        p.mediaType,
        p.highlight,
        p.name,
        p.location,
        p.sector,
        p.description,
        p.priceRegular,
        p.priceNote,
        p.priceDiscounted,
        p.price,
        p.discountPercent,
        p.poster,
        p.video,
        p.images?.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [query, properties])


  // const logout = () => {
  //   sessionStorage.removeItem('adminAuthed')
  //   router.replace('/')
  // }
const logout = () => {
    // logout()
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0;'
    router.push('/user/login')
  }


  return (
    <main className={`${mulish.className} min-h-screen bg-slate-900 text-white`}>
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Rents inn — Messages & Bookings
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/add-specialproperty" 
              className="hidden sm:inline text-slate-300 hover:text-[#01F5FF] transition-colors text-sm"
             >
              Add special Property
            </Link>

             <Link
              href="/admin/add-property" 
              className="hidden sm:inline text-slate-300 hover:text-[#01F5FF] transition-colors text-sm"
             >
              Add Property
            </Link>

            <Link
              href="/"
              className="hidden sm:inline text-slate-300 hover:text-[#01F5FF] transition-colors text-sm"
            >
              Back to site
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 
             text-xs sm:text-sm text-slate-200 bg-slate-900 
             hover:bg-slate-800 hover:border-[#01F5FF] hover:text-[#01F5FF]
             transition-colors duration-200 ease-in-out"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

    
      {/* Actions Row */}
      <div className="sticky top-[56px] sm:top-[64px] z-20 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 border-b border-slate-800">
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                aria-label="Search messages & bookings"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-md border border-slate-700 bg-slate-800 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#01F5FF] text-sm"
                placeholder="Search by name, email, mobile, dates, message…"
              />
            </div>

            {/* Responsive counters */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-400 sm:ml-auto">
              <span>
                Messages:{' '}
                <span className="text-[#01F5FF] font-medium">
                  {filteredMessages.length}
                </span>{' '}
                / {messages.length}
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span>
                Bookings:{' '}
                <span className="text-[#01F5FF] font-medium">
                  {filteredBookings.length}
                </span>{' '}
                / {bookings.length}
              </span>
                  <span className="hidden sm:inline text-slate-600">|</span>
              <span>
                Properties:{' '}
                <span className="text-[#01F5FF] font-medium">
                  {filteredProperties.length}
                </span>{' '}
                / {properties.length}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Content */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        {loading && (
          <div className="text-slate-400 text-sm">Loading data…</div>
        )}
        {error && !loading && (
          <div className="text-rose-400 text-sm">Error: {error}</div>
        )}

        {/* Messages */}
        {!loading && !error && (
          <div>
            <header className="mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">User Messages</h2>
              <p className="text-slate-400 text-sm">
                Latest contact form submissions
              </p>
            </header>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-slate-900/70 border-b border-slate-800">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Created At
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Email
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Mobile
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((m, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-800/60 hover:bg-slate-800/40 align-top"
                      >
                        <td className="px-4 py-3 text-slate-400">
                          {formatDateTimeUTC(m.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {m.contact?.name}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {m.contact?.email}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {m.contact?.mobile}
                        </td>
                        <td className="px-4 py-3 text-slate-200 max-w-[420px]">
                          <span className="line-clamp-2">
                            {m.contact?.message}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredMessages.map((m, idx) => (
                <article
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                  aria-label={`Message from ${m.contact?.name || 'User'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-base leading-tight">
                      {m.contact?.name}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {formatDateTimeUTC(m.createdAt)}
                    </span>
                  </div>
                  <dl className="text-sm text-slate-300 space-y-1">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Email</dt>
                      <dd className="text-right break-all">
                        {m.contact?.email}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Mobile</dt>
                      <dd className="text-right">{m.contact?.mobile}</dd>
                    </div>
                    <div className="mt-2">
                      <dt className="text-slate-400 mb-1">Message</dt>
                      <dd className="text-slate-200">{m.contact?.message}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Bookings */}
        {!loading && !error && (
          <div>
            <header className="mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">User Bookings</h2>
              <p className="text-slate-400 text-sm">
                Upcoming and recent bookings
              </p>
            </header>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">
                  <thead className="bg-slate-900/70 border-b border-slate-800">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Created At
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Mobile
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Guests
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Check-In
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Check-Out
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-800/60 hover:bg-slate-800/40"
                      >
                        <td className="px-4 py-3 text-slate-400">
                          {formatDateTimeUTC(b.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {b.booking?.name}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {b.booking?.mobile}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {b.booking?.guests}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {b.booking?.checkIn?.date} • {b.booking?.checkIn?.time}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {b.booking?.checkOut?.date} • {b.booking?.checkOut?.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredBookings.map((b, idx) => (
                <article
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                  aria-label={`Booking by ${b.booking?.name || 'User'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-base leading-tight">
                      {b.booking?.name}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {formatDateTimeUTC(b.createdAt)}
                    </span>
                  </div>
                  <dl className="text-sm text-slate-300 space-y-1">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Mobile</dt>
                      <dd className="text-right">{b.booking?.mobile}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Guests</dt>
                      <dd className="text-right">{b.booking?.guests}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Check-In</dt>
                      <dd className="text-right">
                        {b.booking?.checkIn?.date} • {b.booking?.checkIn?.time}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Check-Out</dt>
                      <dd className="text-right">
                        {b.booking?.checkOut?.date} • {b.booking?.checkOut?.time}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            
            {/* Properties Section */}
{!loading && !error && (
  <div>
    <header className="mb-3 mt-6 sm:mb-4">
      <h2 className="text-lg sm:text-xl font-semibold">Properties</h2>
      <p className="text-slate-400 text-sm">List of added rental properties</p>
    </header>

    {/* Desktop Table */}
    <div className="hidden md:block rounded-xl mt- border border-slate-800 bg-slate-900/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-slate-900/70 border-b border-slate-800">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Created At</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Location</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Sector</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Highlight</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Discount</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Price</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Discounted</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Note</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-300">Description</th>
              {/* <th className="text-left px-4 py-3 font-semibold text-slate-300">Images</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((p, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-800/60 hover:bg-slate-800/40 align-top"
              >
                <td className="px-4 py-3 text-slate-400">
                  {formatDateTimeUTC(p.createdAt)}
                </td>
                <td className="px-4 py-3 text-slate-200">{p.name}</td>
                <td className="px-4 py-3 text-slate-300">{p.location}</td>
                <td className="px-4 py-3 text-slate-300">{p.sector}</td>
                <td className="px-4 py-3 text-slate-300">{p.highlight ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-slate-300">{p.discountPercent}%</td>
                <td className="px-4 py-3 text-slate-300">{p.priceRegular}</td>
                <td className="px-4 py-3 text-slate-300">{p.priceDiscounted}</td>
                <td className="px-4 py-3 text-slate-300">{p.priceNote || '-'}</td>
                <td className="px-4 py-3 text-slate-200 max-w-[300px]">
                  <span className="line-clamp-2">{p.description}</span>
                </td>
                {/* <td className="px-4 py-3">
                  <div className="flex gap-2 overflow-x-auto">
                    {p.images?.filter(Boolean).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Property ${p.name} image ${i + 1}`}
                        className="w-20 h-14 object-cover rounded border border-slate-700"
                      />
                    ))}
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Mobile Cards */}
    <div className="md:hidden grid grid-cols-1 gap-4">
      {filteredProperties.map((p, idx) => (
        <article
          key={idx}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
          aria-label={`Property: ${p.name}`}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-base leading-tight">{p.name}</h3>
            <span className="text-xs text-slate-400">{formatDateTimeUTC(p.createdAt)}</span>
          </div>
          <dl className="text-sm text-slate-300 space-y-1">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Location</dt>
              <dd className="text-right">{p.location}</dd>
            </div>
           <div className="flex justify-between gap-3">{/*added new */}
              <dt className="text-slate-400">Sector</dt>
              <dd className="text-right">{p.sector}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Highlight</dt>
              <dd className="text-right">{p.highlight ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Discount</dt>
              <dd className="text-right">{p.discountPercent}%</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">PriceRegular</dt>
              <dd className="text-right">{p.priceRegular}</dd>
            </div>
              <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Price</dt>
              <dd className="text-right">{p.price}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Discounted</dt>
              <dd className="text-right">{p.priceDiscounted}</dd>
            </div>
            {p.priceNote && (
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Note</dt>
                <dd className="text-right">{p.priceNote}</dd>
              </div>
            )}
          </dl>
          {p.description && (
            <div className="mt-3">
              <p className="text-slate-400 text-xs mb-1">Description</p>
              <p className="text-slate-200 text-sm">{p.description}</p>
            </div>
          )}
          {/* {p.images?.length > 0 && (
            <div className="mt-3">
              <p className="text-slate-400 text-xs mb-1">Images</p>
              <div className="flex gap-2 overflow-x-auto">
                {p.images.filter(Boolean).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Property ${p.name} image ${i + 1}`}
                    className="w-24 h-16 object-cover rounded border border-slate-700"
                  />
                ))}
              </div>
            </div>
          )} */}
        </article>
      ))}
    </div>
  </div>
  
)}
            

          </div>

        )}
      </section>



    </main>
  )
}
