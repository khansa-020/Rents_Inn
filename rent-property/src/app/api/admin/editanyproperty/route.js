// /api/admin/properties.js
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const folderPath = path.join(process.cwd(), 'src', 'propertiesinfo')

// ---------------------- EDIT PROPERTY ----------------------
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')
    const role = request.headers.get('x-role')

    if (!token || role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, location, sector, highlight,discountEnabled, discountPercent, price } = body

    if (!id) return NextResponse.json({ ok: false, error: 'Property ID required' }, { status: 400 })

    const filePath = path.join(folderPath, `property-${id}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ ok: false, error: 'Property not found' }, { status: 404 })
    }

    // Read existing property data
    const propertyData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    // Update fields
    propertyData.name = name ?? propertyData.name
    propertyData.location = location ?? propertyData.location
    propertyData.sector = sector ?? propertyData.sector
    propertyData.highlight = highlight ?? propertyData.highlight
    propertyData.discountEnabled = discountEnabled ?? propertyData.discountEnabled
    propertyData.discountPercent = discountPercent ?? propertyData.discountPercent
    propertyData.price = price ?? propertyData.price
    propertyData.updatedAt = new Date().toISOString()

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(propertyData, null, 2), 'utf8')

    return NextResponse.json({ ok: true, message: 'Property updated successfully', data: propertyData })
  } catch (err) {
    console.error('Edit property error:', err)
    return NextResponse.json({ ok: false, error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
