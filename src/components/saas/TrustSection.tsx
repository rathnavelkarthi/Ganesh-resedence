import { motion } from 'motion/react';
import { Shield, Zap, Lock, Cloud } from 'lucide-react';

const items = [
    {
        icon: Shield,
        title: 'Secure Infrastructure',
        description: 'Enterprise-grade encryption at rest and in transit. Your guest data is yours alone.',
        accent: 'bg-emerald-500/10 text-emerald-600',
        border: 'border-l-emerald-400/50',
    },
    {
        icon: Zap,
        title: 'Real-time Sync',
        description: 'Changes to rates, rooms, and bookings propagate instantly across all OTAs.',
        accent: 'bg-amber-500/10 text-amber-600',
        border: 'border-l-amber-400/50',
    },
    {
        icon: Lock,
        title: 'Role-based Access',
        description: 'Front desk sees what they need. Managers see everything. No accidental edits.',
        accent: 'bg-blue-500/10 text-blue-600',
        border: 'border-l-blue-400/50',
    },
    {
        icon: Cloud,
        title: 'Cloud Hosted',
        description: '99.9% uptime with daily backups. Access your dashboard from any device, anywhere.',
        accent: 'bg-violet-500/10 text-violet-600',
        border: 'border-l-violet-400/50',
    },
];

export default function TrustSection() {
    return (
        <section className="py-24 lg:py-32 bg-[#F7F4EF]">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-14">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.7 }}
                        className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-4"
                    >
                        Built for Growing Hospitality Businesses.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-sm text-foreground/45 leading-relaxed"
                    >
                        Rock-solid infrastructure so you can focus on running your property, not managing software.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className={`bg-white rounded-2xl p-6 border border-foreground/5 border-l-4 ${item.border} flex gap-4 items-start`}
                        >
                            <div className={`w-10 h-10 rounded-xl ${item.accent} flex items-center justify-center shrink-0 mt-0.5`}>
                                <item.icon size={18} strokeWidth={1.8} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground mb-1.5">{item.title}</h4>
                                <p className="text-xs text-foreground/40 leading-relaxed">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
