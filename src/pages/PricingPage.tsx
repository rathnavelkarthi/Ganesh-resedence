import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Zap, Receipt, Building2, ArrowRight } from 'lucide-react';
import BillingToggle from '../components/pricing/BillingToggle';
import PricingCard from '../components/pricing/PricingCard';
import FAQAccordion from '../components/pricing/FAQAccordion';

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true);

    // Pricing Data
    const basicPrice = isYearly ? "₹69,999" : "₹7,099";
    const proPrice = isYearly ? "₹1,24,999" : "₹12,699";
    const elitePrice = isYearly ? "₹1,99,999" : "₹20,399";

    return (
        <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-24 relative overflow-hidden text-[#0E2A38]">

            {/* Background Layering */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-[#EEF2F7] -z-20" />
            <div className="absolute inset-0 opacity-5 mix-blend-overlay -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">

                {/* HERO SECTION */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif text-5xl md:text-6xl lg:text-[72px] font-bold text-[#0E2A38] tracking-tight leading-[1.1] mb-6 drop-shadow-sm"
                    >
                        Simple Pricing.<br />Built for Serious Hotels.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl text-gray-500 font-medium tracking-wide"
                    >
                        One platform. Complete operational control. Predictable annual cost.
                    </motion.p>
                </div>

                {/* BILLING TOGGLE */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
                </motion.div>

                {/* PRICING GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-32 items-center">
                    <PricingCard
                        index={0}
                        name="BASIC"
                        price={basicPrice}
                        description="For independent hotels starting digital operations."
                        ctaText="Get Started"
                        features={[
                            "Direct Booking Website",
                            "Booking Engine",
                            "CRM Dashboard",
                            "Calendar & Room Management",
                            "Guest Management",
                            "GST Invoice System",
                            "Hosting & Maintenance"
                        ]}
                    />
                    <PricingCard
                        index={1}
                        name="PRO"
                        isPopular={true}
                        price={proPrice}
                        description="Complete operational platform to scale revenue."
                        ctaText="Start Pro Plan"
                        features={[
                            "Everything in BASIC, plus:",
                            "OTA Booking Sync",
                            "WhatsApp Automation",
                            "Revenue & Occupancy Analytics",
                            "Payment Tracking",
                            "Booking Source Breakdown",
                            "Priority Support"
                        ]}
                    />
                    <PricingCard
                        index={2}
                        name="ELITE"
                        price={elitePrice}
                        description="Advanced intelligence for established properties."
                        ctaText="Contact Sales"
                        features={[
                            "Everything in PRO, plus:",
                            "AI Revenue Insights",
                            "Forecasting & Analytics",
                            "Custom Branding",
                            "Dedicated Onboarding",
                            "API Access",
                            "Multi-Role Enterprise Control"
                        ]}
                    />
                </div>

                {/* ENTERPRISE SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-3xl p-10 lg:p-16 text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12 mb-32"
                >
                    <div className="text-left max-w-xl">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0E2A38] mb-4">Enterprise & Multi-Property</h2>
                        <p className="text-gray-500 font-medium text-lg mb-6 leading-relaxed">
                            Custom deployment for 70+ rooms and hotel groups. Built for scale, security, and unified operational control across regions.
                        </p>
                        <ul className="grid grid-cols-2 gap-4 text-sm font-bold text-[#0E2A38]">
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C9A646]" /> Dedicated Account Manager</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C9A646]" /> Custom Integrations</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C9A646]" /> Multi-Property Dashboard</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C9A646]" /> On-Site Training</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center md:items-end text-center md:text-right shrink-0">
                        <span className="text-3xl font-bold tracking-tight text-[#0E2A38]">₹3L – ₹5L <span className="text-gray-400 text-lg font-medium">/ year</span></span>
                        <button className="mt-8 px-8 py-4 bg-[#0E2A38] text-white rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg transition-all hover:bg-[#091b24] flex items-center gap-2">
                            Talk to Enterprise Sales <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>

            </div>

            {/* ROI SECTION (DARK) */}
            <section className="bg-[#0E2A38] text-white py-32 relative overflow-hidden mb-32">
                <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

                <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif text-4xl md:text-5xl font-bold mb-16 tracking-wide drop-shadow-lg"
                    >
                        Your Software Should <span className="text-[#C9A646]">Generate Revenue.</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 lg:p-14 rounded-3xl shadow-2xl inline-block text-left"
                    >
                        <div className="space-y-6 text-[17px] font-medium text-white/90">
                            <p className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-gray-500" /> If your hotel makes <strong className="text-white text-xl ml-2">₹10L/month</strong></p>
                            <p className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-gray-500" /> And direct bookings increase by <strong className="text-[#2E7D5B] text-xl ml-2 bg-[#E8F3EF]/10 px-2 py-0.5 rounded">5%</strong></p>

                            <div className="h-[1px] bg-white/20 my-8" />

                            <div className="flex items-center justify-between gap-12">
                                <span className="text-white/60 text-lg">That's an additional</span>
                                <span className="font-serif text-4xl lg:text-5xl font-bold text-[#C9A646]">₹6L / year</span>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 text-center">
                            <p className="text-lg font-bold tracking-widest uppercase text-white/80">
                                Your system pays for itself <span className="text-white">3–5x over.</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
                {/* TRUST SECTION */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
                    {[
                        { icon: Shield, title: "Secure Infrastructure" },
                        { icon: Zap, title: "Real-Time Sync" },
                        { icon: Receipt, title: "No Hidden Charges" },
                        { icon: Building2, title: "Annual Contracts" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="flex flex-col items-center text-center p-6"
                        >
                            <div className="w-16 h-16 bg-[#F7F4EF] rounded-full flex items-center justify-center mb-6 text-[#0E2A38]">
                                <item.icon size={28} strokeWidth={1.5} />
                            </div>
                            <h4 className="font-bold text-[#0E2A38] text-sm tracking-wide">{item.title}</h4>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ SECTION */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl font-bold text-[#0E2A38]">Frequently Asked Questions</h2>
                    </div>
                    <FAQAccordion />
                </div>

                {/* FINAL CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1 }}
                    className="text-center bg-[#F7F4EF] rounded-3xl py-24 px-6 border border-gray-200"
                >
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0E2A38] mb-10 tracking-tight">
                        Ready to Upgrade Your Hotel Operations?
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="w-full sm:w-auto px-10 py-4 bg-[#C9A646] hover:bg-[#b08d35] text-white rounded-xl font-bold tracking-wider transition-colors shadow-md hover:shadow-lg">
                            Talk to Sales
                        </button>
                        <button className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-gray-50 text-[#0E2A38] border-2 border-[#0E2A38] rounded-xl font-bold tracking-wider transition-colors shadow-sm">
                            Schedule Demo
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
