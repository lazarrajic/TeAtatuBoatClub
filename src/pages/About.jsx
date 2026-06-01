import { Link } from 'react-router-dom'
import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'

export default function About() {
  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-extrabold md:text-5xl" data-cms="About - Hero - Heading">
            {c.about_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/80" data-cms="About - Hero - Sub">{c.about_hero_sub}</p>
        </div>
      </section>

      {/* Story */}
      <section className="section grid items-center gap-12 md:grid-cols-2">
        <AnimatedSection>
          <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="About - Story - Heading">
            {c.about_story_heading}
          </h2>
          <p className="mt-4 text-navy/70" data-cms="About - Story - Body">{c.about_story_body}</p>
        </AnimatedSection>
        <AnimatedSection delay={120}>
          <img
            src={c.about_story_image}
            data-cms="About - Story - Image"
            alt="The club"
            className="aspect-[4/3] w-full rounded-2xl bg-navy/5 object-cover"
          />
        </AnimatedSection>
      </section>

      {/* Growth */}
      <section className="bg-sand">
        <div className="section mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <p className="text-lg text-navy/70" data-cms="About - Growth - Body">{c.about_growth_body}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Committee (repeater) */}
      <section className="bg-sand">
        <div className="section">
          <AnimatedSection className="mb-10 text-center">
            <span className="eyebrow" data-cms="About - Committee - Label">{c.about_committee_label}</span>
            <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="About - Committee - Heading">
              {c.about_committee_heading}
            </h2>
          </AnimatedSection>
          <div data-cms-repeater="About - Committee" className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {c.committee.map((m, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="text-lg font-bold" data-cms-field="name">{m.name}</h3>
                <p className="text-sm font-semibold text-accent" data-cms-field="role">{m.role}</p>
                <a href={`mailto:${m.email}`} className="mt-2 block text-sm text-navy/60 hover:text-accent" data-cms-field="email">
                  {m.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="section text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="About - CTA - Heading">
              {c.about_cta_heading}
            </h2>
            <Link to="/contact" className="btn-primary mt-8" data-cms="About - CTA - Button">
              {c.about_cta_button}
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
