'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPin, Mail, Phone, Menu, X } from 'lucide-react'
import { Mulish } from 'next/font/google'
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

// Read from NEXT_PUBLIC_* env vars (client-side only)
// const ADMIN_CREDENTIALS = {
//   userId: process.env.NEXT_PUBLIC_ADMIN_USER_ID || '',
//   password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
// }

const SUPPORT_EMAIL = 'Support@rentsinn.com'

// Build a Gmail compose URL
const getGmailComposeUrl = (to, subject = '', body = '') =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`

export default function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Admin modal state
  // const [showAdminModal, setShowAdminModal] = useState(false)
  // const [adminUserId, setAdminUserId] = useState('')
  // const [adminPassword, setAdminPassword] = useState('')
  // const [adminError, setAdminError] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId)
    if (el) {
      const headerOffset = window.innerWidth >= 768 ? 140 : 160
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  // const openAdminModal = () => {
  //   setAdminError('')
  //   setAdminUserId('')
  //   setAdminPassword('')
  //   setShowAdminModal(true)
  // }

  // const openAdminFromMenu = () => {
  //   setIsMobileMenuOpen(false)
  //   openAdminModal()
  // }

  // const handleAdminSubmit = (e) => {
  //   e && e.preventDefault && e.preventDefault()
  //   setAdminError('')
  //   setIsChecking(true)
  //   setTimeout(() => {
  //     const ok =
  //       adminUserId.trim() === ADMIN_CREDENTIALS.userId &&
  //       adminPassword === ADMIN_CREDENTIALS.password
  //     setIsChecking(false)
  //     if (ok) {
  //       sessionStorage.setItem('adminAuthed', '1')
  //       setShowAdminModal(false)
  //       router.push('/admin')
  //     } else {
  //       setAdminError('Only Admin have access.')
  //     }
  //   }, 400)
  // }

  // const handleAdminKeyDown = (e) => {
  //   if (e.key === 'Enter') handleAdminSubmit(e)
  // }

  return (
    <div className={mulish.className}>
      {/* Top Header Bar */}
      <div
        className={`fixed top-0 w-full z-50 bg-slate-800 text-white py-2 px-4 transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100 translate-y-0'
          }`}
      >
        <div className="container mx-auto">
          {/* Desktop/tablet */}
          <div className="hidden md:flex items-center justify-between text-sm">
            {/* Left - Contact */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center space-x-2 min-w-0">
                <MapPin className="w-4 h-4 text-[#01F5FF]" />
                <span className="whitespace-nowrap">Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Mail className="w-4 h-4 text-[#01F5FF]" />
                {/* EMAIL -> Opens Gmail compose in new tab */}
                <a
                  href={getGmailComposeUrl(SUPPORT_EMAIL, 'Support Request', 'Hello Rentsinn team,')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap hover:text-[#01F5FF] transition-colors underline-offset-2"
                  title={`Email ${SUPPORT_EMAIL}`}
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Phone className="w-4 h-4 text-[#01F5FF]" />
                <a href="tel:+923033304987" className="whitespace-nowrap hover:text-[#01F5FF] transition-colors">
                  +92-303-3304987
                </a>
              </div>
            </div>

            {/* Right - Admin + Social */}
            <div className="flex items-center space-x-6">
              <span
                 onClick={() => router.push('/user/login')}
                className="cursor-pointer hover:text-[#01F5FF] transition-colors font-medium"
              >
                Login
              </span>
              <div className="flex items-center space-x-3 ml-2">
                <a
                  href="https://www.facebook.com/share/1LghvgvnzK/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className="w-4 h-4 hover:text-[#01F5FF] cursor-pointer transition-colors" />
                </a>
                <a
                  href="https://www.instagram.com/rentsinn05/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="w-4 h-4 hover:text-[#01F5FF] cursor-pointer transition-colors" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UC2OKQJ8YlbZG1Rsv0ZchEVQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="w-4 h-4 hover:text-[#01F5FF] cursor-pointer transition-colors" />
                </a>
                <a
                  href="https://www.tiktok.com/@rentsinn5?_t=ZS-8yyM6u6kwqH&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok className="w-4 h-4 hover:text-[#01F5FF] cursor-pointer transition-colors" />
                </a>

              </div>
            </div>
          </div>

          {/* Mobile top header */}
          <div className="md:hidden flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 min-w-0">
              <Phone className="w-4 h-4 text-[#01F5FF] flex-shrink-0" />
              <a
                href="tel:+923001234567"
                className="text-xs sm:text-sm truncate max-w-[140px] hover:text-[#01F5FF] transition-colors"
                title="+92-303-3304987"
              >
                +92-303-3304987
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href="https://www.facebook.com/share/1LghvgvnzK/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="w-4 h-4 hover:text-[#01F5FF] cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/rentsinn05/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-4 h-4 hover:text-[#01F5FF] cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.youtube.com/channel/UC2OKQJ8YlbZG1Rsv0ZchEVQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className="w-4 h-4 hover:text-[#01F5FF] cursor-pointer transition-colors" />
              </a>

              <a
                href="https://www.tiktok.com/@rentsinn5?_t=ZS-8yyM6u6kwqH&_r=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="w-4 h-4 hover:text-[#01F5FF] cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed w-full z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100 translate-y-0 top-8'
          }`}
      >
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Navigation */}
          <div className="hidden md:grid grid-cols-3 items-center">
            {/* Left: Logo */}
            <div className="flex items-center">
              <button
                onClick={() => scrollToSection('home')}
                className="flex items-center focus:outline-none"
                aria-label="Go to Home"
              >
                <Image
                  src="/logo.png"
                  alt="Rentsinn"
                  width={140}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </button>
            </div>

            {/* Center: Nav items */}
            <nav className="flex items-center justify-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-white hover:text-[#01F5FF] transition-colors font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('properties')} className="text-slate-300 hover:text-[#01F5FF] transition-colors font-medium">
                Properties
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-300 hover:text-[#01F5FF] transition-colors font-medium">
                Contact
              </button>
              <button onClick={() => scrollToSection('about')} className="text-slate-300 hover:text-[#01F5FF] transition-colors font-medium">
                About
              </button>
            </nav>

            {/* Right Spacer */}
            <div />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center focus:outline-none"
              aria-label="Go to Home"
            >
              <Image
                src="/logo.png"
                alt="Rentsinn"
                width={120}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-[#01F5FF] transition-colors p-2"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-sm border-t border-slate-800">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-3">
                <button onClick={() => scrollToSection('home')} className="block w-full text-left text-white hover:text-[#01F5FF] transition-colors font-medium py-2">
                  Home
                </button>
                <button onClick={() => scrollToSection('properties')} className="block w-full text-left text-slate-300 hover:text-[#01F5FF] transition-colors font-medium py-2">
                  Properties
                </button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-slate-300 hover:text-[#01F5FF] transition-colors font-medium py-2">
                  Contact
                </button>
                <button onClick={() => scrollToSection('about')} className="block w-full text-left text-slate-300 hover:text-[#01F5FF] transition-colors font-medium py-2">
                  About
                </button>
                <span onClick={openAdminFromMenu} className="block w-full text-left text-slate-300 hover:text-[#01F5FF] transition-colors font-medium py-2 cursor-pointer">
                  Admin
                </span>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Admin Modal */}
      {/* {showAdminModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdminModal(false)} />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-white text-lg font-semibold mb-1">Admin Login</h3>
            <p className="text-slate-400 text-sm mb-4">Enter your credentials to continue.</p>

            <form onSubmit={handleAdminSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 text-sm mb-1">User ID</label>
                <input
                  type="text"
                  value={adminUserId}
                  onChange={(e) => setAdminUserId(e.target.value)}
                  onKeyDown={handleAdminKeyDown}
                  className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
                  placeholder="Enter User ID"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={handleAdminKeyDown}
                  className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
                  placeholder="Enter Password"
                />
              </div>

              {adminError && <p className="text-red-400 text-sm">{adminError}</p>}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isChecking}
                  className="flex-1 inline-flex items-center justify-center rounded-md bg-[#01F5FF] px-4 py-2 font-medium text-slate-900 hover:bg-[#00ddee] transition-colors disabled:opacity-60"
                >
                  {isChecking ? 'Checking…' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-600 px-4 py-2 font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div> 
        </div>
      )}*/}
    </div>
  )
}
