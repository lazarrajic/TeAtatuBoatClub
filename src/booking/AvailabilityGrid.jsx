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
// Tap any number of free cells to select them, then continue to confirm.
export default function AvailabilityGrid({ member, onSelect }) {
  const [state, setState] = useState({ status: 'loading' })
  const [selected, setSelected] = useState({}) // key `${berthId}|${iso}` -> selection object

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
  const selectedList = Object.values(selected).sort((a, b) => a.slotDate.localeCompare(b.slotDate))
  const count = selectedList.length

  const toggle = (berth, iso) => {
    const key = `${berth.id}|${iso}`
    setSelected((prev) => {
      const next = { ...prev }
      if (next[key]) delete next[key]
      else next[key] = { berthId: berth.id, berthName: berth.name, slotDate: iso, period: PERIOD }
      return next
    })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy/70">
          Signed in as <strong>{member.fullName}</strong>. Tap any free days to select — book one or several.
        </p>
        <div className="flex items-center gap-4 text-xs text-navy/60">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent/20 ring-1 ring-accent/40" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gold ring-1 ring-gold-dark" /> Selected</span>
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
                  const isSelected = !!selected[`${berth.id}|${iso}`]
                  return (
                    <td key={iso} className="px-1.5 py-1.5 text-center">
                      {isTaken ? (
                        <span className="block rounded-md bg-navy/10 px-2 py-2 text-[11px] text-navy/40">Taken</span>
                      ) : (
                        <button
                          onClick={() => toggle(berth, iso)}
                          aria-pressed={isSelected}
                          className={
                            isSelected
                              ? 'block w-full rounded-md bg-gold px-2 py-2 text-[11px] font-bold text-navy ring-1 ring-inset ring-gold-dark transition'
                              : 'block w-full rounded-md bg-accent/15 px-2 py-2 text-[11px] font-semibold text-accent-dark ring-1 ring-inset ring-accent/30 transition hover:bg-accent hover:text-white'
                          }
                        >
                          {isSelected ? '✓' : 'Book'}
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

      {/* Selection bar */}
      <div className="sticky bottom-4 z-20 mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
          <p className="text-sm text-navy/70">
            {count === 0 ? (
              'No days selected yet.'
            ) : (
              <>
                <strong className="text-navy">{count}</strong> day{count !== 1 ? 's' : ''} selected
                <span className="ml-2 text-navy/45">
                  {selectedList.slice(0, 3).map((s) => `${s.berthName.replace('Work Bay', 'Bay')} ${s.slotDate.slice(5)}`).join(', ')}
                  {count > 3 ? ` +${count - 3} more` : ''}
                </span>
              </>
            )}
          </p>
          <button
            onClick={() => onSelect(selectedList)}
            disabled={count === 0}
            className="btn-primary px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue{count > 0 ? ` (${count})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
