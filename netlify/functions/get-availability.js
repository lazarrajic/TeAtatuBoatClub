// GET → { ok, today, windowDays, days: [...], berths: [...], taken: { 'berthId|date|period': true } }
// Returns the booking window and all confirmed bookings within it so the UI can
// render the availability grid. No member data is exposed.
import { json, supabase, nzToday, addDays, BOOKING_WINDOW_DAYS } from './_supabase.js'

export const handler = async () => {
  try {
    const today = nzToday()
    const max = addDays(today, BOOKING_WINDOW_DAYS)

    const sb = supabase()
    const [{ data: berths, error: bErr }, { data: bookings, error: kErr }] = await Promise.all([
      sb.from('berths').select('id, name, description').order('id'),
      sb
        .from('bookings')
        .select('berth_id, slot_date, slot_period')
        .eq('status', 'confirmed')
        .gte('slot_date', today)
        .lte('slot_date', max),
    ])
    if (bErr) throw bErr
    if (kErr) throw kErr

    // Build the list of bookable dates (today .. today+window inclusive).
    const days = []
    for (let i = 0; i <= BOOKING_WINDOW_DAYS; i++) days.push(addDays(today, i))

    // Map of taken slots for O(1) lookup in the UI.
    const taken = {}
    for (const b of bookings || []) {
      taken[`${b.berth_id}|${b.slot_date}|${b.slot_period}`] = true
    }

    return json(200, { ok: true, today, windowDays: BOOKING_WINDOW_DAYS, days, berths: berths || [], taken })
  } catch (e) {
    console.error('get-availability error', e)
    return json(500, { ok: false, error: 'Could not load availability. Please try again.' })
  }
}
