'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Mulish } from 'next/font/google'

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

function Button({ children, className = '', size = 'md', variant = 'default', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
  const sizes = {
    xs: 'px-2 py-1 text-xs h-7',
    sm: 'px-3 py-2 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12',
  }
  const variants = {
    default: 'bg-[#01F5FF] text-slate-900 hover:bg-[#00ddee] focus:ring-[#01F5FF]',
    outline:
      'border border-[#01F5FF] text-[#01F5FF] bg-transparent hover:bg-[#01F5FF] hover:text-slate-900 focus:ring-[#01F5FF]',
    link:
      'text-[#01F5FF] hover:text-[#00ddee] underline-offset-4 hover:underline bg-transparent p-0 h-auto',
  }
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' })
  const [formErrors, setFormErrors] = useState({ name: '', email: '', mobile: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let isValid = true
    const newErrors = {}

    if (!formData.name.trim()) { newErrors.name = 'Name is required'; isValid = false }
    if (!formData.email.trim()) { newErrors.email = 'Email is required'; isValid = false }
    else if (!validateEmail(formData.email)) { newErrors.email = 'Please enter a valid email address'; isValid = false }
    if (!formData.mobile.trim()) { newErrors.mobile = 'Mobile number is required'; isValid = false }
    else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.mobile)) { newErrors.mobile = 'Enter a valid phone number'; isValid = false }
    if (!formData.message.trim()) { newErrors.message = 'Message is required'; isValid = false }

    setFormErrors(newErrors)
    if (!isValid) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/save-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: formData })
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Failed to save data')
      }
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', mobile: '', message: '' })
      setTimeout(() => setSubmitSuccess(false), 2500)
    } catch (err) {
      console.error('Contact save failed:', err)
      alert('Sorry, could not save your details. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className={`${mulish.className} py-20 sm:py-24 bg-slate-900`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Contact Us
          </h2>
          <div className="w-16 h-0.5 bg-[#01F5FF] mx-auto mb-6 lg:mb-8"></div>
          <p className="text-slate-300 text-base lg:text-lg max-w-2xl mx-auto px-4">
            Get in touch with our team to find your perfect rental property
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* Contact Details */}
          <div className="space-y-6 lg:space-y-8">
            {/* PHONE */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#01F5FF] rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold">Phone</h3>
                <p className="text-slate-300 break-words">
                  +92-303-3304987
                </p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#01F5FF] rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold">Email</h3>
                <p className="text-slate-300 break-words">
                  Support@rentsinn.com
                </p>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#01F5FF] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold">Address</h3>
                <p className="text-slate-300 break-words leading-relaxed">
                  Street 39, Block C, Multi Gardens, B-17, Islamabad
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-900 p-6 lg:p-8 rounded-lg">
            <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01F5FF] text-sm sm:text-base"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01F5FF] text-sm sm:text-base"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Your Mobile"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01F5FF] text-sm sm:text-base"
                />
                {formErrors.mobile && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.mobile}</p>
                )}
              </div>
              <div>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01F5FF] text-sm sm:text-base"
                ></textarea>
                {formErrors.message && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-[#01F5FF] hover:bg-[#00ddee] text-slate-900 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
              {submitSuccess && (
                <p className="text-green-400 text-sm">
                  Thanks! We saved your request and will get back to you shortly.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
