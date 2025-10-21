import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key'

// List of protected paths
const protectedPaths = ['/user/dashboard', '/admin']

export function middleware(req) {
  const url = req.nextUrl.pathname
  const token = req.cookies.get('token')?.value

  // Check if path is protected
  const isProtected = protectedPaths.some(path => url.startsWith(path))

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/user/login', req.url))
    }

    try {
      jwt.verify(token, JWT_SECRET)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/user/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*']  // apply middleware on these paths
}
