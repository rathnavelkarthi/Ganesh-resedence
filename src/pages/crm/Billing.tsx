import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Check, ArrowRight, Crown, Clock, Receipt, Puzzle, Hotel, MessageCircle, Globe, Radio, Headphones, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { initiatePayment, initiateAddonPayment, PLAN_PRICES } from '../../lib/razorpay';
import { toast } from 'sonner';

interface Subscription {
    id: string;
    plan: string;
    billing_cycle: string;
    amount_paid: number;
    status: string;
    starts_at: string | null;
    expires_at: string | null;
    created_at: string;
    razorpay_payment_id: string | null;
}

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        description: 'Basic booking page, up to 5 rooms.',
        isFree: true,
    },
    {
        id: 'growth',
        name: 'Growth',
        description: 'Custom website, CRM, GST invoices.',
    },
    {
        id: 'pro',
        name: 'Pro',
        description: 'Hotel + restaurant, POS, analytics.',
        isPopular: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Multi-property, API, dedicated manager.',
    },
];

const planOrder = ['starter', 'growth', 'pro', 'enterprise'];

const ADDONS = [
    { id: 'extra_rooms', name: 'Extra 10 Rooms', price: '₹499/mo', description: 'Add 10 room slots on top of your plan limit.', icon: Hotel, color: 'bg-blue-50 text-blue-600' },
    { id: 'whatsapp_pack', name: 'WhatsApp Pack', price: '₹799/mo', description: '500 WhatsApp messages per month.', icon: MessageCircle, color: 'bg-green-50 text-green-600' },
    { id: 'custom_domain', name: 'Custom Domain', price: '₹299/mo', description: 'Use your own domain for the booking site.', icon: Globe, color: 'bg-purple-50 text-purple-600' },
    { id: 'ota_sync', name: 'OTA Channel Sync', price: '₹1,499/mo', description: 'Sync with Booking.com, Agoda, MakeMyTrip.', icon: Radio, color: 'bg-orange-50 text-orange-600' },
    { id: 'priority_support', name: 'Priority Support', price: '₹999/mo', description: '24/7 phone support + dedicated Slack.', icon: Headphones, color: 'bg-rose-50 text-rose-600' },
    { id: 'analytics', name: 'Advanced Analytics', price: '₹699/mo', description: 'Revenue heatmaps, occupancy forecasting.', icon: BarChart3, color: 'bg-amber-50 text-amber-600' },
];

