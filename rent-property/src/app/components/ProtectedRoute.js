'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'


export default function ProtectedRoute({ children, role }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    // If no user is logged in → go to login page
    if (!user) {
      router.push('/user/login')
      return
    }
    if (role && user.role !== role) {
      router.push('/user/login')
    }
  }, [user, loading, role, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Checking authentication...
      </div>
    )
  }
  return <>{children}</>
}
