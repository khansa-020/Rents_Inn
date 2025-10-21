import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { Abhaya_Libre, Fresca, Yaldevi } from 'next/font/google'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function readJsonDir(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const jsonFiles = entries.filter(e =>
      e.isFile() && e.name.toLowerCase().endsWith('.json')
    )
    const reads = jsonFiles.map(async (e) => {
      const file = await fs.readFile(path.join(dirPath, e.name), 'utf8')
      return JSON.parse(file)
    })
    return await Promise.all(reads)
  } catch (err) {
    if (err.code === 'ENOENT') return [] // folder missing → empty list
    throw err
  }
}

export async function GET() {
  try {
    
    const dir = path.join(process.cwd(), 'src', 'useinformation')
    const data = await readJsonDir(dir)
    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error('Messages API error:', err)
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    )
  }
}