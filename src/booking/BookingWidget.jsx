import { useState } from 'react'
import IdentityGate from './IdentityGate.jsx'
import AvailabilityGrid from './AvailabilityGrid.jsx'
import ConfirmScreen from './ConfirmScreen.jsx'
import SuccessScreen from './SuccessScreen.jsx'

// Dynamic booking application — a simple state machine over four steps.
// IMPORTANT: this component and its children carry NO data-cms* attributes.
// `fallback` holds content.js defaults (notices, office email, rate) which the
// ConfirmScreen overrides with live CMS values at runtime.
export default function BookingWidget({ fallback }) {
  const [step, setStep] = useState('gate') // gate | grid | confirm | success
  const [member, setMember] = useState(null)
  const [selections, setSelections] = useState(null) // array of selected slots
  const [booking, setBooking] = useState(null)

  return (
    <div>
      {step === 'gate' && (
        <IdentityGate
          onValidated={(m) => {
            setMember(m)
            setStep('grid')
          }}
        />
      )}

      {step === 'grid' && member && (
        <AvailabilityGrid
          member={member}
          onSelect={(sels) => {
            setSelections(sels)
            setStep('confirm')
          }}
        />
      )}

      {step === 'confirm' && member && selections && (
        <ConfirmScreen
          member={member}
          selections={selections}
          fallback={fallback}
          onBack={() => setStep('grid')}
          onSuccess={(b) => {
            setBooking(b)
            setStep('success')
          }}
        />
      )}

      {step === 'success' && booking && (
        <SuccessScreen
          booking={booking}
          onBookAnother={() => {
            setSelections(null)
            setBooking(null)
            setStep('grid')
          }}
        />
      )}
    </div>
  )
}
