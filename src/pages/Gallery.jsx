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
        {/* Repeater (not data-cms-gallery) so the seeded photos render from
            content.js and stay add/edit/removable in the CMS. */}
        <div
          data-cms-repeater="Gallery - Photos"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
        >
          {c.gallery_photos.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-navy/5">
              <img
                src={item.image}
                data-cms-field="image"
                alt=""
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
