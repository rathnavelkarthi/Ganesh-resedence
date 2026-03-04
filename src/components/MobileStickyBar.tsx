import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useCRM } from '../context/CRMDataContext';

export default function MobileStickyBar() {
  const { rooms } = useCRM();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const availableRooms = rooms.filter(r => r.is_available);
  const minPrice = availableRooms.length > 0
    ? Math.min(...availableRooms.map(r => r.price_per_night))
    : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-foreground/10 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-3">
            {minPrice !== null && (
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-foreground/50">Starting from</p>
                <p className="text-lg font-bold text-accent">
                  &#8377;{minPrice.toLocaleString()}
                  <span className="text-xs font-normal text-foreground/40">/night</span>
                </p>
              </div>
            )}
            <Link
              to="/book"
              className="bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-sm text-sm shadow-lg flex items-center gap-2 hover:bg-accent-hover transition-all uppercase tracking-widest text-[11px]"
            >
              Reserve
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
