import { motion } from 'framer-motion';
import { useCRM } from '../context/CRMDataContext';

const destinations = [
    {
        name: 'Auroville',
        image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=1470&auto=format&fit=crop',
        description: 'An experimental township dedicated to global unity, peace, and spiritual awakening.',
    },
    {
        name: 'French Quarter',
        image: 'https://images.unsplash.com/photo-1594911760431-15fe62cc0818?q=80&w=1470&auto=format&fit=crop',
        description: 'Stroll through cobbled streets alive with colonial heritage, vibrant colors, and timeless charm.',
    },
    {
        name: 'Sri Aurobindo Ashram',
        image: 'https://images.unsplash.com/photo-1616010515152-cb9935bc7291?q=80&w=1470&auto=format&fit=crop',
        description: 'A sanctuary of quiet reflection and deep spiritual legacy in the heart of Pondicherry.',
    },
];

export default function DestinationMagazine() {
    const { cmsSettings } = useCRM();

    return (
        <>
            <section className="py-48 bg-foreground text-background flex flex-col items-center justify-center text-center px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-4xl md:text-5xl lg:text-[72px] font-normal tracking-wide drop-shadow-xl"
                >
                    The Ganesh Experience
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    whileInView={{ opacity: 1, width: "120px" }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="h-[1px] bg-accent mt-16 bg-opacity-80"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-16 max-w-2xl text-lg md:text-xl font-light text-secondary/80 leading-relaxed drop-shadow-sm"
                >
                    {cmsSettings?.aboutText || "Immerse yourself in a landscape where time slows down, curated precisely to elevate your coastal journey."}
                </motion.p>
            </section>

            <section className="py-32 bg-background">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {destinations.map((dest, i) => (
                        <motion.div
                            key={dest.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1.2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative aspect-[3/4] overflow-hidden cursor-pointer shadow-lg"
                        >
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700 mix-blend-multiply" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-background transition-transform duration-700 ease-[0.16,1,0.3,1] translate-y-6 group-hover:translate-y-0">
                                <h3 className="font-serif text-3xl mb-4 group-hover:text-accent transition-colors duration-500 drop-shadow-md">{dest.name}</h3>
                                <p className="font-light text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-[50ms] text-secondary/90">
                                    {dest.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    );
}
