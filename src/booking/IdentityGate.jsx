import { useState } from 'react'
import { validateMember } from './api.js'

// Step 1 — confirm the person is a current member (name + membership number).
// This is a convenience gate; create-booking re-validates server-side.
export default function IdentityGate({ onValidated }) {
  const [fullName, setFullName] = useState('')
  const [membershipNumber, setMembershipNumber] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await validateMember(fullName.trim(), membershipNumber.trim())
      if (res.ok) {
        onValidated({ fullName: fullName.trim(), membershipNumber: membershipNumber.trim() })
      } else {
        setError(res.error || "We couldn't match those details.")
      }
    } catch {
      setError('Could not reach the booking service. Please try again shortly.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-navy/10 bg-white p-7 shadow-sm">
      <h2 className="text-xl font-bold text-navy">Confirm your membership</h2>
      <p className="mt-1 text-sm text-navy/60">
        Bookings are for current club members. Enter your details to continue.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-navy">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-xl border border-navy/15 px-4 py-3"
            placeholder="As it appears on your membership"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-navy">Membership number</label>
          <input
            value={membershipNumber}
            onChange={(e) => setMembershipNumber(e.target.value)}
            required
            inputMode="numeric"
            className="w-full rounded-xl border border-navy/15 px-4 py-3"
            placeholder="e.g. 1234"
          />
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'Checking…' : 'Continue'}
        </button>
      </form>
    </div>
  )
}
