import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initiatePayment } from '../../lib/razorpay';
import { toast } from 'sonner';

const NEXT_PLAN: Record<string, string> = {
    starter: 'growth',
    growth: 'pro',
    pro: 'enterprise',
};

interface UpgradeModalProps {
    open: boolean;
    onClose: () => void;
    resource: string;
    plan: string;
    currentCount: number;
    limit: number;
}

export default function UpgradeModal({ open, onClose, resource, plan, currentCount, limit }: UpgradeModalProps) {
    const navigate = useNavigate();
    const { tenant, user } = useAuth();
    const [loading, setLoading] = useState(false);

    const nextPlan = NEXT_PLAN[plan] || 'growth';

    if (!open) return null;

    const handleUpgrade = async () => {
        if (!tenant || !user) {
            toast.error('Authentication required');
            return;
        }

        setLoading(true);
        try {
            const result = await initiatePayment(
                nextPlan,
                'monthly', // Default billing cycle for quick upgrades from the modal
                tenant.id,
                user.email || '',
                tenant.business_name,
                20 // Pass 20 for the 20% discount!
            );

            if (result.success) {
                toast.success(`Successfully upgraded to ${nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)} plan!`);
                onClose();
                window.location.reload(); // Refresh to apply new limits
            } else {
                if (result.error !== 'Payment cancelled by user') {
                    toast.error(result.error || 'Payment failed');
                }
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className="pt-8 pb-2 flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <Crown size={28} className="text-[#C9A646]" />
                        </div>
                    </div>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Content */}
                    <div className="px-8 pb-2 text-center">
                        <h2 className="text-xl font-bold text-[#0E2A38] mb-2">
                            Upgrade to {nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)}
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            You're on the <span className="font-semibold text-[#0E2A38] capitalize">{plan}</span> plan,
                            which allows up to <span className="font-semibold text-[#0E2A38]">{limit === Infinity ? 'unlimited' : limit}</span> {resource}.
                            You currently have <span className="font-semibold text-[#0E2A38]">{currentCount}</span>.
                        </p>
                    </div>

                    {/* 20% Discount offer */}
                    <div className="mx-8 mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-amber-500 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-amber-700">First month 20% off</p>
                                <p className="text-[11px] text-amber-600/70">Upgrade now and save on your first month.</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-8 py-6 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors"
                        >
                            Maybe later
                        </button>
                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-[#0E2A38] hover:bg-[#1a3d4f] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Upgrade'}
                            {!loading && <ArrowRight size={14} />}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
