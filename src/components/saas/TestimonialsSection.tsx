import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
    {
        quote: "Before this, I was managing bookings on paper and WhatsApp. Within a week of switching, I could see every booking, every payment, every room status in one place. I saved 3 hours a day.",
        name: 'Ramesh Nair',
        role: 'Owner',
        property: 'Sunrise Residency, Kochi',
        initials: 'RN',
        color: 'bg-[#0E2A38]',
    },
    {
        quote: "The OTA sync alone paid for a year of the subscription. No more double bookings on peak dates. My front desk staff actually uses it without any training.",
        name: 'Priya Menon',
        role: 'General Manager',
        property: 'Lakshmi Heritage, Mysuru',
        initials: 'PM',
        color: 'bg-[#1a3d50]',
    },
    {
        quote: "I tried other hotel software but they were either too expensive or too complex. This one is built for Indian hotels. GST invoices, UPI payments, everything just works.",
        name: 'Suresh Kumar',
        role: 'Director',
        property: 'Royal Comfort Inn, Coimbatore',
        initials: 'SK',
        color: 'bg-[#C9A646]',
    },
];

function Stars() {
    return (
        <div className="flex gap-0.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="text-[#C9A646] fill-[#C9A646]" />
            ))}
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="py-24 lg:py-32 bg-[#F7F4EF]">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-xs font-bold uppercase tracking-[0.22em] text-[#C9A646] mb-3"
                    >
                        What hoteliers say
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        className="text-3xl md:text-4xl font-extrabold text-[#0E2A38] tracking-tight leading-tight"
                    >
                        Real Hotels. Real Results.
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-5%' }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-7 border border-foreground/5 flex flex-col"
                        >
                            <Stars />
                            <p className="text-[13.5px] leading-relaxed text-foreground/70 flex-1 mb-6">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-3 pt-5 border-t border-foreground/5">
                                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center shrink-0`}>
                                    <span className="text-[10px] font-extrabold text-white/90 tracking-wide">
                                        {t.initials}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                                    <p className="text-[11px] text-foreground/40">{t.role} · {t.property}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
