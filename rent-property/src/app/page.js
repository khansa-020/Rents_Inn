'use client'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import BookingSection from './components/BookingSection'
import DiscountedProperty from './components/DiscountedProperty'
import SpecialProperties from './components/SpecialProperties'
import PropertiesSection from './components/PropertiesSection'
import ReviewsSection from './components/ReviewsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export default function Home() {
  return (
    <div className={`min-h-screen bg-slate-900 ${inter.className}`}>
      <Header />
      
      {/* SEO Content Section */}
      <section className="sr-only">
        <h1>Rooms For Rent In B17 Islamabad</h1>
        <h2>Rooms For Rent In B17 Islamabad</h2>
        <p>Rooms For Rent In B17 Islamabad</p>
      </section>
      
      <HeroSection />
      <BookingSection/>
      <DiscountedProperty/>
      <SpecialProperties/>
      <PropertiesSection />
      <AboutSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}