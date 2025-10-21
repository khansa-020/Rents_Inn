'use client'

import Image from 'next/image'
import { MapPin, Mail, Phone } from 'lucide-react'
import { Mulish } from 'next/font/google'
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

// Support email
const SUPPORT_EMAIL = 'Support@rentsinn.com'

// Gmail compose URL builder
const getGmailComposeUrl = (to, subject = '', body = '') =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

export default function Footer() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = window.innerWidth >= 768 ? 140 : 160
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  return (
    <footer className={`${mulish.className} bg-slate-950 py-12 sm:py-16`}>
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4 lg:mb-6">
              <a href="/" aria-label="Rentsinn Home" className="inline-flex items-center">
                <Image
                  src="/logo.png"
                  alt="Rentsinn logo"
                  width={180}
                  height={56}
                  priority
                  className="h-10 sm:h-12 w-auto object-contain"
                  sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 180px"
                />
              </a>
            </div>

            <p className="text-slate-400 mb-4 lg:mb-6 text-sm sm:text-base">
              Discover premium rentals in B-17 & D-17 Islamabad, featuring handpicked homes in Multi Gardens and nearby sectors.
            </p>

            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1LghvgvnzK/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-5 h-5 text-slate-400 hover:text-[#01F5FF] cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/Rentsinn05/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5 text-slate-400 hover:text-[#01F5FF] cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.youtube.com/channel/UC2OKQJ8YlbZG1Rsv0ZchEVQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5 text-slate-400 hover:text-[#01F5FF] cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.tiktok.com/@Rentsinn5?_t=ZS-8yyM6u6kwqH&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5 text-slate-400 hover:text-[#01F5FF] cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 lg:mb-6">Quick Links</h4>
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-slate-400 hover:text-[#01F5FF] transition-colors text-sm sm:text-base"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-slate-400 hover:text-[#01F5FF] transition-colors text-sm sm:text-base"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('properties')}
                  className="text-slate-400 hover:text-[#01F5FF] transition-colors text-sm sm:text-base"
                >
                  Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-slate-400 hover:text-[#01F5FF] transition-colors text-sm sm:text-base"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 lg:mb-6">Contact Info</h4>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#01F5FF] flex-shrink-0" />
                <span className="text-slate-400 text-sm sm:text-base">Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#01F5FF] flex-shrink-0" />
                <a href="tel:+923033304987" className="text-slate-400 text-sm sm:text-base hover:text-[#01F5FF]">
                  +92-303-3304987
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#01F5FF] flex-shrink-0" />
                <a
                  href={getGmailComposeUrl(SUPPORT_EMAIL, 'Support Request', 'Hello Rentsinn team,')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 text-sm sm:text-base hover:text-[#01F5FF]"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 lg:pt-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-slate-400 text-sm text-center">
              © {new Date().getFullYear()} Rents inn. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
