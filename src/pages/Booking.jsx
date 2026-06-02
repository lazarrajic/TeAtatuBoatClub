import c from '../../content.js'
import BookingWidget from '../booking/BookingWidget.jsx'
import WaveDivider from '../components/WaveDivider.jsx'

// The ONLY CMS-editable content on this page is the static framing text below
// (heading, "how it works", and the two notices). Everything inside
// <BookingWidget> is dynamic application UI and carries NO data-cms attributes.
//
// The content.js values are passed into the widget as fallback defaults; the
// widget also fetches the live versions from the CMS API at runtime.
export default function Booking() {
  return (
    <>
      <section className="bg-navy py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-semibold md:text-5xl" data-cms="Booking - Hero - Heading">
            {c.booking_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/75" data-cms="Booking - Hero - Sub">{c.booking_hero_sub}</p>
        </div>
      </section>
      <WaveDivider />

      <section className="section mx-auto max-w-5xl">
        <div className="mb-10 rounded-2xl border border-navy/10 bg-sand p-6">
          <h2 className="text-xl font-bold" data-cms="Booking - How - Heading">{c.booking_how_heading}</h2>
          <p className="mt-2 text-sm text-navy/70" data-cms="Booking - How - Body">{c.booking_how_body}</p>
        </div>

        {/* ── Hidden static notice fields so the CMS can discover + edit them. ──
            The widget reads the live versions at runtime; these elements exist
            purely so the scanner registers the keys. */}
        <div hidden>
          <p data-cms="Booking - Notice - Charge">{c.booking_notice_charge}</p>
          <p data-cms="Booking - Notice - Cancellation">{c.booking_notice_cancellation}</p>
        </div>

        {/* Dynamic booking application — NO data-cms inside. */}
        <BookingWidget
          fallback={{
            chargeNotice: c.booking_notice_charge,
            cancelNotice: c.booking_notice_cancellation,
            officeEmail: c.contact_office_email,
            rate: c.pricing_workbay_member_booked_rate,
            unit: c.pricing_workbay_unit,
          }}
        />
      </section>
    </>
  )
}
