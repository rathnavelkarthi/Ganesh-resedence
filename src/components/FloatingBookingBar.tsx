import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, ChevronDown, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';

export default function FloatingBookingBar() {
    const navigate = useNavigate();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState({ adults: 2, children: 0 });
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

    const checkInRef = useRef<HTMLInputElement>(null);
    const checkOutRef = useRef<HTMLInputElement>(null);

    const handleReserve = () => {
        const params = new URLSearchParams();
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        params.append('guests', (guests.adults + guests.children).toString());
        navigate(`/book?${params.toString()}`);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Select Date';
        try {
            return format(new Date(dateStr), 'MMM dd, yyyy');
        } catch (e) {
            return 'Select Date';
        }
    };

    return (
        <div className="w-full flex justify-center px-4 md:px-8 z-40 relative -mt-20 lg:-mt-24 pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                className="w-full max-w-5xl backdrop-blur-3xl bg-background/60 border border-accent/30 rounded-xl shadow-2xl flex flex-col"
            >
                <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-accent/20 p-2 md:p-4">

                    {/* Check-in */}
                    <div
                        className="flex-1 w-full p-4 flex flex-col group cursor-pointer relative"
                        onClick={() => checkInRef.current?.showPicker()}
                    >
                        <span className="text-xs tracking-[0.15em] text-foreground/60 uppercase mb-1 font-semibold">Check-in</span>
                        <div className="flex items-center text-foreground font-serif text-lg">
                            <Calendar className="w-4 h-4 mr-3 text-accent" />
                            <span>{formatDate(checkIn)}</span>
                        </div>
                        <input
                            ref={checkInRef}
                            type="date"
                            className="absolute opacity-0 pointer-events-none inset-0"
                            onChange={(e) => setCheckIn(e.target.value)}
                        />
                    </div>

                    {/* Check-out */}
                    <div
                        className="flex-1 w-full p-4 flex flex-col group cursor-pointer relative"
                        onClick={() => checkOutRef.current?.showPicker()}
                    >
                        <span className="text-xs tracking-[0.15em] text-foreground/60 uppercase mb-1 font-semibold">Check-out</span>
                        <div className="flex items-center text-foreground font-serif text-lg">
                            <Calendar className="w-4 h-4 mr-3 text-accent" />
                            <span>{formatDate(checkOut)}</span>
                        </div>
                        <input
                            ref={checkOutRef}
                            type="date"
                            className="absolute opacity-0 pointer-events-none inset-0"
                            onChange={(e) => setCheckOut(e.target.value)}
                        />
                    </div>

                    {/* Guests */}
                    <div className="flex-1 w-full p-4 flex flex-col group cursor-pointer relative">
                        <div
                            className="w-full h-full"
                            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                        >
                            <span className="text-xs tracking-[0.15em] text-foreground/60 uppercase mb-1 font-semibold">Guests</span>
                            <div className="flex items-center justify-between text-foreground font-serif text-lg">
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-3 text-accent" />
                                    <span>{guests.adults} Adults, {guests.children} Children</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isGuestDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isGuestDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-accent/20 rounded-xl shadow-2xl p-6 z-50 space-y-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-foreground">Adults</span>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                                                className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center hover:bg-accent/10 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-serif w-4 text-center">{guests.adults}</span>
                                            <button
                                                onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}
                                                className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center hover:bg-accent/10 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-foreground">Children</span>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                                                className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center hover:bg-accent/10 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-serif w-4 text-center">{guests.children}</span>
                                            <button
                                                onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}
                                                className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center hover:bg-accent/10 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsGuestDropdownOpen(false)}
                                        className="w-full bg-accent text-accent-foreground py-2 rounded-lg font-semibold text-sm mt-2"
                                    >
                                        Apply
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-full md:auto p-4 flex items-center justify-center">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleReserve}
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
