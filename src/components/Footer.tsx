import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-24 md:py-32 relative overflow-hidden">
      {/* Heavy noise specifically for footer to ground the page */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] uppercase font-normal text-background drop-shadow-sm mb-4">
            Ganesh
            <span className="block text-xl md:text-2xl tracking-[0.4em] mt-4 opacity-70 font-light">Residency</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "80px" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-[1px] bg-accent opacity-60 mb-16"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-8 md:gap-16 text-[10px] tracking-[0.2em] uppercase font-medium text-background/60 mb-24"
        >
          <Link to="/#rooms" className="hover:text-accent transition-colors duration-300">Accommodations</Link>
          <Link to="/#gallery" className="hover:text-accent transition-colors duration-300">Experience</Link>
          <Link to="/#contact" className="hover:text-accent transition-colors duration-300">Contact</Link>
          <Link to="/pricing" className="hover:text-accent transition-colors duration-300">Pricing</Link>
          <Link to="/policies" className="hover:text-accent transition-colors duration-300">Policies</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest text-background/30 uppercase mt-auto pt-8 border-t border-background/10"
        >
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Ganesh Residency. All rights reserved.</p>
          <Link to="/admin/login" className="hover:text-accent transition-colors duration-300">Staff Portal</Link>
        </motion.div>

      </div>
    </footer>
  );
}
