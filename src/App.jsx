import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Facilities from './pages/Facilities.jsx'
import Pricing from './pages/Pricing.jsx'
import Membership from './pages/Membership.jsx'
import Restaurant from './pages/Restaurant.jsx'
import Venue from './pages/Venue.jsx'
import Events from './pages/Events.jsx'
import Rules from './pages/Rules.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import Booking from './pages/Booking.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/venue-hire" element={<Venue />} />
          <Route path="/events" element={<Events />} />
          <Route path="/club-rules" element={<Rules />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
