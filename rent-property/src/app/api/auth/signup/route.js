import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'


export async function POST(req) {
  try {
    const { email, password } = await req.json()

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

    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return NextResponse.json({ ok: false, error: 'User already exists' }, { status: 400 })
    }

    // Decide role based on email
    const role = email === 'admin@example.com' ? 'admin' : 'user'

    const newUser = { email, password, role }
    users.push(newUser)

    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8')

    return NextResponse.json({ ok: true, message: 'User created successfully' })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
