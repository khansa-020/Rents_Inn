import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const jsonDir = path.join(process.cwd(), 'src', 'propertiesinfo')

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

        // ✅ If userEmail is provided → filter
        // ✅ Otherwise → return all properties
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

    // 📸 Save images
    const imageFiles = formData.getAll('images')
    const imageUrls = []

    for (const file of imageFiles) {
  if (typeof file === 'string') {
    // It's already a URL, keep it
    imageUrls.push(file)
  } else if (file && typeof file.arrayBuffer === 'function') {
    // It's a new uploaded file
    const bytes = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name}`
    const filePathUpload = path.join(uploadDir, fileName)
    await fs.writeFile(filePathUpload, bytes)
    imageUrls.push(`/uploads/${fileName}`)
  }
}


    // 📹 Video (optional)
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

    // 🖼️ Poster (optional)
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
      price,
      mediaType: formData.get('mediaType'),
      highlight: formData.get('highlight') === 'true',
      discountEnabled: formData.get('discountEnabled') === 'true',
      discountPercent: Number(formData.get('discountPercent')) || 0,
      // priceRegular: formData.get('priceRegular'),
      // price: formData.get('price'),
      // priceDiscounted: formData.get('priceDiscounted') || formData.get('price') || '',
      priceDiscounted: formData.get('priceDiscounted'),
      priceNote: formData.get('priceNote'),
      images: imageUrls,
      video: videoUrl,
      poster: posterUrl, // 🆕 added poster URL
      createdAt: new Date().toISOString(),
    }

    // 💾 Save JSON file
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













// import { NextResponse } from 'next/server'
// import fs from 'fs/promises'
// import path from 'path'

// export const runtime = 'nodejs'
// export const dynamic = 'force-dynamic'

// async function readJsonDir(dirPath) {
//   try {
//     const entries = await fs.readdir(dirPath, { withFileTypes: true })
//     const jsonFiles = entries.filter(e =>
//       e.isFile() && e.name.toLowerCase().endsWith('.json')
//     )
//     const reads = jsonFiles.map(async (e) => {
//       const file = await fs.readFile(path.join(dirPath, e.name), 'utf8')
//       return JSON.parse(file)
//     })
//     return await Promise.all(reads)
//   } catch (err) {
//     if (err.code === 'ENOENT') return [] // folder missing → empty list
//     throw err
//   }
// }

// export async function GET() {
//   try {
//     const dir = path.join(process.cwd(), 'src', 'propertiesinfo')
//     const data = await readJsonDir(dir)
//     return NextResponse.json({ ok: true, data })
//   } catch (err) {
//     console.error('Properties API error:', err)
//     return NextResponse.json(
//       { ok: false, error: String(err?.message || err) },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request) {
//   try {
//     const body = await request.json()

//     if (!body.name || !body.location || !body.description) {
//       return NextResponse.json(
//         { ok: false, error: 'Missing required fields: name, location, or description' },
//         { status: 400 }
//       )
//     }

//     const id = Date.now()
//     const newProperty = {
//       ...body,
//       id,
//       createdAt: new Date().toISOString()
//     }

//     const dir = path.join(process.cwd(), 'src', 'propertiesinfo')
//     const filePath = path.join(dir, `property-${id}.json`)

//     await fs.mkdir(dir, { recursive: true })
//     await fs.writeFile(filePath, JSON.stringify(newProperty, null, 2), 'utf8')

//     return NextResponse.json({ ok: true, data: newProperty })
//   } catch (err) {
//     console.error('Properties API error:', err)
//     return NextResponse.json(
//       { ok: false, error: String(err?.message || err) },
//       { status: 500 }
//     )
//   }
// }

