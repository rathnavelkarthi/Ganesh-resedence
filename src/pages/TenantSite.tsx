import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTenantOccupancyPricing } from '../hooks/useOccupancyPricing';
import { getSubdomain } from '../hooks/useSubdomain';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import {
    Star, MapPin, Phone, Mail, Calendar, Users, ChevronDown,
    ArrowRight, Wifi, Car, Coffee, Waves, X, Check, Clock,
    Quote, ExternalLink, ChevronLeft, ChevronRight, Plus, Minus,
    Shield, Sunrise, BadgeCheck, Camera, Navigation, Plane, Building2,
    MessageCircle, UtensilsCrossed, Leaf, Wind, Sparkles
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
type MenuCategory = { id: number; name: string; description: string; sort_order: number; is_active: boolean };
type MenuItem = {
    id: number; category_id: number; name: string; description: string;
    price: number; is_veg: boolean; is_available: boolean; image_url: string | null;
    preparation_time_mins: number; sort_order: number;
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
function BookingModal({ room, subdomain, onClose, onSuccess, adjustedPrice }: {
    room: Room; subdomain: string; onClose: () => void; onSuccess: (data: any) => void; adjustedPrice: (base: number) => number;
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
                <div className="relative h-32 bg-gradient-to-br from-primary to-primary-hover p-6 flex flex-col justify-end">
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
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check-out</label>
                            <input type="date" required value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })}
                                min={form.checkIn || new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full name</label>
                        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="you@email.com"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                            <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                    </div>

                    {nights > 0 && (
                        <div className="bg-[#F7F4EF] rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{nights} night{nights > 1 ? 's' : ''} x ₹{adjustedPrice(room.price_per_night).toLocaleString()}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Taxes included</p>
                            </div>
                            <p className="text-xl font-bold text-primary">₹{(nights * adjustedPrice(room.price_per_night)).toLocaleString()}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2">
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
                    Your reservation <span className="font-semibold text-primary">{data.booking_id}</span> has been received.
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
                        <span className="font-bold text-primary">₹{Number(data.amount).toLocaleString()}</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">You'll receive a confirmation email shortly.</p>
                <button onClick={onClose} className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-hover transition-all text-sm">
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
    const { subdomain: pathSubdomain } = useParams<{ subdomain?: string }>();
    const hostSubdomain = getSubdomain();
    const subdomain = pathSubdomain || hostSubdomain || '';

    const [siteData, setSiteData] = useState<SiteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<any>(null);
    const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [activeMenuCat, setActiveMenuCat] = useState<number | null>(null);
    const [menuSearch, setMenuSearch] = useState('');
    const [pageContent, setPageContent] = useState<any[]>([]);

    // Hero booking strip state
    const [heroCheckIn, setHeroCheckIn] = useState('');
    const [heroCheckOut, setHeroCheckOut] = useState('');
    const [heroGuests, setHeroGuests] = useState(2);
    const heroCheckInRef = useRef<HTMLInputElement>(null);
    const heroCheckOutRef = useRef<HTMLInputElement>(null);

    // Occupancy-based pricing
    const { adjustedPrice } = useTenantOccupancyPricing(
        siteData?.tenant?.id,
        siteData?.rooms || []
    );

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

            const { data: contentData } = await supabase.from('page_content').select('*').eq('tenant_id', data.tenant.id);
            if (contentData) setPageContent(contentData);

            // Fetch menu data for restaurant/combined tenants
            const bType = data.tenant.business_type;
            if (bType === 'restaurant' || bType === 'combined') {
                const [catRes, itemRes] = await Promise.all([
                    supabase.from('menu_categories').select('*').eq('tenant_id', data.tenant.id).eq('is_active', true).order('sort_order'),
                    supabase.from('menu_items').select('*').eq('tenant_id', data.tenant.id).eq('is_available', true).order('sort_order'),
                ]);
                if (catRes.data) setMenuCategories(catRes.data);
                if (itemRes.data) setMenuItems(itemRes.data);
                if (catRes.data && catRes.data.length > 0) setActiveMenuCat(catRes.data[0].id);
            }

            setLoading(false);
        })();
    }, [subdomain]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background animate-pulse">
                {/* Skeleton navbar */}
                <div className="h-16 bg-white/80 border-b border-gray-100/80" />
                {/* Skeleton hero */}
                <div className="h-[60vh] bg-gray-200/50" />
                {/* Skeleton booking strip */}
                <div className="max-w-5xl mx-auto -mt-8 px-6">
                    <div className="h-24 bg-white rounded-2xl shadow-sm" />
                </div>
                {/* Skeleton room cards */}
                <div className="max-w-6xl mx-auto px-6 py-28">
                    <div className="h-8 w-48 bg-gray-200/60 rounded mx-auto mb-16" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                                <div className="h-64 bg-gray-200/50" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 w-32 bg-gray-200/60 rounded" />
                                    <div className="h-4 w-full bg-gray-100 rounded" />
                                    <div className="h-10 w-full bg-gray-100 rounded-xl mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !siteData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-white/10 mb-4">404</h1>
                    <p className="text-white/50 text-lg mb-2">Property not found</p>
                    <p className="text-white/30 text-sm">This site doesn't exist or has been deactivated.</p>
                </div>
            </div>
        );
    }

    const { tenant, rooms, testimonials, settings } = siteData;

    const getContent = (section: string, key: string, field: 'content_text' | 'image_url' = 'content_text') => {
        const block = pageContent.find(p => p.section === section && p.block_key === key);
        return block && block[field] ? block[field] : null;
    };

    const contactEmail = getContent('contact', 'email') || settings.contactEmail || '';
    const contactPhone = getContent('contact', 'phone') || settings.contactPhone || '';
    const contactAddress = getContent('contact', 'address') || settings.contactAddress || '';
    const googleMapsUrl = settings.googleMapsUrl || '';
    const heroTitle = getContent('hero', 'title') || settings.heroTitle || tenant.business_name;
    const heroSubtitle = getContent('hero', 'subtitle') || settings.heroSubtitle || 'Experience comfort and luxury';
    const aboutText = getContent('about', 'body') || settings.aboutText || '';

    // Additional items that might be configurable inside pageContent
    const heroBtn = getContent('hero', 'button_text') || 'Book now';
    const aboutHeading = getContent('about', 'heading') || tenant.business_name;
    const heroBgImage = getContent('hero', 'bgImage', 'image_url') || tenant.hero_image_url;
    const optionalAboutImage = getContent('about', 'aboutImage', 'image_url');

    const vis = tenant.sections_visible || { hero: true, rooms: true, testimonials: true, about: true, contact: true, menu: true };

    const isHotel = tenant.business_type === 'hotel' || tenant.business_type === 'combined';
    const isRestaurant = tenant.business_type === 'restaurant' || tenant.business_type === 'combined';

    const whatsappNumberOverride = getContent('contact', 'whatsapp') || settings.whatsappNumber;
    const whatsappBase = whatsappNumberOverride || contactPhone;
    const whatsappNumber = whatsappBase.replace(/[\s\(\)\-\+]/g, '');
    const buildWhatsAppOrderUrl = () => {
        const text = encodeURIComponent(`Hi, I'd like to place an order from ${tenant.business_name}. Can I see the menu?`);
        return `https://wa.me/${whatsappNumber}?text=${text}`;
    };


    const handleHeroBook = () => {
        const el = document.getElementById('rooms');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div id="main-content" className="min-h-screen bg-background font-sans text-gray-900 antialiased overflow-x-hidden">
            {/* ===== NAVBAR ===== */}
            <nav className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {tenant.logo_url ? (
                            <img src={tenant.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{tenant.business_name.charAt(0)}</span>
                            </div>
                        )}
                        <span className="font-serif font-bold text-primary tracking-tight">{tenant.business_name}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm">
                        {isHotel && <a href="#rooms" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Rooms</a>}
                        {isRestaurant && menuCategories.length > 0 && <a href="#menu" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Menu</a>}
                        {testimonials.length > 0 && <a href="#reviews" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Reviews</a>}
                        {aboutText && <a href="#about" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">About</a>}
                        <a href="#location" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Location</a>
                        <a href="#contact" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Contact</a>
                    </div>
                    {isHotel ? (
                        <a href="#rooms" className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-hover transition-all shadow-sm hover:shadow-md">Book now</a>
                    ) : (
                        <a href={buildWhatsAppOrderUrl()} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                            <MessageCircle size={16} /> Order now
                        </a>
                    )}
                </div>
            </nav>

            {/* ===== HERO ===== */}
            {vis.hero !== false && (
                <section className="relative pt-16 min-h-[65vh] flex flex-col justify-center">
                    {/* Background Wrapper */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        {heroBgImage ? (
                            <>
                                <img src={heroBgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
                        )}
                        {/* Decorative */}
                        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/90 to-transparent backdrop-blur-[2px] z-10 pointer-events-none" />
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }} />
                    </div>

                    {/* Hero content */}
                    <div className="relative z-20 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-6 pt-24 pb-32 md:pt-32 md:pb-40 w-full text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-3xl mx-auto md:mx-0 flex flex-col items-center md:items-start"
                        >
                            <h1
                                className="font-serif text-4xl md:text-5xl lg:text-[64px] font-bold text-white leading-[1.15] tracking-tight mb-6"
                            >
                                {heroTitle.split(',').join('\n')}
                            </h1>
                            <p className="text-lg md:text-[20px] text-white/95 leading-relaxed mb-10 max-w-2xl font-light">
                                {heroSubtitle}
                            </p>

                            {/* Quick stats - Glass strip */}
                            <div className="inline-flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/5 rounded-2xl md:rounded-full px-6 py-3">
                                {isHotel && rooms.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">{rooms.length}</span>
                                        <span className="text-white/80 text-sm">Rooms</span>
                                    </div>
                                )}
                                {isRestaurant && menuItems.length > 0 && (
                                    <>
                                        {isHotel && rooms.length > 0 && <span className="text-white/30">|</span>}
                                        <div className="flex items-center gap-2">
                                            <UtensilsCrossed size={14} className="text-accent" />
                                            <span className="text-white font-semibold">{menuItems.length}</span>
                                            <span className="text-white/80 text-sm">Dishes</span>
                                        </div>
                                    </>
                                )}
                                {testimonials.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-1.5 hidden md:flex">
                                            <span className="text-white/30">|</span>
                                            <span className="text-accent">★</span>
                                            <span className="text-white font-semibold flex items-center gap-1">
                                                {(testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)}
                                                <span className="text-white/80 font-normal text-xs">rating</span>
                                            </span>
                                        </div>
                                    </>
                                )}
                                {isHotel && rooms.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-1.5 hidden md:flex">
                                            <span className="text-white/30">|</span>
                                            <span className="text-white font-semibold flex items-center gap-1">
                                                <span className="text-accent text-xs font-normal">₹</span>
                                                {Math.min(...rooms.map(r => adjustedPrice(r.price_per_night))).toLocaleString()}
                                                <span className="text-white/80 font-normal text-xs">starting</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 md:hidden">
                                            <span className="text-white/30">|</span>
                                            <span className="text-accent">★</span>
                                            <span className="text-white font-semibold">{(testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)}</span>
                                            <span className="text-white/30 ml-2">|</span>
                                            <span className="text-white font-semibold">₹{Math.min(...rooms.map(r => adjustedPrice(r.price_per_night))).toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* ===== INLINE BOOKING STRIP (Hotel only) ===== */}
                    {isHotel && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="sticky top-[60px] md:relative z-40 w-full px-4 md:px-6 max-w-5xl mx-auto pb-6 md:pb-0 md:-mb-10 mt-6 md:mt-0"
                        >
                            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/40 overflow-hidden">
                                <div className="grid grid-cols-2 md:flex md:flex-row items-stretch">
                                    {/* Check-in */}
                                    <div className="col-span-1 min-w-0 p-3 md:p-5 flex flex-col gap-1 relative border-b border-r border-gray-100 md:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer focus-within:bg-gray-50">
                                        <label className="absolute inset-0 w-full h-full cursor-pointer z-10 shrink-0 select-none">
                                            <input ref={heroCheckInRef} type="date" min={new Date().toISOString().split('T')[0]}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    setHeroCheckIn(e.target.value);
                                                    if (heroCheckOut && new Date(e.target.value) >= new Date(heroCheckOut)) {
                                                        const next = new Date(e.target.value); next.setDate(next.getDate() + 1);
                                                        setHeroCheckOut(next.toISOString().split('T')[0]);
                                                    }
                                                }} />
                                        </label>
                                        <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase font-semibold truncate">Check-in</span>
                                        <div className="flex items-center gap-2 text-primary font-semibold min-w-0">
                                            <Calendar size={16} className="text-accent hidden sm:block shrink-0" />
                                            <span className="text-sm truncate">{heroCheckIn ? new Date(heroCheckIn + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Select date'}</span>
                                        </div>
                                    </div>

                                    {/* Check-out */}
                                    <div className="col-span-1 min-w-0 p-3 md:p-5 flex flex-col gap-1 relative border-b border-gray-100 md:border-b-0 md:border-r hover:bg-gray-50/50 transition-colors cursor-pointer focus-within:bg-gray-50">
                                        <label className="absolute inset-0 w-full h-full cursor-pointer z-10 shrink-0 select-none">
                                            <input ref={heroCheckOutRef} type="date" min={heroCheckIn || new Date().toISOString().split('T')[0]}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => setHeroCheckOut(e.target.value)} />
                                        </label>
                                        <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase font-semibold truncate">Check-out</span>
                                        <div className="flex items-center gap-2 text-primary font-semibold min-w-0">
                                            <Calendar size={16} className="text-accent hidden sm:block shrink-0" />
                                            <span className="text-sm truncate">{heroCheckOut ? new Date(heroCheckOut + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Select date'}</span>
                                        </div>
                                    </div>

                                    {/* Guests */}
                                    <div className="col-span-2 md:col-span-1 md:flex-1 p-3 md:p-5 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-1 border-b border-gray-100 md:border-b-0 md:border-r">
                                        <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase font-semibold md:mb-1">Guests</span>
                                        <div className="flex items-center gap-3">
                                            <Users size={16} className="text-accent hidden md:block" />
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => setHeroGuests(Math.max(1, heroGuests - 1))}
                                                    className="w-8 h-8 md:w-7 md:h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500">
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-sm font-semibold text-primary w-12 text-center">{heroGuests} Guest{heroGuests > 1 ? 's' : ''}</span>
                                                <button type="button" onClick={() => setHeroGuests(Math.min(16, heroGuests + 1))}
                                                    disabled={heroGuests >= 16}
                                                    className="w-8 h-8 md:w-7 md:h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="col-span-2 md:col-span-1 p-3 md:p-4 flex items-center bg-gray-50/30">
                                        <button
                                            onClick={handleHeroBook}
                                            className="w-full md:w-auto bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                        >
                                            Check Availability
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-background py-2 md:py-2.5 text-center border-t border-gray-100">
                                    <p className="text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.15em] text-gray-400 uppercase font-medium">
                                        Best Rate Guarantee <span className="text-accent mx-1 md:mx-2">•</span> No fees <span className="text-accent mx-1 md:mx-2">•</span> Free cancel
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </section>
            )}

            {/* ===== QUICK HIGHLIGHTS / AMENITIES ===== */}
            {isHotel && (
                <section className="py-12 md:py-20 px-6 bg-white border-b border-gray-100 hidden md:block">
                    <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-6">
                        {[
                            { label: 'Free WiFi', icon: Wifi },
                            { label: 'Air Conditioned', icon: Wind },
                            { label: 'Free Parking', icon: Car },
                            { label: '24/7 Check-in', icon: Clock },
                            { label: 'Room Service', icon: Coffee },
                            { label: 'Daily Cleaning', icon: Sparkles }
                        ].map((amenity, idx) => {
                            const Icon = amenity.icon;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                    <Icon size={24} className="text-gray-400 mb-1" />
                                    <span className="text-xs font-semibold text-gray-700 tracking-wide">{amenity.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ===== ROOMS (Hotel only) ===== */}
            {isHotel && vis.rooms !== false && rooms.length > 0 && (
                <section id="rooms" className="py-16 md:py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">Accommodation</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {rooms.map((room, i) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 flex flex-col"
                                >
                                    {/* Room image -- 70% height aspect ratio via sizing */}
                                    <div className="relative h-72 md:h-80 overflow-hidden shrink-0">
                                        {room.images?.[0] ? (
                                            <img src={room.images[0]} alt={room.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            /* Elegant placeholder for missing images */
                                            <div className="w-full h-full bg-gradient-to-br from-primary/8 via-accent/5 to-primary/10 flex items-center justify-center backdrop-blur-sm">
                                                <div className="text-center">
                                                    <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center mx-auto mb-3">
                                                        <Camera size={24} className="text-primary/30" />
                                                    </div>
                                                    <p className="text-xs text-primary/40 font-medium">{room.type}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Price overlay on image */}
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                                                <p className="text-lg font-bold text-primary">₹{adjustedPrice(room.price_per_night).toLocaleString()}<span className="text-[10px] font-normal text-gray-400 ml-0.5">/night</span></p>
                                            </div>
                                        </div>

                                        {/* Status tags on image */}
                                        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                            {room.is_available === false ? (
                                                <div className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                                    Sold Out
                                                </div>
                                            ) : (
                                                <div className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                                    Available
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-primary text-xl mb-1">{room.name}</h3>
                                                <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <span>{room.max_occupancy} guests</span>
                                                    {room.amenities && room.amenities.length > 0 && (
                                                        <>
                                                            <span className="text-gray-300">•</span>
                                                            <span>{room.amenities.slice(0, 2).join(' • ')}</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 flex gap-3">
                                            <Link
                                                to={hostSubdomain ? `/room/${room.id}` : `/site/${subdomain}/room/${room.id}`}
                                                className="flex-1 bg-white text-primary font-semibold py-3 rounded-xl text-sm border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-center"
                                            >
                                                Explore
                                            </Link>
                                            <button
                                                onClick={() => setBookingRoom(room)}
                                                className="flex-1 bg-primary text-white font-semibold py-3 rounded-xl text-sm hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== RESTAURANT MENU ===== */}
            {isRestaurant && vis.menu !== false && menuCategories.length > 0 && (
                <section id="menu" className="py-28 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Our menu</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">What we serve</h2>
                            <p className="text-gray-500 mt-4 max-w-lg mx-auto">Fresh ingredients, bold flavors. Browse our menu and order via WhatsApp.</p>
                        </div>

                        {/* Category tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                            {menuCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveMenuCat(cat.id)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeMenuCat === cat.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Menu items grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {menuItems
                                .filter(item => item.category_id === activeMenuCat)
                                .map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05, duration: 0.4 }}
                                        className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:shadow-md hover:border-gray-200 transition-all group"
                                    >
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} loading="lazy" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0">
                                                <span className="text-2xl">{item.is_veg ? '🥬' : '🍗'}</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${item.is_veg ? 'border-green-600' : 'border-red-600'}`}>
                                                        <span className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`} />
                                                    </span>
                                                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                                </div>
                                                <p className="font-bold text-primary text-sm whitespace-nowrap">₹{item.price}</p>
                                            </div>
                                            {item.description && (
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                                            )}
                                            {item.preparation_time_mins > 0 && (
                                                <p className="text-[10px] text-gray-300 mt-2 flex items-center gap-1">
                                                    <Clock size={10} /> {item.preparation_time_mins} min
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                        </div>

                        {/* WhatsApp order CTA */}
                        {contactPhone && (
                            <div className="text-center mt-16">
                                <a
                                    href={buildWhatsAppOrderUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 bg-green-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 text-sm"
                                >
                                    <MessageCircle size={20} />
                                    Order via WhatsApp
                                </a>
                                <p className="text-xs text-gray-400 mt-3">Send us your order and we'll confirm within minutes</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ===== TESTIMONIALS -- 3-column grid ===== */}
            {vis.testimonials !== false && testimonials.length > 0 && (
                <section id="reviews" className="py-28 px-6 bg-primary">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Guest reviews</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">What our guests say</h2>
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

                        {/* Grid -- up to 3 */}
                        <div className={`grid gap-6 ${testimonials.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : testimonials.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                            {testimonials.slice(0, 3).map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition-colors duration-300 flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        <Stars count={t.rating} />
                                    </div>

                                    <p className="text-white/90 text-[15px] leading-relaxed mb-6 line-clamp-4 italic flex-1">
                                        "{t.review_text}"
                                    </p>

                                    <div className="flex items-center gap-3 pt-5 border-t border-white/10 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center ring-2 ring-white/10 shrink-0">
                                            <span className="text-accent font-bold">{t.guest_name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{t.guest_name}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Google Reviews link */}
                        <div className="text-center mt-12">
                            <a href={tenant.google_review_url || '#'} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/10 rounded-full px-8 py-3 hover:bg-white/20 transition-all border border-white/10">
                                <span>View all reviews</span>
                                <ArrowRight size={16} className="text-white" />
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== ABOUT ===== */}
            {vis.about !== false && aboutText && (
                <section id="about" className="py-28 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">About us</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-8">{aboutHeading}</h2>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">{aboutText}</p>
                    </div>
                </section>
            )}

            {/* ===== LOCATION + MAP ===== */}
            <section id="location" className="py-16 md:py-24 px-6 bg-white border-t border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">Perfectly Located</h2>
                    </div>

                    {/* Proximity Distance Badges */}
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-10 max-w-4xl mx-auto">
                        {[
                            { icon: '📍', value: '600m', label: settings.locationStat1Label || 'from Beach' },
                            { icon: '🚗', value: '2km', label: settings.locationStat2Label || 'from Town Center' },
                            { icon: '✈️', value: '15 min', label: settings.locationStat3Label || 'from Airport' },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center justify-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-5 py-2.5">
                                <span className="text-lg">{stat.icon}</span>
                                <span className="font-bold text-[#0E2A38] text-sm">{stat.value}</span>
                                <span className="text-gray-500 text-sm">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Map embed */}
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[300px] md:h-[400px]">
                        {settings.googleMapsUrl ? (
                            <iframe
                                title="Location"
                                className="w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.googleMapsUrl.startsWith('http') ? settings.googleMapsUrl.replace('https://maps.google.com/maps?q=', '').replace('https://www.google.com/maps?q=', '') : settings.googleMapsUrl)}&output=embed&z=15`}
                            />
                        ) : tenant.google_place_id ? (
                            <iframe
                                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}&q=place_id:${tenant.google_place_id}`}
                                className="w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                                title="Location"
                            />
                        ) : contactAddress ? (
                            <iframe
                                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(contactAddress)}`}
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
                            <a
                                href={`https://maps.google.com/maps?q=${encodeURIComponent(contactAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors group"
                            >
                                <MapPin size={18} className="text-accent group-hover:scale-110 transition-transform shrink-0" />
                                <span className="text-sm text-gray-600 whitespace-pre-wrap text-left leading-relaxed max-w-lg">
                                    {contactAddress}
                                </span>
                                <ExternalLink size={14} className="text-gray-300 group-hover:text-primary ml-1 shrink-0" />
                            </a>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ===== DIRECT BOOKING BENEFITS (Hotel only) ===== */}
            {isHotel && (
                <section className="py-20 px-6 bg-primary relative overflow-hidden">
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />

                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
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
                                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                                            <Icon size={20} className="text-accent" />
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
                                className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 text-sm"
                            >
                                Browse rooms & book
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== CONTACT / FOOTER ===== */}
            {vis.contact !== false && (
                <footer id="contact" className="bg-ocean-950 text-white py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    {tenant.logo_url ? (
                                        <img src={tenant.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{tenant.business_name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <span className="font-serif font-bold text-lg tracking-tight">{tenant.business_name}</span>
                                </div>
                                {aboutText && <p className="text-white/40 text-sm leading-relaxed line-clamp-3">{aboutText}</p>}
                            </div>

                            {/* Quick links */}
                            <div>
                                <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em] mb-4">Quick links</p>
                                <ul className="space-y-3 text-sm">
                                    {isHotel && <li><a href="#rooms" className="text-white/50 hover:text-white transition-colors">Rooms</a></li>}
                                    {isRestaurant && menuCategories.length > 0 && <li><a href="#menu" className="text-white/50 hover:text-white transition-colors">Menu</a></li>}
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
                                            <Phone size={14} className="text-accent" />
                                            <a href={`tel:${contactPhone}`} className="hover:text-white transition-colors">{contactPhone}</a>
                                        </li>
                                    )}
                                    {contactEmail && (
                                        <li className="flex items-center gap-3 text-white/50">
                                            <Mail size={14} className="text-accent" />
                                            <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">{contactEmail}</a>
                                        </li>
                                    )}
                                    {contactAddress && (
                                        <li className="flex items-start gap-3 text-white/50">
                                            <MapPin size={14} className="text-accent mt-0.5 shrink-0" />
                                            <span>{contactAddress}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} {tenant.business_name}. All rights reserved.</p>
                            <p className="text-xs text-white/20">
                                Powered by <a href="/" className="text-accent/50 hover:text-accent transition-colors">HospitalityOS</a>
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
                            {isHotel && rooms.length > 0 ? (
                                <>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400">Starting from</p>
                                        <p className="text-lg font-bold text-accent">₹{Math.min(...rooms.map(r => adjustedPrice(r.price_per_night))).toLocaleString()}<span className="text-xs font-normal text-gray-400">/night</span></p>
                                    </div>
                                    <a href="#rooms" className="bg-primary text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-primary-hover transition-all">
                                        Book now <ArrowRight size={14} />
                                    </a>
                                </>
                            ) : isRestaurant ? (
                                <>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400">{menuItems.length} dishes available</p>
                                        <p className="text-sm font-semibold text-gray-700">Browse our menu</p>
                                    </div>
                                    <a href={buildWhatsAppOrderUrl()} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-lg shadow-green-500/20 flex items-center gap-2 hover:bg-green-600 transition-all">
                                        <MessageCircle size={14} /> Order
                                    </a>
                                </>
                            ) : null}
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
                        adjustedPrice={adjustedPrice}
                    />
                )}
                {bookingSuccess && (
                    <BookingConfirmation
                        data={bookingSuccess}
                        onClose={() => { setBookingSuccess(null); setBookingRoom(null); }}
                    />
                )}
            </AnimatePresence>

            {/* ===== WHATSAPP FAB ===== */}
            {contactPhone && (
                <motion.a
                    href={`https://wa.me/${contactPhone.replace(/[\s\(\)\-\+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
                >
                    <MessageCircle size={28} />
                    <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-medium py-1.5 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat with us
                    </span>
                </motion.a>
            )}

            {/* ===== MOBILE STICKY BOOK NOW ===== */}
            {isHotel && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
                    <button
                        onClick={handleHeroBook}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                    >
                        Check Availability
                        <ArrowRight size={16} />
                    </button>
                    {/* Padding utility to handle the fixed footer covering content below */}
                    <style>{`
                        #main-content { padding-bottom: 80px; }
                        @media (min-width: 768px) { #main-content { padding-bottom: 0; } }
                    `}</style>
                </div>
            )}
        </div>
    );
}
