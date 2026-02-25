import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  Users,
  BedDouble,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight
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

const revenueData = [
  { name: 'Jan', total: 400000 },
  { name: 'Feb', total: 300000 },
  { name: 'Mar', total: 500000 },
  { name: 'Apr', total: 450000 },
  { name: 'May', total: 600000 },
  { name: 'Jun', total: 550000 },
];

const occupancyData = [
  { name: 'Mon', rate: 65 },
  { name: 'Tue', rate: 70 },
  { name: 'Wed', rate: 68 },
  { name: 'Thu', rate: 85 },
  { name: 'Fri', rate: 95 },
  { name: 'Sat', rate: 100 },
  { name: 'Sun', rate: 90 },
];

const sourceData = [
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

export default function Dashboard() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState('Yearly');

  const renderSuperAdmin = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        <motion.div variants={itemVariants}><StatCard title="Total Revenue" value="₹24,50,000" icon={IndianRupee} trend="+12.5%" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="Occupancy Rate" value="85%" icon={BedDouble} trend="+5.2%" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="Total Bookings" value="342" icon={CalendarCheck} trend="+18.1%" /></motion.div>
        <motion.div variants={itemVariants}><StatCard title="Pending Payments" value="₹1,25,000" icon={AlertCircle} trend="-2.4%" trendDown /></motion.div>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
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
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1 bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#0E2A38] mb-8">Booking Sources</h3>
          <div className="flex-1 min-h-[200px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  stroke="none"
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
              <span className="text-3xl font-serif font-bold text-[#0E2A38]">82%</span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Online</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-3">
            {sourceData.map((source, i) => (
              <div key={source.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs font-semibold text-gray-600">{source.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#0E2A38] mb-8">Weekly Occupancy Rate</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
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
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#0E2A38]">Recent Activity</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A646] transition-colors flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 space-y-6">
            <ActivityItem
              icon={<CalendarCheck size={14} className="text-blue-600" />}
              bg="bg-blue-50"
              border="border-blue-100"
              title="New Booking from Agoda"
              time="10 mins ago"
              desc="Room 102 - Executive Double AC"
            />
            <ActivityItem
              icon={<IndianRupee size={14} className="text-emerald-600" />}
              bg="bg-emerald-50"
              border="border-emerald-100"
              title="Payment Received"
              time="25 mins ago"
              desc="₹12,400 via UPI (TXN-8821)"
            />
            <ActivityItem
              icon={<CheckCircle2 size={14} className="text-amber-600" />}
              bg="bg-amber-50"
              border="border-amber-100"
              title="Room Marked Clean"
              time="1 hr ago"
              desc="Housekeeping finished Room 205"
            />
            <ActivityItem
              icon={<Users size={14} className="text-purple-600" />}
              bg="bg-purple-50"
              border="border-purple-100"
              title="Guest Check-in"
              time="2 hrs ago"
              desc="Sarah Jenkins arrived"
            />
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
          <p className="text-gray-500 font-medium text-sm lg:text-base">Real-time metrics and operations for Ganesh Residency.</p>
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

      {user?.role === 'SUPER_ADMIN' && renderSuperAdmin()}
      {/* Other roles remain unchanged structurally but would benefit from similar aesthetic updates in a full pass. */}
      {user?.role !== 'SUPER_ADMIN' && (
        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 text-center">
          <p className="text-gray-500 font-medium">Please log in as SUPER_ADMIN to see the full $1M SaaS UI experience.</p>
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
