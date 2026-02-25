import { motion } from 'motion/react';
import BookingBar from './BookingBar';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://picsum.photos/seed/resort/1920/1080")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-20">
        <motion.h1 
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Stay Steps Away<br/>from the Beach
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto mb-12 drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Beachfront comfort near Pondicherry University with pool and spacious family accommodations.
        </motion.p>
      </div>

      {/* Booking Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: '50%' }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <BookingBar />
      </motion.div>
    </section>
  );
}
