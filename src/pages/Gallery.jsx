import { useState, useMemo } from 'react'
import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'
import WaveDivider from '../components/WaveDivider.jsx'
import Lightbox from '../components/Lightbox.jsx'

export default function Gallery() {
  const [active, setActive] = useState(null)
  const srcs = useMemo(() => c.gallery_photos.map((p) => p.image), [])

  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-semibold md:text-5xl" data-cms="Gallery - Hero - Heading">
            {c.gallery_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/75" data-cms="Gallery - Hero - Sub">{c.gallery_hero_sub}</p>
        </div>
      </section>
      <WaveDivider />

      <section className="section">
        {/* Repeater (not data-cms-gallery) so the seeded photos render from
            content.js and stay add/edit/removable in the CMS. */}
        <div
          data-cms-repeater="Gallery - Photos"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
        >
          {c.gallery_photos.map((item, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-label="View photo"
              onClick={() => setActive(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i) } }}
              className="group cursor-zoom-in overflow-hidden rounded-xl bg-navy/5 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <img
                src={item.image}
                data-cms-field="image"
                alt=""
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      <Lightbox items={srcs} index={active} setIndex={setActive} />
    </>
  )
}
