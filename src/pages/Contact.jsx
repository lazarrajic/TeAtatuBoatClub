import { useState } from 'react'
import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'

export default function Contact() {
  const [sent, setSent] = useState(false)

  // No backend enquiry endpoint yet — opens the visitor's email client as a
  // mailto fallback. TODO: wire to a Netlify Forms or function handler if Dan wants.
  function handleSubmit(e) {
    e.preventDefault()
    const data = new FormData(e.target)
    const subject = encodeURIComponent(`Website enquiry from ${data.get('name')}`)
    const body = encodeURIComponent(`${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`)
    window.location.href = `mailto:${c.contact_office_email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-extrabold md:text-5xl" data-cms="Contact - Hero - Heading">
            {c.contact_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/80" data-cms="Contact - Hero - Sub">{c.contact_hero_sub}</p>
        </div>
      </section>

      <section className="section grid gap-12 md:grid-cols-2">
        {/* Office details */}
        <AnimatedSection>
          <h2 className="text-2xl font-extrabold" data-cms="Contact - Office - Heading">
            {c.contact_office_heading}
          </h2>
          <dl className="mt-6 space-y-4 text-navy/80">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">Email</dt>
              <dd>
                <a href={`mailto:${c.contact_office_email}`} className="hover:text-accent" data-cms="Contact - Office - Email">
                  {c.contact_office_email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">Phone</dt>
              <dd>
                <a href={`tel:${c.contact_office_phone.replace(/\s/g, '')}`} className="hover:text-accent" data-cms="Contact - Office - Phone">
                  {c.contact_office_phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy/40">Address</dt>
              <dd data-cms="Contact - Office - Address">{c.contact_office_address}</dd>
            </div>
          </dl>
          <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10">
            <iframe
              title="Map"
              src={c.contact_map_embed}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </AnimatedSection>

        {/* Enquiry form */}
        <AnimatedSection delay={120}>
          <div className="rounded-2xl bg-sand p-7">
            <h2 className="text-2xl font-extrabold" data-cms="Contact - Form - Heading">
              {c.contact_form_heading}
            </h2>
            {sent ? (
              <p className="mt-6 rounded-xl bg-accent/10 p-4 text-sm text-accent-dark">
                Thanks — your email app should have opened. If not, email us directly at {c.contact_office_email}.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input name="name" required placeholder="Your name" className="w-full rounded-xl border border-navy/15 px-4 py-3" />
                <input name="email" type="email" required placeholder="Your email" className="w-full rounded-xl border border-navy/15 px-4 py-3" />
                <textarea name="message" required rows={5} placeholder="How can we help?" className="w-full rounded-xl border border-navy/15 px-4 py-3" />
                <button type="submit" className="btn-primary w-full" data-cms="Contact - Form - Submit">
                  {c.contact_form_submit}
                </button>
              </form>
            )}
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}
