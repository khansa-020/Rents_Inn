'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Mulish } from 'next/font/google'

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border bg-white text-slate-950 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

function ClientReviewsSlider() {
  const [currentReview, setCurrentReview] = useState(0)
  const reviews = [
    {
      name: "Ahmed Hassan",
      role: "Software Engineer",
      content: "Found my ideal apartment at Capital Square through Rents inn. The modern amenities and prime location are perfect.",
      rating: 5
    },
    {
      name: "Fatima Khan",
      role: "Marketing Manager",
      content: "Rents inn secured me a beautiful house in Block B. Their knowledge of Islamabad's sectors is impressive.",
      rating: 5
    },
    {
      name: "Usman Malik",
      role: "Business Owner",
      content: "The team found me a premium office space in Block C within my budget. Exceptional service for professionals!",
      rating: 4
    },
    {
      name: "Ayesha Raza",
      role: "University Professor",
      content: "As a newcomer to Islamabad, Rents inn perfectly matched me with Capital Square's secure community.",
      rating: 5
    }
  ]

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentReview((prev) => (prev + 1) % reviews.length),
      5000
    )
    return () => clearInterval(timer)
  }, [reviews.length])

  const review = reviews[currentReview]

  return (
    <div className="w-full">
      <Card className="border-slate-200">
        <CardContent className="flex flex-col gap-6">
          {/* Stars */}
          <div className="flex items-center">
            {[...Array(review.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5"
                style={{ fill: '#01F5FF', color: '#01F5FF' }}
              />
            ))}
          </div>

          {/* Review text */}
          <p className="text-black text-lg md:text-xl italic">
            "{review.content}"
          </p>

          {/* Reviewer */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#01F5FF' }}
            >
              <span className="text-black font-bold">
                {review.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="leading-tight sm:leading-snug">
              <h4 className="text-black font-semibold">{review.name}</h4>
              <p className="text-black text-sm">{review.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dots */}
      <div className="mt-4 flex justify-center space-x-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReview(index)}
            className={`w-3 h-3 rounded-full transition-transform duration-300 ${
              index === currentReview ? 'scale-110' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: index === currentReview ? '#01F5FF' : '#475569'
            }}
            aria-label={`Show review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function ReviewsSection() {
  return (
    <section className={`py-20 sm:py-24 bg-slate-800 ${mulish.className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6">
            What They're Saying
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mb-6 lg:mb-8"
            style={{ backgroundColor: '#01F5FF' }}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <ClientReviewsSlider />
        </div>
      </div>
    </section>
  )
}
