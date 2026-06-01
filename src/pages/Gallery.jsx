import c from '../../content.js'
import AnimatedSection from '../components/AnimatedSection.jsx'

export default function Gallery() {
  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-extrabold md:text-5xl" data-cms="Gallery - Hero - Heading">
            {c.gallery_hero_heading}
          </h1>
          <p className="mt-4 text-lg text-white/80" data-cms="Gallery - Hero - Sub">{c.gallery_hero_sub}</p>
        </div>
      </section>

      <section className="section">
        <AnimatedSection>
          {/* CMS-managed gallery. Seeded with the 65th Anniversary set; the office
              can add albums and photos from the dashboard. The string/url guard
              keeps it rendering both from content.js and after the CMS snippet. */}
          <div
            data-cms-gallery="Gallery - Photos"
            className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>img]:mb-4"
          >
            {c.gallery_photos.map((item, i) => (
              <img
                key={i}
                src={typeof item === 'string' ? item : item.url}
                alt=""
                loading="lazy"
                className="w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}
