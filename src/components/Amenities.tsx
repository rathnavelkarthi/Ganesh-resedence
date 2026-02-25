import { motion } from 'motion/react';
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
    <section id="amenities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ocean-900)] font-bold mb-6">
            Resort Amenities
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Everything you need for a comfortable stay, thoughtfully designed to enhance your experience at Ganesh Residency.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <motion.div 
                key={amenity.name}
                className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-sand-100)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-ocean-50)] group-hover:scale-110 transition-all duration-300">
                  <Icon size={32} className="text-[var(--color-ocean-600)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-gray-900 leading-tight group-hover:text-[var(--color-ocean-600)] transition-colors">
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
