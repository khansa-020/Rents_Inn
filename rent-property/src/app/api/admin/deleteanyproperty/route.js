import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const folderPath = path.join(process.cwd(), 'src', 'propertiesinfo')

export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')
    const role = request.headers.get('x-role')

    if (!token || role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()
    if (!id) return NextResponse.json({ ok: false, error: 'Property ID required' }, { status: 400 })

    const filePath = path.join(folderPath, `property-${id}.json`)

    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath)
      return NextResponse.json({ ok: false, error: 'Property file not found', path: filePath }, { status: 404 })
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({ ok: true, message: 'Property deleted successfully' })
  } catch (err) {
    console.error('Delete property error:', err)
    return NextResponse.json({ ok: false, error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
