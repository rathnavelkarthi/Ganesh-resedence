import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import {
    Star, MapPin, Phone, Mail, Calendar, Users, ChevronDown,
    ArrowRight, Wifi, Car, Coffee, Waves, X, Check, Clock,
    Quote, ExternalLink, ChevronLeft, ChevronRight, Plus, Minus,
    Shield, Sunrise, BadgeCheck, Camera, Navigation, Plane, Building2
} from 'lucide-react';

// --- Types ---
type Room = {
    id: number; name: string; type: string; description: string;
    price_per_night: number; max_occupancy: number; amenities: string[]; images: string[]; is_available: boolean;
};
type Testimonial = {
    guest_name: string; guest_location: string; rating: number;
    review_text: string; avatar_url: string; source: string;
};
type TenantData = {
    id: string; business_name: string; business_type: string; subdomain: string;
    template: string; logo_url: string; google_place_id: string; google_review_url: string;
    hero_image_url: string; sections_visible: Record<string, boolean> | null;
};
type SiteData = { tenant: TenantData; rooms: Room[]; testimonials: Testimonial[]; settings: Record<string, string> };

// --- Amenity icon map ---
const amenityIcons: Record<string, React.ElementType> = {
    wifi: Wifi, parking: Car, coffee: Coffee, pool: Waves, 'free wifi': Wifi, 'car park': Car
};

// --- Star rating ---
function Stars({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < count ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
            ))}
        </div>
    );
}

