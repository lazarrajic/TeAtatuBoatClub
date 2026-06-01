import { useState } from 'react'
import { useCmsContent } from '../hooks/useCmsContent.js'
import { createBooking } from './api.js'

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Step 3 — confirm. Shows the LIVE member rate + notices fetched from the CMS
// at runtime (falling back to content.js values passed in `fallback`), and gates
// the confirm button behind a required acknowledgement checkbox.
export default function ConfirmScreen({ member, selection, fallback, onBack, onSuccess }) {
  // Map content.js defaults → the CMS keys the office actually edits.
  const { content } = useCmsContent({
    'Pricing - Work Bay - Member Booked Rate': fallback.rate,
    'Pricing - Work Bay - Unit': fallback.unit,
    'Booking - Notice - Charge': fallback.chargeNotice,
    'Booking - Notice - Cancellation': fallback.cancelNotice,
    'Contact - Office - Email': fallback.officeEmail,
  })

  const rate = content['Pricing - Work Bay - Member Booked Rate']
  const unit = content['Pricing - Work Bay - Unit']
  const chargeNotice = content['Booking - Notice - Charge']
  const cancelNotice = content['Booking - Notice - Cancellation']
  const officeEmail = content['Contact - Office - Email']

  const [ack, setAck] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    setError('')
    setBusy(true)
    try {
      const res = await createBooking({
        fullName: member.fullName,
        membershipNumber: member.membershipNumber,
        berthId: selection.berthId,
        slotDate: selection.slotDate,
        slotPeriod: selection.period,
        acknowledged: ack,
      })
      if (res.ok) onSuccess(res.booking)
      else {
        setError(res.error || 'Could not complete the booking.')
        // If the slot was taken in a race, send the member back to re-pick.
        if (res.code === 'taken') setTimeout(onBack, 1800)
      }
    } catch {
      setError('Could not reach the booking service. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-navy/10 bg-white p-7 shadow-sm">
      <button onClick={onBack} className="mb-4 text-sm font-semibold text-accent hover:underline">
        ← Back to availability
      </button>

      <h2 className="text-xl font-bold text-navy">Confirm your booking</h2>

      <dl className="mt-5 divide-y divide-navy/5 rounded-xl bg-sand p-4 text-sm">
        <div className="flex justify-between py-2"><dt className="text-navy/60">Work bay</dt><dd className="font-semibold">{selection.berthName}</dd></div>
        <div className="flex justify-between py-2"><dt className="text-navy/60">Date</dt><dd className="font-semibold">{formatDate(selection.slotDate)}</dd></div>
        <div className="flex justify-between py-2"><dt className="text-navy/60">Member</dt><dd className="font-semibold">{member.fullName}</dd></div>
        <div className="flex justify-between py-2"><dt className="text-navy/60">Member rate</dt><dd className="font-semibold text-accent-dark">{rate} {unit}</dd></div>
      </dl>

      <div className="mt-5 space-y-3 text-sm text-navy/70">
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-amber-900">{chargeNotice}</p>
        <p className="rounded-lg bg-navy/5 px-4 py-3">
          {cancelNotice}{' '}
          <a href={`mailto:${officeEmail}`} className="font-semibold text-accent hover:underline">{officeEmail}</a>
        </p>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-navy">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-navy/30 text-accent focus:ring-accent"
        />
        <span>I understand I will be charged and that changes/cancellations go through the office.</span>
      </label>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={!ack || busy}
        className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? 'Confirming…' : 'Confirm booking'}
      </button>
    </div>
  )
}
