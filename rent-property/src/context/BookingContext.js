'use client'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [modal, setModal] = useState(null)
  const isOpen = !!modal

  const openBooking = useCallback((property) => setModal({ type: 'booking', property }), [])
  const closeBooking = useCallback(() => setModal(null), [])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  return (
    <BookingContext.Provider value={{ modal, isOpen, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
