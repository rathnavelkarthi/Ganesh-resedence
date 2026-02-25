import { motion } from 'motion/react';
import { Users, Building2, Heart, GraduationCap } from 'lucide-react';

const eventTypes = [
  { name: 'College Tours', icon: GraduationCap },
  { name: 'Corporate Offsites', icon: Building2 },
  { name: 'Family Reunions', icon: Users },
  { name: 'Small Weddings', icon: Heart },
];

export default function Events() {
  return (
    <section className="py-24 bg-[var(--color-sand-50)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <motion.div 
            className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1498&q=80" 
              alt="Banquet Hall" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="font-serif text-3xl font-bold mb-2">Elegant Banquet Facilities</h3>
              <p className="text-white/80">Spacious venues designed for memorable gatherings.</p>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ocean-900)] font-bold mb-6">
              Host Your Perfect Event
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-12">
              Whether you're planning a corporate retreat, a family reunion, or a special celebration, our dedicated team and versatile spaces ensure your event is a resounding success.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {eventTypes.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={event.name} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[var(--color-ocean-50)] transition-colors">
                      <Icon size={24} className="text-[var(--color-ocean-600)]" />
                    </div>
                    <span className="font-medium text-gray-900 text-lg">{event.name}</span>
                  </div>
                );
              })}
            </div>

            <button className="self-start bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg text-lg">
              Plan Your Event
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
