import { Link } from 'react-router-dom'
import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'

export default function Facilities() {
  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-extrabold md:text-5xl" data-cms="Facilities - Hero - Heading">
            {c.facilities_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/80" data-cms="Facilities - Hero - Sub">{c.facilities_hero_sub}</p>
        </div>
      </section>

      {/* Work bays (repeater) — display names only; booking logic keys off fixed bay IDs */}
      <section className="section">
        <AnimatedSection className="mb-10 max-w-2xl">
          <span className="eyebrow" data-cms="Facilities - Bays - Label">{c.facilities_bays_label}</span>
          <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="Facilities - Bays - Heading">
            {c.facilities_bays_heading}
          </h2>
          <p className="mt-4 text-navy/70" data-cms="Facilities - Bays - Body">{c.facilities_bays_body}</p>
        </AnimatedSection>
        <div data-cms-repeater="Facilities - Work Bays" className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {c.work_bays.map((bay, i) => (
            <div key={i} className="rounded-2xl border border-navy/10 bg-white p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold" data-cms-field="name">{bay.name}</h3>
              <p className="mt-1 text-sm text-navy/60" data-cms-field="desc">{bay.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/booking" className="btn-primary">Book a Work Bay</Link>
        </div>
      </section>

      {/* Other facilities (repeater) */}
      <section className="bg-sand">
        <div className="section">
          <AnimatedSection className="mb-10">
            <span className="eyebrow" data-cms="Facilities - Other - Label">{c.facilities_other_label}</span>
            <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="Facilities - Other - Heading">
              {c.facilities_other_heading}
            </h2>
          </AnimatedSection>
          <div data-cms-repeater="Facilities - Other" className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {c.facilities_other.map((f, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold" data-cms-field="title">{f.title}</h3>
                <p className="mt-2 text-sm text-navy/70" data-cms-field="desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery teaser — full gallery lives on its own page */}
      <section className="section">
        <AnimatedSection className="rounded-2xl bg-navy px-6 py-12 text-center text-white">
          <h2 className="text-2xl font-extrabold md:text-3xl" data-cms="Facilities - Gallery - Heading">
            {c.facilities_gallery_heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80" data-cms="Facilities - Gallery - Sub">
            {c.facilities_gallery_sub}
          </p>
          <Link to="/gallery" className="btn-primary mt-6">View the Gallery</Link>
        </AnimatedSection>
      </section>
    </>
  )
}
