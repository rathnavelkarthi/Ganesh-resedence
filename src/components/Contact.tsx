import { motion } from 'motion/react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ocean-900)] font-bold mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Have questions or need assistance with your booking? Our team is here to help you plan the perfect stay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <motion.div 
            className="flex flex-col gap-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[var(--color-sand-100)] flex items-center justify-center shrink-0">
                <MapPin size={28} className="text-[var(--color-ocean-600)]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600 leading-relaxed">
                  No. 2, Sai Baba Koil Street<br/>
                  Chinna Kalapet<br/>
                  Puducherry 605014
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[var(--color-sand-100)] flex items-center justify-center shrink-0">
                <Phone size={28} className="text-[var(--color-ocean-600)]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600 leading-relaxed">
                  <a href="tel:04132656555" className="hover:text-[var(--color-ocean-600)] transition-colors block mb-1">0413 265 6555</a>
                  <a href="tel:8248981269" className="hover:text-[var(--color-ocean-600)] transition-colors block">8248981269</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[var(--color-sand-100)] flex items-center justify-center shrink-0">
                <Mail size={28} className="text-[var(--color-ocean-600)]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 leading-relaxed">
                  <a href="mailto:theganeshresidencypdy@gmail.com" className="hover:text-[var(--color-ocean-600)] transition-colors">
                    theganeshresidencypdy@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-4">
              <a 
                href="https://wa.me/918248981269" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg text-lg"
              >
                <MessageCircle size={24} />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Enquiry Form */}
          <motion.div 
            className="bg-[var(--color-sand-50)] rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-serif text-3xl font-bold text-gray-900 mb-8">Send an Enquiry</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all bg-white" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all bg-white" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all bg-white appearance-none">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                  <option>5+ Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-ocean-500)] focus:border-transparent outline-none transition-all bg-white resize-none" placeholder="Any special requests?"></textarea>
              </div>

              <button type="button" className="w-full bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg text-lg">
                Submit Enquiry
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
