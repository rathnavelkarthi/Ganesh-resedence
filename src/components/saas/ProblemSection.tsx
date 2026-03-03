import { motion } from 'motion/react';
import {
    AlertTriangle,
    CalendarX,
    Globe,
    FileSpreadsheet,
    MessageCircle,
    Hotel,
    ClipboardList,
    TrendingDown,
    Users,
    Zap,
    ArrowRight,
} from 'lucide-react';

const fragmentedTools = [
    { icon: CalendarX, label: 'One tool for bookings', color: '#E74C3C' },
    { icon: Globe, label: 'Another for website', color: '#3498DB' },
    { icon: FileSpreadsheet, label: 'Excel for payroll', color: '#27AE60' },
    { icon: MessageCircle, label: 'WhatsApp for coordination', color: '#25D366' },
    { icon: Hotel, label: 'OTAs for revenue', color: '#F39C12' },
    { icon: ClipboardList, label: 'Manual inventory tracking', color: '#9B59B6' },
];

const painStats = [
    { icon: TrendingDown, value: '23%', label: 'Revenue leaked on average', color: '#E74C3C' },
    { icon: Users, value: '4.2hrs', label: 'Staff time wasted daily', color: '#F39C12' },
    { icon: Zap, value: '6+', label: 'Disconnected tools used', color: '#9B59B6' },
];

export default function ProblemSection() {
    return (
        <section className="py-20 lg:py-28 bg-[#F7F4EF] overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <p className="text-xs font-semibold text-destructive/70 uppercase tracking-[0.2em] mb-3">
                        The problem
                    </p>
                    <h2
                        className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-foreground tracking-tight leading-tight"
                    >
                        Hospitality Operations Are Fragmented.
                    </h2>
                    <p className="mt-4 text-foreground/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Most properties juggle half a dozen disconnected tools.
                        The result? Lost revenue, confused staff, and unhappy guests.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-stretch">
                    {/* Left — tool cards (3 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-5%' }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <p className="text-[11px] font-semibold text-foreground/35 uppercase tracking-[0.18em] mb-4">
                            Most properties use:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {fragmentedTools.map((tool, i) => {
                                const Icon = tool.icon;
                                return (
                                    <motion.div
                                        key={tool.label}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.35, delay: 0.12 + i * 0.05 }}
                                        className="group relative bg-white rounded-xl border border-foreground/[0.06] p-4 hover:shadow-lg hover:border-foreground/10 transition-all duration-300 cursor-default"
                                    >
                                        {/* colored top accent */}
                                        <div
                                            className="absolute top-0 left-4 right-4 h-[2px] rounded-b-full opacity-40 group-hover:opacity-80 transition-opacity"
                                            style={{ background: tool.color }}
                                        />
                                        <div
                                            className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                                            style={{ background: `${tool.color}12` }}
                                        >
                                            <Icon size={18} style={{ color: tool.color }} />
                                        </div>
                                        <p className="text-sm font-medium text-foreground/75 leading-snug">
                                            {tool.label}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Connector line visual */}
                        <div className="flex items-center gap-3 mt-5 pl-1">
                            <div className="flex-1 h-px bg-gradient-to-r from-destructive/30 via-destructive/10 to-transparent" />
                            <span className="text-[11px] font-semibold text-destructive/50 uppercase tracking-widest whitespace-nowrap">
                                No single source of truth
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-l from-destructive/30 via-destructive/10 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Right — result callout (2 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-5%' }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-2 bg-white border border-foreground/5 rounded-2xl p-7 lg:p-8 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-destructive" />
                            </div>
                            <p className="text-[11px] font-semibold text-foreground/35 uppercase tracking-[0.18em]">
                                The result
                            </p>
                        </div>

                        <p className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight leading-snug mb-6">
                            Revenue leakage.<br />
                            Staff confusion.<br />
                            Operational chaos.
                        </p>

                        {/* Stats */}
                        <div className="space-y-3 flex-1">
                            {painStats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
                                        className="flex items-center gap-3 bg-[#F7F4EF] rounded-lg px-4 py-3"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                                            style={{ background: `${stat.color}15` }}
                                        >
                                            <Icon size={16} style={{ color: stat.color }} />
                                        </div>
                                        <div>
                                            <span className="text-lg font-extrabold text-foreground tracking-tight">
                                                {stat.value}
                                            </span>
                                            <span className="text-xs text-foreground/45 ml-2">
                                                {stat.label}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-6 pt-5 border-t border-foreground/5">
                            <p className="text-base font-semibold text-accent tracking-wide flex items-center gap-2">
                                There's a better way
                                <ArrowRight size={16} className="text-accent" />
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
