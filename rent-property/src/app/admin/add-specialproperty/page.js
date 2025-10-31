'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'   // ✅ import Link

export default function AddPropertyPage() {
  const router = useRouter()

  const [newProperty, setNewProperty] = useState({
    mediaType: 'imageGallery',
    name: '',
    email: '',
    contact: '',
    location: '',
    sector: '',
    images: [],
    video: null,
    poster: null,
    description: '',
    highlight: false,
    discountEnabled: false,
    discountPercent: '',
    priceRegular: '',
    priceDiscounted: '',
    price: '',
    priceNote: '',
    priceType: 'Per Day' // ✅ new dropdown
  })

  // ✅ Auto-calculate discounted price logic
  useEffect(() => {
    if (newProperty.discountEnabled && newProperty.priceRegular && newProperty.discountPercent) {
      const regular = parseFloat(newProperty.priceRegular)
      const discount = parseFloat(newProperty.discountPercent)
      if (!isNaN(regular) && !isNaN(discount)) {
        const discounted = regular - (regular * discount) / 100
        setNewProperty(prev => ({ ...prev, priceDiscounted: discounted.toFixed(0) }))
      }
    }
  }, [newProperty.priceRegular, newProperty.discountPercent, newProperty.discountEnabled])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('mediaType', newProperty.mediaType)
    formData.append('name', newProperty.name)
    formData.append('email', newProperty.email)
    formData.append('contact', newProperty.contact)
    formData.append('sector', newProperty.sector)
    formData.append('location', newProperty.location)
    formData.append('description', newProperty.description)
    formData.append('highlight', newProperty.highlight)
    formData.append('discountEnabled', newProperty.discountEnabled)
    formData.append('discountPercent', newProperty.discountPercent)
    formData.append('priceRegular', newProperty.priceRegular)
    formData.append('price', newProperty.price)
    formData.append('priceDiscounted', newProperty.priceDiscounted)
    formData.append('priceNote', newProperty.priceNote)
    formData.append('priceType', newProperty.priceType) // ✅ added

    if (newProperty.images.length > 0) {
      newProperty.images.forEach((file) => {
        formData.append('images', file)
      })
    }

    if (newProperty.video) {
      formData.append('video', newProperty.video)
    }

    if (newProperty.poster) {
      formData.append('poster', newProperty.poster)
    }

    try {
      const res = await fetch('/api/admin/addspecialproperty/', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.ok) {
        alert('Property saved successfully')
        router.refresh()
      } else {
        alert('Failed to save property')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Error saving property')
    }
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setNewProperty(prev => ({ ...prev, images: files }))
  }

  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    setNewProperty(prev => ({ ...prev, video: file }))
  }

  const handlePosterSelect = (e) => {
    const file = e.target.files[0]
    setNewProperty(prev => ({ ...prev, poster: file }))
  }

  return (
    <div className='bg-slate-900'>
      <div className="flex justify-end px-8 pt-6">
        <Link
          href="/"
          className="text-slate-300 hover:text-[#01F5FF] transition-colors text-sm border border-[#01F5FF] px-4 py-2 rounded-md"
        >
          Back to site
        </Link>
      </div>

      <main className="min-h-screen bg-slate-800 text-white p-8 border border-slate-500 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Special Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Type */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Media Type</label>
            <select
              value={newProperty.mediaType}
              onChange={e => setNewProperty({ ...newProperty, mediaType: e.target.value })}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              required
            >
              <option value="imageGallery">Image Gallery</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Name</label>
            <input
              type="text"
              value={newProperty.name}
              onChange={e => setNewProperty({ ...newProperty, name: e.target.value })}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Email</label>
            <input
              type="text"
              value={newProperty.email}
              onChange={e => setNewProperty({ ...newProperty, email: e.target.value })}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Contact</label>
            <input
              type="text"
              value={newProperty.contact}
              onChange={e => setNewProperty({ ...newProperty, contact: e.target.value })}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Location</label>
            <input
              type="text"
              value={newProperty.location}
              onChange={e => setNewProperty({ ...newProperty, location: e.target.value })}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              required
            />
          </div>

          {/* Sector */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Sector</label>
            <input
              type="text"
              value={newProperty.sector}
              onChange={e => setNewProperty({ ...newProperty, sector: e.target.value })}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              required
            />
          </div>

          {/* ✅ Price Type Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Price Type</label>
            <select
              value={newProperty.priceType}
              onChange={e => setNewProperty({ ...newProperty, priceType: e.target.value })}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white focus:ring-2 focus:ring-[#01F5FF]"
            >
              <option value="Per Day">Per Day</option>
              <option value="Per Month">Per Month</option>
              <option value="Per Year">Per Year</option>
            </select>
          </div>

         
        {/* Media Upload */}
        {newProperty.mediaType === 'imageGallery' && (
          <div>
            <label className="block mb-1 text-sm text-slate-300">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              required
            />
            {newProperty.images.length > 0 && (
              <p className="text-xs text-slate-400 mt-1">{newProperty.images.length} file(s) selected</p>
            )}
          </div>
        )}

       {newProperty.mediaType === 'video' && (
  <>
    {/* Upload Video */}
    <div>
      <label className="block mb-1 text-sm text-slate-300">Upload Video</label>
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoSelect}
        className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
        required
      />
      {newProperty.video && (
        <p className="text-xs text-slate-400 mt-1">{newProperty.video.name} selected</p>
      )}
    </div>

    {/* Upload Poster */}
    <div>
      <label className="block mb-1 text-sm text-slate-300">Upload Poster Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handlePosterSelect}
        className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
        required
      />
      {newProperty.poster && (
        <p className="text-xs text-slate-400 mt-1">{newProperty.poster.name} selected</p>
      )}
    </div>
  </>
)}


        {/* Description */}
        <div>
          <label className="block mb-1 text-sm text-slate-300">Description</label>
          <textarea
            value={newProperty.description}
            onChange={e => setNewProperty({ ...newProperty, description: e.target.value })}
            rows={3}
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
            required
          />
        </div>

        {/* Highlight */}
        <div className="flex items-center gap-2">
          <input
            id="highlight"
            type="checkbox"
            checked={newProperty.highlight}
            onChange={e => setNewProperty({ ...newProperty, highlight: e.target.checked })}
            className="rounded border border-slate-600 bg-slate-800 text-[#01F5FF] focus:ring-2 focus:ring-[#01F5FF]"
          />
          <label htmlFor="highlight" className="text-sm text-slate-300">
            Highlight this property
          </label>
        </div>

        {/* Discount Toggle */}
        <div className="flex items-center gap-2">
          <input
            id="discountEnabled"
            type="checkbox"
            checked={newProperty.discountEnabled}
            onChange={e => setNewProperty({ ...newProperty, discountEnabled: e.target.checked })}
            className="rounded border border-slate-600 bg-slate-800 text-[#01F5FF] focus:ring-2 focus:ring-[#01F5FF]"
          />
          <label htmlFor="discountEnabled" className="text-sm text-slate-300">
            Apply Discount
          </label>
        </div>

        {newProperty.discountEnabled && (
          <>
            <div>
              <label className="block mb-1 text-sm text-slate-300">Discount Percent</label>
              <input
                type="number"
                min={0}
                max={100}
                value={newProperty.discountPercent}
                onChange={e => setNewProperty({ ...newProperty, discountPercent: Number(e.target.value) })}
                className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-300">Discounted Price</label>
              <input
                type="number"
                value={newProperty.priceDiscounted}
                onChange={e => setNewProperty({ ...newProperty, priceDiscounted: e.target.value })}
                className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              />
            </div>
            
        <div>
          <label className="block mb-1 text-sm text-slate-300">Regular Price</label>
          <input
            type="number"
            value={newProperty.priceRegular}
            onChange={e => setNewProperty({ ...newProperty, priceRegular: e.target.value })}
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
          />
        </div>
          </>
        )}

        <div>
          <label className="block mb-1 text-sm text-slate-300"> Price</label>
          <input
            type="number"
            value={newProperty.price}
            onChange={e => setNewProperty({ ...newProperty, price: e.target.value })}
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-slate-300">Price Note</label>
          <input
            type="text"
            value={newProperty.priceNote}
            onChange={e => setNewProperty({ ...newProperty, priceNote: e.target.value })}
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          className="bg-[#01F5FF] text-black font-medium px-6 py-3 rounded-md hover:bg-cyan-400 transition"
        >
          Save Property
        </button>
         <Link
              href="/user/dashboard" // change this to where you want cancel to go
              className="bg-slate-700 text-white font-medium px-6 py-3 rounded-md hover:bg-slate-600 transition"
            >
              Cancel
            </Link>
            </div>
      </form>
    </main>
    </div>
  )
}