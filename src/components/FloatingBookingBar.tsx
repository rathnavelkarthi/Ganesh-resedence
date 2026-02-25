import { motion } from 'framer-motion';
import { Calendar, Users } from 'lucide-react';

export default function FloatingBookingBar() {
    return (
        <div className="w-full flex justify-center px-4 md:px-8 z-40 relative -mt-20 lg:-mt-24 pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                className="w-full max-w-5xl backdrop-blur-3xl bg-background/60 border border-accent/30 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-accent/20 p-2 md:p-4">

                    <div className="flex-1 w-full p-4 flex flex-col group cursor-pointer">
                        <span className="text-xs tracking-[0.15em] text-foreground/60 uppercase mb-1 font-semibold">Check-in</span>
                        <div className="flex items-center text-foreground font-serif text-lg">
                            <Calendar className="w-4 h-4 mr-3 text-accent" />
                            <span>Select Date</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full p-4 flex flex-col group cursor-pointer">
                        <span className="text-xs tracking-[0.15em] text-foreground/60 uppercase mb-1 font-semibold">Check-out</span>
                        <div className="flex items-center text-foreground font-serif text-lg">
                            <Calendar className="w-4 h-4 mr-3 text-accent" />
                            <span>Select Date</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full p-4 flex flex-col group cursor-pointer">
                        <span className="text-xs tracking-[0.15em] text-foreground/60 uppercase mb-1 font-semibold">Guests</span>
                        <div className="flex items-center text-foreground font-serif text-lg">
                            <Users className="w-4 h-4 mr-3 text-accent" />
                            <span>2 Adults, 0 Children</span>
                        </div>
                    </div>

                    <div className="w-full md:w-auto p-4 flex items-center justify-center">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-serif tracking-widest uppercase text-sm shadow-[0_0_15px_rgba(201,166,70,0.4)] hover:shadow-[0_0_25px_rgba(201,166,70,0.6)] transition-shadow duration-300 w-full md:w-auto"
                        >
                            Reserve
                        </motion.button>
                    </div>

                </div>

                <div className="bg-foreground/5 py-3 text-center border-t border-accent/10">
                    <p className="text-xs tracking-widest text-foreground/70 uppercase font-medium">
                        Best Rate Guarantee <span className="text-accent mx-2">•</span> Direct Booking Privilege
                    </p>
                </div>

            </motion.div>
        </div>
    );
}
