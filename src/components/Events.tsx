import { motion } from 'framer-motion';

export default function Events() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.0 }}
        whileInView={{ scale: 1.05 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2070&auto=format&fit=crop"
          alt="Banquet"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-accent tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block font-semibold drop-shadow-md"
        >
          Gatherings & Celebrations
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-6xl lg:text-[72px] leading-tight text-background mb-10 drop-shadow-2xl"
        >
          Host Your Perfect Event
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-secondary/90 text-lg md:text-xl font-light mb-12 max-w-2xl leading-relaxed drop-shadow-md"
        >
          An inspiring backdrop for unforgettable occasions. From intimate vows to grand corporate retreats, our tailored spaces await.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03 }}
          className="bg-accent text-accent-foreground px-12 py-5 rounded-sm font-serif tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(201,166,70,0.4)] hover:shadow-[0_0_35px_rgba(201,166,70,0.6)] transition-all duration-500"
        >
          Plan Your Occasion
        </motion.button>
      </div>
    </section>
  );
}
