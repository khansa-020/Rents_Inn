'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Mulish } from 'next/font/google'
import { useAuth } from '../../../../context/AuthContext'

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export default function ViewProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/profile?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) setProfile(data.user)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#01F5FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#01F5FF] text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 text-lg">Profile not found</p>
        </div>
      </div>
    )
  }

  // ✅ Map JSON fields to UI structure
  const p = profile?.profile || {}
  const info = {
    fullName: p.name || 'Unnamed User',
    contact: p.phone || 'Not added',
    location: p.address || 'Not added',
    profession: p.bio || 'Not added',
    sector: p.sector || 'Not added',
    image: p.image || '/user.png'
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden ${mulish.className}`}
    >
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#01F5FF]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center pt-20 pb-16 px-6 animate-fadeIn">
        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-700/50 relative overflow-hidden">

          {/* Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01F5FF] via-purple-500 to-pink-500"></div>
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
            {/* Profile Image */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#01F5FF] to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-32 h-32">
                <Image
                  src={info.image}
                  alt="Profile Picture"
                  fill
                  className="rounded-full object-cover border-4 border-slate-800"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#01F5FF] to-purple-400 bg-clip-text text-transparent mb-2">
                {info.fullName}
              </h1>
              <p className="text-gray-300 text-lg mb-1 flex items-center justify-center md:justify-start gap-2">
                <span className="text-[#01F5FF]">✉</span> {profile.email}
              </p>
              <div className="inline-flex items-center gap-2 bg-[#01F5FF]/10 border border-[#01F5FF]/30 rounded-full px-4 py-1 mt-2">
                <span className="w-2 h-2 bg-[#01F5FF] rounded-full animate-pulse"></span>
                <span className="text-[#01F5FF] text-sm font-medium uppercase tracking-wide">{profile.role}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8"></div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileItem icon="📍" label="Location" value={info.location} />
            <ProfileItem icon="📞" label="Contact" value={info.contact} />
            <ProfileItem icon="🏙" label="Sector" value={info.sector} />
            <ProfileItem icon="💼" label="Profession" value={info.profession} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Small reusable profile info card
function ProfileItem({ icon, label, value }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 hover:border-[#01F5FF]/30 transition-colors duration-300 group">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-[#01F5FF]/10 rounded-lg flex items-center justify-center group-hover:bg-[#01F5FF]/20 transition-colors duration-300">
          <span className="text-xl">{icon}</span>
        </div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-white text-lg font-semibold ml-1">{value || 'Not added'}</p>
    </div>
  )
}
