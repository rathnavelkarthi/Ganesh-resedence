import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useCRM } from '../context/CRMDataContext';

const attractions = [
  {
    name: 'Auroville',
    distance: '15 mins',
    image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=1470&auto=format&fit=crop',
    description: 'The experimental township dedicated to human unity.',
  },
  {
    name: 'French Quarter',
    distance: '20 mins',
    image: 'https://images.unsplash.com/photo-1594911760431-15fe62cc0818?q=80&w=1470&auto=format&fit=crop',
    description: 'Stroll through charming streets with colonial architecture.',
  },
  {
    name: 'Sri Aurobindo Ashram',
    distance: '20 mins',
    image: 'https://images.unsplash.com/photo-1616010515152-cb9935bc7291?q=80&w=1470&auto=format&fit=crop',
    description: 'A spiritual community located in the heart of the city.',
  },
  {
    name: 'Serenity Beach',
    distance: 'Nearby',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1470&auto=format&fit=crop',
    description: 'Pristine sands perfect for a morning walk or surfing.',
  },
];

export default function Explore() {
  const { cmsSettings } = useCRM();

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-secondary/10 rounded-tr-[100px] blur-2xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="block text-primary/80 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-4"
            >
              Discover
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-bold mb-6"
            >
              Explore Pondicherry
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-foreground/70 text-lg md:text-xl font-light leading-relaxed"
            >
              {cmsSettings.aboutText}
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {attractions.map((place, index) => (
            <motion.div
              key={place.name}
              className="group cursor-pointer rounded-default overflow-hidden relative h-[420px] shadow-sm hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-500 border border-secondary/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                <div className="flex items-center gap-2 mb-3 text-primary-foreground/90">
                  <MapPin size={16} className="text-primary/90" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">{place.distance}</span>
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-3 drop-shadow-md">{place.name}</h3>
                <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-light leading-relaxed line-clamp-3">
                  {place.description}
                </p>

                {/* Visual Cue */}
                <div className="w-8 h-1 bg-primary mt-6 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 delay-200" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
