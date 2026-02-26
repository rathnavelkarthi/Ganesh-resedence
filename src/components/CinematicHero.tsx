import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useCRM } from '../context/CRMDataContext';
// @ts-ignore
import fallbackHeroImage from '../../herobanner.jpg';

export default function CinematicHero() {
    const { pageContent } = useCRM();
    const containerRef = useRef<HTMLDivElement>(null);

    const getContent = (key: string, field: 'content_text' | 'image_url' = 'content_text') => {
        const block = pageContent.find(p => p.section === 'hero' && p.block_key === key);
        return block ? block[field] : null;
    };

    const title = getContent('title') || 'A Private Sanctuary';
    const subtitle = getContent('subtitle') || 'Where the Ocean Meets Stillness';
    const heroImage = getContent('bgImage', 'image_url') || fallbackHeroImage;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-foreground">
            <motion.div
                style={{ scale }}
                className="absolute inset-0 z-0 origin-center"
            >
                <img
                    src={heroImage}
                    alt="Ganesh Residency Sanctuary"
                    className="object-cover w-full h-full opacity-60"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-foreground/90 mix-blend-multiply" />
            </motion.div>

            <motion.div
                style={{ opacity, y }}
                className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="font-serif text-4xl md:text-6xl lg:text-[80px] leading-[1.1] text-background max-w-5xl tracking-normal drop-shadow-lg"
                >
                    <span className="block mb-4">{title}</span>
                    <span className="block text-accent">{subtitle}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                    className="mt-8 text-sm md:text-base font-light text-secondary tracking-[0.2em] uppercase drop-shadow-md"
                >
                    Beachfront luxury in the heart of Pondicherry.
                </motion.p>
            </motion.div>
        </div>
    );
}
