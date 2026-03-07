import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMDataContext';
import {
    UtensilsCrossed,
    ClipboardList,
    Armchair,
    IndianRupee,
    TrendingUp,
    Clock,
    AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table';

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function RestaurantDashboard() {
    const { tenant } = useAuth();
    const { foodOrders, restaurantTables, menuItems } = useCRM();

    const stats = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);
        const todayOrders = foodOrders.filter(o => o.created_at.slice(0, 10) === today);
        const revenue = todayOrders
            .filter(o => o.payment_status === 'paid')
            .reduce((sum, o) => sum + o.total_amount, 0);
        const pendingOrders = foodOrders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
        const billRequested = foodOrders.filter(o => o.status === 'bill_requested').length;
        const tableOccupancy = restaurantTables.filter(t => t.status === 'occupied').length;

        return { revenue, pendingOrders, billRequested, tableOccupancy };
    }, [foodOrders, restaurantTables]);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Restaurant Overview</h1>
                    <p className="text-gray-500 mt-1">Live updates from your floor and kitchen.</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Today's Revenue"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    icon={IndianRupee}
                    color="emerald"
                />
                <KpiCard
                    title="Active Orders"
                    value={stats.pendingOrders.toString()}
                    icon={ClipboardList}
                    color="blue"
                />
                <KpiCard
                    title="Bill Requests"
                    value={stats.billRequested.toString()}
                    icon={AlertCircle}
                    color="amber"
                    highlight={stats.billRequested > 0}
                />
                <KpiCard
                    title="Tables Occupied"
                    value={`${stats.tableOccupancy}/${restaurantTables.length}`}
                    icon={Armchair}
                    color="indigo"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <Card className="border-none shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold">Live Orders</CardTitle>
                        <Badge variant="outline" className="font-mono">{foodOrders.filter(o => o.status !== 'billed' && o.status !== 'cancelled').length} Active</Badge>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-gray-100">
                                    <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Order ID</TableHead>
                                    <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Table</TableHead>
                                    <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Status</TableHead>
                                    <TableHead className="text-right font-bold text-gray-400 uppercase text-[10px] tracking-wider">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {foodOrders
                                    .filter(o => o.status !== 'billed' && o.status !== 'cancelled')
                                    .slice(0, 6)
                                    .map((order) => {
                                        const table = restaurantTables.find(t => t.id === order.table_id);
                                        return (
                                            <TableRow key={order.id} className="hover:bg-gray-50/50 border-gray-50 transition-colors">
                                                <TableCell className="font-medium text-gray-900 text-sm">#{order.id.toString().slice(-4)}</TableCell>
                                                <TableCell className="text-sm">{table?.table_number || 'T/A'}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`rounded-lg uppercase text-[9px] px-2 py-0.5 ${order.status === 'bill_requested' ? 'bg-amber-100 text-amber-600 border-amber-200 animate-pulse' :
                                                                order.status === 'ready' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
                                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                            }`}
                                                    >
                                                        {order.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-gray-900 text-sm">₹{order.total_amount}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Table Status */}
                <Card className="border-none shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Floor Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {restaurantTables.map(table => {
                                const activeOrder = foodOrders.find(o => o.table_id === table.id && o.status !== 'billed' && o.status !== 'cancelled');
                                const isRequested = activeOrder?.status === 'bill_requested';
                                return (
                                    <div
                                        key={table.id}
                                        className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border transition-all ${table.status === 'occupied'
                                                ? isRequested ? 'bg-amber-50 border-amber-200 shadow-sm animate-pulse' : 'bg-blue-50 border-blue-200 shadow-sm'
                                                : 'bg-white border-gray-100'
                                            }`}
                                    >
                                        <span className={`text-xs font-bold ${table.status === 'occupied' ? 'text-blue-700' : 'text-gray-400'}`}>
                                            {table.table_number}
                                        </span>
                                        <span className={`text-[8px] uppercase font-bold tracking-tighter ${table.status === 'occupied' ? isRequested ? 'text-amber-600' : 'text-blue-500' : 'text-gray-300'}`}>
                                            {table.status === 'occupied' ? isRequested ? 'BILL' : 'BUSY' : 'FREE'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}

function KpiCard({ title, value, icon: Icon, color, highlight }: any) {
    const colorMap: any = {
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    };

    return (
        <motion.div variants={itemVariants}>
            <Card className={`border-none shadow-lg shadow-gray-200/40 overflow-hidden ${highlight ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl ${colorMap[color] || 'bg-gray-50 text-gray-500'}`}>
                            <Icon size={20} />
                        </div>
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
