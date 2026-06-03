import { useState, useMemo } from 'react'
import c from '../../content.js'
import WaveDivider from '../components/WaveDivider.jsx'
import Lightbox from '../components/Lightbox.jsx'

// Resolve a gallery item to an image src — tolerates the content.js seed shape
// ({ image }), the CMS gallery shape ({ url, album }), or a plain string.
const itemSrc = (item) => (typeof item === 'string' ? item : item.url || item.image)

export default function Gallery() {
  const [active, setActive] = useState(null)
  const srcs = useMemo(() => c.gallery_photos.map(itemSrc), [])

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
        {/* Dynamic gallery — the office manages photos + albums from the CMS.
            Seeded from content.js (gallery_photos) on first scan. This site
            renders the grid with React (no CMS snippet), so the Lightbox stays
            wired; data-cms-gallery is purely the scanner's discovery marker. */}
        <div
          data-cms-gallery="Gallery - Photos"
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
                src={itemSrc(item)}
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