// --- Booking Modal ---
function BookingModal({ room, subdomain, onClose, onSuccess }: {
    room: Room; subdomain: string; onClose: () => void; onSuccess: (data: any) => void;
}) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', checkIn: '', checkOut: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const nights = form.checkIn && form.checkOut
        ? Math.max(0, Math.floor((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { data, error: rpcError } = await supabase.rpc('create_public_booking', {
            p_subdomain: subdomain,
            p_guest_name: form.name,
            p_guest_email: form.email,
            p_guest_phone: form.phone,
            p_room_id: room.id,
            p_check_in: form.checkIn,
            p_check_out: form.checkOut,
        });

        setLoading(false);
        if (rpcError) { setError(rpcError.message); return; }
        if (data?.error) { setError(data.error); return; }
        onSuccess(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-32 bg-gradient-to-br from-[#0E2A38] to-[#1a3d4f] p-6 flex flex-col justify-end">
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                        <X size={16} />
                    </button>
                    <h3 className="text-white font-bold text-lg">{room.name}</h3>
                    <p className="text-white/60 text-sm">{room.type}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check-in</label>
                            <input type="date" required value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0E2A38]/20 focus:border-[#0E2A38] outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check-out</label>
                            <input type="date" required value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })}
                                min={form.checkIn || new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0E2A38]/20 focus:border-[#0E2A38] outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full name</label>
                        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0E2A38]/20 focus:border-[#0E2A38] outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="you@email.com"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0E2A38]/20 focus:border-[#0E2A38] outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                            <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0E2A38]/20 focus:border-[#0E2A38] outline-none transition-all" />
                        </div>
                    </div>

                    {nights > 0 && (
                        <div className="bg-[#F7F4EF] rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{nights} night{nights > 1 ? 's' : ''} x ₹{room.price_per_night.toLocaleString()}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Taxes included</p>
                            </div>
                            <p className="text-xl font-bold text-[#0E2A38]">₹{(nights * room.price_per_night).toLocaleString()}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full bg-[#0E2A38] hover:bg-[#1a3d4f] text-white font-semibold py-3 rounded-xl transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? 'Reserving...' : 'Reserve now'}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}

// --- Booking confirmation ---
function BookingConfirmation({ data, onClose }: { data: any; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                    <Check size={30} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking confirmed</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Your reservation <span className="font-semibold text-[#0E2A38]">{data.booking_id}</span> has been received.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Room</span>
                        <span className="font-medium">{data.room}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-medium">{data.nights} night{data.nights > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total</span>
                        <span className="font-bold text-[#0E2A38]">₹{Number(data.amount).toLocaleString()}</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">You'll receive a confirmation email shortly.</p>
                <button onClick={onClose} className="w-full bg-[#0E2A38] text-white font-semibold py-3 rounded-xl hover:bg-[#1a3d4f] transition-all text-sm">
                    Done
                </button>
            </motion.div>
        </motion.div>
    );
}

// =========================================================================
// MAIN TENANT SITE COMPONENT
// =========================================================================
export default function TenantSite() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const [siteData, setSiteData] = useState<SiteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<any>(null);

    // Hero booking strip state
    const [heroCheckIn, setHeroCheckIn] = useState('');
    const [heroCheckOut, setHeroCheckOut] = useState('');
    const [heroGuests, setHeroGuests] = useState(2);
    const heroCheckInRef = useRef<HTMLInputElement>(null);
    const heroCheckOutRef = useRef<HTMLInputElement>(null);

    // Sticky mobile bar
    const [showStickyBar, setShowStickyBar] = useState(false);
    const { scrollY } = useScroll();
    useMotionValueEvent(scrollY, 'change', (latest) => {
        setShowStickyBar(latest > 600);
    });

    useEffect(() => {
        if (!subdomain) return;
        (async () => {
            const { data, error } = await supabase.rpc('get_tenant_site', { p_subdomain: subdomain });
            if (error || !data || !data.tenant) { setNotFound(true); setLoading(false); return; }
            setSiteData(data);
            setLoading(false);
        })();
    }, [subdomain]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-[#0E2A38]/10 border-t-[#0E2A38] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-400 tracking-wide">Loading...</p>
                </div>
            </div>
        );
    }

    if (notFound || !siteData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0E2A38]">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-white/10 mb-4">404</h1>
                    <p className="text-white/50 text-lg mb-2">Property not found</p>
                    <p className="text-white/30 text-sm">This site doesn't exist or has been deactivated.</p>
                </div>
            </div>
        );
    }

    const { tenant, rooms, testimonials, settings } = siteData;
    const contactEmail = settings.contactEmail || '';
    const contactPhone = settings.contactPhone || '';
    const contactAddress = settings.contactAddress || '';
    const heroTitle = settings.heroTitle || tenant.business_name;
    const heroSubtitle = settings.heroSubtitle || 'Experience comfort and luxury';
    const aboutText = settings.aboutText || '';
    const vis = tenant.sections_visible || { hero: true, rooms: true, testimonials: true, about: true, contact: true };

    // Pseudo-random "rooms left" per room (stable across re-renders)
    const roomsLeft = (id: number) => ((id * 7 + 13) % 3) + 1;

    const handleHeroBook = () => {
        const el = document.getElementById('rooms');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-900 antialiased">
            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />

            {/* ===== NAVBAR ===== */}
            <nav className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {tenant.logo_url ? (
                            <img src={tenant.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#0E2A38] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{tenant.business_name.charAt(0)}</span>
                            </div>
                        )}
                        <span className="font-bold text-[#0E2A38] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{tenant.business_name}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm">
                        <a href="#rooms" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Rooms</a>
                        {testimonials.length > 0 && <a href="#reviews" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Reviews</a>}
                        {aboutText && <a href="#about" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">About</a>}
                        <a href="#location" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Location</a>
                        <a href="#contact" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Contact</a>
                    </div>
                    <a
                        href="#rooms"
                        className="bg-[#0E2A38] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1a3d4f] transition-all shadow-sm hover:shadow-md"
                    >
                        Book now
                    </a>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            {vis.hero !== false && (
                <section className="relative pt-16 min-h-[60vh] md:min-h-[75vh] flex flex-col overflow-hidden">
                    {/* Background */}
                    {tenant.hero_image_url ? (
                        <>
                            <img src={tenant.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2A38]/90 via-[#0E2A38]/70 to-[#0E2A38]/40" />
                    )}
                    {/* Decorative */}
                    <div className="absolute top-20 right-20 w-96 h-96 bg-[#C9A646]/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFBF7]/90 to-transparent backdrop-blur-[2px] z-10 pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }} />

                    {/* Hero content */}
                    <div className="relative z-20 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-6 pt-24 pb-32 md:pt-32 md:pb-40 w-full text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-3xl mx-auto md:mx-0 flex flex-col items-center md:items-start"
                        >
                            <h1
                                className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white leading-[1.15] tracking-tight mb-6"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {heroTitle.split(',').join('\n')}
                            </h1>
                            <p className="text-lg md:text-[20px] text-white/95 leading-relaxed mb-10 max-w-2xl font-light">
                                {heroSubtitle}
                            </p>

                            {/* Quick stats - Glass strip */}
                            <div className="inline-flex justify-center md:justify-start items-center gap-4 md:gap-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/5 rounded-full px-6 py-3">
                                {rooms.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">{rooms.length}</span>
                                        <span className="text-white/80 text-sm">Rooms</span>
                                    </div>
                                )}
                                {rooms.length > 0 && testimonials.length > 0 && <span className="text-white/30">|</span>}
                                {testimonials.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#C9A646]">★</span>
                                        <span className="text-white font-semibold">
                                            {(testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)}
                                        </span>
                                        <span className="text-white/80 text-sm hidden sm:inline">Rating</span>
                                    </div>
                                )}
                                {testimonials.length > 0 && rooms.length > 0 && <span className="text-white/30 hidden sm:inline">|</span>}
                                {rooms.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/80 text-sm hidden sm:inline">From</span>
                                        <span className="text-white font-semibold flex items-center gap-1">
                                            <span className="text-[#C9A646] text-xs font-normal">₹</span>
                                            {Math.min(...rooms.map(r => r.price_per_night)).toLocaleString()}
                                            <span className="text-white/60 font-normal text-xs ml-0.5">/ night</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* ===== INLINE BOOKING STRIP ===== */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="sticky top-[60px] md:relative z-40 w-full px-4 md:px-6 max-w-5xl mx-auto pb-6 md:pb-0 md:-mb-10 mt-6 md:mt-0"
                    >
                        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/40 overflow-hidden">
                            <div className="grid grid-cols-2 md:flex md:flex-row items-stretch divide-x md:divide-y-0 divide-y md:divide-x divide-gray-100">
                                {/* Check-in */}
                                <div
                                    className="col-span-1 p-3 md:p-5 flex flex-col gap-1 cursor-pointer hover:bg-gray-50/50 transition-colors relative border-b border-gray-100 md:border-b-0"
                                    onClick={() => heroCheckInRef.current?.showPicker()}
                                >
                                    <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase font-semibold">Check-in</span>
                                    <div className="flex items-center gap-2 text-[#0E2A38] font-semibold">
                                        <Calendar size={16} className="text-[#C9A646] hidden sm:block" />
                                        <span className="text-sm">{heroCheckIn ? new Date(heroCheckIn + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Select date'}</span>
                                    </div>
                                    <input ref={heroCheckInRef} type="date" min={new Date().toISOString().split('T')[0]}
                                        className="absolute opacity-0 pointer-events-none inset-0"
                                        onChange={(e) => {
                                            setHeroCheckIn(e.target.value);
                                            if (heroCheckOut && new Date(e.target.value) >= new Date(heroCheckOut)) {
                                                const next = new Date(e.target.value); next.setDate(next.getDate() + 1);
                                                setHeroCheckOut(next.toISOString().split('T')[0]);
                                            }
                                        }} />
                                </div>

                                {/* Check-out */}
                                <div
                                    className="col-span-1 p-3 md:p-5 flex flex-col gap-1 cursor-pointer hover:bg-gray-50/50 transition-colors relative border-b border-gray-100 md:border-b-0"
                                    onClick={() => heroCheckOutRef.current?.showPicker()}
                                >
                                    <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase font-semibold">Check-out</span>
                                    <div className="flex items-center gap-2 text-[#0E2A38] font-semibold">
                                        <Calendar size={16} className="text-[#C9A646] hidden sm:block" />
                                        <span className="text-sm">{heroCheckOut ? new Date(heroCheckOut + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Select date'}</span>
                                    </div>
                                    <input ref={heroCheckOutRef} type="date" min={heroCheckIn || new Date().toISOString().split('T')[0]}
                                        className="absolute opacity-0 pointer-events-none inset-0"
                                        onChange={(e) => setHeroCheckOut(e.target.value)} />
                                </div>

                                {/* Guests */}
                                <div className="col-span-2 md:flex-1 p-3 md:p-5 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-1">
                                    <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase font-semibold md:mb-1">Guests</span>
                                    <div className="flex items-center gap-3">
                                        <Users size={16} className="text-[#C9A646] hidden md:block" />
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => setHeroGuests(Math.max(1, heroGuests - 1))}
                                                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500">
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-sm font-semibold text-[#0E2A38] w-12 text-center">{heroGuests} Guest{heroGuests > 1 ? 's' : ''}</span>
                                            <button type="button" onClick={() => setHeroGuests(heroGuests + 1)}
                                                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500">
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="col-span-2 p-3 md:p-4 flex items-center bg-gray-50/30">
                                    <button
                                        onClick={handleHeroBook}
                                        className="w-full md:w-auto bg-[#0E2A38] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1a3d4f] transition-all shadow-lg shadow-[#0E2A38]/20 text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        Check Availability
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#FDFBF7] py-2 md:py-2.5 text-center border-t border-gray-100">
                                <p className="text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.15em] text-gray-400 uppercase font-medium">
                                    Best Rate Guarantee <span className="text-[#C9A646] mx-1 md:mx-2">•</span> No fees <span className="text-[#C9A646] mx-1 md:mx-2">•</span> Free cancel
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* ===== ROOMS ===== */}
            {vis.rooms !== false && rooms.length > 0 && (
                <section id="rooms" className="py-28 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-xs font-semibold text-[#C9A646] uppercase tracking-[0.2em] mb-3">Accommodation</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0E2A38] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Our rooms</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {rooms.map((room, i) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
                                >
                                    {/* Room image -- taller, with zoom */}
                                    <div className="relative h-64 overflow-hidden">
                                        {room.images?.[0] ? (
                                            <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            /* Elegant placeholder for missing images */
                                            <div className="w-full h-full bg-gradient-to-br from-[#0E2A38]/8 via-[#C9A646]/5 to-[#0E2A38]/10 flex items-center justify-center backdrop-blur-sm">
                                                <div className="text-center">
                                                    <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center mx-auto mb-3">
                                                        <Camera size={24} className="text-[#0E2A38]/30" />
                                                    </div>
                                                    <p className="text-xs text-[#0E2A38]/40 font-medium">{room.type}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Price overlay on image */}
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                                                <p className="text-lg font-bold text-[#0E2A38]">₹{room.price_per_night.toLocaleString()}<span className="text-[10px] font-normal text-gray-400 ml-0.5">/night</span></p>
                                            </div>
                                        </div>

                                        {/* Status tags on image */}
                                        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                            {room.is_available === false ? (
                                                <div className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                                    Sold Out
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                                                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                                        Available
                                                    </div>
                                                    <div className="bg-[#C9A646] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                                        Only {roomsLeft(room.id)} left
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-[#0E2A38] text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{room.name}</h3>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">{room.type}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                                <Users size={12} />
                                                <span>{room.max_occupancy}</span>
                                            </div>
                                        </div>

                                        {room.description && (
                                            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{room.description}</p>
                                        )}

                                        {room.amenities?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-5">
                                                {room.amenities.slice(0, 4).map((amenity, j) => {
                                                    const Icon = amenityIcons[amenity.toLowerCase()] || Coffee;
                                                    return (
                                                        <span key={j} className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                                            <Icon size={10} /> {amenity}
                                                        </span>
                                                    );
                                                })}
                                                {room.amenities.length > 4 && (
                                                    <span className="text-[11px] text-gray-400 px-2 py-1">+{room.amenities.length - 4} more</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/site/${subdomain}/room/${room.id}`}
                                                className="flex-1 bg-white text-[#0E2A38] border-2 border-[#0E2A38]/15 font-semibold py-2.5 rounded-xl text-sm hover:border-[#0E2A38]/40 hover:bg-[#0E2A38]/5 transition-all text-center"
                                            >
                                                Explore room
                                            </Link>
                                            <button
                                                onClick={() => setBookingRoom(room)}
                                                className="flex-1 bg-[#0E2A38] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#1a3d4f] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:shadow-[#0E2A38]/15"
                                            >
                                                Book now <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== TESTIMONIALS -- 3-column grid ===== */}
            {vis.testimonials !== false && testimonials.length > 0 && (
                <section id="reviews" className="py-28 px-6 bg-[#0E2A38]">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-xs font-semibold text-[#C9A646] uppercase tracking-[0.2em] mb-3">Guest reviews</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>What our guests say</h2>
                            {testimonials.length >= 3 && (
                                <div className="flex items-center justify-center gap-2 mt-5">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="text-white/50 text-sm ml-2">
                                        {(testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)} average from {testimonials.length} reviews
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Grid -- up to 6, responsive */}
                        <div className={`grid gap-6 ${testimonials.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : testimonials.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                            {testimonials.slice(0, 6).map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition-colors duration-300"
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        <Stars count={t.rating} />
                                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 font-semibold uppercase tracking-wider">
                                            <BadgeCheck size={14} className="text-emerald-400" />
                                            Verified stay
                                        </div>
                                    </div>

                                    <p className="text-white/75 text-sm leading-relaxed mb-6 line-clamp-4 italic">
                                        "{t.review_text}"
                                    </p>

                                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                        {t.avatar_url ? (
                                            <img src={t.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#C9A646]/20 flex items-center justify-center ring-2 ring-white/10">
                                                <span className="text-[#C9A646] font-bold">{t.guest_name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-semibold text-sm">{t.guest_name}</p>
                                            {t.guest_location && (
                                                <p className="text-white/35 text-xs flex items-center gap-1">
                                                    <MapPin size={10} /> {t.guest_location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Google Reviews link */}
                        {tenant.google_review_url && (
                            <div className="text-center mt-12">
                                <a href={tenant.google_review_url} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm border border-white/10 rounded-full px-5 py-2.5 hover:border-white/20">
                                    <span>See all reviews on Google</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ===== ABOUT ===== */}
            {vis.about !== false && aboutText && (
                <section id="about" className="py-28 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-xs font-semibold text-[#C9A646] uppercase tracking-[0.2em] mb-3">About us</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0E2A38] tracking-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>{tenant.business_name}</h2>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">{aboutText}</p>
                    </div>
                </section>
            )}

            {/* ===== LOCATION + MAP ===== */}
            <section id="location" className="py-28 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-semibold text-[#C9A646] uppercase tracking-[0.2em] mb-3">Find us</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0E2A38] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Perfectly located</h2>
                    </div>

                    {/* Proximity stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14 max-w-3xl mx-auto">
                        {[
                            { icon: Waves, label: settings.locationStat1Label || 'Beach', value: settings.locationStat1Value || '500m', color: 'text-cyan-500' },
                            { icon: Building2, label: settings.locationStat2Label || 'Town Center', value: settings.locationStat2Value || '2 km', color: 'text-[#C9A646]' },
                            { icon: Plane, label: settings.locationStat3Label || 'Airport', value: settings.locationStat3Value || '15 min', color: 'text-[#0E2A38]' },
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-center bg-[#FDFBF7] rounded-2xl p-6 border border-gray-100"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 ${stat.color}`}>
                                        <Icon size={22} />
                                    </div>
                                    <p className="text-2xl font-bold text-[#0E2A38] mb-1">{stat.value}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">from {stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Map embed */}
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[350px] md:h-[400px]">
                        {tenant.google_place_id ? (
                            <iframe
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=place_id:${tenant.google_place_id}`}
                                className="w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                                title="Location"
                            />
                        ) : contactAddress ? (
                            <iframe
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactAddress)}`}
                                className="w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                                title="Location"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">Map unavailable</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Address below map */}
                    {contactAddress && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mt-6"
                        >
                            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                                <MapPin size={14} className="text-[#C9A646]" />
                                {contactAddress}
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ===== DIRECT BOOKING BENEFITS ===== */}
            <section className="py-20 px-6 bg-[#0E2A38] relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#C9A646]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A646]/3 rounded-full blur-3xl" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Book direct & save
                        </h2>
                        <p className="text-white/40 text-sm">Skip the middleman. Get the best deal when you book with us directly.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: Shield, title: 'Best Price Guarantee', desc: 'Lowest rates available only here' },
                            { icon: Sunrise, title: 'Free Early Check-in', desc: 'Subject to availability' },
                            { icon: Check, title: 'No Hidden Fees', desc: 'What you see is what you pay' },
                        ].map((benefit, i) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4 bg-white/5 rounded-xl p-5 border border-white/5"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#C9A646]/20 flex items-center justify-center shrink-0">
                                        <Icon size={20} className="text-[#C9A646]" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm mb-1">{benefit.title}</p>
                                        <p className="text-white/35 text-xs leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <a
                            href="#rooms"
                            className="inline-flex items-center gap-2 bg-[#C9A646] text-[#0E2A38] font-bold px-8 py-3.5 rounded-xl hover:bg-[#d4af4f] transition-all shadow-lg shadow-[#C9A646]/20 text-sm"
                        >
                            Browse rooms & book
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ===== CONTACT / FOOTER ===== */}
            {vis.contact !== false && (
                <footer id="contact" className="bg-[#0a1f2c] text-white py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    {tenant.logo_url ? (
                                        <img src={tenant.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-[#C9A646] flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{tenant.business_name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{tenant.business_name}</span>
                                </div>
                                {aboutText && <p className="text-white/40 text-sm leading-relaxed line-clamp-3">{aboutText}</p>}
                            </div>

                            {/* Quick links */}
                            <div>
                                <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em] mb-4">Quick links</p>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="#rooms" className="text-white/50 hover:text-white transition-colors">Rooms</a></li>
                                    {testimonials.length > 0 && <li><a href="#reviews" className="text-white/50 hover:text-white transition-colors">Reviews</a></li>}
                                    {aboutText && <li><a href="#about" className="text-white/50 hover:text-white transition-colors">About</a></li>}
                                    <li><a href="#location" className="text-white/50 hover:text-white transition-colors">Location</a></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em] mb-4">Contact</p>
                                <ul className="space-y-3 text-sm">
                                    {contactPhone && (
                                        <li className="flex items-center gap-3 text-white/50">
                                            <Phone size={14} className="text-[#C9A646]" />
                                            <a href={`tel:${contactPhone}`} className="hover:text-white transition-colors">{contactPhone}</a>
                                        </li>
                                    )}
                                    {contactEmail && (
                                        <li className="flex items-center gap-3 text-white/50">
                                            <Mail size={14} className="text-[#C9A646]" />
                                            <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">{contactEmail}</a>
                                        </li>
                                    )}
                                    {contactAddress && (
                                        <li className="flex items-start gap-3 text-white/50">
                                            <MapPin size={14} className="text-[#C9A646] mt-0.5 shrink-0" />
                                            <span>{contactAddress}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} {tenant.business_name}. All rights reserved.</p>
                            <p className="text-xs text-white/20">
                                Powered by <a href="/" className="text-[#C9A646]/50 hover:text-[#C9A646] transition-colors">HospitalityOS</a>
                            </p>
                        </div>
                    </div>
                </footer>
            )}

            {/* ===== MOBILE STICKY BOOK NOW BAR ===== */}
            <AnimatePresence>
                {showStickyBar && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
                    >
                        <div className="flex items-center gap-3">
                            {rooms.length > 0 && (
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Starting from</p>
                                    <p className="text-lg font-bold text-[#C9A646]">₹{Math.min(...rooms.map(r => r.price_per_night)).toLocaleString()}<span className="text-xs font-normal text-gray-400">/night</span></p>
                                </div>
                            )}
                            <a
                                href="#rooms"
                                className="bg-[#0E2A38] text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-lg shadow-[#0E2A38]/20 flex items-center gap-2 hover:bg-[#1a3d4f] transition-all"
                            >
                                Book now
                                <ArrowRight size={14} />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== BOOKING MODAL ===== */}
            <AnimatePresence>
                {bookingRoom && !bookingSuccess && (
                    <BookingModal
                        room={bookingRoom}
                        subdomain={subdomain || ''}
                        onClose={() => setBookingRoom(null)}
                        onSuccess={(data) => setBookingSuccess(data)}
                    />
                )}
                {bookingSuccess && (
                    <BookingConfirmation
                        data={bookingSuccess}
                        onClose={() => { setBookingSuccess(null); setBookingRoom(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
