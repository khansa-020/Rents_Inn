'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useAuth } from '../../../../context/AuthContext'
import { Mulish } from 'next/font/google'
import { Upload } from 'lucide-react'

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: '',
    bio: '',
    image: '',
  })
  const [preview, setPreview] = useState('/user.png')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/user?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.user.profile) {
            setProfile(data.user.profile)
            if (data.user.profile.image) setPreview(data.user.profile.image)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setProfile({ ...profile, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage('')

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, profile }),
    })
    const data = await res.json()
    if (data.ok) setMessage('✅ Profile updated successfully!')
    else setMessage('❌ ' + data.error)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <div className="w-16 h-16 border-4 border-[#01F5FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-16 px-6 flex justify-center ${mulish.className}`}
    >
      <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl shadow-2xl p-10 relative">
        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01F5FF] via-blue-800 to-mint-500"></div>

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#01F5FF] to-purple-400 bg-clip-text text-transparent mb-8">
          Edit Profile
        </h1>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#01F5FF] to-purple-500 rounded-full blur opacity-60 group-hover:opacity-100 transition"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800">
              <Image
                src={preview || '/user.png'}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="mt-4 flex items-center gap-2 text-sm text-[#01F5FF] hover:text-purple-400 transition-colors"
          >
            <Upload size={18} /> Upload New Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Full Name" name="name" value={profile.name} onChange={handleChange} />
          <InputField label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
          <InputField label="Address" name="address" value={profile.address} onChange={handleChange} />

          <div>
            <label className="text-sm text-gray-400 block mb-2">Bio</label>
            <textarea
              name="bio"
              rows="3"
              placeholder="Write something about yourself..."
              value={profile.bio}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-[#01F5FF] outline-none resize-none transition"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-[#01F5FF] to-purple-500 text-slate-900 hover:opacity-90 transition-all shadow-lg"
          >
            Save Profile
          </button>
        </form>

        {message && (
          <p className="text-center mt-6 text-[#01F5FF] font-medium animate-pulse">{message}</p>
        )}
      </div>
    </div>
  )
}

function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-400 block mb-2">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-[#01F5FF] outline-none transition"
      />
    </div>
  )
}
