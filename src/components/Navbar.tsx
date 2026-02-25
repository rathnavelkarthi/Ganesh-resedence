import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Rooms', href: '/#rooms' },
    { name: 'Experience', href: '/#gallery' },
    { name: 'Events', href: '/#events' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (isHome && href.startsWith('/#')) {
      const element = document.getElementById(href.substring(2));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled
        ? 'bg-background/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4'
        : 'bg-transparent py-8'
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex flex-col z-50 relative">
            <span className={`font-serif text-2xl md:text-3xl font-normal tracking-wide transition-colors duration-500 ${isScrolled || !isHome ? 'text-foreground' : 'text-white'}`}>
              Ganesh
            </span>
            <span className={`text-[9px] md:text-[10px] font-medium tracking-[0.3em] uppercase transition-colors duration-500 ${isScrolled || !isHome ? 'text-foreground/60' : 'text-white/80'}`}>
              Residency
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-[11px] uppercase tracking-widest font-medium transition-all duration-300 hover:text-accent ${isScrolled || !isHome ? 'text-foreground/70' : 'text-white/90'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/book"
              className="bg-accent hover:bg-accent-hover text-accent-foreground px-8 py-3 rounded-sm text-[11px] uppercase tracking-widest font-semibold transition-all duration-500 shadow-md hover:shadow-lg active:scale-95 ml-4"
            >
              Reserve
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden z-50 p-2 transition-colors duration-300 ${isScrolled || !isHome || isMobileMenuOpen ? 'text-foreground' : 'text-white'
              }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-3xl shadow-2xl py-8 px-6 flex flex-col gap-2 md:hidden border-t border-foreground/5"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <Link
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block text-foreground/80 font-serif text-2xl py-4 hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.05 + 0.1 }}
              className="mt-8"
            >
              <Link
                to="/book"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-accent text-accent-foreground text-center px-6 py-5 rounded-sm font-semibold uppercase tracking-widest text-[11px] transition-all duration-300 shadow-xl"
              >
                Reserve
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
