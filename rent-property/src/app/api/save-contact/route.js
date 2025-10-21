// app/api/contact/route.js
import { promises as fs } from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

export async function POST(req) {
  try {
    const body = await req.json()
    const contact = body?.contact
    if (!contact) return new Response('Missing contact data', { status: 400 })

    // ---------- Save JSON locally (works on cPanel Node/Passenger) ----------
    const dir = path.join(process.cwd(), 'src', 'useinformation')
    await fs.mkdir(dir, { recursive: true })

    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${stamp}_${(contact.name || 'anon').replace(/[^a-z0-9]/gi, '_')}.json`
    const filePath = path.join(dir, filename)

    await fs.writeFile(
      filePath,
      JSON.stringify({ createdAt: new Date(), contact }, null, 2)
    )

    // ---------- Email via cPanel SMTP (support@rentsinn.com) ----------
    const {
      SMTP_HOST = 'mail.rentsinn.com',
      SMTP_USER = 'support@rentsinn.com',
      SMTP_PASS, // REQUIRED (cpanel mailbox password)
      CONTACT_TO = 'rentsinn5@gmail.com',
      FROM_NAME = 'RentsInn',
      SMTP_ALLOW_INVALID_CERTS = 'false', // set to 'true' only if host has a bad cert
    } = process.env

    let mailed = false
    if (!SMTP_PASS) {
      console.warn('[contact] Missing SMTP_PASS; email will be skipped.')
    } else {
      const esc = (s) =>
        String(s ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')

      const html = `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,'Noto Sans',sans-serif">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${esc(contact.name)}</p>
          <p><strong>Email:</strong> ${esc(contact.email)}</p>
          <p><strong>Mobile:</strong> ${esc(contact.mobile)}</p>
          <p><strong>Message:</strong><br/>${esc(contact.message).replace(/\n/g, '<br/>')}</p>
          <hr/>
          <small>Saved file: ${esc(filename)}</small>
        </div>
      `

      // Try 465 (SSL), then fall back to 587 (STARTTLS) if needed
      const sendWith = async (port, secure, extra = {}) => {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port,
          secure, // true for 465, false for 587
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
          subject: `New contact form — ${contact.name || 'Unknown'}`,
          text: [
            `Name: ${contact.name || ''}`,
            `Email: ${contact.email || ''}`,
            `Mobile: ${contact.mobile || ''}`,
            `Message: ${contact.message || ''}`,
            `Saved file: ${filename}`,
          ].join('\n'),
          html,
          replyTo: contact.email || undefined,
        })
      }

      try {
        // 1) Preferred: 465 implicit SSL
        await sendWith(465, true)
        mailed = true
      } catch (e1) {
        console.warn('[contact] SMTP 465 failed, trying 587 STARTTLS…', e1?.message || e1)
        try {
          // 2) Fallback: 587 STARTTLS
          await sendWith(587, false, { requireTLS: true })
          mailed = true
        } catch (e2) {
          console.error('[contact] SMTP 587 also failed:', e2)
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true, saved: filename, mailed }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('[contact] Error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
