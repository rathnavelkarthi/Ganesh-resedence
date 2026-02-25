import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingCardProps {
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    ctaText: string;
    onCtaClick?: () => void;
    index: number;
}

export default function PricingCard({
    name,
    price,
    description,
    features,
    isPopular,
    ctaText,
    onCtaClick,
    index
}: PricingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`relative bg-white rounded-2xl p-8 lg:p-10 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 border ${isPopular ? 'border-[#C9A646]/40 scale-105 z-10' : 'border-transparent'
                }`}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0E2A38] text-[#C9A646] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    Most Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className="font-serif text-2xl font-bold text-[#0E2A38] mb-2">{name}</h3>
                <p className="text-gray-500 text-sm font-medium h-10">{description}</p>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-100 flex items-baseline gap-1">
                <span className="text-4xl lg:text-5xl font-bold text-[#0E2A38] tracking-tight">{price}</span>
                <span className="text-gray-400 font-medium tracking-wide">/ year</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-sm font-medium">
                        <Check size={18} className="text-[#2E7D5B] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onCtaClick}
                className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all shadow-sm ${isPopular
                        ? 'bg-[#0E2A38] hover:bg-[#091b24] text-[#C9A646] hover:shadow-lg'
                        : 'bg-[#F7F4EF] hover:bg-[#edeade] text-[#0E2A38] border border-gray-200'
                    }`}
            >
                {ctaText}
            </button>
        </motion.div>
    );
}
