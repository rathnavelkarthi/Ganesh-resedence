import { useState, useMemo } from 'react';
import { Download, Calendar as CalendarIcon, Filter } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useCRM } from '../../context/CRMDataContext';
import { useAuth } from '../../context/AuthContext';
import { isDemoAccount } from '../../lib/booking';

const COLORS = ['#2b7a9b', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Reports() {
  const [dateRange, setDateRange] = useState('This Week');
  const { reservations, rooms } = useCRM();
  const { user } = useAuth();
  const isDemo = isDemoAccount(user?.email);

  const reportData = useMemo(() => {
    if (isDemo) {
      return {
        revenueData: [
          { name: 'Mon', revenue: 45000 },
          { name: 'Tue', revenue: 38000 },
          { name: 'Wed', revenue: 52000 },
          { name: 'Thu', revenue: 48000 },
          { name: 'Fri', revenue: 65000 },
          { name: 'Sat', revenue: 85000 },
          { name: 'Sun', revenue: 70000 },
        ],
        sourceData: [
          { name: 'Direct', value: 400 },
          { name: 'Booking.com', value: 300 },
          { name: 'Agoda', value: 300 },
          { name: 'MakeMyTrip', value: 200 },
        ],
        roomPerformance: [
          { name: 'Executive Double AC', bookings: 145, occ: '88%', revenue: 362500 },
          { name: 'Triple Room AC', bookings: 98, occ: '82%', revenue: 343000 },
          { name: 'Four Occupancy Room', bookings: 65, occ: '75%', revenue: 292500 },
          { name: 'Six Bed AC Room', bookings: 34, occ: '60%', revenue: 204000 },
        ]
      };
    }

    // Group revenue by day of week
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueByDay: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    reservations.forEach(r => {
      if (r.checkIn && r.amount) {
        const day = dayNames[new Date(r.checkIn).getDay()];
        if (revenueByDay[day] !== undefined) {
          revenueByDay[day] += r.amount;
        }
      }
    });

    const revenueData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      name: day,
      revenue: revenueByDay[day]
    }));

    // Compute source distribution
    const sourceCounts: Record<string, number> = {};
    reservations.forEach(r => {
      const src = r.source || 'Direct';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
    const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

    // Compute room performance
    const roomPerformanceMap: Record<string, { bookings: number, revenue: number, activeRooms: number }> = {};
    rooms.forEach(r => {
      if (!roomPerformanceMap[r.type]) {
        roomPerformanceMap[r.type] = { bookings: 0, revenue: 0, activeRooms: 0 };
      }
      roomPerformanceMap[r.type].activeRooms += 1;
    });

    reservations.forEach(r => {
      if (r.room) {
        if (!roomPerformanceMap[r.room]) {
          roomPerformanceMap[r.room] = { bookings: 0, revenue: 0, activeRooms: 0 };
        }
        roomPerformanceMap[r.room].bookings += 1;
        roomPerformanceMap[r.room].revenue += (r.amount || 0);
      }
    });

    const roomPerformance = Object.entries(roomPerformanceMap)
      .map(([name, data]) => {
        const occ = data.activeRooms > 0 ? Math.round((data.bookings / (data.activeRooms * 30)) * 100) : 0; // rough 30 day occ logic
        return {
          name,
          bookings: data.bookings,
          occ: `${Math.min(100, Math.max(0, occ))}%`,
          revenue: data.revenue
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);


    return { revenueData, sourceData, roomPerformance };
  }, [reservations, rooms, isDemo]);


  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive insights into hotel performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:border-[var(--color-ocean-500)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all cursor-pointer shadow-sm"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 bg-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-800)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-bold text-gray-900">Revenue by Date</h3>
            <button className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors">
              <Filter size={18} />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="revenue" fill="var(--color-ocean-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-bold text-gray-900">Booking Source Breakdown</h3>
            <button className="p-1.5 text-gray-400 hover:text-[var(--color-ocean-600)] hover:bg-[var(--color-ocean-50)] rounded-lg transition-colors">
              <Filter size={18} />
            </button>
          </div>
          <div className="h-80 flex items-center justify-center">
            {reportData.sourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportData.sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 font-medium">No booking data available</p>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4 flex-wrap">
            {reportData.sourceData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Room Performance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-serif text-xl font-bold text-gray-900">Top Room Type Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Room Type</th>
                <th className="p-4 font-semibold">Total Bookings</th>
                <th className="p-4 font-semibold">Occupancy Rate</th>
                <th className="p-4 font-semibold">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {reportData.roomPerformance.length > 0 ? reportData.roomPerformance.map((room, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{room.name}</td>
                  <td className="p-4 text-gray-600">{room.bookings}</td>
                  <td className="p-4 text-gray-600">{room.occ}</td>
                  <td className="p-4 font-bold text-[var(--color-ocean-900)]">₹{room.revenue?.toLocaleString('en-IN') || 0}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No rooms or booking performance data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
