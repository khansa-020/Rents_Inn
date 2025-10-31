import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const jsonDir = path.join(process.cwd(), 'src', 'specialproperties')

/* --------------------------- ✅ GET: Read properties -------------------------- */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')

    const files = await fs.readdir(jsonDir)
    const properties = []

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(jsonDir, file), 'utf8')
        const data = JSON.parse(content)

        if (!userEmail || userEmail === 'all' || data.email === userEmail) {
          properties.push(data)
        }

      }
    }

    return NextResponse.json({ ok: true, data: properties })
  } catch (err) {
    console.error('GET Properties API error:', err)
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}


/* --------------------------- ✅ POST: Create property -------------------------- */
export async function POST(request) {
  try {
    const formData = await request.formData()

    const name = formData.get('name')
    const contact = formData.get('contact')
    const email = formData.get('email')
    const location = formData.get('location')
    const sector = formData.get('sector')
    const description = formData.get('description')
    const priceType = formData.get('priceType')

    if (!name || !location || !sector || !description) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: name, location, or description' },
        { status: 400 }
      )
    }

    const imageFiles = formData.getAll('images')
    const imageUrls = []

    if (imageFiles && imageFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })

      for (const file of imageFiles) {
        const bytes = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-${file.name}`
        const filePath = path.join(uploadDir, fileName)
        await fs.writeFile(filePath, bytes)
        imageUrls.push(`/uploads/${fileName}`)
      }
    }

    const videoFile = formData.get('video')
    let videoUrl = null
    if (videoFile && typeof videoFile !== 'string') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })
      const bytes = Buffer.from(await videoFile.arrayBuffer())
      const fileName = `${Date.now()}-${videoFile.name}`
      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, bytes)
      videoUrl = `/uploads/${fileName}`
    }

    const posterFile = formData.get('poster')
    let posterUrl = null
    if (posterFile && typeof posterFile !== 'string') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })
      const bytes = Buffer.from(await posterFile.arrayBuffer())
      const fileName = `${Date.now()}-${posterFile.name}`
      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, bytes)
      posterUrl = `/uploads/${fileName}`
    }

    const id = Date.now()
    const newProperty = {
      id,
      name,
      contact,
      email,
      location,
      sector,
      description,
      priceType,
      mediaType: formData.get('mediaType'),
      highlight: formData.get('highlight') === 'true',
      discountEnabled: formData.get('discountEnabled') === 'true',
      discountPercent: Number(formData.get('discountPercent')) || 0,
      priceRegular: formData.get('priceRegular'),
      price: formData.get('price'),
      priceDiscounted: formData.get('priceDiscounted'),
      priceNote: formData.get('priceNote'),
      images: imageUrls,
      video: videoUrl,
      poster: posterUrl,
      createdAt: new Date().toISOString(),
    }

    /* ✅ Ensure only ONE special property exists */
    if (newProperty.highlight === true) {
      const files = await fs.readdir(jsonDir)

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(jsonDir, file)
          const content = await fs.readFile(filePath, 'utf8')
          const existing = JSON.parse(content)

          if (existing.highlight === true) {
            existing.highlight = false
            await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8')
          }
        }
      }
    }

    await fs.mkdir(jsonDir, { recursive: true })
    const filePath = path.join(jsonDir, `property-${id}.json`)
    await fs.writeFile(filePath, JSON.stringify(newProperty, null, 2), 'utf8')

    return NextResponse.json({ ok: true, data: newProperty })
  } catch (err) {
    console.error('POST Properties API error:', err)
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    )
  }
}
