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
      mediaType: formData.get('mediaType'),
      highlight: formData.get('highlight') === 'true',
      discountEnabled: formData.get('discountEnabled') === 'true',
      discountPercent: Number(formData.get('discountPercent')) || 0,
      priceRegular: formData.get('priceRegular'),
      // price: formData.get('price'),
      priceDiscounted: formData.get('priceDiscounted') || formData.get('price') || '',
      // priceDiscounted: formData.get('priceDiscounted'),
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


/* --------------------------- ✅ PUT: Update property -------------------------- */
/* --------------------------- ✅ PUT: Update property -------------------------- */
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id'); // property id required
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing property ID' }, { status: 400 });
    }

    const filePath = path.join(jsonDir, `property-${id}.json`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ ok: false, error: 'Property not found' }, { status: 404 });
    }

    // Read old data
    const oldData = JSON.parse(await fs.readFile(filePath, 'utf8'));

    // Handle normal fields
    const updatedFields = {
      name: formData.get('name') || oldData.name,
      contact: formData.get('contact') || oldData.contact,
      email: formData.get('email') || oldData.email,
      location: formData.get('location') || oldData.location,
      sector: formData.get('sector') || oldData.sector,
      description: formData.get('description') || oldData.description,
      priceType: formData.get('priceType') || oldData.priceType,
      priceRegular: formData.get('priceRegular') || oldData.priceRegular,
      priceDiscounted: formData.get('priceDiscounted') || oldData.priceDiscounted,
      priceNote: formData.get('priceNote') || oldData.priceNote,
      highlight: formData.get('highlight') === 'true' || oldData.highlight,
      discountEnabled: formData.get('discountEnabled') === 'true' || oldData.discountEnabled,
      discountPercent: Number(formData.get('discountPercent')) || oldData.discountPercent,
      updatedAt: new Date().toISOString(),
    };

    /* --------------------------- 📸 Handle Images --------------------------- */
    const imageFiles = formData.getAll('images') || [];
    let imageUrls = oldData.images || [];

    if (imageFiles.length > 0) {
      imageUrls = [];
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      for (const file of imageFiles) {
        if (typeof file === 'string') {
          imageUrls.push(file);
        } else if (file && typeof file.arrayBuffer === 'function') {
          const bytes = Buffer.from(await file.arrayBuffer());
          const fileName = `${Date.now()}-${file.name}`;
          const filePathUpload = path.join(uploadDir, fileName);
          await fs.writeFile(filePathUpload, bytes);
          imageUrls.push(`/uploads/${fileName}`);
        }
      }
    }

    /* --------------------------- 🎥 Handle Video --------------------------- */
    const videoFile = formData.get('video');
    let videoUrl = oldData.video || null;

    if (videoFile && typeof videoFile !== 'string') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const bytes = Buffer.from(await videoFile.arrayBuffer());
      const fileName = `${Date.now()}-${videoFile.name}`;
      const filePathUpload = path.join(uploadDir, fileName);
      await fs.writeFile(filePathUpload, bytes);
      videoUrl = `/uploads/${fileName}`;
    } else if (typeof videoFile === 'string') {
      videoUrl = videoFile; // if coming as existing string
    }

    /* --------------------------- 🖼️ Handle Poster --------------------------- */
    const posterFile = formData.get('poster');
    let posterUrl = oldData.poster || null;

    if (posterFile && typeof posterFile !== 'string') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const bytes = Buffer.from(await posterFile.arrayBuffer());
      const fileName = `${Date.now()}-${posterFile.name}`;
      const filePathUpload = path.join(uploadDir, fileName);
      await fs.writeFile(filePathUpload, bytes);
      posterUrl = `/uploads/${fileName}`;
    } else if (typeof posterFile === 'string') {
      posterUrl = posterFile;
    }

    /* --------------------------- 💾 Merge & Save --------------------------- */
    const updatedData = {
      ...oldData,
      ...updatedFields,
      images: imageUrls,
      video: videoUrl,
      poster: posterUrl,
    };

    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

    return NextResponse.json({ ok: true, data: updatedData });
  } catch (err) {
    console.error('PUT Properties API error:', err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}






/* --------------------------- ✅ DELETE: Delete property -------------------------- */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    // Optionally support FormData DELETE requests
    let propertyId = id
    if (!propertyId) {
      try {
        const formData = await request.formData()
        propertyId = formData.get('id')
      } catch (_) {
        // ignore if no formData
      }
    }

    if (!propertyId) {
      return NextResponse.json(
        { ok: false, error: 'Missing property ID' },
        { status: 400 }
      )
    }

    const filePath = path.join(jsonDir, `property-${propertyId}.json`)

    // Check existence
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Read before delete (to clean up media if desired)
    const oldData = JSON.parse(await fs.readFile(filePath, 'utf8'))

    // Delete JSON file
    await fs.unlink(filePath)

    /* ------------------ Optional: delete uploaded media ------------------ */
    const deleteFileSafe = async (relativePath) => {
      if (!relativePath) return
      try {
        const absPath = path.join(process.cwd(), 'public', relativePath)
        await fs.unlink(absPath)
      } catch {
        // ignore missing files
      }
    }

    // 🖼️ Delete images/videos/posters if exist
    if (Array.isArray(oldData.images)) {
      for (const img of oldData.images) await deleteFileSafe(img)
    }
    if (oldData.video) await deleteFileSafe(oldData.video)
    if (oldData.poster) await deleteFileSafe(oldData.poster)

    return NextResponse.json({
      ok: true,
      message: `Property ${propertyId} deleted successfully`
    })
  } catch (err) {
    console.error('DELETE Properties API error:', err)
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

