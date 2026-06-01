// POST { fullName, membershipNumber } → { ok, member? }
// Confirms the person is a current member before showing the booking flow.
// NOTE: this is a convenience gate only — create-booking re-validates server-side.
import { json, parseBody, findActiveMember } from './_supabase.js'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' })
  try {
    const { fullName, membershipNumber } = parseBody(event)
    const member = await findActiveMember(fullName, membershipNumber)
    if (!member) {
      return json(200, {
        ok: false,
        error: "We couldn't match those details. Please check your membership number, or contact the office.",
      })
    }
    // Return only what the UI needs — not the email address.
    return json(200, { ok: true, member: { full_name: member.full_name, membership_number: member.membership_number } })
  } catch (e) {
    console.error('validate-member error', e)
    return json(500, { ok: false, error: 'Server error. Please try again or contact the office.' })
  }
}
