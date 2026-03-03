import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Play, BarChart3, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

/* ── animated problem-to-solution strip ── */
function ProblemStrip() {
    const tools = ['Bookings', 'POS', 'Payroll', 'Inventory', 'WhatsApp', 'OTAs'];
    const [resolved, setResolved] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setResolved(true), 2400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 lg:mt-20"
        >
            <div className="bg-white/60 backdrop-blur-sm border border-foreground/5 rounded-2xl px-6 py-5 max-w-3xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="text-[11px] font-semibold text-foreground/35 uppercase tracking-widest shrink-0">
                        Currently managing:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {tools.map((tool, i) => (
                            <motion.span
                                key={tool}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: resolved ? 0.3 : 1,
                                    scale: resolved ? 0.95 : 1,
                                    textDecoration: resolved ? 'line-through' : 'none',
                                }}
                                transition={{ duration: 0.4, delay: resolved ? i * 0.06 : 0.9 + i * 0.07 }}
                                className="text-xs font-medium text-foreground/60 bg-foreground/[0.04] px-3 py-1.5 rounded-lg"
                            >
                                {tool}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Resolved line */}
                <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={resolved ? { opacity: 1, height: 'auto', marginTop: 12 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="overflow-hidden"
                >
                    <div className="flex items-center gap-2 pt-3 border-t border-foreground/5">
                        <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        >
                            <ArrowRight size={14} className="text-accent" />
                        </motion.div>
                        <span className="text-sm font-bold text-foreground">
                            All replaced by <span className="text-accent">HospitalityOS</span>
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

/* ── floating metric badges ── */
function FloatingMetrics() {
    return (
        <>
            {/* Top right - direct bookings */}
            <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -top-4 -right-4 lg:-right-8 z-20"
            >
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="bg-white rounded-xl shadow-lg border border-foreground/5 p-3 flex items-center gap-2.5"
                >
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <TrendingUp size={16} className="text-success" />
                    </div>
                    <div>
                        <p className="text-[10px] text-foreground/40 font-medium">Direct bookings</p>
                        <p className="text-sm font-bold text-success">+28%</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom left - manual coordination */}
            <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-4 -left-4 lg:-left-8 z-20"
            >
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                    className="bg-white rounded-xl shadow-lg border border-foreground/5 p-3 flex items-center gap-2.5"
                >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Clock size={16} className="text-accent" />
                    </div>
                    <div>
                        <p className="text-[10px] text-foreground/40 font-medium">Manual coordination</p>
                        <p className="text-sm font-bold text-accent">-40%</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Mid right - reconciliation */}
            <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute top-1/2 -right-6 lg:-right-12 -translate-y-1/2 z-20 hidden lg:block"
            >
                <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                    className="bg-white rounded-xl shadow-lg border border-foreground/5 p-3 flex items-center gap-2.5"
                >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 size={16} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] text-foreground/40 font-medium">Reconciliation</p>
                        <p className="text-sm font-bold text-primary">3x faster</p>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}

/* ── dashboard mockup ── */
function DashboardMockup() {
    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Radial glow behind mockup */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[60px] pointer-events-none -z-10"
                style={{ background: 'radial-gradient(circle, rgba(14,42,56,0.06) 0%, rgba(201,166,70,0.03) 50%, transparent 100%)' }}
            />

            {/* Main dashboard card with 3D tilt */}
            <motion.div
                initial={{ opacity: 0, y: 30, rotateX: 8, rotateY: -8 }}
                animate={{ opacity: 1, y: 0, rotateX: 4, rotateY: -4 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
                className="bg-white rounded-2xl shadow-[0_25px_80px_rgba(14,42,56,0.15)] border border-foreground/5 overflow-hidden"
            >
                {/* Top bar */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-foreground/5 bg-ocean-50/50">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-success/40" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="bg-ocean-100/60 rounded-md px-3 py-1 text-[10px] text-foreground/40 font-medium">
                            dashboard.hospitalityos.com
                        </div>
                    </div>
                </div>

                {/* Dashboard content */}
                <div className="p-5 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Revenue', value: '₹8.2L', change: '+12.5%' },
                            { label: 'Occupancy', value: '87%', change: '+4.2%' },
                            { label: 'Bookings', value: '142', change: '+23' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                className="bg-ocean-50 rounded-xl p-3"
                            >
                                <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-wider">{stat.label}</p>
                                <p className="text-lg font-bold text-foreground mt-0.5">{stat.value}</p>
                                <p className="text-[10px] text-success font-semibold mt-1">{stat.change}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart with glow */}
                    <div className="bg-ocean-50/50 rounded-xl p-4 relative">
                        {/* Subtle chart glow */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/[0.06] rounded-full blur-xl pointer-events-none" />
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-xs font-semibold text-foreground/70">Revenue trend</p>
                            <p className="text-[10px] text-foreground/30">Last 7 days</p>
                        </div>
                        <div className="flex items-end gap-1.5 h-16 relative z-10">
                            {[40, 55, 45, 65, 50, 75, 85].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.8, delay: 0.8 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex-1 rounded-md bg-gradient-to-t from-primary/80 to-primary/30"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recent bookings */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-foreground/70">Recent bookings</p>
                        {[
                            { name: 'Rahul M.', room: 'Deluxe Suite', amount: '₹4,500' },
                            { name: 'Priya S.', room: 'Standard Room', amount: '₹2,200' },
                        ].map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 + i * 0.15 }}
                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-ocean-50/40"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-primary">{b.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">{b.name}</p>
                                        <p className="text-[10px] text-foreground/40">{b.room}</p>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-foreground">{b.amount}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Floating metric badges */}
            <FloatingMetrics />
        </div>
    );
}

/* ── hero section ── */
export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-8 lg:pt-44 lg:pb-12 overflow-hidden">
            {/* Layered background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#eee9e0] via-background to-[#f0ede7] -z-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 -z-10" />

            {/* Ambient radial glow */}
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none -z-10" />

            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
                    {/* Left - copy */}
                    <div className="max-w-[480px]">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl md:text-5xl lg:text-[52px] font-extrabold text-foreground tracking-tight leading-[1.12] mb-6"
                        >
                            The Operating System for Modern Hospitality.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="text-base lg:text-lg text-foreground/50 leading-relaxed mb-10"
                        >
                            Replace disconnected bookings, POS, payroll, inventory, and analytics with one unified platform built for serious operators.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <button className="px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-[0_4px_20px_rgba(201,166,70,0.3)] hover:shadow-[0_6px_28px_rgba(201,166,70,0.4)] flex items-center justify-center gap-2">
                                Schedule Strategy Call
                                <ArrowRight size={16} />
                            </button>
                            <button className="px-7 py-4 bg-white hover:bg-ocean-50 text-foreground border border-foreground/10 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2">
                                <Play size={14} className="text-foreground/40" />
                                Watch 2-Minute Overview
                            </button>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-5 text-xs text-foreground/30 font-medium tracking-wide"
                        >
                            Built for modern hotels and restaurants.
                        </motion.p>
                    </div>

                    {/* Right - dashboard mockup */}
                    <div className="lg:pl-4">
                        <DashboardMockup />
                    </div>
                </div>

                {/* Problem-to-solution strip */}
                <ProblemStrip />
            </div>
        </section>
    );
}
