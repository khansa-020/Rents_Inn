import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const jsonDir = path.join(process.cwd(), 'src', 'propertiesinfo')

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updatedData } = body

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing property ID' }, { status: 400 })
    }

    const filePath = path.join(jsonDir, `property-${id}.json`)

    // check if file exists
    const existing = JSON.parse(await fs.readFile(filePath, 'utf8'))

    // merge old data with updated fields
    const newData = { ...existing, ...updatedData }

    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8')

    return NextResponse.json({ ok: true, data: newData })
  } catch (err) {
    console.error('PUT Property error:', err)
    return NextResponse.json({ ok: false, error: String(err.message) }, { status: 500 })
  }
}
