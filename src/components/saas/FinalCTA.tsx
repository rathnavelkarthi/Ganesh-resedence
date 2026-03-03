import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
    return (
        <section className="py-24 lg:py-32">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.8 }}
                    className="text-center bg-gradient-to-br from-[#0E2A38] to-[#091b24] rounded-2xl py-20 lg:py-24 px-6 relative overflow-hidden"
                >
                    {/* Subtle glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-accent/[0.06] rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-tight mb-4 max-w-3xl mx-auto">
                            Ready to Run Your Entire Hospitality Business From One Platform?
                        </h2>
                        <p className="text-base text-white/40 mb-10 max-w-md mx-auto">
                            Stop duct-taping tools together. Get a single system that runs your revenue.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                Schedule Strategy Call
                                <ArrowRight size={16} />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl font-semibold text-sm transition-all">
                                Start Demo
                            </button>
                        </div>
                        <p className="mt-6 text-xs text-white/25 font-medium tracking-wide">
                            No long-term lock-in. Secure infrastructure. Dedicated onboarding.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
