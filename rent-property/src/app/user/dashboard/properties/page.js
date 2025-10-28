'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { Edit, Trash2 } from 'lucide-react'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetch(`/api/admin/properties?userEmail=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          setProperties(data.data || [])
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching properties:', err)
          setLoading(false)
        })
    }
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      const res = await fetch(`/api/admin/properties?id=${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.ok) {
        setProperties(prev => prev.filter(p => p.id !== id))
      } else {
        alert(result.error || 'Failed to delete')
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleEdit = (id) => {
    window.location.href = `/user/dashboard/properties/edit/${id}`
  }

  if (loading) {
    return (
      <div className="text-slate-400 text-sm py-8 text-center">
        Loading your properties…
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 sm:p-10">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">My Properties</h1>
        <p className="text-slate-400 text-sm mt-1">Manage, edit or delete your listings</p>
      </header>

      {properties.length === 0 ? (
        <p className="text-slate-400 text-center">No properties found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/40 overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-slate-900/70 border-b border-slate-800">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Created</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Location</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Sector</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Discount</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Description</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/40 align-top"
                  >
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-200">{p.name}</td>
                    <td className="px-4 py-3 text-slate-300">{p.location}</td>
                    <td className="px-4 py-3 text-slate-300">{p.sector}</td>
                    <td className="px-4 py-3 text-slate-300">{p.price}</td>
                    <td className="px-4 py-3 text-slate-300">{p.discountPercent || 0}%</td>
                    <td className="px-4 py-3 text-slate-200 max-w-[250px]">
                      <span className="line-clamp-2">{p.description}</span>
                    </td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(p.id)}
                        className="text-[#01F5FF] hover:text-[#04ffff] transition"
                        aria-label="Edit property"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:text-red-400 transition"
                        aria-label="Delete property"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
            {properties.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
              >
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold text-slate-100">{p.name}</h3>
                <p className="text-slate-400 text-sm">{p.location} • {p.sector}</p>
                <p className="text-slate-300 text-sm mt-1">{p.description}</p>
                <div className="flex justify-between mt-3 text-sm text-slate-400">
                  <span>Price: <span className="text-slate-200">{p.price}</span></span>
                  <span>Discount: <span className="text-slate-200">{p.discountPercent || 0}%</span></span>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(p.id)}
                    className="text-[#01F5FF] hover:text-[#04ffff] transition"
                    aria-label="Edit property"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-400 transition"
                    aria-label="Delete property"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
