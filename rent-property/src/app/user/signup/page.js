'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    const res = await fetch('/api/auth/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      alert('Signup successful. Please login.')
      router.push('/user/login')  // ✅ updated path
    } else {
      alert('Signup failed.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-white mb-1">Sign Up</h1>
        <p className="text-slate-400 text-sm mb-4">Create a new account</p>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-[#01F5FF] px-4 py-2 font-medium text-slate-900 hover:bg-[#00ddee] transition-colors"
          >
            Sign Up
          </button>

          <p className="text-slate-400 text-sm text-center mt-3">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/user/login')}
              className="text-[#01F5FF] hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
