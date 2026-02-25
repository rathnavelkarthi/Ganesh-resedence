import { motion } from 'framer-motion';

interface BillingToggleProps {
    isYearly: boolean;
    onToggle: (isYearly: boolean) => void;
}

export default function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
    return (
        <div className="flex items-center justify-center gap-4 mt-12 mb-20">
            <button
                onClick={() => onToggle(false)}
                className={`text-sm font-bold tracking-widest uppercase transition-colors ${!isYearly ? 'text-[#0E2A38]' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Monthly
            </button>

            <div
                className="w-16 h-8 bg-white border border-gray-200 rounded-full p-1 cursor-pointer flex items-center shadow-sm relative"
                onClick={() => onToggle(!isYearly)}
            >
                <motion.div
                    className="w-6 h-6 bg-[#0E2A38] rounded-full shadow-md"
                    animate={{ x: isYearly ? 32 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>

            <button
                onClick={() => onToggle(true)}
                className={`text-sm font-bold tracking-widest uppercase transition-colors flex items-center gap-2 ${isYearly ? 'text-[#0E2A38]' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Yearly
                <span className="bg-[#E8F3EF] text-[#2E7D5B] text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Save 18%
                </span>
            </button>
        </div>
    );
}
