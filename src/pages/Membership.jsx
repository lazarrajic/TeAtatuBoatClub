import { Link } from 'react-router-dom'
import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'

export default function Membership() {
  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-extrabold md:text-5xl" data-cms="Membership - Hero - Heading">
            {c.membership_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/80" data-cms="Membership - Hero - Sub">{c.membership_hero_sub}</p>
        </div>
      </section>

      <section className="section mx-auto max-w-3xl text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="Membership - Intro - Heading">
            {c.membership_intro_heading}
          </h2>
          <p className="mt-4 text-navy/70" data-cms="Membership - Intro - Body">{c.membership_intro_body}</p>
        </AnimatedSection>

        {/* Fees */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-accent bg-accent/5 p-6">
            <p className="text-4xl font-extrabold text-navy">
              <span data-cms="Membership - Family - Fee">{c.membership_family_fee}</span>{' '}
              <span className="text-base font-semibold text-navy/50" data-cms="Membership - Family - Unit">{c.membership_family_unit}</span>
            </p>
            <p className="mt-2 text-sm text-navy/60" data-cms="Membership - Family - Note">{c.membership_family_note}</p>
          </div>
          <div className="rounded-2xl border border-navy/10 p-6">
            <p className="text-4xl font-extrabold text-navy">
              <span data-cms="Membership - Nomination - Fee">{c.membership_nomination_fee}</span>
            </p>
            <p className="mt-2 text-sm text-navy/60" data-cms="Membership - Nomination - Note">{c.membership_nomination_note}</p>
          </div>
        </div>
      </section>

      {/* How to join (repeater) */}
      <section className="section pt-0 mx-auto max-w-4xl">
        <AnimatedSection className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold md:text-3xl" data-cms="Membership - How - Heading">
            {c.membership_how_heading}
          </h2>
        </AnimatedSection>
        <div data-cms-repeater="Membership - Steps" className="grid gap-5 sm:grid-cols-2">
          {c.membership_steps.map((s, i) => (
            <div key={i} className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold" data-cms-field="step">{s.step}</h3>
              <p className="mt-1 text-sm text-navy/70" data-cms-field="desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="section">
          <div data-cms-repeater="Membership - Benefits" className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {c.membership_benefits.map((b, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="text-lg font-bold" data-cms-field="title">{b.title}</h3>
                <p className="mt-2 text-sm text-navy/70" data-cms-field="desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="section text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="Membership - CTA - Heading">
              {c.membership_cta_heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80" data-cms="Membership - CTA - Body">
              {c.membership_cta_body}
            </p>
            <Link to="/contact" className="btn-primary mt-8" data-cms="Membership - CTA - Button">
              {c.membership_cta_button}
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
