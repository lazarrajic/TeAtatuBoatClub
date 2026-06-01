// POST { password, bookingId } → { ok }
// Marks a booking cancelled, which frees the slot (the unique index only covers
// status='confirmed'). Shared-password gated.
import { json, parseBody, supabase } from './_supabase.js'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' })
  const { password, bookingId } = parseBody(event)
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return json(401, { ok: false, error: 'Incorrect password.' })
  }
  if (!bookingId) return json(400, { ok: false, error: 'Missing bookingId.' })
  try {
    const { error } = await supabase()
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
    if (error) throw error
    return json(200, { ok: true })
  } catch (e) {
    console.error('admin-cancel error', e)
    return json(500, { ok: false, error: 'Server error.' })
  }
}
