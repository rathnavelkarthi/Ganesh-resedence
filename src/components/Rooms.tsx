import { Link } from 'react-router-dom';
import { Users, Wind, Wifi, Bath } from 'lucide-react';
import { motion } from 'motion/react';

const rooms = [
  {
    id: 'executive-double-ac',
    name: 'Executive Double AC',
    description: 'Perfect for couples or solo travelers seeking comfort with modern amenities and a cozy atmosphere.',
    capacity: '2 Guests',
    image: 'https://picsum.photos/seed/room1/1470/980',
  },
  {
    id: 'triple-room-ac',
    name: 'Triple Room AC',
    description: 'Spacious accommodation ideal for small families or groups of three, featuring premium bedding.',
    capacity: '3 Guests',
    image: 'https://picsum.photos/seed/room2/1470/980',
  },
  {
    id: 'four-occupancy-room',
    name: 'Four Occupancy Room',
    description: 'Generously sized room designed for families of four, offering ample space to relax after a beach day.',
    capacity: '4 Guests',
    image: 'https://picsum.photos/seed/room3/1470/980',
  },
  {
    id: 'six-bed-ac-room',
    name: 'Six Bed AC Room',
    description: 'The ultimate group getaway room. Comfortably sleeps six with multiple beds and expansive living area.',
    capacity: '6 Guests',
    image: 'https://picsum.photos/seed/room4/1470/980',
  },
];

export default function Rooms() {
  return (
    <section id="rooms" className="py-24 bg-[var(--color-sand-50)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ocean-900)] font-bold mb-6">
            Our Accommodations
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Discover handpicked stays that blend luxury and practicality. From intimate double rooms to spacious family suites, find your perfect retreat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {rooms.map((room, index) => (
            <motion.div 
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Image Container */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Users size={16} className="text-[var(--color-ocean-600)]" />
                  <span className="text-sm font-medium text-gray-800">{room.capacity}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">{room.name}</h3>
                <p className="text-gray-600 mb-6 flex-grow line-clamp-2">{room.description}</p>
                
                {/* Amenities Icons */}
                <div className="flex items-center gap-6 mb-8 text-gray-500">
                  <div className="flex items-center gap-2" title="Air Conditioning">
                    <Wind size={20} className="text-[var(--color-ocean-500)]" />
                    <span className="text-sm hidden sm:inline">AC</span>
                  </div>
                  <div className="flex items-center gap-2" title="Free WiFi">
                    <Wifi size={20} className="text-[var(--color-ocean-500)]" />
                    <span className="text-sm hidden sm:inline">WiFi</span>
                  </div>
                  <div className="flex items-center gap-2" title="Attached Bathroom">
                    <Bath size={20} className="text-[var(--color-ocean-500)]" />
                    <span className="text-sm hidden sm:inline">Bath</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <Link 
                    to={`/rooms/${room.id}`}
                    className="flex-1 py-3 px-4 border border-[var(--color-ocean-200)] text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] text-center rounded-xl font-medium transition-colors"
                  >
                    View Room
                  </Link>
                  <Link 
                    to="/book"
                    className="flex-1 py-3 px-4 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white text-center rounded-xl font-medium transition-colors shadow-sm"
                  >
                    Check Availability
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
