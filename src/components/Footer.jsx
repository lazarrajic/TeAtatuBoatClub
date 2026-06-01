import { Link } from 'react-router-dom'
import c from '../../content.js'

// Minimal inline social icons keyed by platform name.
const SOCIAL_ICONS = {
  facebook: (
    <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0114 6h2.5v3H15c-.7 0-1 .3-1 1v2h2.5l-.5 3H14v7A10 10 0 0022 12z" />
  ),
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.68.8.9 1.4.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2a3.8 3.8 0 01-.9 1.4c-.4.42-.8.68-1.4.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42a3.8 3.8 0 01-1.4-.9 3.8 3.8 0 01-.9-1.4c-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 4.9a4.9 4.9 0 100 9.8 4.9 4.9 0 000-9.8zm0 8.1a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm6.2-8.3a1.15 1.15 0 11-2.3 0 1.15 1.15 0 012.3 0z" />
  ),
}

function SocialIcon({ platform }) {
  const path = SOCIAL_ICONS[platform?.toLowerCase()]
  if (!path) return null
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {path}
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="text-lg font-extrabold text-white" data-cms="Footer - Brand - Name">
            {c.company_name}
          </p>
          <p className="mt-3 max-w-xs text-sm" data-cms="Footer - Brand - Tagline">
            {c.footer_tagline}
          </p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Boating</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/facilities" className="hover:text-white">Facilities</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/booking" className="hover:text-white">Book a Work Bay</Link></li>
            <li><Link to="/membership" className="hover:text-white">Membership</Link></li>
            <li><Link to="/club-rules" className="hover:text-white">Club Rules</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">The Club</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">Our Story</Link></li>
            <li><Link to="/restaurant" className="hover:text-white">Restaurant & Bar</Link></li>
            <li><Link to="/venue-hire" className="hover:text-white">Venue Hire</Link></li>
            <li><Link to="/events" className="hover:text-white">What's On</Link></li>
            <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Contact</p>
          <ul className="space-y-2 text-sm">
            <li><a href={`mailto:${c.email}`} className="hover:text-white" data-cms="Footer - Contact - Email">{c.email}</a></li>
            <li><a href={`tel:${c.phone.replace(/\s/g, '')}`} className="hover:text-white" data-cms="Footer - Contact - Phone">{c.phone}</a></li>
            <li data-cms="Footer - Contact - Address">{c.address}</li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Follow</p>
          <ul className="flex gap-3" data-cms-repeater="Footer - Socials">
            {c.socials.map((social, i) => (
              <li key={i}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
                  aria-label={social.platform}
                >
                  <SocialIcon platform={social.platform} />
                  <span hidden data-cms-field="platform">{social.platform}</span>
                  <span hidden data-cms-field="url">{social.url}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {c.company_name}. All rights reserved.
      </div>
    </footer>
  )
}
