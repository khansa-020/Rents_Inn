'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Image from 'next/image'
import { LogOut, User, Settings, ChevronDown } from 'lucide-react'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const router = useRouter()
  const { user, logout } = useAuth()

  // close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // close menu on Escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0;'
    router.push('/user/login')
  }

  const handleMenuItemClick = (action) => {
    setOpen(false)
    if (action === 'profile') router.push('/user/dashboard/viewProfile')
    if (action === 'settings') router.push('/user/dashboard/profile')
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="group relative flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-cyan-400/20"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* User Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900">
            <Image
              src={user?.profile?.image || '/user.png'}
              alt="User avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-900"></div>
        </div>

        {/* Name and Email */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-semibold text-white">
            {user?.profile?.fullName || 'User'}
          </div>
          <div className="text-xs text-slate-400 truncate">{user?.email}</div>
        </div>

        {/* Chevron Icon */}
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 origin-top-right ${
          open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-cyan-400/50">
              <Image
                src={user?.profile?.image || '/user.png'}
                alt="User avatar"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold text-white truncate">
                {user?.profile?.fullName || 'User'}
              </div>
              <div className="text-sm text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <button
            className="w-full group flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-left"
            onClick={() => handleMenuItemClick('profile')}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors">
              <User size={20} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">View Profile</div>
              <div className="text-xs text-slate-400">See your public profile</div>
            </div>
          </button>

          <button
            className="w-full group flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-left"
            onClick={() => handleMenuItemClick('settings')}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-400/10 group-hover:bg-blue-400/20 transition-colors">
              <Settings size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Edit Profile</div>
              <div className="text-xs text-slate-400">Manage your account</div>
            </div>
          </button>
        </div>

        {/* Logout */}
        <div className="p-3 pt-2 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-500 hover:to-pink-500 rounded-xl transition-all duration-200 font-medium text-white shadow-lg hover:shadow-red-500/25"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