export default function Billing() {
    const { tenant, refreshTenant, user } = useAuth();
    const [isYearly, setIsYearly] = useState(true);
    const [loading, setLoading] = useState<string | null>(null);
    const [addonLoading, setAddonLoading] = useState<string | null>(null);
    const [history, setHistory] = useState<Subscription[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const currentPlan = tenant?.plan || 'starter';
    const currentPlanIndex = planOrder.indexOf(currentPlan);

    useEffect(() => {
        if (!tenant?.id) return;
        setHistoryLoading(true);
        supabase
            .from('subscriptions')
            .select('*')
            .eq('tenant_id', tenant.id)
            .eq('status', 'paid')
            .order('created_at', { ascending: false })
            .limit(20)
            .then(({ data }) => {
                setHistory(data || []);
                setHistoryLoading(false);
            });
    }, [tenant?.id]);

    const handleUpgrade = async (planId: string) => {
        if (!tenant || !user) return;
        if (planId === 'starter') return;

        setLoading(planId);
        const billingCycle = isYearly ? 'yearly' : 'monthly';
        const result = await initiatePayment(planId, billingCycle, tenant.id, user.email, tenant.business_name);
        setLoading(null);

        if (result.success) {
            toast.success(`Upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)}!`);
            await refreshTenant();
            // Refresh history
            const { data } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('tenant_id', tenant.id)
                .eq('status', 'paid')
                .order('created_at', { ascending: false })
                .limit(20);
            setHistory(data || []);
        } else if (result.error !== 'Payment cancelled') {
            toast.error(result.error || 'Payment failed');
        }
    };

    const activeSub = history.find(s => s.status === 'paid' && s.expires_at && new Date(s.expires_at) > new Date());

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#0E2A38]">Billing & Subscription</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your plan and payment history.</p>
            </div>

            {/* Current plan card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0E2A38] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C9A646]/20 flex items-center justify-center">
                        <Crown size={22} className="text-[#C9A646]" />
                    </div>
                    <div>
                        <p className="text-xs text-white/40 uppercase tracking-widest">Current plan</p>
                        <p className="text-xl font-bold capitalize">{currentPlan}</p>
                    </div>
                </div>
                {activeSub && (
                    <div className="flex items-center gap-2 text-sm text-white/50">
                        <Clock size={14} />
                        <span>Expires {new Date(activeSub.expires_at!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                )}
            </motion.div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3">
                <span className={`text-sm font-medium ${!isYearly ? 'text-[#0E2A38]' : 'text-gray-300'}`}>Monthly</span>
                <button
                    onClick={() => setIsYearly(!isYearly)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${isYearly ? 'bg-[#0E2A38]' : 'bg-gray-200'}`}
                >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className={`text-sm font-medium ${isYearly ? 'text-[#0E2A38]' : 'text-gray-300'}`}>Yearly</span>
                {isYearly && (
                    <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full">Save 20%</span>
                )}
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLANS.map((plan, i) => {
                    const isCurrentPlan = plan.id === currentPlan;
                    const planIndex = planOrder.indexOf(plan.id);
                    const isDowngrade = planIndex < currentPlanIndex;
                    const price = plan.isFree ? null : PLAN_PRICES[plan.id];
                    const displayPrice = plan.isFree
                        ? 'Free'
                        : isYearly
                            ? price?.yearly.display
                            : price?.monthly.display;

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`rounded-xl border p-5 flex flex-col ${plan.isPopular
                                ? 'border-[#C9A646]/30 bg-[#FFFDF7] shadow-sm'
                                : isCurrentPlan
                                    ? 'border-[#0E2A38]/20 bg-[#F0F4F7]'
                                    : 'border-gray-100 bg-white'
                                }`}
                        >
                            {plan.isPopular && (
                                <span className="text-[9px] font-bold text-[#C9A646] uppercase tracking-widest mb-2">Most popular</span>
                            )}
                            <h3 className="font-bold text-[#0E2A38] mb-1">{plan.name}</h3>
                            <p className="text-xs text-gray-400 mb-4 flex-1">{plan.description}</p>
                            <p className="text-2xl font-bold text-[#0E2A38] mb-1">{displayPrice}</p>
                            {!plan.isFree && (
                                <p className="text-[10px] text-gray-300 mb-4">per {isYearly ? 'year' : 'month'}</p>
                            )}
                            {plan.isFree && <p className="text-[10px] text-gray-300 mb-4">forever</p>}

                            {isCurrentPlan ? (
                                <div className="flex items-center gap-2 text-sm text-green-600 font-medium py-2.5 justify-center bg-green-50 rounded-lg">
                                    <Check size={14} /> Current plan
                                </div>
                            ) : isDowngrade ? (
                                <button
                                    disabled
                                    className="w-full py-2.5 rounded-lg text-xs font-semibold text-gray-300 bg-gray-50 cursor-not-allowed"
                                >
                                    Downgrade N/A
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={!!loading}
                                    className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0E2A38] hover:bg-[#1a3d4f] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
                                >
                                    {loading === plan.id ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Upgrade <ArrowRight size={12} /></>
                                    )}
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Add-Ons */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Puzzle size={16} className="text-[#C9A646]" />
                    <h2 className="font-bold text-[#0E2A38]">Add-Ons</h2>
                    <span className="text-[10px] font-semibold bg-[#C9A646]/10 text-[#C9A646] px-2 py-0.5 rounded-full">Boost your plan</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ADDONS.map((addon, i) => {
                        const Icon = addon.icon;
                        const isActiveAddon = history.some(s => s.plan === `addon_${addon.id}` && s.status === 'paid' && s.expires_at && new Date(s.expires_at) > new Date());
                        const isAddonLoading = addonLoading === addon.id;
                        return (
                            <motion.div
                                key={addon.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className={`bg-white border rounded-xl p-5 transition-all group ${isActiveAddon ? 'border-green-200 bg-green-50/30' : 'border-gray-100 hover:shadow-sm hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${addon.color}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-semibold text-sm text-[#0E2A38]">{addon.name}</h3>
                                            <span className="text-xs font-bold text-[#0E2A38] whitespace-nowrap">{addon.price}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{addon.description}</p>
                                    </div>
                                </div>
                                {isActiveAddon ? (
                                    <div className="w-full mt-4 py-2 rounded-lg text-xs font-semibold text-green-600 bg-green-50 text-center flex items-center justify-center gap-1.5">
                                        <Check size={14} /> Active
                                    </div>
                                ) : (
                                    <button
                                        className="w-full mt-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-500 hover:border-[#0E2A38] hover:text-[#0E2A38] hover:bg-[#0E2A38]/5 transition-all disabled:opacity-40"
                                        disabled={!!addonLoading}
                                        onClick={async () => {
                                            if (!tenant || !user) return;
                                            setAddonLoading(addon.id);
                                            const result = await initiateAddonPayment(addon.id, tenant.id, user.email, tenant.business_name);
                                            setAddonLoading(null);
                                            if (result.success) {
                                                toast.success(`${addon.name} activated!`);
                                                const { data } = await supabase.from('subscriptions').select('*').eq('tenant_id', tenant.id).eq('status', 'paid').order('created_at', { ascending: false }).limit(20);
                                                setHistory(data || []);
                                            } else if (result.error !== 'Payment cancelled') {
                                                toast.error(result.error || 'Payment failed');
                                            }
                                        }}
                                    >
                                        {isAddonLoading ? (
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
                                        ) : 'Add to plan'}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Payment history */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Receipt size={16} className="text-gray-400" />
                    <h2 className="font-bold text-[#0E2A38]">Payment history</h2>
                </div>

                {historyLoading ? (
                    <div className="text-sm text-gray-300 py-8 text-center">Loading...</div>
                ) : history.length === 0 ? (
                    <div className="text-sm text-gray-300 py-8 text-center border border-dashed border-gray-200 rounded-xl">
                        No payments yet.
                    </div>
                ) : (
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plan</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cycle</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(sub => (
                                    <tr key={sub.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(sub.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-[#0E2A38] capitalize">{sub.plan}</td>
                                        <td className="px-4 py-3 text-gray-400 capitalize">{sub.billing_cycle}</td>
                                        <td className="px-4 py-3 text-gray-600">₹{sub.amount_paid.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sub.status === 'paid'
                                                ? 'bg-green-50 text-green-600'
                                                : sub.status === 'failed'
                                                    ? 'bg-red-50 text-red-500'
                                                    : sub.status === 'created'
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-gray-50 text-gray-400'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
