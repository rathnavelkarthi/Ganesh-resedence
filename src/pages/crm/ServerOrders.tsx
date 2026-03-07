import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMDataContext';
import { UtensilsCrossed, ClipboardList, Plus, Search, ChevronRight, Armchair, Clock, CheckCircle2, LayoutGrid, ListFilter, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function ServerOrders() {
    const { restaurantTables, foodOrders } = useCRM();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');
    const navigate = useNavigate();

    // Floor Metrics
    const metrics = useMemo(() => {
        const running = foodOrders.filter(o => o.status !== 'billed' && o.status !== 'cancelled' && o.table_id);
        const billRequested = running.filter(o => o.status === 'bill_requested').length;
        const occupied = restaurantTables.filter(t => t.status === 'occupied').length;
        return { occupied, billRequested };
    }, [foodOrders, restaurantTables]);

    const activeTables = useMemo(() => {
        return restaurantTables.filter(table => {
            const matchesSearch = table.table_number.toLowerCase().includes(search.toLowerCase());
            if (!matchesSearch) return false;

            if (activeTab === 'active') {
                return table.status === 'occupied';
            }
            return true;
        });
    }, [restaurantTables, search, activeTab]);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            {/* Header Area */}
            <div className="flex items-center justify-between px-4 pt-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Floor View</h1>
                    <p className="text-sm text-gray-500">Manage running tables</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/pos')}
                    className="bg-[#0E2A38] text-white hover:bg-[#1a3d4f] shadow-lg flex items-center gap-2 h-12 rounded-2xl px-6"
                >
                    <Plus size={20} />
                    <span className="font-bold">New Order</span>
                </Button>
            </div>

            {/* Quick Metrics & Tabs */}
            <div className="px-4 grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mb-0.5">Active Tables</p>
                        <p className="text-2xl font-black text-blue-900">{metrics.occupied}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
                        <Armchair size={20} />
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-amber-600 mb-0.5">Bill Requested</p>
                        <p className="text-2xl font-black text-amber-900">{metrics.billRequested}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm animate-pulse">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* View Controls */}
            <div className="px-4 space-y-4">
                <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-[#0E2A38] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ListFilter size={18} />
                        Active Running
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white text-[#0E2A38] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <LayoutGrid size={18} />
                        All Tables
                    </button>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A646] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search table number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-[#0E2A38]/5 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Grid of Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                {activeTables.map((table) => {
                    const activeOrder = foodOrders.find(o =>
                        o.table_id === table.id &&
                        o.status !== 'billed' &&
                        o.status !== 'cancelled'
                    );

                    return (
                        <motion.div
                            layout
                            key={table.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/admin/pos', { state: { tableId: table.id } })}
                            className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden group ${table.status === 'occupied'
                                ? activeOrder?.status === 'bill_requested'
                                    ? 'bg-amber-50 border-amber-200 shadow-amber-100 shadow-lg'
                                    : 'bg-white border-blue-200 shadow-blue-50 shadow-md'
                                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md opacity-80'
                                }`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 ${table.status === 'occupied'
                                    ? activeOrder?.status === 'bill_requested' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    <Armchair size={32} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-black text-[#0E2A38]">
                                            Table {table.table_number}
                                        </h3>
                                        <Badge
                                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none ${table.status === 'occupied'
                                                ? activeOrder?.status === 'bill_requested' ? 'bg-amber-500 text-white animate-pulse' : 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            {table.status === 'occupied'
                                                ? activeOrder?.status === 'bill_requested' ? 'Bill Requested' : 'Running'
                                                : 'Free'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            {activeOrder ? (
                                                <>
                                                    <span className="text-xl font-black text-gray-900 flex items-center gap-0.5">
                                                        <IndianRupee size={16} strokeWidth={3} />
                                                        {activeOrder.total_amount.toFixed(0)}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <Clock size={10} />
                                                        Started {new Date(activeOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400 font-medium italic">Click to start order</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#0E2A38] group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {activeTables.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] mx-4 border-2 border-dashed border-gray-200">
                    <UtensilsCrossed className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-bold text-lg">
                        {activeTab === 'active' ? "No active tables right now" : "No tables found"}
                    </p>
                    {activeTab === 'active' ? (
                        <Button
                            variant="link"
                            onClick={() => setActiveTab('all')}
                            className="text-[#C9A646] font-bold mt-2"
                        >
                            View all tables
                        </Button>
                    ) : (
                        <p className="text-sm text-gray-400">Add tables in settings to see them here</p>
                    )}
                </div>
            )}

            {/* Quick Actions Legend / Helper */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#0E2A38]/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/10 flex items-center gap-6 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span className="text-xs text-white font-bold uppercase tracking-widest whitespace-nowrap">Running</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
                    <span className="text-xs text-white font-bold uppercase tracking-widest whitespace-nowrap">Bill Requested</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <span className="text-xs text-white/60 font-medium uppercase tracking-widest whitespace-nowrap">Available</span>
                </div>
            </div>
        </div>
    );
}
