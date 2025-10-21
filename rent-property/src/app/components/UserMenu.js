'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const { logout, user } = useAuth()
  const router = useRouter()


  function Button({ children, className = '', size = 'md', variant = 'default', onClick, ...props }) {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
  const sizes = { sm: 'px-3 py-2 text-sm h-9', md: 'px-4 py-2 text-base h-10'}
  const variants = {
    outline: 'border border-[#01F5FF] text-[#01F5FF] bg-transparent hover:bg-[#01F5FF] hover:text-slate-900 focus:ring-[#01F5FF]',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )}

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0;'
    router.push('/user/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#01F5FF]"
      >
        <Image
          src="/user.png" 
          alt="User avatar"
          width={80}
          height={80}
          className="object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 text-white rounded-lg shadow-lg border border-slate-700">
          <ul className="p-2">
            <li
              className="px-4 py-2 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/user/profile')}
            >
              <User size={18} />
               Profile
            </li>

            <li
              className="px-4 py-2 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/user/edit')}
            >
              <Settings size={18} /> 
              Edit
            </li>

            <hr className="my-2 border-slate-700" />

            
          <Button
           size="md"
           variant="outline"
            onClick={handleLogout}
            className="w-full justify-center"
          >logout 
          </Button>
            
          </ul>
        </div>
      )}
    </div>
  )
}
