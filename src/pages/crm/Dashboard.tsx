import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMDataContext';
import { isDemoAccount } from '../../lib/booking';
import { motion } from 'motion/react';
import {
  IndianRupee,
  Users,
  BedDouble,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- Demo account hardcoded showcase data ---
const DEMO_REVENUE_DATA = [
  { name: 'Jan', total: 400000 },
  { name: 'Feb', total: 300000 },
  { name: 'Mar', total: 500000 },
  { name: 'Apr', total: 450000 },
  { name: 'May', total: 600000 },
  { name: 'Jun', total: 550000 },
];

const DEMO_OCCUPANCY_DATA = [
  { name: 'Mon', rate: 65 },
  { name: 'Tue', rate: 70 },
  { name: 'Wed', rate: 68 },
  { name: 'Thu', rate: 85 },
  { name: 'Fri', rate: 95 },
  { name: 'Sat', rate: 100 },
  { name: 'Sun', rate: 90 },
];

const DEMO_SOURCE_DATA = [
  { name: 'Direct', value: 45 },
  { name: 'Agoda', value: 25 },
  { name: 'MakeMyTrip', value: 20 },
  { name: 'Goibibo', value: 10 },
];

const COLORS = ['#0E2A38', '#C9A646', '#10b981', '#64748b'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

function formatINRDisplay(amount: number): string {
  if (amount === 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function Dashboard() {
  const { user, tenant } = useAuth();
  const { reservations, rooms } = useCRM();
  const [dateFilter, setDateFilter] = useState('Yearly');
  const isDemo = isDemoAccount(user?.email);

  // Compute real dashboard data from reservations and rooms
  const dashboardData = useMemo(() => {
    if (isDemo) {
      return {
        totalRevenue: '₹24,50,000',
        occupancyRate: '85%',
        totalBookings: '342',
        pendingPayments: '₹1,25,000',
        revenueData: DEMO_REVENUE_DATA,
        occupancyData: DEMO_OCCUPANCY_DATA,
        sourceData: DEMO_SOURCE_DATA,
        onlinePercent: '82%',
      };
    }

    // Real data computed from tenant's actual reservations
    const totalRevenue = reservations.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalBookings = reservations.length;
    const pendingPayments = reservations
      .filter(r => r.payment === 'Unpaid' || r.payment === 'Partial')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Group revenue by month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth: Record<string, number> = {};
    reservations.forEach(r => {
      if (r.checkIn && r.amount) {
        const month = monthNames[new Date(r.checkIn).getMonth()];
        revenueByMonth[month] = (revenueByMonth[month] || 0) + (r.amount || 0);
      }
    });
    const revenueData = Object.entries(revenueByMonth).map(([name, total]) => ({ name, total }));

    // Compute source distribution
    const sourceCounts: Record<string, number> = {};
    reservations.forEach(r => {
      const src = r.source || 'Direct';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
    const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

    // Occupancy by day of week (from recent reservations)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayBookings: Record<string, number> = {};
    const dayCounts: Record<string, number> = {};
    reservations.forEach(r => {
      if (r.checkIn) {
        const day = dayNames[new Date(r.checkIn).getDay()];
        dayBookings[day] = (dayBookings[day] || 0) + 1;
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
    });
    const occupancyData = totalRooms > 0
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
          name: day,
          rate: Math.min(100, Math.round(((dayBookings[day] || 0) / totalRooms) * 100))
        }))
      : [];

    const onlineBookings = reservations.filter(r => r.source && r.source !== 'Direct' && r.source !== 'Walk-in').length;
    const onlinePercent = totalBookings > 0 ? `${Math.round((onlineBookings / totalBookings) * 100)}%` : '0%';

    return {
      totalRevenue: formatINRDisplay(totalRevenue),
      occupancyRate: `${occupancyRate}%`,
      totalBookings: String(totalBookings),
      pendingPayments: formatINRDisplay(pendingPayments),
      revenueData,
      occupancyData,
      sourceData,
      onlinePercent,
    };
  }, [reservations, rooms, isDemo]);

  // Recent activity from actual reservations (last 4)
  const recentActivity = useMemo(() => {
    if (isDemo) {
      return [
        { type: 'booking', title: 'New Booking from Agoda', desc: 'Room 102 - Executive Double AC', time: '10 mins ago' },
        { type: 'payment', title: 'Payment Received', desc: '₹12,400 via UPI (TXN-8821)', time: '25 mins ago' },
        { type: 'room', title: 'Room Marked Clean', desc: 'Housekeeping finished Room 205', time: '1 hr ago' },
        { type: 'checkin', title: 'Guest Check-in', desc: 'Sarah Jenkins arrived', time: '2 hrs ago' },
      ];
    }

    return reservations.slice(0, 4).map(r => {
      const checkInDate = r.checkIn ? new Date(r.checkIn) : null;
      const daysAgo = checkInDate ? Math.floor((Date.now() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      const timeStr = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

      if (r.status === 'Confirmed') {
        return { type: 'booking', title: `Booking: ${r.guest}`, desc: `${r.room} via ${r.source}`, time: timeStr };
      }
      if (r.payment === 'Paid') {
        return { type: 'payment', title: `Payment from ${r.guest}`, desc: `${formatINRDisplay(r.amount || 0)}`, time: timeStr };
      }
      return { type: 'booking', title: `Reservation: ${r.guest}`, desc: `${r.room} - ${r.status}`, time: timeStr };
    });
  }, [reservations, isDemo]);

  const hasData = reservations.length > 0 || rooms.length > 0 || isDemo;

  const renderEmptyState = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-12 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F8F9FB] flex items-center justify-center border border-gray-100 mx-auto mb-6">
          <BarChart3 size={36} className="text-gray-300" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#0E2A38] mb-3">Welcome to your Dashboard</h3>
        <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
          Your dashboard will come alive once you start adding rooms and bookings. Head over to <strong>Rooms</strong> to add your first room, then create your first reservation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mt-8">
          <StatCard title="Total Revenue" value="₹0" icon={IndianRupee} />
          <StatCard title="Occupancy Rate" value="0%" icon={BedDouble} />
          <StatCard title="Total Bookings" value="0" icon={CalendarCheck} />
          <StatCard title="Pending Payments" value="₹0" icon={AlertCircle} />
        </div>
      </motion.div>
    </motion.div>
  );

  const renderSuperAdmin = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        <motion.div variants={itemVariants}><StatCard title="Total Revenue" value={dashboardData.totalRevenue} icon={IndianRupee} trend={isDemo ? "+12.5%" : undefined} /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="Occupancy Rate" value={dashboardData.occupancyRate} icon={BedDouble} trend={isDemo ? "+5.2%" : undefined} /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="Total Bookings" value={dashboardData.totalBookings} icon={CalendarCheck} trend={isDemo ? "+18.1%" : undefined} /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="Pending Payments" value={dashboardData.pendingPayments} icon={AlertCircle} trend={isDemo ? "-2.4%" : undefined} trendDown={isDemo} /></motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#0E2A38]">Revenue Overview</h3>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A646] px-3 py-1 bg-[#C9A646]/10 rounded-full">
              {dateFilter === 'Yearly' ? 'YTD 2026' : (dateFilter === 'Custom' ? 'Custom Range' : `This ${dateFilter.replace('ly', '')}`)}
            </span>
          </div>
          <div className="h-72">
            {dashboardData.revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0E2A38" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#0E2A38" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} tickFormatter={(value) => `₹${value / 1000}k`} dx={-10} />
                  <Tooltip cursor={{ fill: '#F3F4F6', opacity: 0.4 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px', fontWeight: 600, color: '#0E2A38' }} />
                  <Bar dataKey="total" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-sm font-medium">No revenue data yet. Create your first booking to see charts.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1 bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#0E2A38] mb-8">Booking Sources</h3>
          {dashboardData.sourceData.length > 0 ? (
            <>
              <div className="flex-1 min-h-[200px] relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      stroke="none"
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {dashboardData.sourceData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
                  <span className="text-3xl font-serif font-bold text-[#0E2A38]">{dashboardData.onlinePercent}</span>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Online</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-y-3">
                {dashboardData.sourceData.map((source, i) => (
                  <div key={source.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-semibold text-gray-600">{source.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p className="text-sm font-medium text-center">No bookings yet. Sources will appear here.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#0E2A38] mb-8">Weekly Occupancy Rate</h3>
          <div className="h-72">
            {dashboardData.occupancyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.occupancyData}>
                  <defs>
                    <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} tickFormatter={(value) => `${value}%`} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600, color: '#0E2A38' }} />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={4} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0, fill: '#0E2A38' }} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-sm font-medium">Add rooms and bookings to see occupancy trends.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#0E2A38]">Recent Activity</h3>
            {recentActivity.length > 0 && (
              <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A646] transition-colors flex items-center gap-1">
                View All <ArrowRight size={12} />
              </button>
            )}
          </div>
          <div className="flex-1 space-y-6">
            {recentActivity.length > 0 ? recentActivity.map((item, i) => {
              const iconConfig = {
                booking: { icon: <CalendarCheck size={14} className="text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-100' },
                payment: { icon: <IndianRupee size={14} className="text-emerald-600" />, bg: 'bg-emerald-50', border: 'border-emerald-100' },
                room: { icon: <CheckCircle2 size={14} className="text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-100' },
                checkin: { icon: <Users size={14} className="text-purple-600" />, bg: 'bg-purple-50', border: 'border-purple-100' },
              }[item.type] || { icon: <CalendarCheck size={14} className="text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-100' };

              return (
                <ActivityItem
                  key={i}
                  icon={iconConfig.icon}
                  bg={iconConfig.bg}
                  border={iconConfig.border}
                  title={item.title}
                  time={item.time}
                  desc={item.desc}
                />
              );
            }) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p className="text-sm font-medium text-center">No recent activity. Your bookings and updates will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 lg:mb-12 gap-6">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[#0E2A38] mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium text-sm lg:text-base">Real-time metrics and operations for {tenant?.business_name || 'your property'}.</p>
        </div>

        {/* Global Date Filter */}
        <div className="flex bg-white/80 backdrop-blur-md rounded-full p-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-x-auto max-w-full no-scrollbar">
          {['Daily', 'Monthly', 'Yearly', 'Custom'].map(f => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${dateFilter === f
                  ? 'bg-[#0E2A38] text-[#C9A646] shadow-md'
                  : 'text-gray-500 hover:text-[#0E2A38] hover:bg-gray-50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {user?.role === 'SUPER_ADMIN' && (hasData ? renderSuperAdmin() : renderEmptyState())}
      {user?.role !== 'SUPER_ADMIN' && (
        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 text-center">
          <p className="text-gray-500 font-medium">Your role-specific dashboard is coming soon.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendDown }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full -z-10 transition-colors group-hover:from-gray-100/80" />
      <div className="flex justify-between items-start mb-6 w-full">
        <div className="w-14 h-14 rounded-full bg-[#F8F9FB] flex items-center justify-center border border-gray-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
          <Icon size={24} className="text-[#0E2A38]" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold shadow-sm ${trendDown ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
            {trendDown ? <TrendingUp size={12} className="rotate-180" /> : <TrendingUp size={12} />}
            {trend}
          </div>
        )}
      </div>
      <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{title}</h4>
      <p className="text-3xl lg:text-[32px] font-serif font-bold text-[#0E2A38] tracking-tight">{value}</p>
    </motion.div>
  );
}

function ActivityItem({ icon, bg, border, title, time, desc }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-9 h-9 rounded-full ${bg} ${border} border flex items-center justify-center shrink-0 shadow-sm mt-0.5`}>
        {icon}
      </div>
      <div>
        <div className="flex items-center justify-between gap-4 mb-1">
          <p className="font-bold text-sm text-[#0E2A38]">{title}</p>
          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            <Clock size={10} /> {time}
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}
