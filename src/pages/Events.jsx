import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'

export default function Events() {
  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-extrabold md:text-5xl" data-cms="Events - Hero - Heading">
            {c.events_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/80" data-cms="Events - Hero - Sub">{c.events_hero_sub}</p>
        </div>
      </section>

      <section className="section mx-auto max-w-3xl text-center">
        <AnimatedSection>
          <p className="text-lg text-navy/70" data-cms="Events - Intro - Body">{c.events_intro_body}</p>
        </AnimatedSection>
      </section>

      {/* Events (repeater) */}
      <section className="section pt-0">
        <div data-cms-repeater="Events - List" className="grid gap-6 md:grid-cols-3">
          {c.events.map((e, i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent" data-cms-field="date">{e.date}</span>
              <h3 className="mt-2 text-xl font-bold" data-cms-field="title">{e.title}</h3>
              <p className="mt-2 text-sm text-navy/70" data-cms-field="desc">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facebook note */}
      <section className="bg-sand">
        <div className="section text-center">
          <AnimatedSection>
            <p className="text-lg font-semibold text-navy" data-cms="Events - Facebook - Note">{c.events_facebook_note}</p>
            <a href={c.socials[0]?.url} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5">
              Follow on Facebook
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
