'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/properties?userEmail=all`)
        .then(res => res.json())
        .then(data => {
          const found = data.data.find(p => String(p.id) === String(id))
          if (found) {
            found.images = Array.isArray(found.images) ? found.images.filter(Boolean) : []
            setProperty(found)
            setForm(found)
          }
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading property:', err)
          setLoading(false)
        })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'file') {
      if (name === 'images') {
        setForm(prev => ({
          ...prev,
          [name]: [...(prev.images || []), ...Array.from(files)]
        }))
      } else {
        setForm(prev => ({ ...prev, [name]: files[0] }))
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  // ✅ Auto-calculate discounted price logic
  useEffect(() => {
    if (form.discountEnabled && form.priceRegular && form.discountPercent) {
      const regular = parseFloat(form.priceRegular)
      const discount = parseFloat(form.discountPercent)
      if (!isNaN(regular) && !isNaN(discount)) {
        const discounted = regular - (regular * discount) / 100
        setForm(prev => ({ ...prev, priceDiscounted: discounted.toFixed(0) }))
      }
    }
  }, [form.priceRegular, form.discountPercent, form.discountEnabled])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      for (const key in form) {
        const val = form[key]
        if (val === undefined || val === null) continue
        if (Array.isArray(val)) {
          val.forEach(item => formData.append(key, item))
        } else {
          formData.append(key, val)
        }
      }
      formData.append('id', id)

      const res = await fetch('/api/admin/properties', {
        method: 'PUT',
        body: formData,
      })

      const result = await res.json()
      if (result.ok) {
        alert('✅ Property updated successfully!')
        router.push('/user/dashboard/properties')
      } else {
        alert(result.error || 'Update failed.')
      }
    } catch (err) {
      console.error('Update error:', err)
      alert('Error updating property.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-slate-400 text-sm py-8 text-center">Loading property details…</div>
  }

  if (!property) {
    return <div className="text-slate-400 text-sm py-8 text-center">Property not found.</div>
  }

  return (
    <div className="bg-slate-900">
      <div className="flex justify-end px-8 pt-6">
        <Link
          href="/"
          className="text-slate-300 hover:text-[#01F5FF] transition-colors text-sm border border-[#01F5FF] px-4 py-2 rounded-md"
        >
          Back to site
        </Link>
      </div>

      <main className="min-h-screen bg-slate-800 text-white p-8 border border-slate-500 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Media Type */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Media Type</label>
            <select
              name="mediaType"
              value={form.mediaType || 'imageGallery'}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
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
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Email</label>
            <input
              type="text"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Contact</label>
            <input
              type="text"
              name="contact"
              value={form.contact || ''}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Location</label>
            <input
              type="text"
              name="location"
              value={form.location || ''}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              required
            />
          </div>

          {/* Sector */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Sector</label>
            <input
              type="text"
              name="sector"
              value={form.sector || ''}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              required
            />
          </div>

          {/* Price Type */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Price Type</label>
            <select
              name="priceType"
              value={form.priceType || 'Per Day'}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
            >
              <option value="Per Day">Per Day</option>
              <option value="Per Month">Per Month</option>
              <option value="Per Year">Per Year</option>
            </select>
          </div>

          {/* Highlight */}
          <div className="flex items-center gap-2">
            <input
              id="highlight"
              type="checkbox"
              name="highlight"
              checked={form.highlight || false}
              onChange={handleChange}
              className="rounded border border-slate-600 bg-slate-800 text-[#01F5FF]"
            />
            <label htmlFor="highlight" className="text-sm text-slate-300">
              Highlight this property
            </label>
          </div>

          {/* Discount */}
          <div className="flex items-center gap-2">
            <input
              id="discountEnabled"
              type="checkbox"
              name="discountEnabled"
              checked={form.discountEnabled || false}
              onChange={handleChange}
              className="rounded border border-slate-600 bg-slate-800 text-[#01F5FF]"
            />
            <label htmlFor="discountEnabled" className="text-sm text-slate-300">
              Apply Discount
            </label>
          </div>

          {form.discountEnabled && (
            <>
              <div>
                <label className="block mb-1 text-sm text-slate-300">Discount Percent</label>
                <input
                  type="number"
                  name="discountPercent"
                  min={0}
                  max={100}
                  value={form.discountPercent || ''}
                  onChange={handleChange}
                  className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-300">Regular Price</label>
                <input
                  type="text"
                  name="priceRegular"
                  value={form.priceRegular || ''}
                  onChange={handleChange}
                  className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-300">Discounted Price</label>
                <input
                  type="text"
                  name="priceDiscounted"
                  value={form.priceDiscounted || ''}
                  onChange={handleChange}
                  className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                />
              </div>
            </>
          )}

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Price</label>
            <input
              type="text"
              name="price"
              value={form.price || ''}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
            />
          </div>

          {/* Price Note */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Price Note</label>
            <input
              type="text"
              name="priceNote"
              value={form.priceNote || ''}
              onChange={handleChange}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
            />
          </div>

          {/* Existing Images / Video */}
          {form.mediaType === 'imageGallery' && form.images?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-slate-400 mb-1">Current Images:</p>
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, i) => {
                  const src =
                    typeof img === 'string'
                      ? img.startsWith('/uploads')
                        ? img
                        : `/uploads/${img}`
                      : URL.createObjectURL(img)
                  return (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-20 h-20 object-cover rounded border border-slate-700"
                    />
                  )
                })}
              </div>
            </div>
          )}

          {form.mediaType === 'video' && form.video && (
            <div className="mt-3">
              <p className="text-sm text-slate-400 mb-1">Current Video:</p>
              <video
                src={
                  typeof form.video === 'string'
                    ? form.video.startsWith('/uploads')
                      ? form.video
                      : `/uploads/${form.video}`
                    : URL.createObjectURL(form.video)
                }
                controls
                className="w-full max-w-sm rounded-lg border border-slate-700"
              />
            </div>
          )}

          {/* Upload New Media */}
          {form.mediaType === 'imageGallery' && (
            <div>
              <label className="block mb-1 text-sm text-slate-300">Upload New Images</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              />
            </div>
          )}

          {form.mediaType === 'video' && (
            <>
              <div>
                <label className="block mb-1 text-sm text-slate-300">Upload New Video</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleChange}
                  className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-300">Upload New Poster</label>
                <input
                  type="file"
                  name="poster"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                />
              </div>
            </>
          )}

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Description</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#01F5FF] text-black font-medium px-6 py-3 rounded-md hover:bg-cyan-400 transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link
              href="/user/dashboard/properties"
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
