import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'userinfo', 'users.json')

export async function PUT(request) {
  try {
    const body = await request.json()
    const { email, profile } = body

    if (!email || !profile)
      return NextResponse.json({ ok: false, error: 'Missing data' }, { status: 400 })

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const index = data.findIndex(u => u.email === email)

    if (index === -1)
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })

    data[index].profile = { ...data[index].profile, ...profile }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json({ ok: true, user: data[index] })
  } catch (error) {
    console.error('API ERROR:', error)
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 })
  }
}


/* ---------------------------- ✅ GET: Get user profile --------------------------- */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 })
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ ok: false, error: 'User file missing' }, { status: 500 })
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const user = data.find(u => u.email === email)

    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, user })
  } catch (error) {
    console.error('API ERROR:', error)
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 })
  }
}