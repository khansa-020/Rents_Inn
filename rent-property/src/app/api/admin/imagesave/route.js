import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name}`

    // ✅ Check file type
    const isVideo = file.type.startsWith('video/')
    const folder = isVideo ? 'videos' : 'images'

    // ✅ Save inside src/uploads/images or src/uploads/videos
    const uploadDir = path.join(process.cwd(), 'src', 'uploads', folder)
    fs.mkdirSync(uploadDir, { recursive: true })

    // ✅ Save file
    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, buffer)

    // ✅ If you need public URL, switch to 'public/uploads'
    const fileUrl = `/uploads/${folder}/${fileName}`

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
