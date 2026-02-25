import { motion } from 'framer-motion';
import BookingBar from './BookingBar';
import { useCRM } from '../context/CRMDataContext';

export default function Hero() {
  const { cmsSettings } = useCRM();

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden pt-32 pb-8 md:pb-10">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </motion.div>

      {/* Content Container (Centers text in available space above booking bar) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-primary-foreground/90 font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-6 drop-shadow-sm">
            Welcome to Paradise
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-white font-bold tracking-tight mb-8 drop-shadow-lg" dangerouslySetInnerHTML={{ __html: cmsSettings.heroTitle }} />
        </motion.div>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-4 drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {cmsSettings.heroSubtitle}
        </motion.p>
      </div>

      {/* Booking Bar Container (Relatively positioned at the bottom) */}
      <motion.div
        className="relative z-20 w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mt-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <BookingBar />
      </motion.div>
    </section>
  );
}
