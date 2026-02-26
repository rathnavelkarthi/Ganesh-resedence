import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCRM } from '../context/CRMDataContext';

export default function Rooms() {
  const { rooms: backendRooms } = useCRM();
  // Filter available rooms and limit to 4 for the homepage layout
  const availableRooms = backendRooms.filter(r => r.is_available).slice(0, 4);

  return (
    <section id="rooms" className="py-32 md:py-48 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-32 md:mb-48">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl md:text-5xl lg:text-[64px] text-foreground font-normal mb-8 leading-tight drop-shadow-sm"
          >
            A Place to Rest
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="w-16 h-[1px] bg-accent mx-auto origin-center"
          />
        </div>

        <div className="flex flex-col gap-32 md:gap-56">
          {availableRooms.map((room, index) => {
            const isEven = index % 2 === 0;
            const bgImage = room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop';
            return (
              <div
                key={room.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-32 group`}
              >
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-[55%] overflow-hidden relative shadow-2xl"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
                    <img
                      src={bgImage}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-[45%] flex flex-col justify-center text-center lg:text-left"
                >
                  <span className="text-[11px] tracking-[0.25em] text-foreground/50 uppercase mb-6 block font-medium">
                    {room.max_occupancy} Guests
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-[44px] leading-tight text-foreground mb-8">
                    {room.name}
                  </h3>
                  <p className="text-foreground/70 text-base md:text-lg font-light leading-relaxed mb-12 max-w-md mx-auto lg:mx-0">
                    {room.description || 'A serene sanctuary designed for quiet comfort.'}
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Link
                      to={`/room/${room.id}`}
                      className="inline-block px-12 py-4 border border-accent text-foreground font-serif text-[13px] tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-500 rounded-sm"
                    >
                      View Room
                    </Link>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
