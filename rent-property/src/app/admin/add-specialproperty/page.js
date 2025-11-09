// Updated AddPropertyPage with toaster and validation
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

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
    priceDiscounted: '',
    price: '',
    priceNote: '',
    priceType: 'Month'
  })

  // auto discount
  useEffect(() => {
    if (newProperty.discountEnabled && newProperty.price && newProperty.discountPercent) {
      const r = parseFloat(newProperty.price)
      const d = parseFloat(newProperty.discountPercent)
      if (!isNaN(r) && !isNaN(d)) {
        const discounted = r - (r * d) / 100
        setNewProperty(p => ({ ...p, priceDiscounted: discounted.toFixed(0) }))
      }
    }
  }, [newProperty.price, newProperty.discountPercent, newProperty.discountEnabled])

  const validateForm = () => {
    const {
      name, email, contact, location, sector, description,
      price, images, video, poster, mediaType, highlight, discountEnabled, discountPercent
    } = newProperty

    if (!name || !email || !contact || !location || !sector || !description || !price) {
      toast.error('Please fill all required fields')
      return false
    }

    if (isNaN(contact) || contact.length < 7) {
      toast.error('Contact must be numeric and valid')
      return false
    }

    if (isNaN(price)) {
      toast.error('Price must be numeric')
      return false
    }

    // highlight & discount rule
    if ((highlight && !discountEnabled) || (!highlight && discountEnabled)) {
      toast.error('Highlight and Discount must both be ON or both OFF')
      return false
    }

    // discount fields
    if (discountEnabled) {
      if (!price || !discountPercent) {
        toast.error('Enter Price & Discount %')
        return false
      }
      if (isNaN(priceRegular) || isNaN(discountPercent)) {
        toast.error('Price fields must be numeric')
        return false
      }
    }

    // media validation
    if (mediaType === 'imageGallery' && images.length === 0) {
      toast.error('Select at least 1 image')
      return false
    }

    if (mediaType === 'video' && (!video || !poster)) {
      toast.error('Upload video and poster image')
      return false
    }

    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return

    const fd = new FormData()
    Object.entries(newProperty).forEach(([k, v]) => {
      if (k === 'images' || k === 'video' || k === 'poster') return
      fd.append(k, v)
    })

    newProperty.images.forEach(f => fd.append('images', f))
    if (newProperty.video) fd.append('video', newProperty.video)
    if (newProperty.poster) fd.append('poster', newProperty.poster)

    try {
      const res = await fetch('/api/admin/addspecialproperty/', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.ok) {
        toast.success('Property saved')
        setTimeout(() => router.refresh(), 1200)
      } else toast.error('Failed to save')
    } catch {
      toast.error('Server error')
    }
  }

  const s = (k, v) => setNewProperty(p => ({ ...p, [k]: v }))

  return (
    <div className='bg-slate-900'>
      <Toaster />
      <div className="flex justify-end px-8 pt-6">
        <Link href="/" className="text-slate-300 hover:text-[#01F5FF] border border-[#01F5FF] px-4 py-2 rounded-md text-sm">Back to site</Link>
      </div>

      <main className="min-h-screen bg-slate-800 text-white p-8 border border-slate-500 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Special Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="text-sm">Media Type</label>
            <select value={newProperty.mediaType} onChange={e=>s('mediaType',e.target.value)} className="w-full border bg-slate-800 p-2 rounded">
              <option value="imageGallery">Image Gallery</option>
              <option value="video">Video</option>
            </select>
          </div>

          {['name','email','contact','location','sector'].map(f => (
            <div key={f}>
              <label className="text-sm capitalize">{f}</label>
              <input type="text" value={newProperty[f]} onChange={e=>s(f,e.target.value)} className="w-full border bg-slate-800 p-2 rounded" required />
            </div>
          ))}

          <div>
            <label className="text-sm">Price Type</label>
            <select value={newProperty.priceType} onChange={e=>s('priceType',e.target.value)} className="w-full border bg-slate-800 p-2 rounded">
              <option>Day</option>
              <option>Month</option>
              <option>Year</option>
            </select>
          </div>

          {newProperty.mediaType==='imageGallery' && (
            <div>
              <label className="text-sm">Images</label>
              <input type="file" multiple accept="image/*" onChange={e=>s('images',Array.from(e.target.files))} className="w-full border bg-slate-800 p-2 rounded" />
            </div>
          )}

          {newProperty.mediaType==='video' && (
            <>
              <div>
                <label className="text-sm">Video</label>
                <input type="file" accept="video/*" onChange={e=>s('video',e.target.files[0])} className="w-full border bg-slate-800 p-2 rounded" />
              </div>
              <div>
                <label className="text-sm">Poster</label>
                <input type="file" accept="image/*" onChange={e=>s('poster',e.target.files[0])} className="w-full border bg-slate-800 p-2 rounded" />
              </div>
            </>
          )}

          <div>
            <label className="text-sm">Description</label>
            <textarea rows={3} value={newProperty.description} onChange={e=>s('description',e.target.value)} className="w-full border bg-slate-800 p-2 rounded" />
          </div>

          <div className="flex gap-4">
            <label className="flex gap-2 items-center"><input type="checkbox" checked={newProperty.highlight} onChange={e=>s('highlight',e.target.checked)} /> Highlight</label>
            <label className="flex gap-2 items-center"><input type="checkbox" checked={newProperty.discountEnabled} onChange={e=>s('discountEnabled',e.target.checked)} /> Discount</label>
          </div>

          {newProperty.discountEnabled && (
            <>
              <input type="number" placeholder="Discount %" value={newProperty.discountPercent} onChange={e=>s('discountPercent',e.target.value)} className="w-full border bg-slate-800 p-2 rounded" />
              <input type="number" placeholder="Discounted Price" value={newProperty.priceDiscounted} onChange={e=>s('priceDiscounted',e.target.value)} className="w-full border bg-slate-800 p-2 rounded" />
            </>
          )}

          <input type="number" placeholder="Price" value={newProperty.price} onChange={e=>s('price',e.target.value)} className="w-full border bg-slate-800 p-2 rounded" />
          <input type="text" placeholder="Price Note" value={newProperty.priceNote} onChange={e=>s('priceNote',e.target.value)} className="w-full border bg-slate-800 p-2 rounded" />

          <div className="flex gap-4 pt-4">
            <button type="submit" className="bg-[#01F5FF] text-black px-6 py-3 rounded">Save</button>
            <Link href="/user/dashboard" className="bg-slate-700 px-6 py-3 rounded">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  )
}
