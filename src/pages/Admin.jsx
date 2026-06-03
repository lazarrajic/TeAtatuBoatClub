import { useState } from 'react'
import { adminBookings, adminCancel } from '../booking/api.js'

// Minimal office view of upcoming bookings. Shared-password gated (checked
// server-side). NOT part of the CMS — no data-cms attributes. Linked nowhere
// in the nav; the office bookmarks /admin.
function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load(pw) {
    setError('')
    setBusy(true)
    try {
      const res = await adminBookings(pw)
      if (res.ok) {
        setBookings(res.bookings)
        setAuthed(true)
      } else {
        setError(res.error || 'Could not load bookings.')
      }
    } catch {
      setError('Could not reach the booking service.')
    } finally {
      setBusy(false)
    }
  }

  async function cancel(id) {
    if (!window.confirm('Cancel this booking? This frees the slot.')) return
    const res = await adminCancel(password, id)
    if (res.ok) setBookings((bs) => bs.filter((b) => b.id !== id))
    else setError(res.error || 'Could not cancel.')
  }

  if (!authed) {
    return (
      <section className="section mx-auto max-w-sm">
        <h1 className="text-2xl font-extrabold text-navy">Office — Bookings</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            load(password)
          }}
          className="mt-6 space-y-4"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl border border-navy/15 px-4 py-3"
          />
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? 'Checking…' : 'View bookings'}
          </button>
        </form>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy">Upcoming bookings</h1>
        <button onClick={() => load(password)} disabled={busy} className="btn-outline px-4 py-2 text-sm disabled:opacity-60">
          {busy ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {bookings.length === 0 ? (
        <p className="text-navy/50">No upcoming bookings.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy/10">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-sand text-left text-navy/60">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Bay</th>
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Member #</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-navy/5">
                  <td className="px-4 py-3 font-medium">{formatDate(b.slot_date)}</td>
                  <td className="px-4 py-3">Bay {b.berth_id}</td>
                  <td className="px-4 py-3">{b.member_name}</td>
                  <td className="px-4 py-3">{b.membership_number}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => cancel(b.id)} className="text-sm font-semibold text-red-600 hover:underline">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
