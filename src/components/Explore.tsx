import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

const attractions = [
  {
    name: 'Auroville',
    distance: '15 mins',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850f0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'The experimental township dedicated to human unity.',
  },
  {
    name: 'French Quarter',
    distance: '20 mins',
    image: 'https://images.unsplash.com/photo-1620802051772-5064e2e26017?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'Stroll through charming streets with colonial architecture.',
  },
  {
    name: 'Sri Aurobindo Ashram',
    distance: '20 mins',
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'A spiritual community located in the heart of the city.',
  },
  {
    name: 'Serenity Beach',
    distance: 'Nearby',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'Pristine sands perfect for a morning walk or surfing.',
  },
];

export default function Explore() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ocean-900)] font-bold mb-6">
              Explore Pondicherry
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Perfectly situated to offer tranquility while keeping the vibrant culture of Pondicherry within easy reach.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {attractions.map((place, index) => (
            <motion.div 
              key={place.name}
              className="group cursor-pointer rounded-2xl overflow-hidden relative h-96 shadow-sm hover:shadow-xl transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <img 
                src={place.image} 
                alt={place.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-2 text-white/90">
                  <MapPin size={16} />
                  <span className="text-sm font-medium uppercase tracking-wider">{place.distance}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">{place.name}</h3>
                <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {place.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
