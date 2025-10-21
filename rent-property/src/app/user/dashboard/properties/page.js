'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetch(`/api/admin/properties?userEmail=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          setProperties(data.data)
        })
        .catch(err => console.error('Error fetching properties:', err))
    }
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Properties</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.length > 0 ? (
          properties.map((p) => (
            <div
              key={p.id}
              className="border border-[#01F5FF]/50 rounded-xl bg-white shadow-sm hover:shadow-lg transition p-4 flex flex-col justify-between"
            >
              {/* ✅ Image or Poster */}
              {p.images && p.images.length > 0 && (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}

              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-800">{p.name}</h2>
                <p className="text-sm text-gray-500"><strong>Location:</strong> {p.location}</p>
                <p className="text-sm text-gray-500"><strong>Sector:</strong> {p.sector}</p>
                <p className="text-sm text-gray-500"><strong>Contact:</strong> {p.contact}</p>
                <p className="text-sm text-gray-500"><strong>Email:</strong> {p.email}</p>
                <p className="text-sm text-gray-500"><strong>Price:</strong> {p.price}</p>
                <p className="text-sm text-gray-500"><strong>Discount:</strong> {p.discountPercent || 0}%</p>
                <p className="text-sm text-gray-500"><strong>Description:</strong> {p.description}</p>
                <p className="text-xs text-gray-400 mt-2">Added on: {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>

              {/* ✅ Action buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(p.id)}
                  className="flex-1 border border-[#01F5FF] text-[#01F5FF] font-semibold rounded-md py-2 hover:bg-[#01F5FF] hover:text-black transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 border border-red-500 text-red-500 font-semibold rounded-md py-2 hover:bg-red-500 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No properties found.</p>
        )}
      </div>
    </div>
  )
}
