// POST { fullName, membershipNumber, berthId, slotDate, slotPeriod?, acknowledged }
//   → { ok, booking } | { ok:false, error, code? }
//
// Server-side guarantees (never trust the client):
//   • member is re-validated against the DB
//   • the acknowledgement checkbox must be true
//   • slot_date must be within [today, today+14d] NZ time (no past slots)
//   • the partial unique index makes the insert atomic — a race loses with 23505
import { Resend } from 'resend'
import {
  json,
  parseBody,
  supabase,
  findActiveMember,
  isWithinWindow,
} from './_supabase.js'

const VALID_BERTHS = new Set([1, 2, 3, 4])

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' })
  try {
    const body = parseBody(event)
    const fullName = String(body.fullName || '').trim()
    const membershipNumber = String(body.membershipNumber || '').trim()
    const berthId = Number(body.berthId)
    const slotDate = String(body.slotDate || '').trim()
    const slotPeriod = String(body.slotPeriod || 'day').trim()
    const acknowledged = body.acknowledged === true

    // ── Guards ──
    if (!acknowledged) {
      return json(400, { ok: false, error: 'You must acknowledge the charge and cancellation terms to book.' })
    }
    if (!VALID_BERTHS.has(berthId)) {
      return json(400, { ok: false, error: 'That work bay does not exist.' })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(slotDate) || !isWithinWindow(slotDate)) {
      return json(400, { ok: false, error: 'Please choose a day within the next two weeks.' })
    }

    // ── Re-validate the member server-side ──
    const member = await findActiveMember(fullName, membershipNumber)
    if (!member) {
      return json(403, { ok: false, error: "We couldn't confirm your membership. Please contact the office." })
    }

    // ── Atomic insert (unique index rejects double-bookings) ──
    const sb = supabase()
    const { data, error } = await sb
      .from('bookings')
      .insert({
        berth_id: berthId,
        slot_date: slotDate,
        slot_period: slotPeriod,
        member_id: member.id,
        member_name: member.full_name,
        membership_number: member.membership_number,
        status: 'confirmed',
      })
      .select('id, berth_id, slot_date, slot_period')
      .single()

    if (error) {
      if (error.code === '23505') {
        return json(409, { ok: false, code: 'taken', error: 'Sorry, that slot was just taken — please pick another.' })
      }
      throw error
    }

    // ── Fetch the bay name for the emails ──
    const { data: berth } = await sb.from('berths').select('name').eq('id', berthId).single()
    const bayName = berth?.name || `Work Bay ${berthId}`

    // ── Notifications (best-effort — booking already succeeded) ──
    await sendEmails({ booking: data, bayName, member }).catch((e) =>
      console.error('email send failed (booking still confirmed)', e),
    )

    return json(200, {
      ok: true,
      booking: { reference: data.id, bay: bayName, date: data.slot_date, period: data.slot_period },
    })
  } catch (e) {
    console.error('create-booking error', e)
    return json(500, { ok: false, error: 'Server error. Your booking was not made — please try again.' })
  }
}

async function sendEmails({ booking, bayName, member }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping emails')
    return
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.EMAIL_FROM || 'Te Atatū Boating Club <onboarding@resend.dev>'
  const office = process.env.EMAIL_OFFICE
  const manager = process.env.EMAIL_MANAGER

  const detailRows = `
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#667">Work bay</td><td><strong>${bayName}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#667">Date</td><td><strong>${booking.slot_date}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#667">Period</td><td>${booking.slot_period}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#667">Member</td><td>${member.full_name} (#${member.membership_number})</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#667">Reference</td><td>${booking.id}</td></tr>
    </table>`

  // 1. Office + manager notification.
  const officeRecipients = [office, manager].filter(Boolean)
  if (officeRecipients.length) {
    await resend.emails.send({
      from,
      to: officeRecipients,
      subject: `New work-bay booking — ${bayName}, ${booking.slot_date}`,
      html: `<h2>New work-bay booking</h2>${detailRows}<p style="color:#667;font-size:12px">Sent automatically by the booking system.</p>`,
    })
  }

  // 2. Member confirmation (only if we have their email on file).
  if (member.email) {
    await resend.emails.send({
      from,
      to: member.email,
      subject: `Your work-bay booking is confirmed — ${bayName}, ${booking.slot_date}`,
      html: `
        <h2>Booking confirmed</h2>
        <p>Thanks ${member.full_name}, your work-bay booking is confirmed:</p>
        ${detailRows}
        <p style="margin-top:16px">${process.env.BOOKING_NOTICE_CHARGE || 'The club will invoice you for work-bay hire at the member day rate. No payment is taken online.'}</p>
        <p>${process.env.BOOKING_NOTICE_CANCELLATION || 'Changes and cancellations must be made by emailing the office.'}</p>`,
    })
  }
}
