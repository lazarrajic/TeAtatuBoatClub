// Thin wrappers around the booking Netlify Functions.
// In local `vite dev` these 404 (functions aren't served) — use `netlify dev`
// to exercise the full flow. Callers handle the !ok / network-error cases.
const BASE = '/.netlify/functions'

async function post(name, body) {
  const res = await fetch(`${BASE}/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  return res.json()
}

export function validateMember(fullName, membershipNumber) {
  return post('validate-member', { fullName, membershipNumber })
}

export async function getAvailability() {
  const res = await fetch(`${BASE}/get-availability`)
  return res.json()
}

export function createBooking(payload) {
  return post('create-booking', payload)
}

export function adminBookings(password) {
  return post('admin-bookings', { password })
}

export function adminCancel(password, bookingId) {
  return post('admin-cancel', { password, bookingId })
}
