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

//edit
const [editingProperty, setEditingProperty] = useState(null) // currently editing property
const [editForm, setEditForm] = useState({
  name: '',
  location: '',
  sector: '',
  highlight: false,
  discountEnabled: false,
  priceType: 'day',
  price: 0,
  discountPercent: '',
  priceDiscounted: '',
  mediaType: 'imageGallery',
    images: [],
    video: null,
    poster: null

})


  // ✅ Admin Guard
  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'admin') router.replace('/user/login')
  }, [router])




  // Fetch Existing Data
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

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0;'
    router.push('/user/login')
  }

  //  Filters
  const filteredBookings = bookings
  const filteredProperties = properties
  const filteredMessages = messages
  const filteredUsers = users

useEffect(() => {
  if (editForm.discountEnabled && editForm.price && editForm.discountPercent) {
    const price = parseFloat(editForm.price)
    const discount = parseFloat(editForm.discountPercent)
    if (!isNaN(price) && !isNaN(discount)) {
      const discounted = price - (price * discount) / 100
      setEditForm(prev => ({ ...prev, priceDiscounted: discounted.toFixed(0) }))
    }
  }
}, [editForm.price, editForm.discountPercent, editForm.discountEnabled])

  return (
    <main className={`${mulish.className} min-h-screen bg-slate-900 text-white`}>

      {/*TOP BAR */}
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


      {/* CARDS (Counts) */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
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



      {/* TABS */}
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



      {/*CONTENT */}
      <section className="max-w-7xl mx-auto px-4 pb-20 space-y-10">

        {/* EDIT PROPERTY MODAL */}
{editingProperty && (
  <div className="fixed inset-0 pt-10 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-slate-900 p-6 rounded-lg w-[600px] space-y-3">
      <h2 className="text-lg font-semibold">Edit Property</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full p-2 rounded bg-slate-800 text-white"
        value={editForm.name}
        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
      />

         <input
        type="text"
        placeholder="Description"
        className="w-full p-2 rounded bg-slate-800 text-white"
        value={editForm.description || ''}
        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
      />

<span className='flex inline space-x-2'>
      <input
        type="text"
        placeholder="Location"
        className="w-68 p-2 mb-4 rounded bg-slate-800 text-white"
        value={editForm.location}
        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
      />

      <input
        type="text"
        placeholder="Sector"
        className="w-68 p-2 mb-4 rounded bg-slate-800 text-white"
        value={editForm.sector}
        onChange={e => setEditForm({ ...editForm, sector: e.target.value })}
      />
</span>

<span className='flex inline space-x-2'>
      {/* Price Type*/}
      <select
        className="w-68 p-2 mb-4 rounded bg-slate-800 text-white"
        value={editForm.priceType || 'Day'}
        onChange={e => setEditForm({ ...editForm, priceType: e.target.value })}
      >
        <option value="Day">Day</option>
        <option value="Month">Month</option>
        <option value="Year">Year</option>
      </select>

      {/* Price*/}
      <input
        type="number"
        placeholder="Price"
        className="w-68 p-2 mb-4 rounded bg-slate-800 text-white"
        value={editForm.price}
        onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
      />
</span>


<span className='flex gap-16 '>
 <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={editForm.highlight}
          onChange={e =>
            setEditForm(prev => ({
              ...prev,
              highlight: e.target.checked,
              discountEnabled: e.target.checked ? true : false
            }))
          }
        />
        Highlight
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={editForm.discountEnabled}
          onChange={e =>
            setEditForm(prev => ({
              ...prev,
              discountEnabled: e.target.checked,
              highlight: e.target.checked ? true : false
            }))
          }
        />
        Discount
      </div>
</span>      

{editForm.discountEnabled && (
        <>
        <span className='flex inline space-x-2'>
        <input
        type="number"
        placeholder="Discount %"
        className="w-68 p-2 mb-4 rounded bg-slate-800 text-white"
        value={editForm.discountPercent}
        onChange={e => setEditForm({ ...editForm, discountPercent: Number(e.target.value) })}
      />
          <input
            type="number"
            placeholder="Discounted Price"
            className="w-68 p-2 mb-4 rounded bg-slate-800 text-white"
            value={editForm.priceDiscounted ?? ''}
            onChange={e =>setEditForm(prev => ({ ...prev, priceDiscounted: Number(e.target.value) }))
}
          />
          </span>
        </>
      )}


       {/* Media Type */}
      <div>
        <label className="block mb-1 text-sm text-slate-300">Media Type</label>
        <select
          value={editForm.mediaType || 'imageGallery'}
          onChange={e =>
           setEditForm(prev => {
            if (e.target.value === 'imageGallery') {
              return { ...prev, mediaType: 'imageGallery', images: [], video: null, poster: null }
            } else {
              return { ...prev, mediaType: 'video', images: [], video: null, poster: null }
            }
          })

          }
          className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
        >
          <option value="imageGallery">Image Gallery</option>
          <option value="video">Video</option>
        </select>
      </div>

      {/* If image gallery → show multiple images input */}
      {editForm.mediaType === 'imageGallery' && (
        <div>
          <label className="block mb-1 text-sm text-slate-300">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e =>
              setEditForm(prev => ({
                ...prev,
                images: Array.from(e.target.files || [])
              }))
            }
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
          />
          {Array.isArray(editForm.images) && editForm.images.length > 0 && (
            <p className="text-xs text-slate-400 mt-1">
              {editForm.images.length} file(s) selected
            </p>
          )}
        </div>
      )}

      {/* If video → show video + poster inputs */}
      {editForm.mediaType === 'video' && (
        <>
          <div>
            <label className="block mb-1 text-sm text-slate-300">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={e =>
                setEditForm(prev => ({
                  ...prev,
                  video: (e.target.files && e.target.files[0]) || null
                }))
              }
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
            />
            {editForm.video && (
              <p className="text-xs text-slate-400 mt-1">{editForm.video.name} selected</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Upload Poster</label>
            <input
              type="file"
              accept="image/*"
              onChange={e =>
                setEditForm(prev => ({
                  ...prev,
                  poster: (e.target.files && e.target.files[0]) || null
                }))
              }
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
            />
            {editForm.poster && (
              <p className="text-xs text-slate-400 mt-1">{editForm.poster.name} selected</p>
            )}
          </div>
        </>
      )}

 

{/*EditForm Buttons*/}
      <div className="flex justify-end gap-3 mt-2">
        <button
          className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-800"
          onClick={() => setEditingProperty(null)}
        >Cancel
        </button>

        <button
  className="px-3 py-1 bg-green-500 rounded hover:bg-green-600"
  onClick={async () => {
    try {
      // Ensure all fields are defined and correctly typed
      const payload = {
        id: editingProperty.id,
        name: editForm.name || '',
        description: editForm.description || '',
        location: editForm.location || '',
        sector: editForm.sector || '',
        mediaType: editForm.mediaType || 'imageGallery',
        priceType: editForm.priceType || 'Day',
        price: Number(editForm.price) || 0,
        highlight: Boolean(editForm.highlight),
        discountEnabled: Boolean(editForm.discountEnabled),
        discountPercent: Number(editForm.discountPercent) || 0,
        priceDiscounted: Number(editForm.priceDiscounted) || 0,
        images: Array.isArray(editForm.images) ? editForm.images : [],
        video: editForm.video || null,
        poster: editForm.poster || null
      };

      console.log('Sending payload:', payload); // DEBUG: check payload

      const res = await fetch('/api/admin/editanyproperty', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: localStorage.getItem('token'),
          'x-role': localStorage.getItem('role')
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.ok) {
        alert('Property updated successfully');
        setProperties(prev =>
          prev.map(p => (p.id === editingProperty.id ? data.data : p))
        );
        setEditingProperty(null);
      } else {
        alert(data.error || 'Failed to update property');
      }
    } catch (err) {
      alert('Error updating property: ' + err.message);
    }
  }}
>
  Save
</button>

      </div>
    </div>
  </div>
)}



{/*Tables of record*/}
        {/* BOOKINGS TABLE */}
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

                        {/* Edit + Delete buttons */}
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

        {/* USERS TABLE */}
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

        {/* PROPERTIES TABLE */}
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
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Sector</th>
                      <th className="px-4 py-3">Highlight</th>
                      <th className="px-4 py-3">Discount</th>
                      <th className="px-4 py-3">Discount%</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Images</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProperties.map((p, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        <td className="px-4 py-3">{formatDateTimeUTC(p.createdAt)}</td>
                        <td className="px-4 py-3">{p.name}</td>
                        <td className="px-4 py-3">{p.location}</td>
                        <td className="px-4 py-3">{p.description}</td>
                        <td className="px-4 py-3">{p.sector}</td>
                        <td className="px-4 py-3">{p.highlight ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">{p.discountEnabled ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">{p.discountPercent}%</td>
                        <td className="px-4 py-3">{p.price}</td>
                        <td className="px-4 py-3">
                        <div className="flex gap-2 overflow-x-auto">
                         {p.images?.filter(Boolean).map((img, i) => (
                      <img key={i} src={img} alt={`Property ${p.name} image ${i + 1}`}
                      className="w-20 h-14 object-cover rounded border border-slate-700"
                        />
                       ))}
                     </div>
                     </td>

                        <td className="px-4 py-4 flex gap-2">
                           <button
    className="text-green-400 hover:text-green-300"
    onClick={() => {
      setEditingProperty(p) // set current property
      setEditForm({
        name: p.name,
        location: p.location,
        sector: p.sector,
        description: p.description,
        mediaType: p.mediaType,
        priceType: p.priceType,
        price: p.price,
        highlight: p.highlight,
        discountEnabled: p.discountEnabled,
        discountPercent: p.discountPercent,
        images: p.images,

      })
    }}
  >
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


  {/*Messages Table*/}      
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
