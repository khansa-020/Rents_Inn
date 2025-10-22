'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'  // ✅ Add this line


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const { login } = useAuth()  // ✅ Destructure login function


  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsChecking(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
       console.log('API response:', data)
      setIsChecking(false)


    if (res.ok) {
// ✅ Save JWT token to localStorage and cookies
  if (data.token) {
    localStorage.setItem('token', data.token);
    console.log('Token saved:', data.token);
    document.cookie = `token=${data.token}; path=/; max-age=3600;`;
    console.log('Token saved in cookie and localStorage');
  } else {
    console.log('Token missing in response');
  }
        setTimeout(() => {
    if (data.role === 'admin') {
      localStorage.setItem('role', data.role); // ✅ save role
      router.push('/admin');
    } else {
      login(data.user);
      router.push('/user/dashboard');
    }
  }, 300); // 0.3 second delay fixes the jump

      } else {
        setError('Invalid email or password.')
      }
    } catch (err) {
      setIsChecking(false)
      setError('Something went wrong. Please try again.')
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
        <h1 className="text-white text-2xl font-semibold mb-2 text-center">
          Login
        </h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Enter your credentials to continue.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Email</label>
            <input
              // type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-slate-600 bg-slate-900 p-2.5 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-slate-600 bg-slate-900 p-2.5 text-white outline-none focus:ring-2 focus:ring-[#01F5FF]"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isChecking}
            className="w-full inline-flex items-center justify-center rounded-md bg-[#01F5FF] px-4 py-2 font-medium text-slate-900 hover:bg-[#00ddee] transition-colors disabled:opacity-60"
          >
            {isChecking ? 'Checking…' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-slate-400 text-sm">
          Don’t have an account?{' '}
          <button
            onClick={() => router.push('/user/signup')}
            className="text-[#01F5FF] hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
