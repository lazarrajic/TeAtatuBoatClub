import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import c from '../../content.js'

// Top-level nav. Some items are dropdown groups to keep the bar uncluttered
// across the club's 10 pages.
const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Boating',
    children: [
      { label: 'Facilities', to: '/facilities' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Book a Work Bay', to: '/booking' },
    ],
  },
  { label: 'Membership', to: '/membership' },
  {
    label: 'Club',
    children: [
      { label: 'Restaurant & Bar', to: '/restaurant' },
      { label: 'Venue Hire', to: '/venue-hire' },
      { label: "What's On", to: '/events' },
      { label: 'Gallery', to: '/gallery' },
      { label: 'Club Rules', to: '/club-rules' },
    ],
  },
  { label: 'Contact', to: '/contact' },
]

function Dropdown({ item }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 text-sm font-semibold text-navy transition-colors hover:text-accent">
        {item.label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
        <div className="overflow-hidden rounded-xl border border-navy/10 bg-white py-2 shadow-lg">
          {item.children.map((ch) => (
            <NavLink
              key={ch.to}
              to={ch.to}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-sand ${
                  isActive ? 'text-accent' : 'text-navy'
                }`
              }
            >
              {ch.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // The mobile menu is a SIBLING of the blurred <header>, never a child.
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-navy">
            <img src={c.logo} data-cms="Nav - Brand - Logo" alt={c.company_name} className="h-11 w-auto" />
            <span className="hidden text-base leading-tight sm:inline">{c.company_name}</span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <Dropdown key={item.label} item={item} />
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors hover:text-accent ${
                      isActive ? 'text-accent' : 'text-navy'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
            <Link to="/booking" className="btn-primary px-5 py-2.5 text-sm" data-cms="Nav - Header - CTA">
              {c.nav_cta}
            </Link>
          </div>

          <button
            className="lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile menu — full-viewport sibling overlay */}
      {open && (
        <div className="fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-navy text-white lg:hidden">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-lg font-extrabold">{c.company_name}</span>
            <button aria-label="Close menu" onClick={() => setOpen(false)}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-1 px-5 pb-10 pt-4">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-white/10 py-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">{item.label}</p>
                  {item.children.map((ch) => (
                    <NavLink key={ch.to} to={ch.to} className="block py-2 text-lg font-semibold">
                      {ch.label}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} className="border-b border-white/10 py-3 text-xl font-semibold">
                  {item.label}
                </NavLink>
              ),
            )}
            <Link to="/booking" className="btn-primary mt-6">
              {c.nav_cta}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
