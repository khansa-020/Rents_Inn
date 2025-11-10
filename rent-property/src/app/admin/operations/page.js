'use client'

import { useEffect, useMemo, useState } from 'react'
import { Mulish } from 'next/font/google'
import { Search, LogOut, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800']
})

// ✅ Date formatter
const formatDateTimeUTC = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
}

export default function AdminPage() {
  const router = useRouter()

  // ✅ UI State
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('bookings') // bookings | users | properties

  // ✅ Data States
  const [messages, setMessages] = useState([])
  const [bookings, setBookings] = useState([])
  const [properties, setProperties] = useState([])
  const [users, setUsers] = useState([]) // ✅ dummy users
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ Admin Guard
  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') router.replace('/user/login')
  }, [router])




  // ✅ Fetch Existing Data
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        setLoading(true)

        const [mRes, bRes, pRes, uRes] = await Promise.all([
          fetch('/api/admin/messages', { cache: 'no-store' }),
          fetch('/api/admin/bookings', { cache: 'no-store' }),
          fetch('/api/admin/properties', { cache: 'no-store' }),
          fetch('/api/auth/users', { cache: 'no-store' ,headers: {
    authorization: localStorage.getItem('token'),
    'x-role': localStorage.getItem('role')
  }})
        ])

        const [mJson, bJson, pJson ,ujson] = await Promise.all([
          mRes.json(),
          bRes.json(),
          pRes.json(),
          uRes.json()
        ])

        if (!alive) return

        setMessages(mJson.data || [])
        setBookings(bJson.data || [])
        setProperties(pJson.data || [])
        setUsers(ujson.data|| [])

      } catch (e) {
        if (alive) setError(e.message || 'Load error')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => (alive = false)
  }, [])

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0;'
    router.push('/user/login')
  }

  // ✅ Filters
  const filteredBookings = bookings
  const filteredProperties = properties
  const filteredMessages = messages
  const filteredUsers = users



  return (
    <main className={`${mulish.className} min-h-screen bg-slate-900 text-white`}>
      {/* ✅ TOP BAR */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

          <div className="flex items-center gap-3">
            <Link href="/admin/add-property" className="text-slate-300 hover:text-[#01F5FF]">
              Add Property
            </Link>
            <Link href="/admin/add-specialproperty" className="text-slate-300 hover:text-[#01F5FF]">
              Add Special Property
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 border border-slate-700 px-3 py-2 rounded-md hover:bg-slate-800 hover:border-[#01F5FF] hover:text-[#01F5FF]"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* ✅ TOP CARDS (Counts) */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Total Bookings</p>
          <h2 className="text-3xl font-bold text-[#01F5FF]">{bookings.length}</h2>
        </div>

        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Total Properties</p>
          <h2 className="text-3xl font-bold text-[#01F5FF]">{properties.length}</h2>
        </div>

          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Total Messages</p>
          <h2 className="text-3xl font-bold text-[#01F5FF]">{messages.length}</h2>
        </div>

        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Total Users</p>
          <h2 className="text-3xl font-bold text-[#01F5FF]">{users.length}</h2>
        </div>
      </div>

      {/* ✅ TABS */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-3">
        {['bookings', 'users', 'properties','messages'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md border ${
              activeTab === tab
                ? 'border-[#01F5FF] text-[#01F5FF] bg-slate-800'
                : 'border-slate-700 text-slate-300'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ✅ CONTENT */}
      <section className="max-w-7xl mx-auto px-4 pb-20 space-y-10">

        {/* ✅ BOOKINGS TABLE */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Bookings</h2>

            <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-slate-900/70 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Guests</th>
                      <th className="px-4 py-3">Check-In</th>
                      <th className="px-4 py-3">Check-Out</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        <td className="px-4 py-3">{formatDateTimeUTC(b.createdAt)}</td>
                        <td className="px-4 py-3">{b.booking?.name}</td>
                        <td className="px-4 py-3">{b.booking?.mobile}</td>
                        <td className="px-4 py-3">{b.booking?.guests}</td>
                        <td className="px-4 py-3">{b.booking?.checkIn?.date}</td>
                        <td className="px-4 py-3">{b.booking?.checkOut?.date}</td>

                        {/* ✅ Edit + Delete buttons */}
                        <td className="px-4 py-3 flex gap-2">
                          <button className="text-green-400 hover:text-green-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ✅ USERS TABLE */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Users</h2>

            <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-slate-900/70 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th> 
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Address</th>
                      {/* <th className="px-4 py-3">Bio</th> */}
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
 
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        <td className="px-4 py-3">{formatDateTimeUTC(u.createdAt)}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">{u.role}</td>
                        <td className="px-4 py-3">{u.name}</td>
                        <td className="px-4 py-3">{u.mobile}</td>
                        <td className="px-4 py-3">{u.address}</td>
                        {/* <td className="px-4 py-3">{u.bio}</td> */}
                        {/* <td className="px-4 py-3">{u.image}</td> */}


                        <td className="px-4 py-3 flex gap-2">
                          {/* <button className="text-green-400 hover:text-green-300">
                            <Edit className="w-4 h-4" />
                          </button> */}
                         
                        <button
                        className="text-red-400 hover:text-red-300"
                        onClick={async () => {
                            if (u.role === 'admin') {
                            alert('You cannot delete admin!')
                            return
                            }
                            if (!confirm(`Are you sure you want to delete ${u.email}?`)) return
                            try {
                            const res = await fetch('/api/auth/users', {
                                method: 'DELETE',
                                headers: {
                                'Content-Type': 'application/json',
                                authorization: localStorage.getItem('token'),
                                'x-role': localStorage.getItem('role'),
                                'x-email': localStorage.getItem('email') // admin email
                                },
                                body: JSON.stringify({ email: u.email })
                            })
                            const data = await res.json()
                            if (data.ok) {
                                alert('User deleted successfully')
                                setUsers(prev => prev.filter(user => user.email !== u.email))
                            } else {
                                alert(data.error || 'Failed to delete user')
                            }
                            } catch (err) {
                            alert('Error deleting user: ' + err.message)
                            }
                        }}
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>


                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        )}

        {/* ✅ PROPERTIES TABLE */}
        {activeTab === 'properties' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Properties</h2>

            <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1000px]">
                  <thead className="bg-slate-900/70 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Sector</th>
                      <th className="px-4 py-3">Highlight</th>
                      <th className="px-4 py-3">Discount</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProperties.map((p, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        <td className="px-4 py-3">{formatDateTimeUTC(p.createdAt)}</td>
                        <td className="px-4 py-3">{p.name}</td>
                        <td className="px-4 py-3">{p.location}</td>
                        <td className="px-4 py-3">{p.sector}</td>
                        <td className="px-4 py-3">{p.highlight ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">{p.discountPercent}%</td>
                        <td className="px-4 py-3">{p.priceRegular}</td>

                        <td className="px-4 py-3 flex gap-2">
                          <button className="text-green-400 hover:text-green-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
  className="text-red-400 hover:text-red-300"
  onClick={async () => {
    if (!confirm(`Delete this property?`)) return
    try {
      const res = await fetch('/api/admin/deleteanyproperty', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: localStorage.getItem('token'),
          'x-role': localStorage.getItem('role')
        },
        body: JSON.stringify({ id: p.id })
      })
      const data = await res.json()
      if (data.ok) {
        alert('Property deleted successfully')
        setProperties(prev => prev.filter(prop => prop.id !== p.id))
      } else {
        alert(data.error || 'Failed to delete property')
      }
    } catch (err) {
      alert('Error deleting property: ' + err.message)
    }
  }}
>
  <Trash2 className="w-4 h-4" />
</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        )}
 {activeTab === 'messages' && (
  <div>
    <h2 className="text-xl font-semibold mb-3">Messages</h2>

    <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-900/70 border-b border-slate-800">
            <tr>
              <th className="text-left px-4 py-3">Created At</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Mobile</th>
              <th className="text-left px-4 py-3">Message</th>
              <th className="text-left px-4 py-3">Actions</th>
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

                <td className="px-4 py-3 text-slate-200 max-w-[320px]">
                  <span className="line-clamp-2">
                    {m.contact?.message}
                  </span>
                </td>

                {/* ✅ Edit + Delete */}
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-green-400 hover:text-green-300">
                    <Edit className="w-4 h-4" />
                  </button>

                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
          </div>
        )}
      </section>
    </main>
  )
}
