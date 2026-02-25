import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={ref} id="gallery" className="py-32 bg-accent overflow-hidden relative">
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="block text-primary/80 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-4"
          >
            Serenity Awaits
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-bold mb-6"
          >
            The Ganesh Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/70 text-lg md:text-xl font-light leading-relaxed"
          >
            Immerse yourself in the tranquil beauty of Pondicherry. From sunrise to sunset, every moment is crafted for relaxation.
          </motion.p>
        </div>

        <div className="flex flex-col gap-12 md:gap-24">

          {/* Experience 1 */}
          <motion.div
            className="relative h-[65vh] min-h-[500px] w-full rounded-default overflow-hidden group shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0 w-full h-[115%]"
              style={{ y: y1 }}
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
                alt="Beach waves"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 opacity-70 group-hover:opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div className="overflow-hidden">
                <motion.h3
                  className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold drop-shadow-2xl leading-tight"
                  initial={{ opacity: 0, y: "100%" }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  Wake Up to the <br className="hidden md:block" /> Sound of Waves
                </motion.h3>
              </div>
            </div>
          </motion.div>

          {/* Experience 2 */}
          <motion.div
            className="relative h-[65vh] min-h-[500px] w-full rounded-default overflow-hidden group shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0 w-full h-[115%]"
              style={{ y: y2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop"
                alt="Poolside relaxation"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 opacity-70 group-hover:opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div className="overflow-hidden">
                <motion.h3
                  className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold drop-shadow-2xl leading-tight"
                  initial={{ opacity: 0, y: "100%" }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  Relax by the <br className="hidden md:block" /> Poolside
                </motion.h3>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
