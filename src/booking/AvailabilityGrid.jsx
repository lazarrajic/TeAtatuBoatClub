import { useEffect, useState } from 'react'
import { getAvailability } from './api.js'

const PERIOD = 'day' // current slot granularity (see schema.sql / Part C #1)

function formatDay(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return {
    weekday: d.toLocaleDateString('en-NZ', { weekday: 'short' }),
    day: d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' }),
  }
}

// Step 2 — visual availability: rows = work bays, columns = next 14 days.
export default function AvailabilityGrid({ member, onSelect }) {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let active = true
    getAvailability()
      .then((data) => {
        if (!active) return
        if (data.ok) setState({ status: 'ready', ...data })
        else setState({ status: 'error', error: data.error || 'Could not load availability.' })
      })
      .catch(() => active && setState({ status: 'error', error: 'Could not reach the booking service.' }))
    return () => {
      active = false
    }
  }, [])

  if (state.status === 'loading') {
    return <p className="py-10 text-center text-navy/50">Loading availability…</p>
  }
  if (state.status === 'error') {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center text-red-700">
        <p>{state.error}</p>
        <button onClick={() => window.location.reload()} className="btn-outline mt-4">
          Retry
        </button>
      </div>
    )
  }

  const { days, berths, taken } = state

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy/70">
          Signed in as <strong>{member.fullName}</strong>. Pick a free bay and day below.
        </p>
        <div className="flex items-center gap-4 text-xs text-navy/60">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent/20 ring-1 ring-accent/40" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-navy/10" /> Taken</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-navy/10">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-sand px-3 py-3 text-left font-semibold text-navy">Bay</th>
              {days.map((iso) => {
                const f = formatDay(iso)
                return (
                  <th key={iso} className="bg-sand px-2 py-2 text-center font-medium text-navy/70">
                    <div className="text-[11px] uppercase">{f.weekday}</div>
                    <div className="text-xs">{f.day}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {berths.map((berth) => (
              <tr key={berth.id} className="border-t border-navy/5">
                <th className="sticky left-0 z-10 bg-white px-3 py-3 text-left font-semibold text-navy">
                  {berth.name}
                </th>
                {days.map((iso) => {
                  const isTaken = taken[`${berth.id}|${iso}|${PERIOD}`]
                  return (
                    <td key={iso} className="px-1.5 py-1.5 text-center">
                      {isTaken ? (
                        <span className="block rounded-md bg-navy/10 px-2 py-2 text-[11px] text-navy/40">Taken</span>
                      ) : (
                        <button
                          onClick={() => onSelect({ berthId: berth.id, berthName: berth.name, slotDate: iso, period: PERIOD })}
                          className="block w-full rounded-md bg-accent/15 px-2 py-2 text-[11px] font-semibold text-accent-dark ring-1 ring-inset ring-accent/30 transition hover:bg-accent hover:text-white"
                        >
                          Book
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
