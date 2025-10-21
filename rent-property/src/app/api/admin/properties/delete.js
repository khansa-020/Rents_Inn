import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const jsonDir = path.join(process.cwd(), 'src', 'propertiesinfo')

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing property ID' }, { status: 400 })
    }

    const filePath = path.join(jsonDir, `property-${id}.json`)

    await fs.unlink(filePath)
    return NextResponse.json({ ok: true, message: 'Property deleted successfully' })
  } catch (err) {
    console.error('DELETE Property error:', err)
    return NextResponse.json({ ok: false, error: String(err.message) }, { status: 500 })
  }
}
