'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/admin/properties?userEmail=all`)
        const data = await res.json()
        const prop = data.data.find((p) => String(p.id) === id)
        setProperty(prop)
      } catch (err) {
        console.error('Error fetching property:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProperty((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch(`/api/admin/properties/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    })
    const data = await res.json()
    setSaving(false)
    if (data.ok) {
      alert('Property updated successfully ✅')
      router.push('/user/properties')
    } else {
      alert('Update failed ❌ ' + data.error)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!property) return <p>Property not found</p>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>

      <div className="space-y-3">
        <input
          name="name"
          value={property.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Property Name"
        />
        <input
          name="location"
          value={property.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Location"
        />
        <input
          name="sector"
          value={property.sector}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Sector"
        />
        <input
          name="price"
          value={property.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Price"
        />
        <textarea
          name="description"
          value={property.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Description"
        />
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#01F5FF] text-black font-semibold rounded hover:bg-cyan-400"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
