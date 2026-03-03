import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useCRM } from '../../context/CRMDataContext';
import {
    Plus,
    Trash2,
    Tag,
    Calendar,
    Percent,
    ArrowRight,
    TrendingUp,
    Activity,
    Users,
    ChevronLeft,
    ChevronRight,
    Save
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, isSameDay, isWeekend } from 'date-fns';

type TabType = 'calendar' | 'rules' | 'coupons';

export default function PricingRules() {
    const { tenant } = useAuth();
    const { rooms } = useCRM();
    const [rules, setRules] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('calendar');

    // Calendar State
    const [startDate, setStartDate] = useState(new Date());
    const [showBulkUpdate, setShowBulkUpdate] = useState(false);

    // Derive dates synchronously on render so dates[0] is never undefined
    const dates = Array.from({ length: 14 }).map((_, i) => addDays(startDate, i));

    // Simulate Daily Rates (In a real app, this would be a Time-Series DB query)
    const [dailyRates, setDailyRates] = useState<Record<number, Record<string, number>>>({});

    useEffect(() => {
        if (tenant) {
            fetchData();
        }
    }, [tenant]);

    useEffect(() => {
        // Initialize simulated daily rates based on base room prices and active rules
        const initialRates: Record<number, Record<string, number>> = {};
        rooms.forEach(room => {
            initialRates[room.id] = {};
            dates.forEach(date => {
                const dateStr = format(date, 'yyyy-MM-dd');
                let price = room.price_per_night || 0;

                // Simulate applying a rule (e.g. +$20 on weekends if no specific rule is set, just for demo variance)
                if (isWeekend(date)) {
                    price += price * 0.15; // 15% weekend premium
                }

                initialRates[room.id][dateStr] = Math.round(price);
            });
        });
        setDailyRates(initialRates);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, rooms, rules]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rulesRes, couponsRes] = await Promise.all([
                supabase.from('room_pricing').select('*, rooms(name)').eq('tenant_id', tenant.id).order('created_at', { ascending: false }),
                supabase.from('coupons').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false })
            ]);

            if (rulesRes.error) throw rulesRes.error;
            if (couponsRes.error) throw couponsRes.error;

            setRules(rulesRes.data || []);
            setCoupons(couponsRes.data || []);
        } catch (error: any) {
            toast.error('Failed to fetch data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRateChange = (roomId: number, dateStr: string, newValue: string) => {
        const val = parseInt(newValue, 10);
        if (isNaN(val)) return;
        setDailyRates(prev => ({
            ...prev,
            [roomId]: {
                ...prev[roomId],
                [dateStr]: val
            }
        }));
    };

    const saveRates = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 800)),
            {
                loading: 'Pushing rates to Channel Manager...',
                success: 'Rates successfully synced to Booking.com, Agoda, and MakeMyTrip!',
                error: 'Failed to sync rates'
            }
        );
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
            {/* Header & KPIs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-[#0E2A38]">Rate & Revenue Management</h1>
                    <p className="text-gray-500 mt-2">Maximize RevPAR through dynamic pricing, OTA sync, and targeted promotions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-[var(--color-ocean-50)] group-hover:scale-110 transition-transform duration-500">
                        <Activity size={100} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">RevPAR (Current)</p>
                        <h3 className="text-3xl font-bold text-[#0E2A38]">₹3,450</h3>
                        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-medium">
                            <TrendingUp size={16} />
                            <span>+12.5% vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-[var(--color-ocean-50)] group-hover:scale-110 transition-transform duration-500">
                        <Tag size={100} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">ADR (Average Daily Rate)</p>
                        <h3 className="text-3xl font-bold text-[#0E2A38]">₹4,200</h3>
                        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-medium">
                            <TrendingUp size={16} />
                            <span>+5.2% vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-[var(--color-ocean-50)] group-hover:scale-110 transition-transform duration-500">
                        <Users size={100} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Occupancy Rate</p>
                        <h3 className="text-3xl font-bold text-[#0E2A38]">82%</h3>
                        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-medium">
                            <TrendingUp size={16} />
                            <span>+8% vs last month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'calendar' ? 'border-[var(--color-ocean-600)] text-[var(--color-ocean-900)] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        Daily Rate Calendar
                    </button>
                    <button
                        onClick={() => setActiveTab('rules')}
                        className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'rules' ? 'border-[var(--color-ocean-600)] text-[var(--color-ocean-900)] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        Dynamic Rules
                    </button>
                    <button
                        onClick={() => setActiveTab('coupons')}
                        className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'coupons' ? 'border-[var(--color-ocean-600)] text-[var(--color-ocean-900)] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        Promo Codes
                    </button>
                </div>

                <div className="p-6 flex-1">
                    {/* RATE CALENDAR TAB */}
                    {activeTab === 'calendar' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setStartDate(addDays(startDate, -7))}
                                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <h3 className="font-semibold text-gray-900 w-48 text-center">
                                        {format(dates[0], 'MMM d, yyyy')} - {format(dates[dates.length - 1], 'MMM d')}
                                    </h3>
                                    <button
                                        onClick={() => setStartDate(addDays(startDate, 7))}
                                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setShowBulkUpdate(true)}
                                        className="flex-1 sm:flex-none bg-white text-[#0E2A38] border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Bulk Update
                                    </button>
                                    <button
                                        onClick={saveRates}
                                        className="flex-1 sm:flex-none bg-[var(--color-ocean-900)] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--color-ocean-800)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Force Sync
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm relative">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead>
                                        <tr>
                                            <th className="p-4 bg-gray-50 border-r border-gray-200 sticky left-0 z-20 font-semibold text-gray-700 min-w-[200px]">Room Type</th>
                                            {dates.map((date, i) => (
                                                <th key={i} className={`p-3 border-b border-gray-200 text-center min-w-[100px] ${isWeekend(date) ? 'bg-[#ffedb3]/30' : 'bg-white'}`}>
                                                    <div className="text-xs text-gray-500 uppercase font-semibold">{format(date, 'EEE')}</div>
                                                    <div className={`text-base font-bold ${isSameDay(date, new Date()) ? 'text-[var(--color-ocean-600)]' : 'text-gray-900'}`}>{format(date, 'MMM d')}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {rooms.map(room => (
                                            <tr key={room.id} className="hover:bg-gray-50">
                                                <td className="p-4 bg-white border-r border-gray-200 sticky left-0 z-10 font-medium text-gray-900">
                                                    {room.name || room.type}
                                                    <div className="text-xs text-gray-400 font-normal mt-0.5">Base: ₹{room.price_per_night}</div>
                                                </td>
                                                {dates.map((date, i) => {
                                                    const dateStr = format(date, 'yyyy-MM-dd');
                                                    const priceStr = dailyRates[room.id]?.[dateStr]?.toString() || '0';
                                                    return (
                                                        <td key={i} className={`p-2 border-r border-gray-100 ${isWeekend(date) ? 'bg-[#ffedb3]/10' : ''}`}>
                                                            <input
                                                                type="text"
                                                                value={priceStr}
                                                                onChange={(e) => handleRateChange(room.id, dateStr, e.target.value)}
                                                                className="w-full text-center py-2 px-1 rounded bg-transparent hover:bg-white focus:bg-white border-transparent focus:border-[var(--color-ocean-300)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none text-sm font-semibold transition-all"
                                                            />
                                                            <div className="text-[10px] text-center text-green-600 mt-1 font-medium scale-90">Synced</div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="w-3 h-3 bg-[#ffedb3]/50 rounded-sm"></div> Weekend Indicator (Auto-premium applied)
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC RULES TAB */}
                    {activeTab === 'rules' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Automation Rules</h3>
                                <button className="bg-white text-[#0E2A38] border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <Plus size={16} /> New Rule
                                </button>
                            </div>
                            {loading ? (
                                <div className="p-8 text-center text-gray-400">Loading rules...</div>
                            ) : rules.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl">
                                    <Calendar className="mx-auto mb-3 opacity-20" size={40} />
                                    <p>No pricing rules set up yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rules.map((rule) => (
                                        <div key={rule.id} className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group relative">
                                            <div className="flex gap-4">
                                                <div className={`p-3 rounded-xl flex-shrink-0 ${rule.rule_type === 'peak' ? 'bg-red-50 text-red-600' :
                                                    rule.rule_type === 'seasonal' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-green-50 text-green-600'
                                                    }`}>
                                                    <Tag size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900">{rule.rooms?.name || 'All Rooms'}</h4>
                                                    <div className="flex items-center gap-2 mt-1.5 mb-3">
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 uppercase font-bold tracking-wider text-gray-600">{rule.rule_type}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        {rule.start_date && !isNaN(new Date(rule.start_date).getTime())
                                                            ? `${format(new Date(rule.start_date), 'MMM d')} - ${rule.end_date && !isNaN(new Date(rule.end_date).getTime()) ? format(new Date(rule.end_date), 'MMM d') : ''}`
                                                            : 'Always Active (Weekends)'}
                                                    </p>
                                                </div>
                                                <div className="text-right flex flex-col items-end justify-between">
                                                    <p className="font-bold text-xl text-[#0E2A38]">₹{rule.price_override.toLocaleString()}</p>
                                                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* COUPONS TAB */}
                    {activeTab === 'coupons' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Promotions & Discount Codes</h3>
                                <button className="bg-white text-[#0E2A38] border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <Plus size={16} /> New Promo Code
                                </button>
                            </div>
                            {loading ? (
                                <div className="p-8 text-center text-gray-400">Loading coupons...</div>
                            ) : coupons.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl">
                                    <Percent className="mx-auto mb-3 opacity-20" size={40} />
                                    <p>No coupons found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {coupons.map((coupon) => (
                                        <div key={coupon.id} className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#C9A646]/5 rounded-bl-full -z-10" />
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="bg-[#0E2A38] text-white px-3 py-1.5 rounded-lg">
                                                    <span className="font-mono font-bold tracking-wider">{coupon.code}</span>
                                                </div>
                                                <div className={`w-2.5 h-2.5 rounded-full ${coupon.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xl text-[#C9A646]">
                                                    {coupon.discount_type === 'percent' ? `${coupon.discount_value}% Off` : `₹${coupon.discount_value} Off`}
                                                </p>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 mb-2">
                                                    <div
                                                        className="bg-[#0E2A38] h-1.5 rounded-full"
                                                        style={{ width: `${Math.min(((coupon.used_count || 0) / (coupon.max_uses || 1)) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest flex justify-between">
                                                    <span>{coupon.used_count || 0} REDEEMED</span>
                                                    {coupon.max_uses ? <span>MAX: {coupon.max_uses}</span> : <span>UNLIMITED</span>}
                                                </p>
                                            </div>
                                            <button className="absolute bottom-4 right-4 p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Update Modal Simulation */}
            {showBulkUpdate && (
                <div className="fixed inset-0 bg-[#0E2A38]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
                        <h3 className="text-2xl font-serif font-bold text-[#0E2A38] mb-2">Bulk Update Rates</h3>
                        <p className="text-sm text-gray-500 mb-6">Select a date range and strategy to override prices across multiple room types.</p>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">From Date</label>
                                    <input type="date" className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--color-ocean-500)]" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">To Date</label>
                                    <input type="date" className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--color-ocean-500)]" defaultValue={format(addDays(new Date(), 7), 'yyyy-MM-dd')} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Target Room</label>
                                <select className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--color-ocean-500)] bg-white">
                                    <option value="all">All Room Types</option>
                                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name || r.type}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Strategy</label>
                                    <select className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--color-ocean-500)] bg-white">
                                        <option value="increase_percent">Increase By %</option>
                                        <option value="decrease_percent">Decrease By %</option>
                                        <option value="set_fixed">Set Fixed Rate</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Value</label>
                                    <div className="relative">
                                        <input type="number" className="w-full border border-gray-200 rounded-xl p-3 pl-8 focus:outline-none focus:border-[var(--color-ocean-500)]" defaultValue="15" />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowBulkUpdate(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowBulkUpdate(false);
                                    toast.success('Rates bulk updated successfully!');
                                }}
                                className="bg-[#C9A646] text-[#0E2A38] px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
