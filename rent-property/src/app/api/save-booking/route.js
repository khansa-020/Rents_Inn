import { promises as fs } from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

export async function POST(req) {
  try {
    const body = await req.json()
    const booking = body?.booking
    if (!booking) return new Response('Missing booking data', { status: 400 })

    // ---------- Save JSON locally ----------
    const dir = path.join(process.cwd(), 'src', 'userdata')
    await fs.mkdir(dir, { recursive: true })

    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${stamp}_${(booking.name || 'guest').replace(/[^a-z0-9]/gi, '_')}.json`
    const filePath = path.join(dir, filename)

    await fs.writeFile(filePath, JSON.stringify({ createdAt: new Date(), booking }, null, 2))

    // ---------- Email via SMTP ----------
    const {
      SMTP_HOST,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_TO,
      FROM_NAME = 'RentsInn',
      SMTP_ALLOW_INVALID_CERTS = 'false',
    } = process.env

    let mailed = false
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
      console.warn('[booking] Missing SMTP config in env, email skipped.')
    } else {
      const esc = (s) =>
        String(s ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')

      const ci = booking.checkIn || {}
      const co = booking.checkOut || {}
      const guests = booking.guests ?? ''
      const name = booking.name || ''
      const mobile = booking.mobile || ''

      const text = [
        `New Booking Submission`,
        `----------------------`,
        `Name: ${name}`,
        `Mobile: ${mobile}`,
        `Guests: ${guests}`,
        `Check-In: ${ci.date || ''} ${ci.time || ''}`,
        `Check-Out: ${co.date || ''} ${co.time || ''}`,
        ``,
        `Saved file: ${filename}`,
      ].join('\n')

      const html = `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,'Noto Sans',sans-serif">
          <h2>New Booking Submission</h2>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Mobile:</strong> ${esc(mobile)}</p>
          <p><strong>Guests:</strong> ${esc(guests)}</p>
          <p><strong>Check-In:</strong> ${esc(ci.date || '')} ${esc(ci.time || '')}</p>
          <p><strong>Check-Out:</strong> ${esc(co.date || '')} ${esc(co.time || '')}</p>
          <hr/>
          <small>Saved file: ${esc(filename)}</small>
        </div>
      `

      const sendWith = async (port, secure, extra = {}) => {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port,
          secure,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
          connectionTimeout: 15000,
          greetingTimeout: 15000,
          socketTimeout: 20000,
          ...(SMTP_ALLOW_INVALID_CERTS === 'true'
            ? { tls: { rejectUnauthorized: false } }
            : {}),
          ...extra,
        })

        return transporter.sendMail({
          from: `"${FROM_NAME}" <${SMTP_USER}>`,
          to: CONTACT_TO,
          subject: `New booking — ${name || 'Guest'}`,
          text,
          html,
        })
      }

      try {
        await sendWith(465, true) // SSL first
        mailed = true
      } catch (e1) {
        console.warn('[booking] SMTP 465 failed, trying 587 STARTTLS…', e1?.message || e1)
        try {
          await sendWith(587, false, { requireTLS: true }) // fallback
          mailed = true
        } catch (e2) {
          console.error('[booking] SMTP 587 also failed:', e2)
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true, saved: filename, mailed }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('[booking] Error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
