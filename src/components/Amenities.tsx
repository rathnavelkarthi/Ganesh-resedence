import { motion } from 'framer-motion';
import {
  Waves,
  Utensils,
  Presentation,
  Clock,
  ConciergeBell,
  Shirt,
  Wifi,
  Car
} from 'lucide-react';

const amenities = [
  { name: 'Outdoor Swimming Pool', icon: Waves },
  { name: 'On-site Restaurant', icon: Utensils },
  { name: 'Conference & Banquet Facilities', icon: Presentation },
  { name: '24-hour Front Desk', icon: Clock },
  { name: 'Room Service', icon: ConciergeBell },
  { name: 'Laundry', icon: Shirt },
  { name: 'Free WiFi', icon: Wifi },
  { name: 'Free Parking', icon: Car },
];

export default function Amenities() {
  return (
    <section id="amenities" className="py-32 bg-background relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/20 rounded-l-full blur-3xl -z-10 transform translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="block text-primary/80 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-4"
          >
            Curated For You
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-bold mb-6"
          >
            Resort Amenities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/70 text-lg md:text-xl font-light leading-relaxed"
          >
            Everything you need for a comfortable stay, thoughtfully designed to enhance your experience at Ganesh Residency.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <motion.div
                key={amenity.name}
                className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-24 h-24 rounded-full bg-secondary/30 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <Icon size={32} className="text-primary group-hover:text-primary-foreground transform group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-foreground text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                  {amenity.name}
                </h3>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
