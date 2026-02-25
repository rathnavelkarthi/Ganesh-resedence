import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} id="gallery" className="py-24 bg-[var(--color-sand-50)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-ocean-900)] font-bold mb-6">
            The Ganesh Experience
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Immerse yourself in the tranquil beauty of Pondicherry. From sunrise to sunset, every moment is crafted for relaxation.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:gap-16">
          
          {/* Experience 1 */}
          <div className="relative h-[60vh] min-h-[400px] w-full rounded-3xl overflow-hidden group">
            <motion.div 
              className="absolute inset-0 w-full h-[120%]"
              style={{ y: y1 }}
            >
              <img 
                src="https://picsum.photos/seed/experience1/2073/1382" 
                alt="Beach waves" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <motion.h3 
                className="font-serif text-4xl md:text-6xl text-white font-bold drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Wake Up to the Sound of Waves
              </motion.h3>
            </div>
          </div>

          {/* Experience 2 */}
          <div className="relative h-[60vh] min-h-[400px] w-full rounded-3xl overflow-hidden group">
            <motion.div 
              className="absolute inset-0 w-full h-[120%]"
              style={{ y: y2 }}
            >
              <img 
                src="https://picsum.photos/seed/experience2/2070/1380" 
                alt="Poolside relaxation" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <motion.h3 
                className="font-serif text-4xl md:text-6xl text-white font-bold drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Relax by the Poolside
              </motion.h3>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
