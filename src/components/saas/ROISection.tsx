import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

function CountUp({ end, prefix = '', suffix = '', duration = 1800 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-10%' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = end / (duration / 16);
        const id = setInterval(() => {
            start = Math.min(start + step, end);
            setCount(Math.floor(start));
            if (start >= end) clearInterval(id);
        }, 16);
        return () => clearInterval(id);
    }, [inView, end, duration]);

    return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

const stats = [
    { label: 'Properties', end: 500, suffix: '+', prefix: '' },
    { label: 'Revenue Managed', end: 12, suffix: 'Cr+', prefix: '₹' },
    { label: 'Uptime', end: 98, suffix: '%', prefix: '' },
];

export default function ROISection() {
    return (
        <section className="py-24 lg:py-32 bg-[#0E2A38] relative overflow-hidden">
            {/* Noise */}
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

            <div className="max-w-[800px] mx-auto px-6 lg:px-8 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-15%' }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-tight mb-6"
                >
                    Your Software Should Generate Revenue.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-base text-white/40 mb-12 max-w-lg mx-auto leading-relaxed"
                >
                    Hotels using HospitalityOS see measurable revenue gains within the first quarter. Here's the math.
                </motion.p>

                {/* Animated stat counters */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="bg-white/[0.05] border border-white/[0.07] rounded-2xl py-6 px-4"
                        >
                            <p className="text-3xl lg:text-4xl font-extrabold text-[#C9A646] mb-1">
                                <CountUp end={s.end} prefix={s.prefix} suffix={s.suffix} />
                            </p>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 lg:p-10 text-left"
                >
                    <div className="space-y-5 text-[15px] font-medium text-white/80">
                        <p className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-white/20 shrink-0" />
                            Hotel revenue:
                            <span className="text-white text-lg font-bold ml-auto">₹10L/month</span>
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-white/20 shrink-0" />
                            Direct booking increase:
                            <span className="text-success text-lg font-bold ml-auto bg-success/10 px-2.5 py-0.5 rounded-lg">5%</span>
                        </p>
                    </div>

                    <div className="h-px bg-white/10 my-8" />

                    <div className="flex items-center justify-between">
                        <span className="text-white/50 text-sm">Additional annual revenue</span>
                        <span className="text-3xl lg:text-4xl font-extrabold text-[#C9A646]">₹6L / year</span>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
                        <p className="text-sm font-bold tracking-wide text-white/60">
                            Your system pays for itself <span className="text-white">3-5x over.</span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
