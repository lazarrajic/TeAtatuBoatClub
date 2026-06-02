function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// Step 4 — confirmation + reference.
export default function SuccessScreen({ booking, onBookAnother }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-accent/30 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-navy">Booking confirmed</h2>
      <p className="mt-2 text-navy/70">
        {booking.bay} on {formatDate(booking.date)} is reserved for you. The office has been notified and will invoice you.
      </p>
      <p className="mt-4 inline-block rounded-lg bg-sand px-4 py-2 text-xs text-navy/60">
        Reference: <span className="font-mono font-semibold text-navy">{booking.reference}</span>
      </p>
      <div className="mt-6">
        <button onClick={onBookAnother} className="btn-outline">Make another booking</button>
      </div>
    </div>
  )
}
