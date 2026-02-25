import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-ocean-900)] text-white/80 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-serif text-2xl text-white mb-6">Ganesh Residency</h2>
            <p className="text-sm leading-relaxed mb-6">
              Experience beachfront comfort near Pondicherry University. Your perfect getaway for family vacations and corporate retreats.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/#rooms" className="hover:text-white transition-colors">Rooms</Link></li>
              <li><Link to="/#amenities" className="hover:text-white transition-colors">Amenities</Link></li>
              <li><Link to="/#gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Information</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/policies" className="hover:text-white transition-colors">Policies</Link></li>
              <li><span className="block text-white/60 mt-4 text-xs">Check-in: 12:00 PM</span></li>
              <li><span className="block text-white/60 text-xs">Check-out: 11:00 AM</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
            <address className="not-italic text-sm space-y-4">
              <p>No. 2, Sai Baba Koil Street<br/>Chinna Kalapet<br/>Puducherry 605014</p>
              <p>
                <a href="tel:04132656555" className="hover:text-white transition-colors">0413 265 6555</a><br/>
                <a href="tel:8248981269" className="hover:text-white transition-colors">8248981269</a>
              </p>
              <p>
                <a href="mailto:theganeshresidencypdy@gmail.com" className="hover:text-white transition-colors">theganeshresidencypdy@gmail.com</a>
              </p>
            </address>
          </div>

        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-sm text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Ganesh Residency. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="text-white/50 text-xs">Designed for Direct Bookings</p>
            <Link to="/admin/login" className="text-white/50 hover:text-white text-xs transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
