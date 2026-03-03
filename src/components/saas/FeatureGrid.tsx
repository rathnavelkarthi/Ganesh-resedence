import { motion } from 'motion/react';
import {
    CalendarCheck, Globe, UtensilsCrossed, Users,
    Package, Truck, UserCheck, RefreshCw, MessageCircle, BarChart3
} from 'lucide-react';

const coreModules = [
    {
        icon: CalendarCheck,
        title: 'Booking Engine',
        description: 'Accept direct bookings with zero commission. Real-time availability, instant confirmations, and automated guest communication.',
    },
    {
        icon: Globe,
        title: 'Website Builder',
        description: 'Launch a branded property website on your own subdomain in minutes. SEO-ready templates with booking integration built in.',
    },
    {
        icon: UtensilsCrossed,
        title: 'Restaurant POS',
        description: 'Handle dine-in, takeaway, and room-service orders. Menu management, KOT printing, split billing, and table tracking.',
    },
    {
        icon: Users,
        title: 'Staff & Payroll',
        description: 'Assign shifts, track attendance, manage roles, and run automated salary calculations with tax deductions.',
    },
];

const secondaryModules = [
    { icon: Package, title: 'Inventory', description: 'Track kitchen stock, room supplies, and auto-alerts on low thresholds.' },
    { icon: Truck, title: 'Vendor Payouts', description: 'Manage vendor invoices, purchase orders, and payment cycles.' },
    { icon: UserCheck, title: 'CRM', description: 'Guest profiles, booking history, and segmented communication.' },
    { icon: RefreshCw, title: 'OTA Sync', description: 'Two-way sync with Booking.com, MakeMyTrip, and Goibibo.' },
    { icon: MessageCircle, title: 'WhatsApp Automation', description: 'Booking confirmations, reminders, and check-in messages on autopilot.' },
    { icon: BarChart3, title: 'Revenue Analytics', description: 'Revenue, occupancy, channel mix, and guest data in one unified view.' },
];

export default function FeatureGrid() {
    return (
        <section id="features" className="py-24 lg:py-32">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.6 }}
                        className="text-xs font-semibold text-accent uppercase tracking-widest mb-3"
                    >
                        Platform
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-foreground tracking-tight leading-tight"
                    >
                        One System. Total Operational Control.
                    </motion.h2>
                </div>

                {/* Core modules - large cards (2x2) */}
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    {coreModules.map((mod, i) => (
                        <motion.div
                            key={mod.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="group bg-primary text-white rounded-2xl p-8 hover:shadow-[0_16px_50px_rgba(14,42,56,0.25)] transition-all duration-300 hover:-translate-y-0.5 cursor-default relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                                    <mod.icon size={24} strokeWidth={1.8} className="text-accent" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{mod.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed max-w-md">{mod.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Secondary modules - smaller cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {secondaryModules.map((mod, i) => (
                        <motion.div
                            key={mod.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                            className="group bg-white border border-foreground/5 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgba(14,42,56,0.06)] hover:border-foreground/10 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                        >
                            <div className="w-10 h-10 rounded-xl bg-ocean-50 flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors duration-300">
                                <mod.icon size={20} strokeWidth={1.8} className="text-foreground/60 group-hover:text-primary transition-colors duration-300" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground mb-1.5">{mod.title}</h3>
                            <p className="text-xs text-foreground/40 leading-relaxed">{mod.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
