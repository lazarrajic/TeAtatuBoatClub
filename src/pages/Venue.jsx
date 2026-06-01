import { Link } from 'react-router-dom'
import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'

export default function Venue() {
  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-extrabold md:text-5xl" data-cms="Venue - Hero - Heading">
            {c.venue_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/80" data-cms="Venue - Hero - Sub">{c.venue_hero_sub}</p>
        </div>
      </section>

      <section className="section mx-auto max-w-3xl text-center">
        <AnimatedSection>
          <p className="text-lg text-navy/70" data-cms="Venue - Intro - Body">{c.venue_intro_body}</p>
        </AnimatedSection>
      </section>

      {/* Spaces (repeater) */}
      <section className="section pt-0">
        <div data-cms-repeater="Venue - Spaces" className="grid gap-6 md:grid-cols-2">
          {c.venues.map((v, i) => (
            <div key={i} className="rounded-2xl border border-navy/10 bg-white p-7 shadow-sm">
              <h3 className="text-2xl font-extrabold" data-cms-field="name">{v.name}</h3>
              <p className="mt-1 text-sm font-semibold text-accent" data-cms-field="capacity">{v.capacity}</p>
              <p className="mt-3 text-navy/70" data-cms-field="desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terms (repeater) */}
      <section className="bg-sand">
        <div className="section mx-auto max-w-3xl">
          <AnimatedSection className="mb-6">
            <h2 className="text-2xl font-extrabold" data-cms="Venue - Terms - Heading">{c.venue_terms_heading}</h2>
          </AnimatedSection>
          <div data-cms-repeater="Venue - Terms" className="space-y-3">
            {c.venue_terms.map((t, i) => (
              <div key={i} className="rounded-xl bg-white p-5 shadow-sm">
                <p className="font-semibold text-navy" data-cms-field="term">{t.term}</p>
                <p className="mt-1 text-sm text-navy/70" data-cms-field="detail">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="section text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="Venue - CTA - Heading">
              {c.venue_cta_heading}
            </h2>
            <Link to="/contact" className="btn-primary mt-8" data-cms="Venue - CTA - Button">
              {c.venue_cta_button}
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
