// /api/auth/all-users.js
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'userinfo', 'users.json')

export async function GET(request) {
  try {
    // ✅ Admin check
    const token = request.headers.get('authorization')
    const role = request.headers.get('x-role') // pass role from frontend

    if (!token || role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ ok: false, error: 'User file missing' }, { status: 500 })
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    // Flatten profile data for frontend table
    const users = data.map(u => ({
      email: u.email,
      role: u.role,
      name: u.name,
      mobile: u.mobile,
      address: u.address,
      bio: u.bio,
      image: u.image,
      createdAt: u.createdAt || new Date().toISOString()
    }))

    return NextResponse.json({ ok: true, data: users })
  } catch (err) {
    console.error('Get all users API error:', err)
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 })
  }
}





export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')
    const role = request.headers.get('x-role') // pass role from frontend
    const adminEmail = request.headers.get('x-email') // pass admin email from frontend

    if (!token || role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 })
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ ok: false, error: 'User file missing' }, { status: 500 })
    }

    // Prevent admin from deleting themselves
    if (email === adminEmail) {
      return NextResponse.json({ ok: false, error: 'Admins cannot delete themselves' }, { status: 403 })
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const userIndex = data.findIndex(u => u.email === email)

    if (userIndex === -1) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    // Remove user
    data.splice(userIndex, 1)

    // Save updated file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')

    return NextResponse.json({ ok: true, message: 'User deleted successfully' })
  } catch (err) {
    console.error('Delete user API error:', err)
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
