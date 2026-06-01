import { Link } from 'react-router-dom'
import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'

export default function Restaurant() {
  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-extrabold md:text-5xl" data-cms="Restaurant - Hero - Heading">
            {c.restaurant_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/80" data-cms="Restaurant - Hero - Sub">{c.restaurant_hero_sub}</p>
        </div>
      </section>

      <section className="section mx-auto max-w-3xl text-center">
        <AnimatedSection>
          <p className="text-lg text-navy/70" data-cms="Restaurant - Intro - Body">{c.restaurant_intro_body}</p>
        </AnimatedSection>
      </section>

      {/* Hours */}
      <section className="bg-sand">
        <div className="section grid gap-8 md:grid-cols-2">
          <AnimatedSection>
            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <h2 className="text-xl font-extrabold" data-cms="Restaurant - Club Rooms - Heading">
                {c.restaurant_clubrooms_heading}
              </h2>
              <ul data-cms-repeater="Restaurant - Club Rooms Hours" className="mt-4 divide-y divide-navy/5">
                {c.clubrooms_hours.map((row, i) => (
                  <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium text-navy" data-cms-field="days">{row.days}</span>
                    <span className="text-navy/70" data-cms-field="time">{row.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={120}>
            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <h2 className="text-xl font-extrabold" data-cms="Restaurant - Kitchen - Heading">
                {c.restaurant_kitchen_heading}
              </h2>
              <p className="mt-1 text-sm text-navy/60" data-cms="Restaurant - Kitchen - Sub">{c.restaurant_kitchen_sub}</p>
              <ul data-cms-repeater="Restaurant - Kitchen Hours" className="mt-4 divide-y divide-navy/5">
                {c.kitchen_hours.map((row, i) => (
                  <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium text-navy" data-cms-field="days">{row.days}</span>
                    <span className="text-navy/70" data-cms-field="time">{row.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Menus */}
      <section className="section">
        <AnimatedSection className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="Restaurant - Menus - Heading">
            {c.restaurant_menu_heading}
          </h2>
        </AnimatedSection>
        <div className="grid gap-6 sm:grid-cols-2">
          <img
            src={c.restaurant_menu_dine_image}
            data-cms="Restaurant - Menus - Dine Image"
            alt="Dining menu"
            className="w-full rounded-2xl border border-navy/10 bg-navy/5 object-cover"
          />
          <img
            src={c.restaurant_menu_catering_image}
            data-cms="Restaurant - Menus - Catering Image"
            alt="Catering menu"
            className="w-full rounded-2xl border border-navy/10 bg-navy/5 object-cover"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="section text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-extrabold md:text-4xl" data-cms="Restaurant - CTA - Heading">
              {c.restaurant_cta_heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80" data-cms="Restaurant - CTA - Body">
              {c.restaurant_cta_body}
            </p>
            <Link to="/contact" className="btn-primary mt-8" data-cms="Restaurant - CTA - Button">
              {c.restaurant_cta_button}
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
