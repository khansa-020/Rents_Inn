import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import jwt from 'jsonwebtoken'   // ✅ Add this

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key'   // ⚠️ Use .env in production

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 })
    }

    const usersDir = path.join(process.cwd(), 'src', 'userinfo')
    await fs.mkdir(usersDir, { recursive: true })
    const filePath = path.join(usersDir, 'users.json')

    let users = []
    try {
      const fileData = await fs.readFile(filePath, 'utf8')
      users = JSON.parse(fileData)
    } catch (e) {
      users = []
    }

    const foundUser = users.find(u => u.email === email)
    if (!foundUser) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    if (foundUser.password !== password) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // ✅ Create JWT Token
    const token = jwt.sign(
      { email: foundUser.email, role: foundUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }   // token valid for 1 hour
    )

    return NextResponse.json({
      ok: true,
      role: foundUser.role,
      user: {
        email: foundUser.email,
        role: foundUser.role,
      },
      token,   // ✅ send token to frontend
      message: 'Login successful'
    })

  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
