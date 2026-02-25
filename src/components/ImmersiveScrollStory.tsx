import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const stories = [
    {
        id: 'ocean',
        title: 'Wake to the Rhythm of the Waves',
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'pool',
        title: 'Relax by the Infinity Pool',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'dining',
        title: 'Savor Coastal Culinary Delights',
        image: 'https://images.unsplash.com/photo-1544148103-0773d1069fee?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'sunset',
        title: 'Evenings Framed by Golden Skies',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
    }
];

const StorySection: React.FC<{ story: typeof stories[0] }> = ({ story }) => {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
    // The text fades in as it approaches the center of the viewport
    const textOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
    const textY = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [30, 0, -30]);

    return (
        <div ref={ref} className="relative h-screen w-full overflow-hidden flex items-center md:items-end">
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <img
                    src={story.image}
                    alt={story.title}
                    className="object-cover w-full h-[130%] -top-[15%] absolute"
                />
                {/* Dark overlay for text legibility and premium feel */}
                <div className="absolute inset-0 bg-black/30 md:bg-transparent md:bg-gradient-to-t md:from-foreground/90 md:via-foreground/30 md:to-transparent md:mix-blend-multiply" />
            </motion.div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-0 md:pb-32 text-center md:text-left">
                <motion.h2
                    style={{ opacity: textOpacity, y: textY }}
                    className="font-serif text-4xl md:text-5xl lg:text-[72px] text-background max-w-4xl mx-auto md:mx-0 leading-[1.1] drop-shadow-2xl"
                >
                    {story.title}
                </motion.h2>
            </div>
        </div>
    );
}

export default function ImmersiveScrollStory() {
    return (
        <section className="bg-foreground">
            {stories.map((story) => (
                <StorySection key={story.id} story={story} />
            ))}
        </section>
    );
}
