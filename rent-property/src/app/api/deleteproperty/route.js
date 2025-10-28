import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'properties.json')

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    const data = await fs.readFile(filePath, 'utf8')
    let properties = JSON.parse(data)

    const filtered = properties.filter((p) => p.id !== id)
    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2))

    return NextResponse.json({ ok: true, message: 'Property deleted successfully!' })
  } catch (err) {
    console.error('DELETE error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
