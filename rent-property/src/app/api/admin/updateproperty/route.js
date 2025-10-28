export async function PUT(request) {
  try {
    const formData = await request.formData()
    const id = formData.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing property ID' }, { status: 400 })
    }

    const filePath = path.join(jsonDir, `property-${id}.json`)
    await fs.access(filePath)
    const oldData = JSON.parse(await fs.readFile(filePath, 'utf8'))

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    // ✅ Always declare before use
    let imageUrls = []
    let videoUrl = oldData.video || null
    let posterUrl = oldData.poster || null

    // 🖼️ Handle images
    const imageFiles = formData.getAll('images') || []
    for (const file of imageFiles) {
      if (typeof file === 'string') imageUrls.push(file)
      else if (file && typeof file.arrayBuffer === 'function') {
        const bytes = Buffer.from(await file.arrayBuffer())
        const name = `${Date.now()}-${file.name}`
        await fs.writeFile(path.join(uploadDir, name), bytes)
        imageUrls.push(`/uploads/${name}`)
      }
    }
    if (imageUrls.length === 0) imageUrls = oldData.images || []

    // 🎥 Handle video
    const videoFile = formData.get('video')
    if (videoFile && typeof videoFile.arrayBuffer === 'function') {
      const bytes = Buffer.from(await videoFile.arrayBuffer())
      const name = `${Date.now()}-${videoFile.name}`
      await fs.writeFile(path.join(uploadDir, name), bytes)
      videoUrl = `/uploads/${name}`
    } else if (typeof videoFile === 'string') {
      videoUrl = videoFile
    }

    // 🖼️ Handle poster
    const posterFile = formData.get('poster')
    if (posterFile && typeof posterFile.arrayBuffer === 'function') {
      const bytes = Buffer.from(await posterFile.arrayBuffer())
      const name = `${Date.now()}-${posterFile.name}`
      await fs.writeFile(path.join(uploadDir, name), bytes)
      posterUrl = `/uploads/${name}`
    } else if (typeof posterFile === 'string') {
      posterUrl = posterFile
    }

    const updatedData = {
      ...oldData,
      name: formData.get('name') || oldData.name,
      images: imageUrls,
      // video: videoUrl,
      // poster: posterUrl,
      updatedAt: new Date().toISOString(),
    }

    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8')
    return NextResponse.json({ ok: true, data: updatedData })
  } catch (err) {
    console.error('PUT Properties API error:', err)
    return NextResponse.json({ ok: false, error: err.message || String(err) }, { status: 500 })
  }
}
