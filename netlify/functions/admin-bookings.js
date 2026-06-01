// POST { password } → { ok, bookings: [...] }
// Lists upcoming confirmed bookings for the office. Shared-password gated.
import { json, parseBody, supabase, nzToday } from './_supabase.js'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' })
  const { password } = parseBody(event)
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return json(401, { ok: false, error: 'Incorrect password.' })
  }
  try {
    const { data, error } = await supabase()
      .from('bookings')
      .select('id, berth_id, slot_date, slot_period, member_name, membership_number, created_at')
      .eq('status', 'confirmed')
      .gte('slot_date', nzToday())
      .order('slot_date', { ascending: true })
      .order('berth_id', { ascending: true })
    if (error) throw error
    return json(200, { ok: true, bookings: data || [] })
  } catch (e) {
    console.error('admin-bookings error', e)
    return json(500, { ok: false, error: 'Server error.' })
  }
}
