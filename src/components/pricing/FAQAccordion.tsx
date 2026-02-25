import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "Is there a setup fee?",
        answer: "No. All onboarding, initial data migration, and training are included in your annual subscription. We believe your success is our success."
    },
    {
        question: "Do you integrate with OTAs?",
        answer: "Yes, our PRO and ELITE plans include seamless two-way synchronization with all major OTAs (MakeMyTrip, Goibibo, Booking.com, Agoda) via our channel manager."
    },
    {
        question: "Can we migrate existing data?",
        answer: "Absolutely. Our dedicated onboarding team will carefully migrate your past guest records, future reservations, and financial data securely to the new system."
    },
    {
        question: "Is training included?",
        answer: "Yes. Every plan receives a comprehensive onboarding session. The ELITE plan includes on-site training for your staff to ensure maximum operational efficiency."
    },
    {
        question: "What happens after Year 1?",
        answer: "Your subscription locks in your pricing for 12 months. After Year 1, you can renew at the same rate, ensuring predictable, transparent operational costs."
    }
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full text-left px-6 py-6 flex items-center justify-between focus:outline-none"
                    >
                        <span className="font-serif text-xl font-bold text-[#0E2A38]">{faq.question}</span>
                        <motion.div
                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-[#C9A646]"
                        >
                            <ChevronDown size={20} />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {openIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed font-medium">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
