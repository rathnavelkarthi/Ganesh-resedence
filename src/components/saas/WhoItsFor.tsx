import { motion } from 'motion/react';
import { Building, Trees, UtensilsCrossed, Network } from 'lucide-react';

const segments = [
    {
        icon: Building,
        title: 'Boutique Hotels',
        description: 'Full direct-booking website, real-time CRM, revenue tracking, and guest management for properties with 5-50 rooms. Go live on a custom subdomain without hiring a developer.',
        iconBg: 'bg-primary/5',
        iconColor: 'text-primary',
    },
    {
        icon: Trees,
        title: 'Resorts',
        description: 'Unified control over rooms, restaurant billing, event bookings, and guest activities. One system handles stays, dining, spa, and everything in between.',
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
    },
    {
        icon: UtensilsCrossed,
        title: 'Restaurants',
        description: 'POS for dine-in and takeaway, inventory management, vendor tracking, direct billing, and staff payroll. Get a website with online reservations built in.',
        iconBg: 'bg-accent/10',
        iconColor: 'text-accent',
    },
    {
        icon: Network,
        title: 'Multi-Property Groups',
        description: 'Centralized analytics, role-based access across locations, and unified billing for hotel chains and restaurant groups. Each property gets its own subdomain and dashboard.',
        iconBg: 'bg-ocean-500/10',
        iconColor: 'text-ocean-600',
    },
];

export default function WhoItsFor() {
    return (
        <section id="about" className="py-24 lg:py-32 bg-white">
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
                        Built for
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-foreground tracking-tight leading-tight"
                    >
                        One system. Every type of property.
                    </motion.h2>
                </div>

                {/* Vertical cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {segments.map((seg, i) => (
                        <motion.div
                            key={seg.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="group border border-foreground/5 rounded-2xl p-7 hover:shadow-[0_12px_40px_rgba(14,42,56,0.08)] transition-all duration-300 hover:-translate-y-1 bg-background"
                        >
                            <div className={`w-12 h-12 rounded-xl ${seg.iconBg} flex items-center justify-center mb-5`}>
                                <seg.icon size={22} strokeWidth={1.8} className={seg.iconColor} />
                            </div>
                            <h3 className="text-base font-bold text-foreground mb-3">{seg.title}</h3>
                            <p className="text-sm text-foreground/40 leading-relaxed">{seg.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
